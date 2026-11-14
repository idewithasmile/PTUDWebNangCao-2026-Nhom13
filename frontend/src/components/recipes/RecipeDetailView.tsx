'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRecipeDetail } from '@/features/recipes/hooks';
import { toErrorMessage } from '@/features/auth/hooks';
import RecipeIngredientsList from '@/components/recipes/RecipeIngredientsList';
import RecipeStepsList from '@/components/recipes/RecipeStepsList';
import RecipeNutritionCard from '@/components/recipes/RecipeNutritionCard';
import RecipeActionButtons from '@/components/recipes/RecipeActionButtons';
import RecipeGalleryViewer from '@/components/recipes/RecipeGalleryViewer';
import { useRecipeViewTracker } from '@/features/recipes/useRecipeViewTracker';
import { useBookmarkStore } from '@/features/bookmarks/useBookmarkStore';
import { resolveMediaUrl } from '@/lib/utils';
import {
  Clock,
  Users,
  UtensilsCrossed,
  Calendar,
  User,
  Tag,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Eye,
  Bookmark,
} from 'lucide-react';

interface RecipeDetailViewProps {
  slug: string;
  hideBackLink?: boolean;
  onBack?: () => void;
}

const difficultyLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Dễ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  2: { label: 'Trung bình', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  3: { label: 'Khó', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  4: { label: 'Chuyên gia', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function RecipeDetailView({
  slug,
  hideBackLink = false,
  onBack,
}: RecipeDetailViewProps) {
  const { data: recipe, isLoading, isError, error, refetch } = useRecipeDetail(slug);
  const { isBookmarked, toggleBookmark, init } = useBookmarkStore();
  const [localBookmarkCount, setLocalBookmarkCount] = useState<number | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  useRecipeViewTracker(recipe?.id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
        <div className="h-6 w-32 rounded bg-gray-200" />
        <div className="h-10 w-3/4 rounded bg-gray-200" />
        <div className="aspect-[16/9] w-full rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <div className="h-40 rounded-2xl bg-gray-100" />
            <div className="h-60 rounded-2xl bg-gray-100" />
          </div>
          <div className="h-60 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="mx-auto max-w-xl py-16 px-4 text-center animate-fade-in">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Công thức không khả dụng
            </h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              Công thức này hiện đang ở chế độ bản nháp, đã được tác giả chuyển vào kho lưu trữ hoặc chưa được xuất bản công khai.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Khám phá các công thức khác</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
            >
              <span>Về trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const diff = difficultyLabels[recipe.difficulty] || difficultyLabels[1];
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  const isSaved = isBookmarked(recipe.id);
  const bookmarkCount = localBookmarkCount ?? recipe.bookmarkCount ?? 0;

  const handleToggleBookmark = async () => {
    try {
      const res = await toggleBookmark(recipe.id, recipe.title);
      if (res.bookmarkCount !== undefined) {
        setLocalBookmarkCount(res.bookmarkCount);
      } else {
        setLocalBookmarkCount((prev) => (prev ?? recipe.bookmarkCount ?? 0) + (res.isBookmarked ? 1 : -1));
      }
    } catch {
      // Ignored
    }
  };

  const formattedDate = recipe.publishedAt
    ? new Date(recipe.publishedAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : new Date(recipe.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Nút Quay lại danh sách */}
      {!hideBackLink && (
        <div>
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-orange-600"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </button>
          ) : (
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-orange-600"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Danh sách công thức</span>
            </Link>
          )}
        </div>
      )}

      {/* Header thông tin chính */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                <Tag className="h-3.5 w-3.5" />
                {recipe.categoryName}
              </span>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${diff.color}`}>
                Độ khó: {diff.label}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {recipe.title}
            </h1>
          </div>

          {/* Nút Lưu trữ công thức */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 shrink-0 ${
              isSaved
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-white hover:bg-orange-50 text-gray-700 border border-gray-200 hover:border-orange-200 hover:text-orange-600'
            }`}
            title={isSaved ? 'Bỏ lưu công thức' : 'Lưu công thức vào danh sách'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            <span>{isSaved ? 'Đã lưu công thức' : 'Lưu công thức'}</span>
          </button>
        </div>

        <p className="text-base leading-relaxed text-gray-600">{recipe.description}</p>

        {/* Tác giả, Ngày đăng, Lượt xem & Lượt lưu */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-500 border-t border-gray-100">
          <div className="flex items-center gap-1.5 font-medium text-gray-700">
            <User className="h-4 w-4 text-orange-500" />
            <span>Tác giả: {recipe.authorName || 'Ẩn danh'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Ngày đăng: {formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-stone-600">
            <Eye className="h-4 w-4 text-orange-500" />
            <span className="font-bold text-stone-800">{recipe.viewCount ?? 0}</span>
            <span>lượt xem</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-stone-600">
            <Bookmark className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-bold text-stone-800">{bookmarkCount}</span>
            <span>lượt lưu</span>
          </div>
        </div>
      </div>

      {/* Thanh thao tác cho Owner / Admin */}
      <RecipeActionButtons recipe={recipe} />

      {/* Khối Hình ảnh công thức chuẩn Gallery Mockup */}
      <RecipeGalleryViewer images={recipe.images} recipeTitle={recipe.title} />

      {/* Các thẻ thông số tóm tắt (Thời gian, Khẩu phần) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Chuẩn bị</p>
            <p className="text-sm font-bold text-gray-900">{recipe.prepTimeMinutes} phút</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Thời gian nấu</p>
            <p className="text-sm font-bold text-gray-900">{recipe.cookTimeMinutes} phút</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng thời gian</p>
            <p className="text-sm font-bold text-gray-900">{totalTime} phút</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Khẩu phần</p>
            <p className="text-sm font-bold text-gray-900">{recipe.servings} phần</p>
          </div>
        </div>
      </div>

      {/* Thông tin dinh dưỡng */}
      {recipe.nutrition && <RecipeNutritionCard nutrition={recipe.nutrition} />}

      {/* Bố cục 2 cột: Cột trái Nguyên liệu & Các bước thực hiện */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Cột 1: Nguyên liệu */}
        <div className="md:col-span-1">
          <RecipeIngredientsList
            ingredients={recipe.ingredients}
            servings={recipe.servings}
          />
        </div>

        {/* Cột 2: Các bước thực hiện */}
        <div className="md:col-span-2">
          <RecipeStepsList
            steps={recipe.steps}
            instructions={recipe.instructions}
          />
        </div>
      </div>
    </div>
  );
}
