'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  message?: string;
}

export default function OfflineBanner({
  message = 'Hệ thống máy chủ đang khởi động hoặc tạm thời gián đoạn kết nối. Vui lòng bấm F5 để tải lại.',
}: OfflineBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="text-sm font-medium text-center sm:text-left">{message}</span>
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition shrink-0"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Tải lại</span>
      </button>
    </div>
  );
}
