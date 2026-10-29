'use client';

import Link from 'next/link';
import type { RecipeSummaryDto } from '@/lib/types/category';
import { resolveMediaUrl } from '@/lib/utils';
import { Clock, Utensils, ChevronRight } from 'lucide-react';

interface HomeFeaturedSpotlightProps {
  recipe?: RecipeSummaryDto | null;
  onNext?: () => void;
}

const difficultyText: Record<number, string> = {
  1: 'Dễ làm',
  2: 'Trung bình',
  3: 'Khó',
  4: 'Chuyên gia',
};

export default function HomeFeaturedSpotlight({ recipe, onNext }: HomeFeaturedSpotlightProps) {
  if (!recipe) return null;

  const diff = difficultyText[recipe.difficulty] || 'Trung bình';
  const heroImage = recipe.thumbnailUrl
    ? resolveMediaUrl(recipe.thumbnailUrl)
    : 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1e1713] text-white shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[220px]">
        {/* Cột trái: Thông tin món ăn */}
        <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Tag cam: Công thức nổi bật */}
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-orange-500 text-white shadow-xs">
              Công thức nổi bật
            </span>

            {/* Tiêu đề món ăn */}
            <Link href={`/recipes/${encodeURIComponent(recipe.slug)}`} className="group block">
              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-orange-400 transition-colors tracking-tight line-clamp-1">
                {recipe.title}
              </h2>
            </Link>

            {/* Mô tả ngắn */}
            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
              {recipe.description ||
                'Hương vị truyền thống đậm đà, nước dùng thanh ngọt tự nhiên, nguyên liệu tươi ngon được chế biến chuẩn xác.'}
            </p>
          </div>

          {/* Meta: Thời gian | Độ khó | Tác giả */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{recipe.totalTimeMinutes || 45} phút</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-gray-400" />
              <span>{diff}</span>
            </div>

            {recipe.authorName && (
              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                  {recipe.authorName.charAt(0).toUpperCase()}
                </span>
                <span className="truncate max-w-[120px] font-medium text-white">{recipe.authorName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Ảnh món ăn + Nút điều hướng Carousel */}
        <div className="md:col-span-5 relative min-h-[160px] md:min-h-full">
          <Link
            href={`/recipes/${encodeURIComponent(recipe.slug)}`}
            className="block h-full w-full overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt={recipe.title}
              className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
            />
          </Link>

          {/* Nút tròn màu trắng chuyển bài kế tiếp */}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg hover:bg-orange-500 hover:text-white transition-all active:scale-95"
              title="Xem công thức nổi bật khác"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
