'use client';

import Link from 'next/link';
import type { RecipeSummaryDto } from '@/lib/types/category';
import RecipeCard from '@/components/recipes/RecipeCard';
import {
  UtensilsCrossed,
  Sparkles,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  AlertCircle,
  ChefHat,
} from 'lucide-react';

interface HomeLatestRecipesProps {
  recipes: RecipeSummaryDto[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  selectedCategoryName?: string;
  searchTerm?: string;
  selectedDifficulty?: number;
  onSelectDifficulty: (diff?: number) => void;
  maxTime?: number;
  onSelectMaxTime: (time?: number) => void;
  onPageChange: (newPage: number) => void;
  onClearFilters: () => void;
}

export default function HomeLatestRecipes({
  recipes,
  isLoading,
  isError,
  totalCount,
  page,
  totalPages,
  selectedCategoryName,
  searchTerm,
  selectedDifficulty,
  onSelectDifficulty,
  maxTime,
  onSelectMaxTime,
  onPageChange,
  onClearFilters,
}: HomeLatestRecipesProps) {
  const hasActiveFilters = Boolean(searchTerm || selectedCategoryName || selectedDifficulty || maxTime);

  // Xác định tiêu đề hiển thị
  let title = 'Công thức mới nhất';
  if (searchTerm) {
    title = `Kết quả tìm kiếm cho: "${searchTerm}"`;
  } else if (selectedCategoryName) {
    title = `Danh mục: ${selectedCategoryName}`;
  }

  return (
    <section className="space-y-6">
      {/* =========================================================
          1. HEADER KHU VỰC CÔNG THỨC & BỘ LỌC NHANH
          ========================================================= */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <UtensilsCrossed className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {title}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                {totalCount} món
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Được tuyển chọn và chia sẻ bởi các thành viên và đầu bếp cộng đồng Culinary Blog.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Bỏ lọc</span>
              </button>
            )}
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline px-3 py-1.5 rounded-xl hover:bg-orange-50 transition"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Thanh chip lọc nhanh: Độ khó & Thời gian nấu */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Lọc nhanh:</span>
          </span>

          {/* Tất cả */}
          <button
            type="button"
            onClick={() => {
              onSelectDifficulty(undefined);
              onSelectMaxTime(undefined);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDifficulty === undefined && maxTime === undefined
                ? 'bg-gray-900 text-white shadow-2xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>

          {/* Dễ làm */}
          <button
            type="button"
            onClick={() => onSelectDifficulty(selectedDifficulty === 1 ? undefined : 1)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDifficulty === 1
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Dễ làm</span>
          </button>

          {/* Trung bình */}
          <button
            type="button"
            onClick={() => onSelectDifficulty(selectedDifficulty === 2 ? undefined : 2)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDifficulty === 2
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Trung bình
          </button>

          {/* Dưới 30 phút */}
          <button
            type="button"
            onClick={() => onSelectMaxTime(maxTime === 30 ? undefined : 30)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              maxTime === 30
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Nấu nhanh &lt; 30 phút</span>
          </button>

          {/* Dưới 60 phút */}
          <button
            type="button"
            onClick={() => onSelectMaxTime(maxTime === 60 ? undefined : 60)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              maxTime === 60
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Dưới 60 phút</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          2. DANH SÁCH THẺ CÔNG THỨC (RECIPE CARDS GRID)
          ========================================================= */}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-2xs animate-pulse space-y-3 p-4"
            >
              <div className="aspect-[16/10] bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
              <div className="pt-2 flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-800 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <h3 className="text-base font-bold">Không thể tải danh sách công thức</h3>
          <p className="text-xs text-red-600 max-w-md mx-auto">
            Đã xảy ra lỗi khi kết nối với máy chủ API. Vui lòng thử lại sau.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && recipes.length === 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto">
            <ChefHat className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Chưa tìm thấy món ăn nào phù hợp</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Không có công thức nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại của bạn.
            </p>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs hover:bg-orange-700 active:scale-95 transition"
            >
              <span>Xem tất cả công thức</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Grid thẻ công thức thật */}
      {!isLoading && !isError && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* =========================================================
          3. ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION CONTROLS)
          ========================================================= */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="text-xs text-gray-500">
            Hiển thị trang <span className="font-bold text-gray-900">{page}</span> /{' '}
            <span className="font-bold text-gray-900">{totalPages}</span> ({totalCount} công thức)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Trang trước</span>
            </button>

            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
            >
              <span>Trang sau</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
