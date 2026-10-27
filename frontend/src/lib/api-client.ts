import { getAccessToken, setAccessToken } from '@/features/auth/token-store';
import type { ProblemDetails } from './types/category';

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

/** Event để các component cập nhật cache khi silent refresh thành công. */
export const SESSION_REFRESHED_EVENT = 'auth:session-refreshed';

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

let refreshPromise: Promise<string | null> | null = null;

/**
 * Tự động làm mới Access Token bằng HttpOnly Cookie (FR-AUTH-004)
 * Singleton Promise ngăn ngừa gọi trùng lặp refresh khi nhiều request bị 401 cùng lúc.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401 && (errorData as { type?: string }).type === SESSION_REVOKED_TYPE) {
          handleSessionRevoked('POST', `${BASE_URL}/auth/refresh`);
        }
        return null;
      }

      const data = await res.json();
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        window.dispatchEvent(new CustomEvent(SESSION_REFRESHED_EVENT, { detail: data }));
        return data.accessToken as string;
      }
      return null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ---------------------------------------------------------------------------
// FR-CAT — ApiError tương thích RFC 7807 cho module Category.
// Giữ đồng thời contract Auth (throw object có `type/status/detail/errors` để
// `toErrorMessage`/`applyServerFieldErrors` trong features/auth/hooks.ts hoạt
// động) và contract Category (`err instanceof ApiError ? err.data : err` trong
// DeleteCategoryModal). ApiError expose cả field top-level lẫn `.data`.
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  status: number;
  type?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
  data: ProblemDetails;

  constructor(status: number, data: ProblemDetails) {
    super(data.detail || data.title || 'An API error occurred');
    this.name = 'ApiError';
    this.status = status;
    this.type = data.type;
    this.title = data.title;
    this.detail = data.detail;
    this.errors = data.errors;
    this.data = data;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { _isRetry?: boolean; suppressLogError?: boolean } = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const method = (options.method ?? 'GET').toUpperCase();

  let res: Response;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const requestHeaders = new Headers(options.headers);

  try {
    if (!isFormData && !requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    // Tự động gắn Bearer Token nếu có trong memory và headers chưa có
    const currentToken = getAccessToken();
    if (currentToken && !requestHeaders.has('Authorization')) {
      requestHeaders.set('Authorization', `Bearer ${currentToken}`);
    }

    // Client-side / FormData (tải file) dùng timeout lớn (30s) để tránh ngắt quãng tải lên.
    // Server-side / SSG dùng timeout ngắn (2.5s) để tránh treo build.
    const isServer = typeof window === 'undefined';
    const timeoutDuration = isServer ? 2500 : isFormData ? 30000 : 15000;

    const timeoutSignal =
      options.signal && typeof AbortSignal.any === 'function'
        ? AbortSignal.any([options.signal, AbortSignal.timeout(timeoutDuration)])
        : typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
          ? AbortSignal.timeout(timeoutDuration)
          : options.signal;

    res = await fetch(url, {
      ...options,
      signal: timeoutSignal,
      credentials: 'include', // Bắt buộc để gửi/nhận HttpOnly Refresh Token Cookie (SPEC.md)
      headers: requestHeaders,
    });
  } catch (err) {
    // FR-AUTH: Backend chưa chạy / sai cổng (5000 vs 5001) → fetch ném TypeError
    // (Failed to fetch / ECONNREFUSED), KHÔNG có Response. Ném ApiError giả lập
    // để hooks `toErrorMessage` hiện câu tiếng Việt cụ thể thay vì "Đăng ký thất bại".
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[api-client] NETWORK ${method} ${url}`, err);
    }
    throw new ApiError(0, {
      type: 'NETWORK_ERROR',
      title: 'Network Error',
      status: 0,
      detail:
        `Không kết nối được tới Backend (${BASE_URL}). ` +
        `Kiểm tra Backend đã chạy ở cổng 5001 chưa ` +
        `(dotnet run --urls "http://localhost:5001").`,
    });
  }

  if (!res.ok) {
    const errorData: Record<string, unknown> = await res.json().catch(() => ({}));
    // Body rỗng / không phải JSON → giữ lại status để UI phân biệt 400/401/409/423.
    if (!('status' in errorData)) {
      errorData.status = res.status;
    }

    // FR-AUTH-004: reuse token cũ → force logout + redirect, KHÔNG để UI tự quyết.
    if (res.status === 401 && errorData.type === SESSION_REVOKED_TYPE) {
      handleSessionRevoked(method, url);
      throw new ApiError(res.status, errorData as unknown as ProblemDetails);
    }

    // Tự động silent refresh và retry 1 lần nếu gặp HTTP 401 ở client-side
    const isAuthEndpoint =
      endpoint.includes('/auth/login') ||
      endpoint.includes('/auth/register') ||
      endpoint.includes('/auth/refresh');
    const isRetry = options._isRetry;

    if (res.status === 401 && !isAuthEndpoint && !isRetry && typeof window !== 'undefined') {
      const newToken = await refreshAccessToken();
      if (newToken) {
        const retryHeaders = new Headers(options.headers);
        retryHeaders.set('Authorization', `Bearer ${newToken}`);
        if (!isFormData && !retryHeaders.has('Content-Type')) {
          retryHeaders.set('Content-Type', 'application/json');
        }

        return apiClient<T>(endpoint, {
          ...options,
          headers: retryHeaders,
          _isRetry: true,
        });
      }
    }

    if (process.env.NODE_ENV !== 'production' && !options.suppressLogError && res.status !== 401) {
      console.error(`[api-client] HTTP ${res.status} ${method} ${url}`, errorData);
    }
    throw new ApiError(res.status, errorData as unknown as ProblemDetails);
  }

  // 204 No Content (vd FR-AUTH-005 logout, FR-CAT-005 delete) không có body JSON.
  if (res.status === 204) return undefined as T;

  // 200 OK nhưng body rỗng (phòng thủ) → tránh res.json() ném SyntaxError.
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
