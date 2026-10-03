import { apiClient } from '@/lib/api-client';
import { authHeaders, getAccessToken, setAccessToken } from './token-store';
import type { AuthResponse, UserProfile } from './types';
import type { LoginForm, RegisterForm, UpdateProfileForm } from './schemas';

// Re-export types để page chỉ import từ features/auth.
export type { AuthResponse, UserProfile, ProblemDetails } from './types';
export type { RegisterForm, LoginForm, UpdateProfileForm } from './schemas';

function withAuth(init: { method?: string; body?: string } = {}): RequestInit {
  return { ...init, headers: { ...authHeaders() } };
}

// FR-AUTH-001: POST /auth/register → 201 { accessToken, user } + HttpOnly refresh cookie.
export async function registerApi(payload: RegisterForm): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setAccessToken(res.accessToken);
  return res;
}

// FR-AUTH-002: POST /auth/login → 200.
export async function loginApi(payload: LoginForm): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setAccessToken(res.accessToken);
  return res;
}

// FR-AUTH-003: POST /auth/google → 200.
export async function googleLoginApi(idToken: string): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
  setAccessToken(res.accessToken);
  return res;
}

// FR-AUTH-004: POST /auth/refresh — refresh đọc từ HttpOnly Cookie (credentials: include).
export async function refreshApi(): Promise<AuthResponse> {
  const res = await apiClient<AuthResponse>('/auth/refresh', { method: 'POST' });
  setAccessToken(res.accessToken);
  return res;
}

// FR-AUTH-005: POST /auth/logout → 204.
export async function logoutApi(): Promise<void> {
  await apiClient<void>(
    '/auth/logout',
    withAuth({ method: 'POST' }),
  );
  setAccessToken(null);
}

// FR-AUTH-006: GET /auth/me.
export async function meApi(): Promise<UserProfile> {
  return apiClient<UserProfile>('/auth/me', withAuth());
}

// FR-AUTH-007: PATCH /auth/me (không gửi email/userName — backend cấm đổi).
export async function updateMeApi(payload: UpdateProfileForm): Promise<UserProfile> {
  const body: Record<string, string> = {};
  if (payload.displayName !== undefined) body.displayName = payload.displayName;
  if (payload.avatarUrl) body.avatarUrl = payload.avatarUrl;
  if (payload.bio !== undefined) body.bio = payload.bio;
  return apiClient<UserProfile>('/auth/me', withAuth({ method: 'PATCH', body: JSON.stringify(body) }));
}

export function hasSession(): boolean {
  return getAccessToken() !== null;
}
