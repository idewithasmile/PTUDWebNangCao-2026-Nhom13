'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, KeyRound, ArrowLeft, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordForm } from '@/features/auth/schemas';
import { useForgotPassword, toErrorMessage } from '@/features/auth/hooks';

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = (values: ForgotPasswordForm) => {
    setServerError(null);
    const parsed = forgotPasswordSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ForgotPasswordForm | undefined;
        if (field) setError(field, { message: issue.message });
      }
      return;
    }

    forgotPassword.mutate(parsed.data.email, {
      onSuccess: () => {
        setSubmittedEmail(parsed.data.email);
      },
      onError: (e) => {
        setServerError(toErrorMessage(e, 'Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại.'));
      },
    });
  };

  return (
    <main className="mx-auto max-w-md py-8 sm:py-12">
      <div className="rounded-3xl border border-orange-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xl shadow-orange-100/40 dark:shadow-none space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-100">
            Quên mật khẩu?
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Nhập email tài khoản của bạn để nhận liên kết tạo mật khẩu mới.
          </p>
        </div>

        {submittedEmail ? (
          <div className="space-y-4">
            <div
              role="status"
              className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm text-emerald-800 dark:text-emerald-200 space-y-2"
            >
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Đã gửi hướng dẫn khôi phục!</span>
              </div>
              <p className="leading-relaxed text-xs sm:text-sm">
                Nếu email <strong>{submittedEmail}</strong> tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến (hoặc thư rác).
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && (
              <div className="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/20 p-3.5 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
                <p className="font-semibold">Môi trường phát triển (Dev MailHog):</p>
                <p>
                  Bạn có thể mở hộp thư giả lập tại{' '}
                  <a
                    href="http://localhost:8025"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold underline"
                  >
                    http://localhost:8025 <ExternalLink className="h-3 w-3" />
                  </a>{' '}
                  để lấy liên kết đặt lại mật khẩu.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSubmittedEmail(null)}
                className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 py-2.5 text-xs font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                Gửi lại với email khác
              </button>
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại đăng nhập</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-zinc-200">
                Địa chỉ Email
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
              disabled={forgotPassword.isPending}
              className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 py-2.5 px-4 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:from-orange-700 hover:to-amber-700 disabled:opacity-50"
            >
              {forgotPassword.isPending ? 'Đang gửi yêu cầu…' : 'Gửi liên kết đặt lại mật khẩu'}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại trang đăng nhập</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
