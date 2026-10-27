'use client';

import Link from 'next/link';
import type { RecipeSummaryDto } from '@/lib/types/category';
import { resolveMediaUrl } from '@/lib/utils';
import {
  Sparkles,
  Clock,
  Users,
  ChefHat,
  ArrowRight,
  Tag,
  Flame,
  Award,
} from 'lucide-react';

interface HomeFeaturedSpotlightProps {
  recipe?: RecipeSummaryDto | null;
}

const difficultyMap: Record<number, { label: string; color: string }> = {
  1: { label: 'Dễ làm', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  2: { label: 'Trung bình', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  3: { label: 'Cầu kỳ', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  4: { label: 'Chuyên gia', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export default function HomeFeaturedSpotlight({ recipe }: HomeFeaturedSpotlightProps) {
  if (!recipe) return null;

  const diffConfig = difficultyMap[recipe.difficulty] || difficultyMap[2];
  const heroImage = recipe.thumbnailUrl ? resolveMediaUrl(recipe.thumbnailUrl) : null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8 lg:p-10 transition-all hover:shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Cột 1: Thông tin nổi bật */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Món ngon tiêu biểu</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
              <Tag className="w-3 h-3" />
              <span>{recipe.categoryName || 'Ẩm thực'}</span>
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${diffConfig.color}`}>
              {diffConfig.label}
            </span>
          </div>

          <Link href={`/recipes/${encodeURIComponent(recipe.slug)}`} className="group block">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 group-hover:text-orange-600 transition-colors tracking-tight leading-snug">
              {recipe.title}
            </h2>
          </Link>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
            {recipe.description ||
              'Món ăn thơm ngon đậm đà phong vị với nguyên liệu tươi ngon được tuyển chọn kỹ lưỡng, phù hợp cho bữa cơm ấm cúng sum vầy bên gia đình.'}
          </p>

          {/* 3 Thông số nhanh */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] text-gray-400 font-medium">Thời gian</span>
                <span className="font-bold text-gray-900">{recipe.totalTimeMinutes || 30} phút</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] text-gray-400 font-medium">Khẩu phần</span>
                <span className="font-bold text-gray-900">{recipe.servings || 4} người</span>
              </div>
            </div>

            {recipe.authorName && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-gray-400 font-medium">Đầu bếp</span>
                  <span className="font-bold text-gray-900">{recipe.authorName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Nút Khám phá */}
          <div className="pt-2">
            <Link
              href={`/recipes/${encodeURIComponent(recipe.slug)}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-200 hover:bg-orange-700 active:scale-95 transition-all"
            >
              <span>Xem chi tiết công thức</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cột 2: Ảnh Hero lớn */}
        <div className="lg:col-span-5">
          <Link
            href={`/recipes/${encodeURIComponent(recipe.slug)}`}
            className="group block relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-sm border border-gray-100"
          >
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={recipe.title}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-orange-100 to-amber-100 text-orange-400 gap-2">
                <ChefHat className="w-16 h-16" />
                <span className="text-xs font-bold text-orange-600">Culinary Blog Masterpiece</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur px-3 py-1.5 rounded-xl">
                <span>Vào bếp ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
