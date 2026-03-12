const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const BASE_URL = (configuredBaseUrl
  ? configuredBaseUrl
  : process.env.NODE_ENV === "production"
    ? "/api/v1"
    : "http://localhost:5500/api/v1"
).replace(/\/$/, "");

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${BASE_URL}${normalizedEndpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}
