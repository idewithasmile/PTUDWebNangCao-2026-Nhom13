'use client';

import type { CategoryDto } from '@/lib/types/category';
import { UtensilsCrossed, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface HomeCategorySidebarProps {
  categories: CategoryDto[];
  isLoading: boolean;
  isError: boolean;
  selectedCategoryId?: string;
  onSelectCategory: (categoryId?: string) => void;
  onRetry?: () => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  'Món khai vị': '🥗',
  'Món chính': '🥩',
  'Món canh': '🍲',
  'Món kho': '🥘',
  'Món xào': '🍳',
  'Món nướng': '🍢',
  'Món chiên rán': '🍗',
  'Món hấp': '🥟',
  'Món luộc': '🥬',
  'Món gỏi - nộm': '🥒',
  'Món lẩu': '🍲',
  'Món chay': '🥑',
  'Món ăn vặt': '🍿',
  'Đồ uống': '🍹',
  'Tráng miệng': '🍨',
  'Bánh ngọt': '🍰',
  'Mì - Bún - Phở': '🍜',
  'Cơm & Cháo': '🍚',
  'Hải sản': '🦐',
  'Gia cầm': '🍗',
  'Thịt bò': '🥩',
  'Thịt heo': '🥓',
};

function getCategoryEmoji(name: string): string {
  return CATEGORY_EMOJIS[name] || '🍽️';
}

export default function HomeCategorySidebar({
  categories,
  isLoading,
  isError,
  selectedCategoryId,
  onSelectCategory,
  onRetry,
}: HomeCategorySidebarProps) {
  const totalRecipesCount = categories.reduce((sum, c) => sum + (c.recipeCount || 0), 0);

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* =========================================================
          1. GIAO DIỆN DI ĐỘNG (HORIZONTAL PILL BAR CHO MOBILE/TABLET)
          ========================================================= */}
      <div className="lg:hidden space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-orange-500" />
            <span>Lọc theo Danh mục</span>
          </span>
          {selectedCategoryId && (
            <button
              type="button"
              onClick={() => onSelectCategory(undefined)}
              className="text-xs text-orange-600 font-bold hover:underline"
            >
              Xem tất cả
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => onSelectCategory(undefined)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
              !selectedCategoryId
                ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>🍽️ Tất cả</span>
            <span className="text-[10px] opacity-80">({totalRecipesCount})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? undefined : cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-200'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{getCategoryEmoji(cat.name)}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-80">({cat.recipeCount || 0})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          2. GIAO DIỆN DESKTOP (STICKY SIDEBAR CỘT TRÁI)
          ========================================================= */}
      <div className="hidden lg:block sticky top-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
        {/* Header Sidebar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">Danh mục món ăn</h3>
              <p className="text-[11px] text-gray-400">Chọn để lọc công thức</p>
            </div>
          </div>
          {selectedCategoryId && (
            <button
              type="button"
              onClick={() => onSelectCategory(undefined)}
              className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              Đặt lại
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2 py-2">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-9 w-full rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-2xl bg-red-50 p-4 border border-red-100 text-center space-y-2 text-xs text-red-700">
            <AlertCircle className="w-5 h-5 mx-auto text-red-500" />
            <p>Không thể tải danh mục.</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1 font-bold text-red-800 hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Thử lại</span>
              </button>
            )}
          </div>
        )}

        {/* Danh sách categories */}
        {!isLoading && !isError && (
          <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {/* Lựa chọn Tất cả */}
            <button
              type="button"
              onClick={() => onSelectCategory(undefined)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                !selectedCategoryId
                  ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs'
                  : 'text-gray-700 hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🍽️</span>
                <span>Tất cả danh mục</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  !selectedCategoryId
                    ? 'bg-orange-200/80 text-orange-900'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {totalRecipesCount}
              </span>
            </button>

            {/* Từng danh mục */}
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(isSelected ? undefined : cat.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                    isSelected
                      ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs'
                      : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base shrink-0">{getCategoryEmoji(cat.name)}</span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-1 ${
                      isSelected
                        ? 'bg-orange-200/80 text-orange-900'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.recipeCount || 0}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
