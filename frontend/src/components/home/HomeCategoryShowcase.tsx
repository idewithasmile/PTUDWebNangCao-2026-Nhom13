'use client';

import Link from 'next/link';
import type { CategoryDto } from '@/lib/types/category';
import { Sparkles, ArrowRight, Utensils, BookOpen } from 'lucide-react';

interface HomeCategoryShowcaseProps {
  categories: CategoryDto[];
  onSelectCategory: (categoryId: string) => void;
}

const CATEGORY_BACKGROUNDS = [
  'from-orange-500 to-amber-600',
  'from-rose-500 to-red-600',
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-amber-500 to-yellow-600',
];

export default function HomeCategoryShowcase({
  categories,
  onSelectCategory,
}: HomeCategoryShowcaseProps) {
  // Chọn 6 danh mục tiêu biểu có nhiều công thức nhất
  const topCategories = [...categories]
    .sort((a, b) => (b.recipeCount || 0) - (a.recipeCount || 0))
    .slice(0, 6);

  if (topCategories.length === 0) return null;

  return (
    <section className="space-y-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Khám phá theo Bộ sưu tập
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tuyển tập các danh mục ẩm thực phong phú được bạn đọc yêu thích nhất.
          </p>
        </div>

        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline px-3 py-1.5 rounded-xl hover:bg-orange-50 transition self-start sm:self-auto"
        >
          <span>Xem tất cả 20 danh mục</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {topCategories.map((cat, idx) => {
          const bgGradient = CATEGORY_BACKGROUNDS[idx % CATEGORY_BACKGROUNDS.length];
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="group relative flex flex-col items-center justify-center p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all text-center space-y-2 overflow-hidden"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${bgGradient} text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}
              >
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">
                <BookOpen className="w-3 h-3 text-orange-500" />
                <span>{cat.recipeCount || 0} món</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
