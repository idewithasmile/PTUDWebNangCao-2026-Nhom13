// Access token lưu In-Memory (SPEC Mâu thuẫn 3) — KHÔNG localStorage.
// Refresh token nằm ở HttpOnly Cookie do backend quản lý, JS không đọc được.
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function authHeaders(): Record<string, string> {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}
