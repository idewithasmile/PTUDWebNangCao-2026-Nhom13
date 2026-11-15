'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordForm } from '@/features/auth/schemas';
import { useResetPassword, toErrorMessage } from '@/features/auth/hooks';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const tokenParam = searchParams.get('token') || '';

  const resetPassword = useResetPassword();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      email: emailParam,
      token: tokenParam,
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    setValue('email', emailParam);
    setValue('token', tokenParam);
  }, [emailParam, tokenParam, setValue]);

  const watchedPassword = watch('newPassword', '');
  const passwordChecks = [
    { label: 'Tối thiểu 8 ký tự', ok: watchedPassword.length >= 8 },
    { label: 'Ít nhất 1 chữ hoa (A-Z)', ok: /[A-Z]/.test(watchedPassword) },
    { label: 'Ít nhất 1 chữ thường (a-z)', ok: /[a-z]/.test(watchedPassword) },
    { label: 'Ít nhất 1 chữ số (0-9)', ok: /[0-9]/.test(watchedPassword) },
    { label: 'Ít nhất 1 ký tự đặc biệt', ok: /[^a-zA-Z0-9]/.test(watchedPassword) },
  ];
  const strengthScore = passwordChecks.filter((c) => c.ok).length;

  const onSubmit = (values: ResetPasswordForm) => {
    setServerError(null);
    const parsed = resetPasswordSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ResetPasswordForm | undefined;
        if (field) setError(field, { message: issue.message });
      }
      return;
    }

    resetPassword.mutate(
      {
        email: parsed.data.email,
        token: parsed.data.token,
        newPassword: parsed.data.newPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            router.push('/login?reset=success');
          }, 1500);
        },
        onError: (e) => {
          setServerError(toErrorMessage(e, 'Không thể đặt lại mật khẩu. Liên kết có thể đã hết hạn.'));
        },
      },
    );
  };

  const missingLinkParams = !emailParam || !tokenParam;

  return (
    <main className="mx-auto max-w-md py-8 sm:py-12">
      <div className="rounded-3xl border border-orange-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xl shadow-orange-100/40 dark:shadow-none space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-100">
            Đặt lại mật khẩu mới
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {emailParam ? `Tài khoản: ${emailParam}` : 'Nhập mật khẩu mới cho tài khoản của bạn'}
          </p>
        </div>

        {missingLinkParams ? (
          <div className="space-y-4">
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-300"
            >
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <span>Liên kết đặt lại mật khẩu không đầy đủ hoặc không hợp lệ. Vui lòng yêu cầu gửi lại email mới.</span>
            </div>
            <Link
              href="/forgot-password"
              className="flex w-full items-center justify-center rounded-xl bg-orange-600 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition"
            >
              Yêu cầu liên kết mới
            </Link>
          </div>
        ) : isSuccess ? (
          <div className="space-y-4 text-center">
            <div
              role="status"
              className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm text-emerald-800 dark:text-emerald-200 space-y-2"
            >
              <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-600" />
              <p className="font-bold">Đặt lại mật khẩu thành công!</p>
              <p className="text-xs">Đang chuyển hướng bạn về trang đăng nhập…</p>
            </div>
            <Link
              href="/login?reset=success"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <input type="hidden" {...register('email')} />
            <input type="hidden" {...register('token')} />

            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 dark:text-zinc-200">
                Mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Nhập mật khẩu mới"
                  className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800 py-2.5 pl-10 pr-10 text-sm text-gray-900 dark:text-zinc-100 outline-none transition focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-orange-500/20"
                  {...register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                  aria-label={showNewPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-xs font-medium text-red-600">{errors.newPassword.message}</p>}

              {/* Thanh báo độ mạnh mật khẩu */}
              <div className="pt-1 space-y-2">
                <div className="grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 rounded-full transition-colors ${
                        strengthScore >= step
                          ? strengthScore <= 2
                            ? 'bg-red-500'
                            : strengthScore <= 4
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                          : 'bg-gray-200 dark:bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <ul className="grid grid-cols-1 gap-1 text-[11px] text-gray-500 dark:text-zinc-400">
                  {passwordChecks.map((chk) => (
                    <li key={chk.label} className={`flex items-center gap-1.5 ${chk.ok ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${chk.ok ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-zinc-600'}`} />
                      <span>{chk.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-zinc-200">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800 py-2.5 pl-10 pr-10 text-sm text-gray-900 dark:text-zinc-100 outline-none transition focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-orange-500/20"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-red-600">{errors.confirmPassword.message}</p>
              )}
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
              disabled={resetPassword.isPending}
              className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 py-2.5 px-4 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:from-orange-700 hover:to-amber-700 disabled:opacity-50"
            >
              {resetPassword.isPending ? 'Đang cập nhật mật khẩu…' : 'Xác nhận đặt lại mật khẩu'}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại đăng nhập</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md py-16 text-center text-sm text-gray-500">
          Đang tải trang đặt lại mật khẩu…
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
