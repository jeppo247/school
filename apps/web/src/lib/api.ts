const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ?? (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://upwiseserver-production.up.railway.app/api/v1"
    : "http://localhost:4000/api/v1");

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders as Record<string, string>,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.error?.code ?? "UNKNOWN_ERROR",
      errorData.error?.message ?? "An unexpected error occurred",
      errorData.error?.details,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "POST", body }),

  put: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),

  delete: <T>(path: string, options?: ApiOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export { ApiError };
