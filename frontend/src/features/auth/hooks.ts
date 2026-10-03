'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  googleLoginApi,
  loginApi,
  logoutApi,
  meApi,
  refreshApi,
  registerApi,
  updateMeApi,
} from './api';
import { AUTH_ERROR_MESSAGES, problemMessage, type ProblemDetails } from './types';

// Fallback khi fetch không tới được Backend (dự phòng khi lỗi không phải RFC 7807).
const AUTH_NETWORK_FALLBACK =
  AUTH_ERROR_MESSAGES.NETWORK_ERROR ??
  'Không kết nối được tới Backend. Kiểm tra Backend đã chạy ở cổng 5001 chưa.';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof TypeError) {
    // Fetch ném TypeError khi không tới được Backend (ECONNREFUSED / Failed to
    // fetch). api-client mới đã bọc thành NETWORK_ERROR, nhánh này là lưới an
    // toàn cho mọi fetch thô khác trong module auth.
    return AUTH_NETWORK_FALLBACK;
  }
  if (error && typeof error === 'object') {
    if ('type' in error) {
      return problemMessage(error as ProblemDetails);
    }
    // Lỗi không theo RFC 7807 (vd network fail, body rỗng) nhưng có text.
    if ('detail' in error && typeof (error as { detail: unknown }).detail === 'string') {
      return (error as { detail: string }).detail;
    }
    if ('title' in error && typeof (error as { title: unknown }).title === 'string') {
      return (error as { title: string }).title;
    }
  }
  return fallback;
}

export type RegisterField = 'email' | 'userName' | 'displayName' | 'password';

const SERVER_FIELD_MAP: Record<string, RegisterField> = {
  email: 'email',
  username: 'userName',
  displayname: 'displayName',
  password: 'password',
};

// FR-AUTH-001: Map lỗi field từ RFC 7807 `errors` vào React Hook Form để hiện
// inline dưới từng input. So khớp không phân biệt hoa/thường vì backend trả
// key PascalCase (Email, UserName...) còn form dùng camelCase. Trả về số field
// đã map + các message không map được (vd lỗi Identity PasswordTooShort)
// để caller hiện banner.
export function applyServerFieldErrors(
  error: unknown,
  setFieldError: (field: RegisterField, message: string) => void,
): { mapped: number; leftover: string[] } {
  const empty = { mapped: 0, leftover: [] as string[] };
  if (!error || typeof error !== 'object' || !('errors' in error)) return empty;
  const errors = (error as ProblemDetails).errors;
  if (!errors || typeof errors !== 'object') return empty;
  let mapped = 0;
  const leftover: string[] = [];
  for (const [rawField, messages] of Object.entries(errors)) {
    const target = SERVER_FIELD_MAP[rawField.toLowerCase()];
    for (const msg of messages ?? []) {
      if (target) {
        setFieldError(target, msg);
        mapped += 1;
      } else {
        leftover.push(`${rawField}: ${msg}`);
      }
    }
  }
  return { mapped, leftover };
}

// FR-AUTH-006: profile hiện tại (chỉ fetch khi đã có session logic ở caller).
export function useMe(enabled = true) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: meApi,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

// FR-AUTH-001
export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerApi,
    onSuccess: (res) => qc.setQueryData(authKeys.me, res.user),
  });
}

// FR-AUTH-002
export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => qc.setQueryData(authKeys.me, res.user),
  });
}

// FR-AUTH-004 (silent refresh khi access hết hạn — caller tự gọi khi 401).
export function useRefresh() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refreshApi,
    onSuccess: (res) => qc.setQueryData(authKeys.me, res.user),
  });
}

// FR-AUTH-003 (client lấy idToken từ Google, backend xác thực + cấp token).
export function useGoogleLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: googleLoginApi,
    onSuccess: (res) => qc.setQueryData(authKeys.me, res.user),
  });
}

// FR-AUTH-005
export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => qc.setQueryData(authKeys.me, null),
  });
}

// FR-AUTH-007
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateMeApi,
    onSuccess: (user) => qc.setQueryData(authKeys.me, user),
  });
}
