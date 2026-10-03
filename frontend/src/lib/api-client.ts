import { setAccessToken } from '@/features/auth/token-store';

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Chuẩn hóa: bỏ trailing slash để `${BASE_URL}/auth/...` không bị double slash.
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

/** Expose để UI/test hiển thị backend đang trỏ tới đâu khi gặp lỗi mạng. */
export function getApiBaseUrl(): string {
  return BASE_URL;
}

// ---------------------------------------------------------------------------
// FR-AUTH-004 — Token Reuse Detection (interceptor cho fetch wrapper).
// Backend trả 401 + RFC 7807 `type: "AUTH_REFRESH_TOKEN_REVOKED"` khi phát hiện
// refresh token cũ bị dùng lại (rotation reuse) → cả token family bị revoke.
// Client BẮT BUỘC: xóa session ngay, cảnh báo user, đá về /login.
// ---------------------------------------------------------------------------

/** Mã RFC 7807 `type` backend dùng cho reuse detection (AuthErrors.RefreshTokenRevoked). */
export const SESSION_REVOKED_TYPE = 'AUTH_REFRESH_TOKEN_REVOKED';

/** Query param /login dùng để hiện banner cảnh báo sau khi bị đá ra. */
export const SESSION_REVOKED_QUERY = 'reason=revoked';

/** Event để các component (Header...) dọn cache React Query khi bị revoke. */
export const SESSION_REVOKED_EVENT = 'auth:session-revoked';

const REVOKED_FLAG_KEY = 'auth:session-revoked-at';

export function isSessionRevokedError(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    (error as { type?: unknown }).type === SESSION_REVOKED_TYPE
  );
}

/** Đọc + xóa flag reuse (để /login hiện banner đúng 1 lần). */
export function consumeSessionRevokedFlag(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const at = sessionStorage.getItem(REVOKED_FLAG_KEY);
    if (at === null) return null;
    sessionStorage.removeItem(REVOKED_FLAG_KEY);
    return at;
  } catch {
    return null;
  }
}

function handleSessionRevoked(method: string, url: string): void {
  if (typeof window === 'undefined') return;
  // 1. Xóa access token in-memory ngay lập tức — không chờ UI.
  setAccessToken(null);
  // 2. Ghi flag để /login hiện cảnh báo "phiên không hợp lệ / bị xâm phạm".
  try {
    sessionStorage.setItem(REVOKED_FLAG_KEY, new Date().toISOString());
  } catch {
    // sessionStorage bị chặn (private mode...) — bỏ qua, vẫn redirect bên dưới.
  }
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[api-client] SESSION REVOKED ${method} ${url} → force logout`);
  }
  // 3. Báo cho Header/React Query dọn cache `['auth','me']`.
  window.dispatchEvent(new CustomEvent(SESSION_REVOKED_EVENT));
  // 4. Redirect thẳng về /login (trừ khi đang ở đó để tránh loop).
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = `/login?${SESSION_REVOKED_QUERY}`;
  }
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const method = (options.method ?? 'GET').toUpperCase();

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      credentials: 'include', // Bắt buộc để gửi/nhận HttpOnly Refresh Token Cookie (SPEC.md)
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (err) {
    // FR-AUTH: Backend chưa chạy / sai cổng (5000 vs 5001) → fetch ném TypeError
    // (Failed to fetch / ECONNREFUSED), KHÔNG có Response. Ném RFC 7807 giả lập
    // để hooks `toErrorMessage` hiện câu tiếng Việt cụ thể thay vì "Đăng ký thất bại".
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[api-client] NETWORK ${method} ${url}`, err);
    }
    throw {
      type: 'NETWORK_ERROR',
      title: 'Network Error',
      status: 0,
      detail:
        `Không kết nối được tới Backend (${BASE_URL}). ` +
        `Kiểm tra Backend đã chạy ở cổng 5001 chưa ` +
        `(dotnet run --urls "http://localhost:5001").`,
    };
  }

  if (!res.ok) {
    const errorData: Record<string, unknown> = await res.json().catch(() => ({}));
    // Body rỗng / không phải JSON → giữ lại status để UI phân biệt 400/401/409/423.
    if (!('status' in errorData)) {
      errorData.status = res.status;
    }
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[api-client] HTTP ${res.status} ${method} ${url}`, errorData);
    }
    // FR-AUTH-004: reuse token cũ → force logout + redirect, KHÔNG để UI tự quyết.
    if (res.status === 401 && errorData.type === SESSION_REVOKED_TYPE) {
      handleSessionRevoked(method, url);
    }
    throw errorData;
  }

  // 204 No Content (vd FR-AUTH-005 logout) không có body JSON.
  if (res.status === 204) return undefined as T;

  // 200 OK nhưng body rỗng (phòng thủ) → tránh res.json() ném SyntaxError.
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
