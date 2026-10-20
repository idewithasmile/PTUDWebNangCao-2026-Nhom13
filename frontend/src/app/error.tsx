'use client';

import { useEffect } from 'react';
import ErrorDisplay from '@/components/common/ErrorDisplay';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="py-12 px-4 sm:px-6">
      <ErrorDisplay
        title="Đã xảy ra sự cố ngoài ý muốn"
        message={error.message || 'Hệ thống gặp sự cố khi xử lý trang này. Vui lòng thử lại.'}
        onRetry={() => reset()}
      />
    </div>
  );
}
