/**
 * Kiểu dữ liệu Phân hệ Xác thực & Người dùng (FR-AUTH)
 */

export type UserRole = 'Admin' | 'Author' | 'Reader';

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

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  userName: string;
  displayName: string;
  password: string;
  confirmPassword?: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresAt?: string;
}
