'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import type { RecipeSummaryDto, PagedResult, CategoryDto } from '@/lib/types/category';
import { categoryService } from '@/lib/services/category-service';
import { useBookmarkStore } from '@/features/bookmarks/useBookmarkStore';
import {
  Bookmark,
  ChefHat,
  Eye,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  cleanRecipeTitle,
  getRecipeDisplayImage,
  FALLBACK_RECIPE_IMAGES,
} from '@/lib/recipe-ui-helpers';

export default function DashboardSavedRecipesView() {
  const { toggleBookmark } = useBookmarkStore();
  const [recipes, setRecipes] = useState<RecipeSummaryDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Bộ lọc tìm kiếm & sắp xếp
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('saved_desc');

  // Debounce ô tìm kiếm 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Tải danh sách danh mục cho dropdown bộ lọc
  useEffect(() => {
    let isMounted = true;
    categoryService
      .getCategories()
      .then((cats) => {
        if (isMounted) setCategories(cats || []);
      })
      .catch((err) => console.error('[DashboardSavedRecipesView] Load categories failed:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchSavedRecipes = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const params = new URLSearchParams();
      params.set('page', pageNum.toString());
      params.set('pageSize', '10');
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (selectedCategory) params.set('category', selectedCategory);
      if (sortBy && sortBy !== 'saved_desc') params.set('sortBy', sortBy);

      const res = await apiClient<PagedResult<RecipeSummaryDto>>(
        `/recipes/bookmarks/me?${params.toString()}`
      );
      if (res) {
        setRecipes(res.items || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.totalCount || 0);
      }
    } catch (err) {
      console.error('[DashboardSavedRecipesView] Load error:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, sortBy]);

  useEffect(() => {
    fetchSavedRecipes(page);
  }, [page, fetchSavedRecipes]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory('');
    setSortBy('saved_desc');
    setPage(1);
  };

  const handleRemoveBookmark = async (recipeId: string) => {
    try {
      await toggleBookmark(recipeId);
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
      setTotalCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error('[DashboardSavedRecipesView] Remove error:', err);
    }
  };

  const hasActiveFilters = Boolean(debouncedSearch || selectedCategory || sortBy !== 'saved_desc');

  return (
    <div className="space-y-6">
      {/* 1. Header khu vực */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
              Món ăn đã lưu
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Sổ tay ẩm thực cá nhân: Danh sách các món ăn bạn đã đánh dấu để tham khảo và nấu bất cứ lúc nào.
            </p>
          </div>
        </div>

        {totalCount > 0 && (
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-50 dark:bg-zinc-800 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-zinc-700 self-start sm:self-auto">
            {hasActiveFilters ? `${totalCount} kết quả tìm thấy` : `${totalCount} công thức đã lưu`}
          </span>
        )}
      </div>

      {/* 2. Thanh tìm kiếm & bộ lọc đa chiều (Search & Filter Bar) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Ô tìm kiếm */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên món ăn, mô tả, nguyên liệu..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 text-xs text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bộ lọc danh mục */}
          <div className="lg:col-span-3 relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              aria-label="Lọc theo danh mục"
              className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 text-xs text-slate-800 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition appearance-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              ▼
            </span>
          </div>

          {/* Sắp xếp */}
          <div className="lg:col-span-3 relative">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              aria-label="Sắp xếp danh sách"
              className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 text-xs text-slate-800 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition appearance-none cursor-pointer"
            >
              <option value="saved_desc">Mới lưu gần nhất</option>
              <option value="views_desc">Lượt xem nhiều nhất</option>
              <option value="time_asc">Thời gian nấu nhanh nhất</option>
              <option value="title_asc">Tên món (A - Z)</option>
            </select>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              ▼
            </span>
          </div>

          {/* Nút đặt lại */}
          <div className="lg:col-span-1 flex items-center">
            <button
              type="button"
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              className="w-full h-full min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 dark:border-zinc-700/80 text-slate-600 dark:text-zinc-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Đặt lại bộ lọc về mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="lg:hidden">Đặt lại</span>
            </button>
          </div>
        </div>

        {/* Thanh trạng thái bộ lọc đang chọn */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-zinc-400 flex-wrap">
            <span className="font-semibold">Bộ lọc đang áp dụng:</span>
            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100/70 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-900/40">
                Từ khóa: &ldquo;{debouncedSearch}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="hover:text-red-500 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-900/40">
                Danh mục: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('');
                    setPage(1);
                  }}
                  className="hover:text-red-500 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sortBy !== 'saved_desc' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 font-bold border border-purple-200 dark:border-purple-900/40">
                Sắp xếp: {
                  sortBy === 'views_desc' ? 'Lượt xem nhiều' :
                  sortBy === 'time_asc' ? 'Nấu nhanh' :
                  sortBy === 'title_asc' ? 'Tên A-Z' : sortBy
                }
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-orange-600 dark:text-orange-400 font-bold hover:underline ml-auto"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* 3. Bảng dữ liệu / Danh sách món ăn */}
      {isLoading ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-xs font-bold text-red-700 dark:text-red-300">Không thể tải danh sách món ăn đã lưu</p>
          <button
            type="button"
            onClick={() => fetchSavedRecipes(page)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-slate-300 dark:border-zinc-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-zinc-800 text-orange-500 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">
              {hasActiveFilters ? 'Không tìm thấy món ăn phù hợp' : 'Chưa có món ăn nào được lưu'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
              {hasActiveFilters
                ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác để xem kết quả.'
                : 'Khi xem các bài viết công thức, hãy bấm nút "Lưu công thức" để dễ dàng tìm lại tại đây.'}
            </p>
          </div>
          <div className="pt-2">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Đặt lại bộ lọc</span>
              </button>
            ) : (
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition active:scale-95"
              >
                <ChefHat className="w-4 h-4" />
                <span>Khám phá công thức</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/75 dark:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Công thức</th>
                  <th className="py-3.5 px-4">Danh mục</th>
                  <th className="py-3.5 px-4">Thời gian</th>
                  <th className="py-3.5 px-4 text-center">Lượt xem</th>
                  <th className="py-3.5 px-4 text-center">Tác giả</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                {recipes.map((recipe, index) => {
                  const title = cleanRecipeTitle(recipe.title);
                  const imgUrl = getRecipeDisplayImage(recipe, index);
                  const cookTime = recipe.totalTimeMinutes || 30;

                  return (
                    <tr
                      key={recipe.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      {/* Cột 1: Ảnh & Tên */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-zinc-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = FALLBACK_RECIPE_IMAGES[0];
                            }}
                          />
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/recipes/${encodeURIComponent(recipe.slug)}`}
                              className="font-bold text-slate-800 dark:text-zinc-100 hover:text-orange-600 transition-colors line-clamp-1 text-sm"
                            >
                              {title}
                            </Link>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 line-clamp-1 mt-0.5">
                              {recipe.description || 'Không có mô tả'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Danh mục */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200/60 dark:border-orange-800/40">
                          {recipe.categoryName || 'Món chính'}
                        </span>
                      </td>

                      {/* Cột 3: Thời gian nấu */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          <span>{cookTime} phút</span>
                        </div>
                      </td>

                      {/* Cột 4: Lượt xem */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-[11px]">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>{recipe.viewCount ?? 0}</span>
                        </div>
                      </td>

                      {/* Cột 5: Tác giả */}
                      <td className="py-3.5 px-4 text-center text-slate-600 dark:text-zinc-300 font-medium">
                        {recipe.authorName || 'Đầu bếp Chuẩn Vị'}
                      </td>

                      {/* Cột 6: Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/recipes/${encodeURIComponent(recipe.slug)}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 transition"
                            title="Xem chi tiết công thức"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleRemoveBookmark(recipe.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                            title="Bỏ lưu khỏi danh sách"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">
                Trang {page} / {totalPages} ({totalCount} món)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
