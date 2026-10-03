import { handlers } from '@/auth';

// Route handler OAuth của Auth.js v5 (signin/callback/signout).
// Không chứa logic nghiệp vụ — FR-AUTH-003 vẫn do backend /api/v1/auth/google xử lý.
export const { GET, POST } = handlers;
