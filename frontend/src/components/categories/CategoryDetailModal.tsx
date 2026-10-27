'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CategoryDto } from '@/lib/types/category';
import {
  X,
  ChefHat,
  BookOpen,
  FolderOpen,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Hash,
} from 'lucide-react';

interface CategoryDetailModalProps {
  isOpen: boolean;
  category: CategoryDto | null;
  onClose: () => void;
}

export default function CategoryDetailModal({
  isOpen,
  category,
  onClose,
}: CategoryDetailModalProps) {
  // Lắng nghe phím tắt Escape để thoát modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !category) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Chi Tiết Danh Mục</h3>
              <p className="text-xs text-gray-500">Xem thông tin chi tiết danh mục ẩm thực</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            title="Thoát (Esc)"
            aria-label="Thoát"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Ảnh Danh Mục */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-gray-100">
            {category.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.imageUrl}
                alt={category.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ChefHat className="h-16 w-16 text-orange-300" />
              </div>
            )}
            <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-bold text-orange-600 shadow-sm flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{category.recipeCount} công thức</span>
            </div>
          </div>

          {/* Tên & Slug */}
          <div className="space-y-1.5">
            <h4 className="text-xl font-black text-gray-900 tracking-tight">
              {category.name}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-gray-500">Đường dẫn tĩnh (Slug):</span>
              <span className="font-mono bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-lg border border-orange-200">
                {category.slug}
              </span>
              <span className="inline-flex items-center gap-1 text-gray-400">
                <Hash className="w-3 h-3" />
                <span>Thứ tự: {category.orderIndex}</span>
              </span>
            </div>
          </div>

          {/* Mô tả */}
          <div className="rounded-2xl bg-gray-50/80 p-4 border border-gray-100 text-xs sm:text-sm text-gray-600 leading-relaxed">
            {category.description ? (
              <p>{category.description}</p>
            ) : (
              <p className="italic text-gray-400">Chưa có mô tả chi tiết cho danh mục này.</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
          <Link
            href={`/categories/${category.slug}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
          >
            <span>Khám phá công thức của danh mục</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 text-xs font-bold text-white hover:bg-black transition shadow-sm"
          >
            Thoát / Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
