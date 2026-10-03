'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginForm } from '@/features/auth/schemas';
import { useLogin, toErrorMessage } from '@/features/auth/hooks';
import { consumeSessionRevokedFlag } from '@/lib/api-client';
import GoogleButton from '@/features/auth/google-button';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);
  // FR-AUTH-004: api-client đá về /login?reason=revoked khi phát hiện reuse
  // refresh token → hiện cảnh báo "phiên không hợp lệ / bị xâm phạm" đúng 1 lần.
  const [revokedWarning, setRevokedWarning] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reason') === 'revoked' || consumeSessionRevokedFlag() !== null) {
      setRevokedWarning(true);
      // Dọn query param cho sạch URL (không reload trang).
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = (values: LoginForm) => {
    setServerError(null);
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof LoginForm | undefined;
        if (field) setError(field, { message: issue.message });
      }
      return;
    }
    login.mutate(parsed.data, {
      onSuccess: () => router.push('/dashboard'),
      onError: (e) => setServerError(toErrorMessage(e, 'Đăng nhập thất bại.')),
    });
  };

  return (
    <main className="mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold">Đăng nhập</h1>
      {revokedWarning && (
        <p role="alert" className="mt-4 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          Phiên đăng nhập không hợp lệ hoặc bị xâm phạm. Vui lòng đăng nhập lại.
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded border p-2"
            {...register('email')}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Mật khẩu</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded border p-2"
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        {serverError && <p role="alert" className="text-sm text-red-600">{serverError}</p>}
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {login.isPending ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>
      <div className="mt-6 border-t pt-4">
        <GoogleButton />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="font-medium text-black underline">
          Đăng ký ngay
        </Link>
      </p>
    </main>
  );
}
