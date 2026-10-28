'use client';

import Link from 'next/link';
import { RecipeSummaryDto } from '@/lib/types/category';
import { Clock, Users, Calendar } from 'lucide-react';
import {
  cleanRecipeTitle,
  getRecipeDisplayImage,
  formatRecipeDate,
  getAuthorAvatarInfo,
  FALLBACK_RECIPE_IMAGES,
} from '@/lib/recipe-ui-helpers';

interface RecipeCardProps {
  recipe: RecipeSummaryDto;
}

const difficultyLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Dễ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  2: { label: 'Trung bình', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  3: { label: 'Khó', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  4: { label: 'Chuyên gia', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime =
    (recipe.totalTimeMinutes ?? ((recipe.prepTime || 0) + (recipe.cookTime || 0))) || 30;
  const diff = difficultyLabels[recipe.difficulty] || difficultyLabels[1];
  const title = cleanRecipeTitle(recipe.title);
  const imgUrl = getRecipeDisplayImage(recipe);
  const formattedDate = formatRecipeDate(recipe.createdAt || recipe.publishedAt);
  const authorInfo = getAuthorAvatarInfo(recipe.authorName);

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl}
          alt={title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_RECIPE_IMAGES[0];
          }}
        />

        {/* Badge trạng thái cho Bản nháp hoặc Lưu trữ */}
        {(recipe.status === 'Draft' || (recipe.status as unknown) === 0) && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-amber-500 text-white font-bold px-2.5 py-0.5 text-[11px] shadow-sm backdrop-blur">
              Bản nháp
            </span>
          </div>
        )}
        {(recipe.status === 'Archived' || (recipe.status as unknown) === 2) && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-slate-600 text-white font-bold px-2.5 py-0.5 text-[11px] shadow-sm backdrop-blur">
              Đã lưu trữ
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur bg-white/90 ${diff.color}`}
          >
            {diff.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h4 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
          {title}
        </h4>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        {/* Footer thông tin: Hàng thông số nấu + Dòng tác giả và ngày đăng riêng biệt */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2.5">
          {/* Hàng 1: Thời gian & Khẩu phần */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-medium">{totalTime} phút</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-medium">{recipe.servings} phần</span>
            </div>
          </div>

          {/* Hàng 2: Tác giả xuống 1 dòng riêng kèm logo avatar (không bị mất chữ) + Ngày đăng */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-50">
            {/* Tác giả với Logo/Avatar đại diện */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div
                className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-xs shrink-0 ring-1 ring-black/5"
                style={{ background: authorInfo.gradient }}
                title={`Tác giả: ${authorInfo.name}`}
              >
                {authorInfo.initial}
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-600 transition-colors truncate">
                {authorInfo.name}
              </span>
            </div>

            {/* Ngày đăng */}
            {formattedDate && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
