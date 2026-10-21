import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({
  className,
  size = 'md',
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-orange-600', sizeClasses[size])} />
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  );
}

export function LoadingPage({ text = 'Đang tải dữ liệu...' }: { text?: string }) {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center py-20">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 space-y-3">
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-5 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-full rounded-lg" />
      <Skeleton className="h-4 w-1/2 rounded-lg" />
      <div className="pt-2 flex justify-between items-center">
        <Skeleton className="h-4 w-1/4 rounded-lg" />
        <Skeleton className="h-4 w-1/4 rounded-lg" />
      </div>
    </div>
  );
}

export function GridCardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
