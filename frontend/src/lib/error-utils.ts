import { ApiError } from './api-client';
import type { ProblemDetails } from './types/category';

/**
 * Các mã lỗi hệ thống chuẩn RFC 7807 thường gặp trong ứng dụng Culinary Blog
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // Lỗi mạng & hệ thống
  NETWORK_ERROR: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.',
  SERVER_ERROR: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau ít phút.',
  TIMEOUT_ERROR: 'Yêu cầu vượt quá thời gian phản hồi. Vui lòng thử lại.',

  // Lỗi xác thực & phân quyền
  AUTH_INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
  AUTH_REFRESH_TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  AUTH_REFRESH_TOKEN_REVOKED: 'Phiên truy cập bị thu hồi. Vui lòng đăng nhập lại.',
  AUTH_UNAUTHORIZED: 'Bạn chưa đăng nhập hoặc không có quyền truy cập.',
  AUTH_FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',

  // Lỗi tệp tin MinIO (FR-FILE)
  FILE_SIZE_EXCEEDED: 'Kích thước tệp tin vượt quá giới hạn tối đa cho phép (5 MB).',
  FILE_MIME_INVALID: 'Định dạng tệp không hợp lệ. Chỉ chấp nhận ảnh JPEG, PNG, WebP hoặc AVIF.',
  FILE_UPLOAD_FAILED: 'Tải ảnh lên máy chủ lưu trữ thất bại. Vui lòng thử lại.',

  // Lỗi danh mục (FR-CAT)
  CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục yêu cầu.',
  CATEGORY_SLUG_CONFLICT: 'Đường dẫn tĩnh (slug) của danh mục này đã tồn tại.',
  CATEGORY_HAS_RECIPES: 'Không thể xóa danh mục đang chứa công thức nấu ăn liên kết.',

  // Lỗi công thức (FR-RCP)
  RECIPE_NOT_FOUND: 'Không tìm thấy công thức nấu ăn yêu cầu.',
  RECIPE_SLUG_CONFLICT: 'Tiêu đề hoặc đường dẫn tĩnh của công thức đã tồn tại.',
};

/**
 * Chuyển đổi mọi đối tượng lỗi không xác định thành chuỗi thông báo tiếng Việt thân thiện
 */
export function getErrorMessage(error: unknown, fallbackMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.'): string {
  if (typeof error === 'string') return error;

  if (error instanceof ApiError) {
    if (error.type && ERROR_MESSAGES[error.type]) {
      return ERROR_MESSAGES[error.type];
    }
    if (error.detail) return error.detail;
    if (error.title) return error.title;
    if (error.status === 401) return ERROR_MESSAGES.AUTH_UNAUTHORIZED;
    if (error.status === 403) return ERROR_MESSAGES.AUTH_FORBIDDEN;
    if (error.status === 404) return 'Không tìm thấy tài nguyên yêu cầu.';
    if (error.status >= 500) return ERROR_MESSAGES.SERVER_ERROR;
  }

  if (error instanceof Error) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return error.message;
  }

  if (error && typeof error === 'object') {
    const errObj = error as { detail?: string; title?: string; message?: string; type?: string };
    if (errObj.type && ERROR_MESSAGES[errObj.type]) return ERROR_MESSAGES[errObj.type];
    if (errObj.detail) return errObj.detail;
    if (errObj.title) return errObj.title;
    if (errObj.message) return errObj.message;
  }

  return fallbackMessage;
}

/**
 * Trích xuất danh sách lỗi validation theo từng trường từ ProblemDetails (RFC 7807)
 */
export function getFieldErrors(error: unknown): Record<string, string[]> {
  if (error instanceof ApiError && error.errors) {
    return error.errors;
  }

  if (error && typeof error === 'object' && 'errors' in error) {
    const p = error as ProblemDetails;
    if (p.errors && typeof p.errors === 'object') {
      return p.errors;
    }
  }

  return {};
}

/**
 * Kiểm tra xem lỗi có phải là lỗi mất kết nối mạng hay không
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiError && error.status === 0) return true;
  if (error instanceof TypeError && error.message.includes('fetch')) return true;
  return false;
}
