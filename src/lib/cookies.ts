import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "gu_access_token";
const REFRESH_TOKEN_KEY = "gu_refresh_token";

/**
 * Tokens are stored in regular (non-httpOnly) cookies rather than
 * server-only httpOnly cookies. This is a deliberate simplification: it
 * lets both Next.js Middleware (route protection) and client-side
 * TanStack Query hooks (calling the backend API directly) read the same
 * token without standing up a full BFF proxy layer for every backend
 * endpoint. The tradeoff is slightly higher XSS exposure than an
 * httpOnly-cookie + server-proxy architecture - reasonable for this
 * assignment's scope, but worth knowing if this were a production app.
 */
export function setAuthCookies(accessToken: string, refreshToken: string): void {
  const commonOptions = { expires: 30, sameSite: "lax" as const, path: "/" };
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, commonOptions);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, commonOptions);
}

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function clearAuthCookies(): void {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
}

export interface DecodedAccessToken {
  sub: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  exp: number;
}

/**
 * Decodes (does NOT verify) the JWT payload for UI purposes only, e.g.
 * showing the right nav links for the user's role. This is never a
 * security boundary - every API call is independently authorized by the
 * backend regardless of what the decoded payload here claims.
 */
export function decodeAccessToken(token: string): DecodedAccessToken | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as DecodedAccessToken;
  } catch {
    return null;
  }
}

export function isTokenExpired(decoded: DecodedAccessToken | null): boolean {
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
}
