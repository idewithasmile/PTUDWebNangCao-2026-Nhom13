'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RecipesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

export default function RecipesPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: RecipesPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Tạo danh sách trang cần hiển thị
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
      <p className="text-xs text-gray-500">
        Hiển thị <span className="font-semibold text-gray-800">{startItem}</span> -{' '}
        <span className="font-semibold text-gray-800">{endItem}</span> trong tổng số{' '}
        <span className="font-semibold text-gray-800">{totalCount}</span> công thức
      </p>

      <nav className="flex items-center gap-1" aria-label="Điều hướng trang">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Trước</span>
        </button>

        {getPageNumbers().map((p, idx) => (
          typeof p === 'number' ? (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 rounded-lg text-xs font-semibold transition-colors ${
                p === currentPage
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={`dots-${idx}`} className="px-2 text-xs text-gray-400">
              ...
            </span>
          )
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40"
        >
          <span>Sau</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
