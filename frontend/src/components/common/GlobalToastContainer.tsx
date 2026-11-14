'use client';

import Link from 'next/link';
import { useToastStore, ToastItem } from '@/features/toast/useToastStore';
import { BookmarkCheck, Bookmark, CheckCircle2, AlertCircle, AlertTriangle, Info, X, ArrowRight } from 'lucide-react';

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: (id: string) => void }) {
  const isBookmarkToast = toast.title.includes('Sổ tay') || toast.title.includes('lưu');

  const getIcon = () => {
    if (isBookmarkToast) {
      return toast.type === 'success' ? (
        <BookmarkCheck className="w-5 h-5 text-orange-500 fill-orange-500/20 shrink-0" />
      ) : (
        <Bookmark className="w-5 h-5 text-gray-400 shrink-0" />
      );
    }

    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    if (isBookmarkToast && toast.type === 'success') {
      return 'border-orange-500/40 bg-white/95 dark:bg-stone-900/95 shadow-orange-500/10';
    }
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40 bg-white/95 dark:bg-stone-900/95 shadow-emerald-500/10';
      case 'error':
        return 'border-rose-500/40 bg-white/95 dark:bg-stone-900/95 shadow-rose-500/10';
      case 'warning':
        return 'border-amber-500/40 bg-white/95 dark:bg-stone-900/95 shadow-amber-500/10';
      default:
        return 'border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 shadow-stone-500/10';
    }
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 max-w-sm w-full ${getBorderColor()}`}
    >
      <div className="pt-0.5">{getIcon()}</div>

      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-zinc-100 leading-snug">
          {toast.title}
        </p>

        {toast.message && (
          <p className="text-[11px] sm:text-xs text-gray-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {toast.message}
          </p>
        )}

        {toast.actionText && toast.actionHref && (
          <div className="pt-1">
            <Link
              href={toast.actionHref}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition group"
            >
              <span>{toast.actionText}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition -mr-1 -mt-1"
        aria-label="Đóng thông báo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function GlobalToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 pointer-events-none flex flex-col gap-2.5 max-w-sm w-full"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}
