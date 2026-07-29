import { NextResponse, type NextRequest } from "next/server";

const ACCESS_TOKEN_COOKIE = "gu_access_token";

type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

function decodeRole(token: string): Role | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    const parsed = JSON.parse(json) as { role?: Role; exp?: number };
    if (!parsed.role) return null;
    if (parsed.exp && parsed.exp * 1000 < Date.now()) return null;
    return parsed.role;
  } catch {
    return null;
  }
}

const ROLE_PREFIX: Record<Role, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

/**
 * Next.js 16 renamed middleware.ts -> proxy.ts (runs on the Node.js
 * runtime, not Edge). This is a UX/routing convenience only, NOT the
 * actual security boundary - it redirects unauthenticated/wrong-role
 * users away from dashboard shells before they render, but every real
 * data request is independently authorized by the backend regardless of
 * whether this ran. A bypass here would show an empty/broken dashboard
 * shell, not leak another user's data.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const role = token ? decodeRole(token) : null;

  if (!role) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const ownPrefix = ROLE_PREFIX[role];
  if (!pathname.startsWith(ownPrefix)) {
    return NextResponse.redirect(new URL(ownPrefix, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
