import { ProblemDetails } from './types/category';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  status: number;
  data: ProblemDetails;

  constructor(status: number, data: ProblemDetails) {
    super(data.detail || data.title || 'An API error occurred');
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    credentials: 'include', // Bắt buộc để gửi/nhận HttpOnly Refresh Token Cookie (SPEC.md)
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    let errorData: ProblemDetails;
    try {
      errorData = await res.json();
    } catch {
      errorData = {
        status: res.status,
        title: res.statusText || 'Error',
        detail: `Request failed with status ${res.status}`,
      };
    }
    throw new ApiError(res.status, errorData);
  }

  // Xử lý phản hồi 204 No Content (ví dụ DELETE)
  if (res.status === 204) {
    return null as unknown as T;
  }

  return res.json();
}
