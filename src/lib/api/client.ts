import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.dispa.vn/v1";
const TIMEOUT_MS = 15_000;

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
  retries?: number;
};

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// token được refresh nếu 401
let refreshPromise: Promise<string | null> | null = null;
// Cache token vừa refresh trong bộ nhớ — tránh repeated 401 trong cùng session
// NextAuth JWT cookie không tự cập nhật; token này có hiệu lực đến khi trang reload
let inMemoryToken: string | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      inMemoryToken = data?.accessToken ?? null;
      return inMemoryToken;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  // client side: ưu tiên token vừa refresh, sau đó mới lấy từ session
  if (typeof window !== "undefined") {
    if (inMemoryToken) {
      return { Authorization: `Bearer ${inMemoryToken}` };
    }
    const session = await getSession();
    if (session?.accessToken) {
      return { Authorization: `Bearer ${session.accessToken}` };
    }
    return {};
  }
  // server side: lấy từ next-auth server session (import động để tránh bundle)
  try {
    const { auth } = await import("@/lib/auth/auth");
    const session = await auth();
    if (session?.accessToken) {
      return { Authorization: `Bearer ${session.accessToken}` };
    }
  } catch {
    // không có session — không gắn header
  }
  return {};
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuth = false, retries = 1, ...init } = options;

  const authHeader = skipAuth ? {} : await getAuthHeader();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...authHeader,
    ...(init.headers as Record<string, string> | undefined),
  };

  let response = await fetchWithTimeout(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  // tự refresh khi 401
  if (response.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetchWithTimeout(`${BASE_URL}${path}`, {
        ...init,
        headers,
      });
    }
  }

  // retry 1 lần khi mạng lỗi (5xx)
  if (response.status >= 500 && retries > 0) {
    await new Promise((r) => setTimeout(r, 800));
    return apiRequest<T>(path, { ...options, retries: retries - 1 });
  }

  if (!response.ok) {
    let errorData: { code?: string; message?: string } = {};
    try {
      errorData = await response.json();
    } catch {
      // không parse được — giữ empty
    }
    throw new ApiError(
      response.status,
      errorData.code ?? "UNKNOWN",
      errorData.message ?? `HTTP ${response.status}`,
      errorData,
    );
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// shorthand helpers
export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    apiRequest<T>(path, { method: "GET", ...opts }),
  post: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...opts,
    }),
  put: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...opts,
    }),
  patch: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...opts,
    }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    apiRequest<T>(path, { method: "DELETE", ...opts }),
};

export { ApiError };
