'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { RecipeSummaryDto } from '@/lib/types/category';
import { resolveMediaUrl } from '@/lib/utils';
import {
  cleanRecipeTitle,
  getRecipeDisplayImage,
  FALLBACK_RECIPE_IMAGES,
} from '@/lib/recipe-ui-helpers';
import {
  ChefHat,
  Flame,
  Leaf,
  Heart,
  Clock,
  BarChart2,
  Users,
  Bookmark,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface HomeLatestRecipesProps {
  recipes: RecipeSummaryDto[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  selectedCategoryName?: string;
  searchTerm?: string;
  onPageChange?: (newPage: number) => void;
  onClearFilters?: () => void;
}

const difficultyLabels: Record<number, string> = {
  1: 'Dễ',
  2: 'Trung bình',
  3: 'Khó',
  4: 'Chuyên gia',
};

function getCategoryPill(categoryName?: string) {
  const name = categoryName?.toLowerCase() || '';

  if (name.includes('tráng miệng') || name.includes('bánh') || name.includes('chè')) {
    return {
      label: categoryName || 'Tráng miệng',
      icon: Sparkles,
      className: 'bg-purple-50 text-purple-700 border-purple-200/80',
    };
  }

  if (name.includes('khai vị') || name.includes('chay') || name.includes('salad')) {
    return {
      label: categoryName || 'Khai vị',
      icon: Leaf,
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    };
  }

  return {
    label: categoryName || 'Món chính',
    icon: ChefHat,
    className: 'bg-amber-50 text-amber-800 border-amber-200/80',
  };
}

export default function HomeLatestRecipes({
  recipes,
  isLoading,
  isError,
  totalCount,
  onPageChange,
}: HomeLatestRecipesProps) {
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Phân chia món hot bên trái (thẻ lớn) và 4 món tiêu biểu bên phải (lưới 2x2)
  const hotRecipe = recipes.length > 0 ? recipes[0] : null;
  const gridRecipes = recipes.length > 1 ? recipes.slice(1, 5) : [];

  return (
    <section className="rounded-3xl bg-[#faf6f0] border border-[#ede3d5] p-4 sm:p-6 lg:p-8 space-y-6 shadow-xs">
      {/* =========================================================
          1. HEADER KHU VỰC: BANNER NỀN ẨM THỰC SANG TRỌNG THEO MẪU
          ========================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-stone-900 shadow-md min-h-[140px] sm:min-h-[160px] flex items-center p-6 sm:p-8 lg:p-10">
        {/* Background ảnh ẩm thực mờ nghệ thuật */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-stone-950/70" />

        {/* Chữ script nghệ thuật: "Nấu ngon Mỗi ngày ♡" góc trên bên phải */}
        <div className="absolute top-6 right-6 lg:right-10 hidden sm:block rotate-6 select-none pointer-events-none z-10">
          <div className="text-right">
            <span className="font-sans italic text-xl lg:text-2xl text-white font-black tracking-tight block drop-shadow-md">
              Nấu ngon
            </span>
            <span className="font-sans italic text-2xl lg:text-3xl text-orange-400 font-black tracking-tight block drop-shadow-md">
              Mỗi ngày ♡
            </span>
          </div>
        </div>

        {/* Nội dung tiêu đề chính */}
        <div className="relative z-10 space-y-2 max-w-2xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-xs">
            <ChefHat className="w-3.5 h-3.5 fill-white" />
            <span>CÔNG THỨC MỚI NHẤT</span>
          </div>

          {/* Tiêu đề */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Công thức <span className="text-orange-500">mới nhất</span> <span className="text-amber-400">✨</span>
          </h2>

          {/* Mô tả */}
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal max-w-xl">
            Cập nhật liên tục những món ăn mới từ các đầu bếp và cộng đồng yêu ẩm thực. Khám phá và nấu ngay!
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          <div className="lg:col-span-5 h-[480px] bg-white/70 rounded-3xl animate-pulse" />
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 bg-white/70 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="p-8 bg-red-50 text-red-700 rounded-3xl text-center space-y-3 border border-red-200">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-sm font-bold">Không thể tải danh sách công thức mới nhất</p>
          {onPageChange && (
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-red-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && recipes.length === 0 && (
        <div className="p-12 bg-white rounded-3xl border border-dashed border-gray-200 text-center space-y-3">
          <ChefHat className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-800">Chưa có công thức nào được xuất bản</p>
          <Link
            href="/recipes"
            className="inline-block px-5 py-2.5 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-orange-600 transition"
          >
            Khám phá tất cả món ngon
          </Link>
        </div>
      )}

      {/* =========================================================
          2. LƯỚI KHỐI 1 LỚN (TRÁI) + 4 NHỎ (PHẢI 2x2) CHUẨN MOCKUP
          ========================================================= */}
      {!isLoading && !isError && hotRecipe && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* -------------------------------------------------------
              A. THẺ LỚN BÊN TRÁI: "MÓN HOT TUẦN NÀY" (lg:col-span-5)
              ------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col">
            {(() => {
              const isLiked = likedIds[hotRecipe.id];
              const isBookmarked = bookmarkedIds[hotRecipe.id];
              const diffText = difficultyLabels[hotRecipe.difficulty] || 'Trung bình';
              const cookTime = hotRecipe.totalTimeMinutes || 35;
              const servingsText = hotRecipe.servings ? `${hotRecipe.servings} người` : '2-3 người';
              const imgUrl = getRecipeDisplayImage(hotRecipe, 0);
              const title = cleanRecipeTitle(hotRecipe.title);

              return (
                <div className="group relative rounded-3xl bg-[#171311] border border-stone-800 shadow-xl overflow-hidden flex flex-col justify-between flex-1 hover:border-orange-500/40 transition-all duration-300">
                  {/* Ảnh đại diện lớn với Badges nổi bật */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={title}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_RECIPE_IMAGES[0];
                      }}
                    />
                    {/* Gradient chuyển mượt từ ảnh sang thân tối */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171311] via-transparent to-black/30 pointer-events-none" />

                    {/* Badge 1: MÓN HOT TUẦN NÀY */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-md flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-white" />
                        <span>MÓN HOT TUẦN NÀY</span>
                      </span>

                      {/* Badge 2: Tên danh mục */}
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800 backdrop-blur shadow-xs flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-emerald-600" />
                        <span>{hotRecipe.categoryName || 'Món chính'}</span>
                      </span>
                    </div>

                    {/* Nút Tim Yêu thích */}
                    <button
                      type="button"
                      onClick={(e) => toggleLike(e, hotRecipe.id)}
                      className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur transition-all active:scale-90"
                      title="Yêu thích món ăn"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Nội dung thông tin món ăn */}
                  <div className="p-5 sm:p-6 lg:p-7 space-y-4 flex flex-col justify-between flex-1">
                    <div className="space-y-2">
                      <Link href={`/recipes/${encodeURIComponent(hotRecipe.slug)}`} className="block">
                        <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight">
                          {title}
                        </h3>
                      </Link>

                      <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed">
                        {hotRecipe.description ||
                          'Thịt bò mềm thơm, thấm vị, giàu protein và vitamin từ rau củ tươi sạch.'}
                      </p>
                    </div>

                    {/* Hàng thông số: Thời gian | Độ khó | Khẩu phần */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-300 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{cookTime} phút</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BarChart2 className="w-4 h-4 text-orange-500" />
                        <span>{diffText}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-300" />
                        <span>{servingsText}</span>
                      </div>
                    </div>

                    {/* Hàng Tác giả & Nút Lưu lại */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center text-xs font-black">
                          {hotRecipe.authorName ? hotRecipe.authorName.charAt(0) : 'C'}
                        </div>
                        <span className="text-xs font-bold text-gray-200">
                          {hotRecipe.authorName || 'Đầu bếp Chuẩn Vị'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(e, hotRecipe.id)}
                        className={`inline-flex items-center gap-1 text-xs font-bold transition ${
                          isBookmarked ? 'text-orange-400' : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-orange-400' : ''}`}
                        />
                        <span>{isBookmarked ? 'Đã lưu' : 'Lưu lại'}</span>
                      </button>
                    </div>

                    {/* Nút Xem công thức lớn */}
                    <Link
                      href={`/recipes/${encodeURIComponent(hotRecipe.slug)}`}
                      className="w-full py-3 px-5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.01] active:scale-95 mt-2"
                    >
                      <ChefHat className="w-4 h-4 fill-white" />
                      <span>Xem công thức</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* -------------------------------------------------------
              B. LƯỚI 2x2 BÊN PHẢI: 4 MÓN MỚI TIÊU BIỂU (lg:col-span-7)
              ------------------------------------------------------- */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {gridRecipes.map((recipe, index) => {
              const isLiked = likedIds[recipe.id];
              const diffText = difficultyLabels[recipe.difficulty] || 'Trung bình';
              const cookTime = recipe.totalTimeMinutes || 35;
              const servingsText = recipe.servings
                ? `${recipe.servings} người`
                : `${(index + 3) * 140} kcal`;
              const imgUrl = getRecipeDisplayImage(recipe, index + 1);
              const title = cleanRecipeTitle(recipe.title);
              const badge = getCategoryPill(recipe.categoryName);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={recipe.id}
                  className="group rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Ảnh món ăn kèm Category Pill & Nút Tim */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={title}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          FALLBACK_RECIPE_IMAGES[(index + 1) % FALLBACK_RECIPE_IMAGES.length];
                      }}
                    />

                    {/* Category Pill Badge góc trên bên trái */}
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1 border backdrop-blur ${badge.className}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    {/* Nút Tim Yêu thích */}
                    <button
                      type="button"
                      onClick={(e) => toggleLike(e, recipe.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur transition active:scale-90"
                      title="Yêu thích món ăn"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Nội dung chi tiết */}
                  <div className="p-4 sm:p-4.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Tiêu đề món ăn */}
                      <Link href={`/recipes/${encodeURIComponent(recipe.slug)}`} className="block">
                        <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 leading-snug">
                          {title}
                        </h4>
                      </Link>

                      {/* Hàng meta thông số: Thời gian | Độ khó | Khẩu phần */}
                      <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500 pt-1.5">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          <span>{cookTime} phút</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart2 className="w-3.5 h-3.5 text-orange-500" />
                          <span>{diffText}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span>{servingsText}</span>
                        </div>
                      </div>

                      {/* Tác giả */}
                      <div className="flex items-center gap-2 pt-2 text-xs text-gray-600 font-medium">
                        <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold">
                          {recipe.authorName ? recipe.authorName.charAt(0) : 'C'}
                        </div>
                        <span className="line-clamp-1 text-[11px]">
                          {recipe.authorName || 'Đầu bếp Chuẩn Vị'}
                        </span>
                      </div>
                    </div>

                    {/* Hai nút hành động: Nấu ngay + Xem chi tiết */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                      <Link
                        href={`/recipes/${encodeURIComponent(recipe.slug)}`}
                        className="py-2 px-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95"
                      >
                        <ChefHat className="w-3.5 h-3.5 fill-white" />
                        <span>Nấu ngay</span>
                      </Link>

                      <Link
                        href={`/recipes/${encodeURIComponent(recipe.slug)}`}
                        className="py-2 px-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-all active:scale-95"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-gray-500" />
                        <span>Xem chi tiết</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          3. NÚT ĐIỀU HƯỚNG: KHÁM PHÁ THÊM CÔNG THỨC KHÁC
          ========================================================= */}
      <div className="flex items-center justify-center pt-2">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-orange-600 font-bold text-xs sm:text-sm border border-orange-200 hover:bg-orange-50 shadow-xs transition-all hover:scale-[1.02] active:scale-95"
        >
          <span>Khám phá thêm công thức khác ({totalCount} món)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
