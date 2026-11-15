'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { MailX, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { newsletterService } from '@/lib/services/newsletter-service';
import { toErrorMessage } from '@/features/auth/hooks';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(token ? 'loading' : 'error');
  const [message, setMessage] = useState<string>(
    token ? '' : 'Liên kết hủy đăng ký không hợp lệ hoặc bị thiếu mã xác nhận.',
  );

  useEffect(() => {
    if (!token) return;
    let active = true;

    newsletterService
      .unsubscribe(token)
      .then((res) => {
        if (!active) return;
        setStatus('success');
        setMessage(res.message || 'Bạn đã hủy đăng ký nhận bản tin ẩm thực thành công.');
      })
      .catch((err) => {
        if (!active) return;
        setStatus('error');
        setMessage(toErrorMessage(err, 'Không thể hủy đăng ký. Liên kết có thể không hợp lệ hoặc đã hết hạn.'));
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <main className="mx-auto max-w-md py-12">
      <div className="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-lg text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
          {status === 'loading' ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          ) : (
            <MailX className="h-7 w-7 text-rose-600" />
          )}
        </div>

        <h1 className="text-xl font-extrabold text-gray-900 dark:text-zinc-100">
          {status === 'loading'
            ? 'Đang xử lý hủy đăng ký…'
            : status === 'success'
            ? 'Đã hủy đăng ký bản tin'
            : 'Không thể hủy đăng ký'}
        </h1>

        {status !== 'loading' && (
          <div
            className={`flex items-start justify-center gap-2 rounded-2xl p-4 text-sm ${
              status === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
            }`}
          >
            {status === 'error' && <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
            <span>{message}</span>
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Về trang chủ Culinary Blog</span>
        </Link>
      </div>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md py-16 text-center text-sm text-gray-500">
          Đang tải…
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
