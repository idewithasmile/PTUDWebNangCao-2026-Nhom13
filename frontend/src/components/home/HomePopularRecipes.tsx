'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRecipes } from '@/features/recipes/hooks';
import { useBookmarkStore } from '@/features/bookmarks/useBookmarkStore';
import {
  cleanRecipeTitle,
  getRecipeDisplayImage,
  FALLBACK_RECIPE_IMAGES,
} from '@/lib/recipe-ui-helpers';
import {
  Flame,
  Bookmark,
  Eye,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Trophy,
} from 'lucide-react';

type RankingTab = 'hot' | 'bookmarks_desc' | 'views_desc';

export default function HomePopularRecipes() {
  const [activeTab, setActiveTab] = useState<RankingTab>('hot');
  const { isBookmarked, toggleBookmark, init } = useBookmarkStore();

  useEffect(() => {
    init();
  }, [init]);

  const {
    data: popularData,
    isLoading,
    isError,
    refetch,
  } = useRecipes({
    sortBy: activeTab,
    status: 'Published',
    page: 1,
    pageSize: 4,
  });

  const recipes = popularData?.items ?? [];

  const handleToggleBookmark = (e: React.MouseEvent, id: string, title?: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(id, title);
  };

  const rankBadgeColors = [
    'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300 shadow-md', // Top 1
    'bg-gradient-to-r from-slate-400 to-slate-600 text-white border-slate-300 shadow-md', // Top 2
    'bg-gradient-to-r from-amber-700 to-orange-800 text-white border-amber-600 shadow-md', // Top 3
    'bg-black/60 text-white border-white/20', // Top 4
  ];

  return (
    <section className="rounded-3xl bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-white dark:from-zinc-900 dark:via-zinc-900/60 dark:to-zinc-950 border border-amber-200/60 dark:border-zinc-800 p-5 sm:p-7 lg:p-9 space-y-6 shadow-xs">
      {/* 1. Header khu vực & Tab chuyển đổi tiêu chí */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-amber-200/50 dark:border-zinc-800/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>BẢNG XẾP HẠNG ẨM THỰC 🔥</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tight leading-tight">
            Món ăn <span className="text-orange-500">thịnh hành & nổi bật</span> nhất
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 max-w-xl">
            Điểm thịnh hành được tính toán theo công thức thực tế: <strong className="text-orange-600 dark:text-orange-400 font-semibold">(Lượt lưu × 5) + Lượt xem</strong>.
          </p>
        </div>

        {/* Tab chuyển đổi tiêu chí xếp hạng */}
        <div className="flex items-center gap-1 p-1 bg-amber-100/70 dark:bg-zinc-800/80 rounded-2xl border border-amber-200/60 dark:border-zinc-700/60 self-start md:self-end">
          <button
            type="button"
            onClick={() => setActiveTab('hot')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'hot'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-gray-700 dark:text-zinc-300 hover:text-orange-600'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>🔥 Thịnh hành (Hot)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookmarks_desc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'bookmarks_desc'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-gray-700 dark:text-zinc-300 hover:text-orange-600'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>🔖 Lưu nhiều</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('views_desc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'views_desc'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-gray-700 dark:text-zinc-300 hover:text-orange-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>👁️ Xem nhiều</span>
          </button>
        </div>
      </div>

      {/* 2. Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* 3. Error state */}
      {isError && (
        <div className="p-8 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 rounded-3xl text-center space-y-3 border border-red-200 dark:border-red-900">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-xs font-bold">Không thể tải danh sách món ăn yêu thích</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      )}

      {/* 4. Danh sách 4 món theo tiêu chí được chọn */}
      {!isLoading && !isError && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recipes.map((recipe, index) => {
            const title = cleanRecipeTitle(recipe.title);
            const imgUrl = getRecipeDisplayImage(recipe, index);
            const isSaved = isBookmarked(recipe.id);
            const cookTime = recipe.totalTimeMinutes || 30;
            const hotScore = (recipe.bookmarkCount ?? 0) * 5 + (recipe.viewCount ?? 0);
            const rankStyle = rankBadgeColors[index] || rankBadgeColors[3];

            return (
              <div
                key={recipe.id}
                className="group rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Ảnh món ăn kèm badge xếp hạng & nút Bookmark */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        FALLBACK_RECIPE_IMAGES[index % FALLBACK_RECIPE_IMAGES.length];
                    }}
                  />

                  {/* Top Rank Badge góc trên bên trái */}
                  <div
                    className={`absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur border ${rankStyle}`}
                  >
                    {index === 0 ? (
                      <Trophy className="w-3 h-3 text-amber-200 fill-amber-200" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-amber-300" />
                    )}
                    <span>Top #{index + 1}</span>
                  </div>

                  {/* Nút Bookmark Lưu món */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleBookmark(e, recipe.id, title)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition active:scale-90"
                    title={isSaved ? 'Bỏ lưu món ăn' : 'Lưu vào sổ tay'}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 transition-colors ${
                        isSaved ? 'fill-orange-400 text-orange-400' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Nội dung tóm tắt */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Danh mục */}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      {recipe.categoryName || 'Món ngon'}
                    </span>

                    {/* Tiêu đề */}
                    <Link href={`/recipes/${encodeURIComponent(recipe.slug)}`} className="block">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                        {title}
                      </h3>
                    </Link>

                    {/* Mô tả ngắn */}
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {recipe.description || 'Hương vị thơm ngon khó cưỡng, nguyên liệu dễ tìm chuẩn vị.'}
                    </p>
                  </div>

                  {/* Thông số lượt lưu 🔖 và lượt xem 👁️ & Điểm Hot */}
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      {/* Tiêu chí nổi bật theo Tab */}
                      {activeTab === 'hot' && (
                        <span
                          className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400 text-[11px] px-2.5 py-0.5 rounded-full bg-orange-100/80 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/40"
                          title="Điểm Hot = Lượt lưu × 5 + Lượt xem"
                        >
                          <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                          <span>{hotScore.toLocaleString()} điểm Hot</span>
                        </span>
                      )}

                      {activeTab === 'bookmarks_desc' && (
                        <span className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400 text-[11px] px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40">
                          <Bookmark className="w-3 h-3 fill-current" />
                          <span>{recipe.bookmarkCount ?? 0} lượt lưu</span>
                        </span>
                      )}

                      {activeTab === 'views_desc' && (
                        <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40">
                          <Eye className="w-3 h-3" />
                          <span>{(recipe.viewCount ?? 0).toLocaleString()} lượt xem</span>
                        </span>
                      )}

                      {/* Chi tiết phụ */}
                      <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 text-[11px]">
                        {activeTab !== 'bookmarks_desc' && (
                          <span className="flex items-center gap-0.5">
                            <Bookmark className="w-3 h-3" />
                            {recipe.bookmarkCount ?? 0}
                          </span>
                        )}
                        {activeTab !== 'views_desc' && (
                          <span className="flex items-center gap-0.5">
                            <Eye className="w-3 h-3" />
                            {recipe.viewCount ?? 0}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tác giả & Thời gian nấu */}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400 pt-1 font-medium">
                      <span className="truncate max-w-[120px] font-semibold text-gray-700 dark:text-zinc-300">
                        {recipe.authorName || 'Đầu bếp Chuẩn Vị'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span>{cookTime}p</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer link dẫn sang trang /recipes */}
      <div className="pt-2 flex justify-end">
        <Link
          href={`/recipes?sortBy=${activeTab}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 group transition"
        >
          <span>Xem tất cả công thức theo tiêu chí này</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
