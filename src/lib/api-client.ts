import { env } from "./env";
import { getAccessToken, getRefreshToken, setAuthCookies, clearAuthCookies } from "./cookies";
import type { ApiErrorDetail } from "@/types";

export class ApiClientError extends Error {
  status: number;
  errorDetails: ApiErrorDetail[];

  constructor(status: number, message: string, errorDetails: ApiErrorDetail[] = []) {
    super(message);
    this.status = status;
    this.errorDetails = errorDetails;
  }

  /** Convenience for React Hook Form's setError - maps field-level errors by name. */
  fieldErrors(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const detail of this.errorDetails) {
      if (detail.field) map[detail.field] = detail.message;
    }
    return map;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip attaching the Authorization header (public endpoints). */
  skipAuth?: boolean;
  /** Skip the automatic 401 refresh-and-retry (used by the refresh call itself). */
  skipRefresh?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${env.API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    setAuthCookies(json.data.accessToken, json.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, skipRefresh, headers, ...rest } = options;

  const doFetch = async (): Promise<Response> => {
    const finalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(headers as Record<string, string>),
    };
    if (!skipAuth) {
      const token = getAccessToken();
      if (token) finalHeaders.Authorization = `Bearer ${token}`;
    }
    return fetch(`${env.API_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let res = await doFetch();

  if (res.status === 401 && !skipAuth && !skipRefresh) {
    // Coalesce concurrent 401s into a single refresh attempt.
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
    const refreshed = await refreshPromise;

    if (refreshed) {
      res = await doFetch();
    } else {
      clearAuthCookies();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const json = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      json?.message ?? "Something went wrong. Please try again.",
      json?.errorDetails ?? [],
    );
  }

  return json as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
