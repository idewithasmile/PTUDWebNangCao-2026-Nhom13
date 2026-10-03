'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import {
  toErrorMessage,
  useGoogleLogin,
} from '@/features/auth/hooks';

// FR-AUTH-003: landing page sau khi Google redirect về (callbackUrl của signIn).
// Lấy idToken từ Auth.js session → đổi lấy token backend → xóa session Auth.js
// (backend là nguồn sự thật duy nhất) → vào dashboard.
export default function GoogleCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const exchange = useGoogleLogin();
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (status === 'loading' || startedRef.current) return;
    if (status === 'unauthenticated') {
      setError('Xác thực Google không thành công. Vui lòng thử lại.');
      return;
    }
    const idToken = session?.idToken;
    if (status === 'authenticated' && !idToken) {
      setError('Không lấy được Google credential.');
      return;
    }
    if (!idToken) return;
    startedRef.current = true;
    exchange.mutate(idToken, {
      onSuccess: async () => {
        // Dọn session tạm của Auth.js, giữ lại session backend (access in-memory + refresh HttpOnly cookie).
        await signOut({ redirect: false }).catch(() => undefined);
        router.push('/dashboard');
      },
      onError: async (e) => {
        await signOut({ redirect: false }).catch(() => undefined);
        setError(toErrorMessage(e, 'Đăng nhập Google thất bại.'));
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  return (
    <main className="mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold">Đang xác thực với Google…</h1>
      {status === 'loading' || (!error && exchange.isPending) ? (
        <p className="mt-4 text-sm">Vui lòng chờ trong giây lát.</p>
      ) : null}
      {error && (
        <div className="mt-4">
          <p role="alert" className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="mt-4 w-full rounded bg-black p-2 text-white"
          >
            Quay lại đăng nhập
          </button>
        </div>
      )}
    </main>
  );
}
