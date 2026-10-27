'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { CategoryDto } from '@/lib/types/category';
import {
  UtensilsCrossed,
  Soup,
  Coffee,
  Cake,
  Flame,
  Salad,
  Pizza,
  Fish,
  Egg,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface HomeCategorySectionProps {
  categories: CategoryDto[];
  isLoading: boolean;
  isError: boolean;
  selectedCategoryId?: string;
  onSelectCategory: (categoryId?: string) => void;
  onRetry?: () => void;
}

// Icon tương ứng với từng nhóm món ăn
function renderCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('việt') || lower.includes('phở') || lower.includes('bún') || lower.includes('canh')) {
    return <Soup className="w-4 h-4" />;
  }
  if (lower.includes('âu') || lower.includes('bánh mì')) {
    return <Pizza className="w-4 h-4" />;
  }
  if (lower.includes('chay') || lower.includes('salad') || lower.includes('gỏi') || lower.includes('rau')) {
    return <Salad className="w-4 h-4" />;
  }
  if (lower.includes('nướng') || lower.includes('chiên') || lower.includes('kho') || lower.includes('xào')) {
    return <Flame className="w-4 h-4" />;
  }
  if (lower.includes('tráng miệng') || lower.includes('bánh') || lower.includes('chè')) {
    return <Cake className="w-4 h-4" />;
  }
  if (lower.includes('uống') || lower.includes('trà') || lower.includes('nước') || lower.includes('cà phê')) {
    return <Coffee className="w-4 h-4" />;
  }
  if (lower.includes('hải sản') || lower.includes('cá') || lower.includes('tôm') || lower.includes('mực')) {
    return <Fish className="w-4 h-4" />;
  }
  if (lower.includes('sáng') || lower.includes('trứng')) {
    return <Egg className="w-4 h-4" />;
  }
  return <UtensilsCrossed className="w-4 h-4" />;
}

export default function HomeCategorySection({
  categories,
  isLoading,
  isError,
  selectedCategoryId,
  onSelectCategory,
  onRetry,
}: HomeCategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const totalRecipesCount = categories.reduce((sum, c) => sum + (c.recipeCount || 0), 0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4">
      {/* Header khu vực Danh mục */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white shadow-xs">
            <UtensilsCrossed className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Khám phá theo Danh mục
            </h3>
            <p className="text-xs text-gray-400">
              Chọn danh mục để lọc nhanh công thức nấu ăn phù hợp khẩu vị
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedCategoryId && (
            <button
              type="button"
              onClick={() => onSelectCategory(undefined)}
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Xem tất cả</span>
            </button>
          )}

          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline"
          >
            <span>Tất cả danh mục</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Nút mũi tên cuộn ngang (Desktop) */}
          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-gray-200">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
              title="Cuộn sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
              title="Cuộn sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="flex items-center gap-3 overflow-hidden py-1">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-11 w-32 shrink-0 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex items-center justify-between p-4 bg-red-50 text-red-700 rounded-2xl text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Không thể tải danh sách danh mục</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 font-bold text-red-600 hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      )}

      {/* Danh sách thẻ Danh mục dạng thanh cuộn ngang mượt mà */}
      {!isLoading && !isError && (
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar scroll-smooth"
        >
          {/* Card: Tất cả danh mục */}
          <button
            type="button"
            onClick={() => onSelectCategory(undefined)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 shadow-2xs ${
              !selectedCategoryId
                ? 'bg-orange-500 text-white shadow-orange-200 ring-2 ring-orange-200'
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Tất cả món</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                !selectedCategoryId ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {totalRecipesCount || 106}
            </span>
          </button>

          {/* Từng danh mục cụ thể */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? undefined : cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 shadow-2xs ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-orange-200 ring-2 ring-orange-200'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-gray-500'}>
                  {renderCategoryIcon(cat.name)}
                </span>
                <span>{cat.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isSelected
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600'
                  }`}
                >
                  {cat.recipeCount || 0}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
