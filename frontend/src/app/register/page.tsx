'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterForm } from '@/features/auth/schemas';
import { applyServerFieldErrors, useRegister, toErrorMessage } from '@/features/auth/hooks';
import GoogleButton from '@/features/auth/google-button';

export default function RegisterPage() {
  const router = useRouter();
  const signup = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit = (values: RegisterForm) => {
    setServerError(null);
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof RegisterForm | undefined;
        if (field) setError(field, { message: issue.message });
      }
      return;
    }
    signup.mutate(parsed.data, {
      // FR-AUTH-001: auto-login sau đăng ký → vào dashboard.
      onSuccess: () => router.push('/dashboard'),
      onError: (e) => {
        // Ưu tiên hiện lỗi field từ RFC 7807 `errors` inline dưới từng input
        // (vd Email/UserName trùng, Password bị Identity từ chối). Message nào
        // không map được field (hoặc lỗi không có `errors` như 409) → banner.
        const { mapped, leftover } = applyServerFieldErrors(e, (field, message) =>
          setError(field, { type: 'server', message }),
        );
        if (leftover.length > 0) setServerError(leftover.join(' '));
        else if (mapped === 0) setServerError(toErrorMessage(e, 'Đăng ký thất bại.'));
        else setServerError(null);
      },
    });
  };

  return (
    <main className="mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold">Đăng ký</h1>
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
          <label htmlFor="userName" className="block text-sm font-medium">Tên đăng nhập</label>
          <input
            id="userName"
            type="text"
            autoComplete="username"
            className="mt-1 w-full rounded border p-2"
            {...register('userName')}
          />
          {errors.userName && <p className="text-sm text-red-600">{errors.userName.message}</p>}
        </div>
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium">Tên hiển thị</label>
          <input
            id="displayName"
            type="text"
            autoComplete="nickname"
            className="mt-1 w-full rounded border p-2"
            {...register('displayName')}
          />
          {errors.displayName && <p className="text-sm text-red-600">{errors.displayName.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Mật khẩu</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded border p-2"
            {...register('password')}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
          </p>
        </div>
        {serverError && <p role="alert" className="text-sm text-red-600">{serverError}</p>}
        <button
          type="submit"
          disabled={signup.isPending}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
        >
          {signup.isPending ? 'Đang đăng ký…' : 'Đăng ký'}
        </button>
      </form>
      <div className="mt-6 border-t pt-4">
        <GoogleButton />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <Link href="/login" className="font-medium text-black underline">
          Đăng nhập
        </Link>
      </p>
    </main>
  );
}
