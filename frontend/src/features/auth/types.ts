// FR-AUTH types — khớp contract backend (camelCase JSON).
// GET /auth/me & PATCH /me: { id, email, userName, displayName, avatarUrl, bio, roles, createdAt } (SRS FR-AUTH-006/007).
export interface UserProfile {
  id: string;
  email: string;
  userName: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  roles: string[];
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

// RFC 7807 problem details — `type` là mã MODULE_REASON để frontend switch (CLAUDE.md mục 4).
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR:
    'Không kết nối được tới Backend. Kiểm tra Backend đã chạy ở cổng 5001 chưa.',
  AUTH_EMAIL_EXISTS: 'Email đã được đăng ký.',
  AUTH_USERNAME_EXISTS: 'Tên đăng nhập đã được sử dụng.',
  AUTH_INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
  AUTH_ACCOUNT_LOCKED: 'Tài khoản tạm khóa 15 phút do nhập sai quá 5 lần.',
  AUTH_ACCOUNT_DISABLED: 'Tài khoản đã bị vô hiệu hóa.',
  AUTH_GOOGLE_TOKEN_INVALID: 'Token Google không hợp lệ hoặc đã hết hạn.',
  AUTH_REFRESH_TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
  AUTH_REFRESH_TOKEN_REVOKED: 'Phiên đăng nhập đã bị thu hồi, vui lòng đăng nhập lại.',
  AUTH_USER_NOT_FOUND: 'Không tìm thấy người dùng.',
  VALIDATION_ERROR: 'Dữ liệu nhập chưa hợp lệ.',
};

export function problemMessage(problem: ProblemDetails): string {
  // NETWORK_ERROR: ưu tiên `detail` vì chứa BASE_URL thực tế để dev debug
  // (cổng 5000/5001), thay vì câu chung chung.
  if (problem.type === 'NETWORK_ERROR' && problem.detail) {
    return problem.detail;
  }
  const base =
    AUTH_ERROR_MESSAGES[problem.type] ??
    problem.detail ??
    problem.title ??
    'Đã xảy ra lỗi, vui lòng thử lại.';
  // FR-AUTH-001: Backend 400 VALIDATION_ERROR luôn kèm `errors` chi tiết từng
  // field — bóc tách ra banner thay vì chỉ hiện câu chung chung. Các mã lỗi
  // khác (409/401/...) đã có message tiếng Việt rõ nghĩa nên giữ nguyên.
  if (problem.type === 'VALIDATION_ERROR') {
    const lines = problemDetailLines(problem);
    if (lines.length > 0) return `${base} ${lines.join(' ')}`;
  }
  return base;
}

// Bóc `detail` + `errors` (Record<field, string[]>) từ RFC 7807 thành từng dòng
// hiển thị được. Key giữ nguyên như backend trả về (PascalCase/camelCase).
export function problemDetailLines(problem: ProblemDetails): string[] {
  const lines: string[] = [];
  if (problem.detail && problem.detail !== 'One or more validation failures occurred.') {
    lines.push(problem.detail);
  }
  if (problem.errors && typeof problem.errors === 'object') {
    for (const [field, messages] of Object.entries(problem.errors)) {
      for (const msg of messages ?? []) {
        lines.push(`${field}: ${msg}`);
      }
    }
  }
  return lines;
}
