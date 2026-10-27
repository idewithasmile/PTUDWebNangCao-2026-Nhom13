'use client';

import Link from 'next/link';
import { CategoryDto } from '@/lib/types/category';
import { ChefHat, BookOpen, Flame, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: CategoryDto;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const isPopular = category.recipeCount >= 3;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
    >
      {/* Khung Ảnh Đại Diện */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100">
        {category.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.imageUrl}
            alt={category.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback khi ảnh lỗi
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ChefHat className="h-16 w-16 text-orange-300 group-hover:scale-110 group-hover:text-orange-400 transition-all duration-300" />
          </div>
        )}

        {/* Huy hiệu Nổi bật nếu có nhiều món */}
        {isPopular && (
          <div className="absolute top-3 left-3 rounded-full bg-orange-600/90 text-white px-2.5 py-1 text-[11px] font-bold shadow-sm flex items-center gap-1 backdrop-blur-xs">
            <Flame className="w-3 h-3 text-amber-200 fill-amber-200" />
            <span>Phổ biến</span>
          </div>
        )}

        {/* Huy hiệu số lượng công thức */}
        <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-orange-600 shadow-sm flex items-center gap-1.5 border border-white/60">
          <BookOpen className="w-3.5 h-3.5 text-orange-500" />
          <span>{category.recipeCount} món</span>
        </div>
      </div>

      {/* Nội dung thông tin danh mục */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
          {category.name}
        </h3>
        {category.description ? (
          <p className="mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        ) : (
          <p className="mt-2 text-xs text-gray-400 italic">Chưa có mô tả chi tiết cho danh mục này.</p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-orange-600 font-semibold">
          <span>Khám phá công thức</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
