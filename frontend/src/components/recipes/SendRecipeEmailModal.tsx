'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, X } from 'lucide-react';
import { recipeService } from '@/lib/services/recipe-service';
import { useToastStore } from '@/features/toast/useToastStore';
import { toErrorMessage } from '@/features/auth/hooks';

interface SendRecipeEmailModalProps {
  recipeId: string;
  recipeTitle: string;
  defaultServings: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SendRecipeEmailModal({
  recipeId,
  recipeTitle,
  defaultServings,
  isOpen,
  onClose,
}: SendRecipeEmailModalProps) {
  const { addToast } = useToastStore();
  const [email, setEmail] = useState('');
  const [servings, setServings] = useState<number>(defaultServings > 0 ? defaultServings : 2);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setServings(defaultServings > 0 ? defaultServings : 2);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [defaultServings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ để nhận phiếu đi chợ.');
      return;
    }

    setIsSending(true);
    try {
      const res = await recipeService.sendToEmail(recipeId, {
        email: trimmedEmail,
        servings,
        subscribeNewsletter,
      });
      setSuccessMsg(res.message);
      setEmail('');
      addToast({
        type: 'success',
        title: 'Đã gửi phiếu đi chợ qua Email! 📩',
        message: res.message,
        duration: 4000,
      });
    } catch (err: unknown) {
      setErrorMsg(toErrorMessage(err, 'Không thể gửi email lúc này. Vui lòng thử lại.'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-recipe-email-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs print:hidden"
    >
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="send-recipe-email-title"
                className="text-lg font-bold text-stone-900 dark:text-zinc-50"
              >
                Gửi phiếu đi chợ qua Email
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 line-clamp-1">
                {recipeTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <div>
            <label
              htmlFor="send-recipe-email-input"
              className="mb-1 block text-xs font-semibold text-stone-700 dark:text-zinc-300"
            >
              Email nhận nguyên liệu &amp; cách làm
            </label>
            <input
              id="send-recipe-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emailcuaban@example.com"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="send-recipe-servings-input"
              className="mb-1 block text-xs font-semibold text-stone-700 dark:text-zinc-300"
            >
              Số khẩu phần quy đổi
            </label>
            <input
              id="send-recipe-servings-input"
              type="number"
              min={1}
              max={100}
              value={servings}
              onChange={(e) => setServings(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
              className="w-28 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm font-semibold text-stone-900 focus:border-orange-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-orange-50/60 p-3 text-xs text-stone-700 dark:bg-orange-950/30 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={subscribeNewsletter}
              onChange={(e) => setSubscribeNewsletter(e.target.checked)}
              className="mt-0.5 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
            />
            <span>Đăng ký nhận thêm các công thức ngon mới hàng tuần qua email này.</span>
          </label>

          {errorMsg && (
            <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="rounded-xl bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {isSending ? 'Đang gửi…' : 'Gửi ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
