const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Chuẩn hóa: bỏ trailing slash để `${BASE_URL}/auth/...` không bị double slash.
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

/** Expose để UI/test hiển thị backend đang trỏ tới đâu khi gặp lỗi mạng. */
export function getApiBaseUrl(): string {
  return BASE_URL;
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
    throw errorData;
  }

  // 204 No Content (vd FR-AUTH-005 logout) không có body JSON.
  if (res.status === 204) return undefined as T;

  // 200 OK nhưng body rỗng (phòng thủ) → tránh res.json() ném SyntaxError.
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
