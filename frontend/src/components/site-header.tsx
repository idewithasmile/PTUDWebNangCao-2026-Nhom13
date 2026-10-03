'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SESSION_REVOKED_EVENT } from '@/lib/api-client';
import { authKeys, toErrorMessage, useLogout, useMe } from '@/features/auth/hooks';
import { hasSession } from '@/features/auth/api';

// Header dùng chung: hiện "Hồ sơ cá nhân" + "Đăng xuất" khi đã đăng nhập
// (FR-AUTH-005/006/007), ngược lại hiện "Đăng nhập" / "Đăng ký".
// FR-AUTH-004: lắng nghe SESSION_REVOKED_EVENT để dọn cache ngay khi bị revoke.
export default function SiteHeader() {
  const router = useRouter();
  const qc = useQueryClient();
  const logout = useLogout();

  // Chỉ fetch /me khi có access token in-memory (tránh 401 thừa sau reload).
  const me = useMe(hasSession());

  // FR-AUTH-004: api-client đá event khi gặp 401 AUTH_REFRESH_TOKEN_REVOKED →
  // dọn cache để Header chuyển ngay về trạng thái chưa đăng nhập (kể cả khi
  // đang đứng ở /login nên không bị redirect).
  useEffect(() => {
    const onRevoked = () => qc.setQueryData(authKeys.me, null);
    window.addEventListener(SESSION_REVOKED_EVENT, onRevoked);
    return () => window.removeEventListener(SESSION_REVOKED_EVENT, onRevoked);
  }, [qc]);

  const user = me.data ?? null;

  const onLogout = () => {
    // FR-AUTH-005: POST /auth/logout → 204. Dù API lỗi (mạng, token hết hạn...)
    // vẫn xóa session client + về /login để không kẹt trạng thái nửa vời.
    logout.mutate(undefined, {
      onSuccess: () => router.push('/login'),
      onError: (e) => {
        qc.setQueryData(authKeys.me, null);
        if (process.env.NODE_ENV !== 'production') {
          console.error('[header] logout failed, force local logout:', toErrorMessage(e, 'Đăng xuất thất bại.'));
        }
        router.push('/login');
      },
    });
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b p-4">
      <Link href="/" className="text-xl font-bold">
        🍳 Culinary Blog
      </Link>
      <nav className="flex items-center gap-2" aria-label="Điều hướng tài khoản">
        {user ? (
          <>
            <span className="hidden text-sm text-gray-600 sm:inline" title={user.email}>
              Xin chào, {user.displayName}
            </span>
            <Link
              href="/profile"
              className="rounded border px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
            >
              Hồ sơ cá nhân
            </Link>
            <button
              type="button"
              onClick={onLogout}
              disabled={logout.isPending}
              className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              {logout.isPending ? 'Đang đăng xuất…' : 'Đăng xuất'}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded border px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="rounded bg-black px-3 py-1.5 text-sm text-white"
            >
              Đăng ký
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
