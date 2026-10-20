import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  onPageChange?: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Tính toán dải trang hiển thị (tối đa 5 nút xung quanh trang hiện tại)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = getPageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const renderPageItem = (p: number | string, index: number) => {
    if (typeof p === 'string') {
      return (
        <span
          key={`ellipsis-${index}`}
          className="flex h-9 w-9 items-center justify-center text-sm text-gray-400 select-none"
        >
          ...
        </span>
      );
    }

    const isActive = p === currentPage;

    if (baseUrl) {
      const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${p}`;
      return (
        <Link
          key={p}
          href={url}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all',
            isActive
              ? 'bg-orange-600 text-white shadow-sm'
              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          {p}
        </Link>
      );
    }

    return (
      <button
        key={p}
        type="button"
        onClick={() => onPageChange?.(p)}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all',
          isActive
            ? 'bg-orange-600 text-white shadow-sm'
            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        {p}
      </button>
    );
  };

  return (
    <nav
      className={cn('flex items-center justify-center gap-2 select-none', className)}
      aria-label="Phân trang"
    >
      {/* Nút lùi */}
      {baseUrl ? (
        hasPrevious ? (
          <Link
            href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage - 1}`}
            className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Trước</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Trước</span>
          </span>
        )
      ) : (
        <button
          type="button"
          disabled={!hasPrevious}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-300"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Trước</span>
        </button>
      )}

      {/* Các số trang */}
      <div className="flex items-center gap-1.5">{pages.map(renderPageItem)}</div>

      {/* Nút tới */}
      {baseUrl ? (
        hasNext ? (
          <Link
            href={`${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${currentPage + 1}`}
            className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )
      ) : (
        <button
          type="button"
          disabled={!hasNext}
          onClick={() => onPageChange?.(currentPage + 1)}
          className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-300"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
}
