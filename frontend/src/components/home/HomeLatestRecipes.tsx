'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { RecipeSummaryDto } from '@/lib/types/category';
import { resolveMediaUrl } from '@/lib/utils';
import {
  Flame,
  ArrowRight,
  Clock,
  Utensils,
  Heart,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
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
  onPageChange: (newPage: number) => void;
  onClearFilters: () => void;
}

const difficultyLabels: Record<number, string> = {
  1: 'Dễ',
  2: 'Trung bình',
  3: 'Khó',
  4: 'Chuyên gia',
};

export default function HomeLatestRecipes({
  recipes,
  isLoading,
  isError,
  totalCount,
  page,
  totalPages,
  selectedCategoryName,
  searchTerm,
  onPageChange,
  onClearFilters,
}: HomeLatestRecipesProps) {
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hasFilter = Boolean(selectedCategoryName || searchTerm);

  return (
    <section className="space-y-4">
      {/* Header khu vực: Icon lửa cam + "Công thức mới nhất" + "Xem tất cả ➔" */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          </span>
          <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
            {searchTerm
              ? `Kết quả tìm: "${searchTerm}"`
              : selectedCategoryName
              ? `Danh mục: ${selectedCategoryName}`
              : 'Công thức mới nhất'}
          </h3>
          {hasFilter && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-md ml-2"
            >
              <X className="w-3 h-3" />
              <span>Bỏ lọc</span>
            </button>
          )}
        </div>

        <Link
          href="/recipes"
          className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-bold">Không thể tải danh sách công thức</p>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
          >
            Tải lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && recipes.length === 0 && (
        <div className="p-10 bg-white rounded-2xl border border-gray-100 text-center space-y-3">
          <p className="text-sm font-semibold text-gray-700">Chưa tìm thấy công thức phù hợp.</p>
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Xem tất cả công thức
          </button>
        </div>
      )}

      {/* Grid 6 Công thức (2 dòng x 3 cột) chuẩn mockup */}
      {!isLoading && !isError && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {recipes.slice(0, 6).map((recipe) => {
            const isLiked = likedIds[recipe.id];
            const diff = difficultyLabels[recipe.difficulty] || 'Trung bình';
            const imgUrl = recipe.thumbnailUrl
              ? resolveMediaUrl(recipe.thumbnailUrl)
              : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';

            return (
              <Link
                key={recipe.id}
                href={`/recipes/${encodeURIComponent(recipe.slug)}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Ảnh món ăn kèm Category Pill & Nút Thích */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={recipe.title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                    }}
                  />

                  {/* Badge Danh mục góc trên bên trái */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-orange-600 backdrop-blur shadow-2xs">
                      {recipe.categoryName || 'Món ngon'}
                    </span>
                  </div>

                  {/* Nút Thích (Trái tim) góc trên bên phải */}
                  <button
                    type="button"
                    onClick={(e) => toggleLike(e, recipe.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/25 hover:bg-black/40 text-white backdrop-blur transition"
                    title="Yêu thích món ăn"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Thông tin mô tả món ăn */}
                <div className="flex flex-1 flex-col p-3.5 space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {recipe.title}
                  </h4>

                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    {recipe.description || 'Hương vị thơm ngon đậm đà, chế biến đơn giản chuẩn vị.'}
                  </p>

                  {/* Thời gian & Độ khó */}
                  <div className="pt-1.5 flex items-center gap-3 text-[11px] text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{recipe.totalTimeMinutes || 30} phút</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-gray-400" />
                      <span>{diff}</span>
                    </div>
                  </div>

                  {/* Tác giả */}
                  {recipe.authorName && (
                    <div className="pt-2 border-t border-gray-50 flex items-center gap-1.5 text-[11px] text-gray-600">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 text-[9px] font-bold text-orange-700">
                        {recipe.authorName.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate">{recipe.authorName}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Phân trang ngắn gọn nếu có nhiều hơn 1 trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 text-xs text-gray-500">
          <span>
            Trang {page} / {totalPages} ({totalCount} món)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
