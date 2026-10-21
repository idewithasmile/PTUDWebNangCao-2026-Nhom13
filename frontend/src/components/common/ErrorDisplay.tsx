import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
}

export default function ErrorDisplay({
  title = 'Đã xảy ra lỗi',
  message = 'Không thể tải dữ liệu vào lúc này. Vui lòng thử lại sau hoặc liên hệ quản trị viên.',
  onRetry,
  showHomeLink = true,
}: ErrorDisplayProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-rose-200 bg-rose-50/40 p-8 text-center max-w-lg mx-auto my-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4 shadow-sm">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-sm">
        {message}
      </p>

      <div className="flex items-center gap-3">
        {onRetry && (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onRetry}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Thử lại</span>
          </Button>
        )}
        {showHomeLink && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Về trang chủ</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
