'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChefHat, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { loginSchema, type LoginForm } from '@/features/auth/schemas';
import { useLogin, toErrorMessage } from '@/features/auth/hooks';
import { consumeSessionRevokedFlag } from '@/lib/api-client';
import GoogleButton from '@/features/auth/google-button';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);
  const [revokedWarning, setRevokedWarning] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reason') === 'revoked' || consumeSessionRevokedFlag() !== null) {
      setRevokedWarning(true);
    }
    if (params.get('reset') === 'success') {
      setResetSuccess(true);
    }
    const emailParam = params.get('email');
    if (emailParam) {
      setValue('email', emailParam);
    }
    const passwordParam = params.get('password');
    if (passwordParam) {
      setValue('password', passwordParam);
    }
    if (emailParam || passwordParam || params.get('reason') === 'revoked' || params.get('reset') === 'success') {
      const returnUrl = params.get('returnUrl');
      const cleanUrl = returnUrl
        ? `${window.location.pathname}?returnUrl=${encodeURIComponent(returnUrl)}`
        : window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
    }
  }, [setValue]);

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
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get('returnUrl') || '/';
    login.mutate(parsed.data, {
      onSuccess: () => {
        router.push(returnUrl);
      },
      onError: (e) =>
        setServerError(toErrorMessage(e, 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.')),
    });
  };

  return (
    <main className="mx-auto max-w-md py-6 sm:py-10">
      <div className="rounded-3xl border border-orange-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xl shadow-orange-100/40 dark:shadow-none space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200 dark:shadow-none">
            <ChefHat className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-100">
            Đăng nhập Culinary Blog
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Chào mừng bạn quay lại căn bếp đầy cảm hứng
          </p>
        </div>

        {revokedWarning && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 p-3.5 text-sm text-amber-800 dark:text-amber-200"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Phiên đăng nhập không hợp lệ hoặc bị xâm phạm. Vui lòng đăng nhập lại.</span>
          </div>
        )}

        {resetSuccess && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 p-3.5 text-sm text-emerald-800 dark:text-emerald-200"
          >
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Mật khẩu đã được đặt lại thành công. Hãy đăng nhập với mật khẩu mới.</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-zinc-200">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="ban@example.com"
                className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800 py-2.5 pl-10 pr-3.5 text-sm text-gray-900 dark:text-zinc-100 outline-none transition focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-orange-500/20"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-xs font-medium text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-zinc-200">
                Mật khẩu
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800 py-2.5 pl-10 pr-10 text-sm text-gray-900 dark:text-zinc-100 outline-none transition focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-orange-500/20"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs font-medium text-red-600">{errors.password.message}</p>}
          </div>

          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-3 text-xs font-medium text-red-700 dark:text-red-300"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 py-2.5 px-4 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:from-orange-700 hover:to-amber-700 disabled:opacity-50"
          >
            <span>{login.isPending ? 'Đang đăng nhập…' : 'Đăng nhập'}</span>
            {!login.isPending && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-3 text-gray-400">Hoặc tiếp tục với</span>
          </div>
        </div>

        <GoogleButton />

        <p className="text-center text-sm text-gray-600 dark:text-zinc-400">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 underline-offset-4 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </main>
  );
}
