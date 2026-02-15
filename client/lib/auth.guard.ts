import { decodeJwt } from "./jwt";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("your-secret-key");
  if (!token) return false;

  const payload = decodeJwt(token);
  if (!payload?.exp) return false;

  const isExpired = Date.now() >= payload.exp * 1000;

  if (isExpired) {
    localStorage.removeItem("your-secret-key");
    return false;
  }

  return true;
}
