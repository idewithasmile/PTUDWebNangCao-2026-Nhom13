'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRecipes } from '@/features/recipes/hooks';
import { ChefHat, ArrowRight, Eye, MessageSquare, MoreVertical } from 'lucide-react';

export default function LatestRecipesList() {
  const { data: recipesData, isLoading } = useRecipes({
    page: 1,
    pageSize: 5,
    sortBy: 'newest',
  });

  const recipes = recipesData?.items ?? [];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Bài viết mới nhất</h3>
          <Link
            href="/recipes"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">Chưa có bài viết mới</p>
          ) : (
            recipes.map((recipe, idx) => (
              <div
                key={recipe.id}
                className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-gray-50/80 transition-colors group relative border border-gray-50/60"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                  {recipe.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={recipe.thumbnailUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ChefHat className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-start justify-between gap-1">
                    <Link
                      href={`/recipes/${recipe.slug}`}
                      className="font-bold text-gray-900 hover:text-blue-600 truncate block transition"
                    >
                      {recipe.title}
                    </Link>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 p-0.5 shrink-0"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                    {recipe.categoryName || 'Ẩm thực'}
                  </p>

                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(recipe.createdAt).toLocaleDateString('vi-VN')}{' '}
                    {new Date(recipe.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>

                  <div className="flex items-center justify-between mt-1 pt-0.5">
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {(1.2 - idx * 0.15).toFixed(1)}K
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {45 - idx * 6}
                      </span>
                    </div>

                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        recipe.status === 'Published' || String(recipe.status) === '1'
                          ? 'bg-emerald-50 text-emerald-700'
                          : recipe.status === 'Draft' || String(recipe.status) === '0'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {recipe.status === 'Published' || String(recipe.status) === '1'
                        ? 'Đã xuất bản'
                        : recipe.status === 'Draft' || String(recipe.status) === '0'
                        ? 'Bản nháp'
                        : 'Đã lưu trữ'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
