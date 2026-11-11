'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRecipes } from '@/features/recipes/hooks';
import { ChefHat, ArrowRight, Clock, Users, Eye, Bookmark, Flame } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/utils';

export default function LatestRecipesList() {
  const [activeTab, setActiveTab] = useState<'newest' | 'top_saved'>('newest');

  const { data: recipesData, isLoading } = useRecipes({
    page: 1,
    pageSize: 5,
    sortBy: activeTab === 'newest' ? 'newest' : 'bookmarks_desc',
  });

  const recipes = recipesData?.items ?? [];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4 gap-2">
          {/* Switcher: Mới nhất vs Yêu thích nhất */}
          <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('newest')}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeTab === 'newest'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Mới nhất
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('top_saved')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                activeTab === 'top_saved'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-500" />
              <span>Yêu thích nhất</span>
            </button>
          </div>

          <Link
            href="/recipes"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition shrink-0"
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
            <p className="text-xs text-gray-400 text-center py-6">
              {activeTab === 'newest' ? 'Chưa có bài viết mới' : 'Chưa có công thức nào được lưu'}
            </p>
          ) : (
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-gray-50/80 transition-colors group relative border border-gray-50/60"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                  {recipe.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveMediaUrl(recipe.thumbnailUrl)}
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

                <div className="flex-1 min-w-0 text-xs space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <Link
                      href={`/recipes/${recipe.slug}`}
                      className="font-bold text-gray-900 hover:text-blue-600 truncate block transition"
                    >
                      {recipe.title}
                    </Link>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        recipe.status === 'Published' || String(recipe.status) === '1'
                          ? 'bg-emerald-50 text-emerald-700'
                          : recipe.status === 'Draft' || String(recipe.status) === '0'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {recipe.status === 'Published' || String(recipe.status) === '1'
                        ? 'Đã xuất bản'
                        : recipe.status === 'Draft' || String(recipe.status) === '0'
                        ? 'Bản nháp'
                        : 'Đã lưu trữ'}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 truncate">
                    {recipe.categoryName || 'Ẩm thực'}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {recipe.totalTimeMinutes || 30}p
                      </span>
                      <span>•</span>
                      <span>{new Date(recipe.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                    <div className="flex items-center gap-2 font-semibold">
                      <span className="flex items-center gap-0.5 text-sky-600">
                        <Eye className="w-3 h-3 text-sky-500" />
                        {(recipe.viewCount ?? 0).toLocaleString('vi-VN')}
                      </span>
                      <span className="flex items-center gap-0.5 text-rose-600">
                        <Bookmark className="w-3 h-3 text-rose-500" />
                        {(recipe.bookmarkCount ?? 0).toLocaleString('vi-VN')}
                      </span>
                    </div>
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
