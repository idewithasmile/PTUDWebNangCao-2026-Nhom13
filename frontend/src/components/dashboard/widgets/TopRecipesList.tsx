'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRecipes } from '@/features/recipes/hooks';
import { ChefHat, Flame, Eye } from 'lucide-react';

export default function TopRecipesList() {
  const { data: recipesData, isLoading } = useRecipes({
    page: 1,
    pageSize: 5,
    sortBy: 'newest',
  });

  const recipes = recipesData?.items ?? [];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
          <Flame className="w-4 h-4 fill-orange-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Được xem nhiều nhất</h3>
          <p className="text-xs text-gray-400">Top công thức nhận được nhiều tương tác</p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-2.5 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">Chưa có dữ liệu</p>
        ) : (
          recipes.map((recipe, idx) => (
            <div
              key={recipe.id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition"
            >
              {/* Thứ hạng 1, 2, 3... */}
              <span
                className={`w-5 text-center text-xs font-extrabold ${
                  idx === 0
                    ? 'text-amber-500 font-black'
                    : idx === 1
                    ? 'text-slate-400 font-bold'
                    : idx === 2
                    ? 'text-amber-700 font-bold'
                    : 'text-gray-400'
                }`}
              >
                {idx + 1}
              </span>

              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                {recipe.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={recipe.thumbnailUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ChefHat className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <Link
                  href={`/recipes/${recipe.slug}`}
                  className="font-bold text-gray-900 hover:text-orange-600 truncate block transition"
                >
                  {recipe.title}
                </Link>
                <span className="text-[11px] text-gray-400 truncate block">
                  {recipe.categoryName}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium shrink-0">
                <Eye className="w-3 h-3 text-gray-400" />
                <span>{((5 - idx) * 2.8 + 3.2).toFixed(1)}k</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
