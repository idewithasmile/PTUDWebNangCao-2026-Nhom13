// Access token lưu In-Memory kèm đồng bộ sessionStorage theo tab (SPEC Mâu thuẫn 3).
// Refresh token nằm ở HttpOnly Cookie do backend quản lý, JS không đọc được.
const TOKEN_STORAGE_KEY = 'auth_access_token';
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
  if (typeof window !== 'undefined') {
    try {
      if (token) {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch {
      // sessionStorage bị chặn (private browsing...)
    }
  }
}

export function getAccessToken(): string | null {
  if (!accessToken && typeof window !== 'undefined') {
    try {
      accessToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      // Bỏ qua
    }
  }
  return accessToken;
}

export function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
