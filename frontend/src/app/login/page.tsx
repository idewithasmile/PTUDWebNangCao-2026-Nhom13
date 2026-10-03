'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginForm } from '@/features/auth/schemas';
import { useLogin, toErrorMessage } from '@/features/auth/hooks';
import GoogleButton from '@/features/auth/google-button';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);
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
