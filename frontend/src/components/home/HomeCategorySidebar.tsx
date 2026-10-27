'use client';

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
  Layers,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface HomeCategorySidebarProps {
  categories: CategoryDto[];
  isLoading: boolean;
  isError: boolean;
  selectedCategoryId?: string;
  onSelectCategory: (categoryId?: string) => void;
  onRetry?: () => void;
}

// Icon tương ứng với danh mục ẩm thực phong phú
function renderCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('việt') || lower.includes('phở') || lower.includes('bún') || lower.includes('canh')) {
    return <Soup className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />;
  }
  if (lower.includes('âu') || lower.includes('bánh mì')) {
    return <Pizza className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />;
  }
  if (lower.includes('chay') || lower.includes('salad') || lower.includes('gỏi')) {
    return <Salad className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />;
  }
  if (lower.includes('nướng') || lower.includes('chiên') || lower.includes('kho')) {
    return <Flame className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />;
  }
  if (lower.includes('tráng miệng') || lower.includes('bánh')) {
    return <Cake className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />;
  }
  if (lower.includes('uống') || lower.includes('trà') || lower.includes('nước')) {
    return <Coffee className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />;
  }
  if (lower.includes('hải sản') || lower.includes('cá') || lower.includes('tôm')) {
    return <Fish className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />;
  }
  if (lower.includes('sáng') || lower.includes('trứng')) {
    return <Egg className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />;
  }
  return <UtensilsCrossed className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />;
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
    <aside className="w-full lg:w-[260px] xl:w-[270px] shrink-0 space-y-5">
      {/* =========================================================
          1. GIAO DIỆN DI ĐỘNG (HORIZONTAL PILL BAR CHO MOBILE)
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
                ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>Tất cả</span>
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
                    ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-200'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-80">({cat.recipeCount || 0})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          2. GIAO DIỆN DESKTOP (STICKY SIDEBAR CỘT TRÁI CHUẨN MOCKUP)
          ========================================================= */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        {/* Header: Icon cam + Chữ "Danh mục" */}
        <div className="flex items-center gap-2.5 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-white shadow-xs">
            <UtensilsCrossed className="h-4 w-4" />
          </span>
          <h3 className="text-base font-black text-gray-900 tracking-tight">Danh mục</h3>
        </div>

        {/* Nút: Tất cả danh mục */}
        <button
          type="button"
          onClick={() => onSelectCategory(undefined)}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            !selectedCategoryId
              ? 'bg-orange-500 text-white shadow-orange-200'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-white/20">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <span>Tất cả danh mục</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${
              !selectedCategoryId ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {totalRecipesCount || 128}
          </span>
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2 py-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Lỗi tải danh mục</span>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Thử lại</span>
              </button>
            )}
          </div>
        )}

        {/* Danh sách từng Danh mục */}
        {!isLoading && !isError && (
          <div className="space-y-0.5 max-h-[460px] overflow-y-auto pr-1 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(isSelected ? undefined : cat.id)}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-orange-50 text-orange-600 font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {renderCategoryIcon(cat.name)}
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span
                    className={`text-[11px] font-medium transition-colors ${
                      isSelected ? 'text-orange-600 font-bold' : 'text-gray-400 group-hover:text-gray-600'
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

      {/* =========================================================
          3. PROMO CARD: NGUYÊN LIỆU TƯƠI NGON (DƯỚI SIDEBAR)
          ========================================================= */}
      <div className="hidden lg:block relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 p-4 shadow-sm group">
        <div className="space-y-1.5 relative z-10 max-w-[150px]">
          <h4 className="text-sm font-black text-gray-900 leading-snug">
            Nguyên liệu tươi ngon
          </h4>
          <p className="text-[11px] text-gray-500 leading-tight">
            Cho món ăn thêm trọn vị
          </p>
          <div className="pt-2">
            <Link
              href="/recipes?filter=ingredients"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold shadow-xs transition-transform active:scale-95"
            >
              <span>Khám phá ngay</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Ảnh rau củ quả tươi ngon góc dưới */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80"
          alt="Nguyên liệu tươi ngon"
          className="absolute -right-4 -bottom-4 w-28 h-28 object-cover rounded-full shadow-inner opacity-90 group-hover:scale-105 transition-transform"
        />
      </div>
    </aside>
  );
}
