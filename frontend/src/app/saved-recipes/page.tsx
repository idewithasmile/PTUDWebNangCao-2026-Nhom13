'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useBookmarkStore } from '@/features/bookmarks/useBookmarkStore';
import { hasSession } from '@/features/auth/api';
import { useMe } from '@/features/auth/hooks';
import { apiClient } from '@/lib/api-client';
import type { RecipeSummaryDto, PagedResult } from '@/lib/types/category';
import RecipeCard from '@/components/recipes/RecipeCard';
import {
  Bookmark,
  ChefHat,
  Sparkles,
  LogIn,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Search,
  X,
  ArrowRight,
} from 'lucide-react';

export default function SavedRecipesPage() {
  const { bookmarkedIds, isInitialized, init } = useBookmarkStore();
  const [recipes, setRecipes] = useState<RecipeSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const isLoggedIn = hasSession();
  const { data: user } = useMe(isLoggedIn);
  const isStaff = Boolean(user?.roles?.includes('Admin') || user?.roles?.includes('Author'));

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!isInitialized) return;

    let isMounted = true;

    async function loadSavedRecipes() {
      setIsLoading(true);
      setIsError(false);

      try {
        if (isLoggedIn) {
          // Người dùng đã đăng nhập: Gọi API bookmarks của tôi
          const res = await apiClient<PagedResult<RecipeSummaryDto>>(
            `/recipes/bookmarks/me?page=${page}&pageSize=12`
          );
          if (isMounted && res) {
            setRecipes(res.items || []);
            setTotalPages(res.totalPages || 1);
            setTotalCount(res.totalCount || 0);
          }
        } else {
          // Khách vãng lai: Lấy danh sách ID từ localStorage rồi fetch batch-summary
          if (bookmarkedIds.length === 0) {
            if (isMounted) {
              setRecipes([]);
              setTotalPages(1);
              setTotalCount(0);
            }
          } else {
            const batch = await apiClient<RecipeSummaryDto[]>('/recipes/batch-summary', {
              method: 'POST',
              body: JSON.stringify(bookmarkedIds),
            });
            if (isMounted) {
              setRecipes(batch || []);
              setTotalPages(1);
              setTotalCount((batch || []).length);
            }
          }
        }
      } catch (err) {
        console.error('[SavedRecipesPage] Failed to load recipes:', err);
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSavedRecipes();

    return () => {
      isMounted = false;
    };
  }, [isInitialized, isLoggedIn, bookmarkedIds, page]);

  const displayedRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    const query = searchQuery.trim().toLowerCase();
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        (r.description && r.description.toLowerCase().includes(query)) ||
        (r.categoryName && r.categoryName.toLowerCase().includes(query))
    );
  }, [recipes, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-zinc-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>DANH SÁCH YÊU THÍCH</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tight sm:text-4xl">
            Món ăn đã lưu 🔖
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-2xl">
            Kho công thức nấu ăn bạn đã lưu lại để tham khảo và nấu cho gia đình bất cứ lúc nào.
          </p>
        </div>

        {totalCount > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-2xl bg-orange-50 dark:bg-zinc-900 border border-orange-200/80 dark:border-zinc-800 text-xs font-bold text-orange-700 dark:text-orange-400 shadow-2xs">
            <span>Tổng cộng:</span>
            <span className="text-sm font-black text-orange-600 dark:text-orange-300">{totalCount} món</span>
          </div>
        )}
      </div>

      {/* 2. Banner điều hướng dành riêng cho Tác giả & Quản trị viên */}
      {isStaff && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-900/40 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
              <ChefHat className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                Sổ tay dành cho Tác giả &amp; Quản trị viên
              </h4>
              <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed max-w-2xl">
                Bạn đang xem giao diện thẻ công khai. Trong Bảng điều khiển (Dashboard), bạn có thể tìm kiếm, lọc danh mục, sắp xếp theo lượt xem và quản lý sổ tay của mình một cách chuyên nghiệp.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard?tab=recipes-saved"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition active:scale-95 shrink-0"
          >
            <span>Mở Bảng điều khiển</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 3. Banner lưu ý cho Khách vãng lai (Guest Notice) */}
      {!isLoggedIn && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/40 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Lưu ý dành cho khách vãng lai
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed max-w-2xl">
                Các món ăn này hiện đang được lưu trên trình duyệt của máy bạn. Hãy đăng nhập để đồng bộ vĩnh viễn vào tài khoản cá nhân và xem được trên mọi thiết bị.
              </p>
            </div>
          </div>

          <Link
            href="/login?returnUrl=/saved-recipes"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition active:scale-95 shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập để đồng bộ</span>
          </Link>
        </div>
      )}

      {/* 4. Thanh tìm kiếm nhanh */}
      {recipes.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm trong danh sách món đã lưu..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs text-gray-800 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-0.5"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchQuery && (
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
              Tìm thấy <strong className="text-orange-600 dark:text-orange-400">{displayedRecipes.length}</strong> món phù hợp
            </span>
          )}
        </div>
      )}

      {/* 5. Danh sách công thức hoặc Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-72 rounded-2xl bg-gray-100 dark:bg-zinc-800" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-10 rounded-3xl border border-red-200 bg-red-50 dark:bg-red-950/20 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-base font-bold text-red-800 dark:text-red-300">Không thể tải danh sách món ăn đã lưu</h3>
          <p className="text-xs text-red-600 dark:text-red-400">Đã xảy ra lỗi kết nối tới máy chủ. Vui lòng thử lại sau.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 p-8 sm:p-12">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto shadow-2xs">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
              Bạn chưa lưu món ăn nào
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Hãy nhấn biểu tượng chiếc thẻ nhớ (Bookmark) ở góc các món ăn yêu thích để lưu lại và xem lại bất cứ khi nào bạn muốn vào bếp.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition active:scale-95"
            >
              <ChefHat className="w-4 h-4 fill-white" />
              <span>Khám phá công thức ngay</span>
            </Link>
          </div>
        </div>
      ) : displayedRecipes.length === 0 ? (
        <div className="py-12 text-center space-y-3 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 p-8">
          <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">
            Không tìm thấy món ăn nào phù hợp với &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-orange-600 hover:underline"
          >
            Xóa tìm kiếm
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Phân trang cho người dùng đã đăng nhập nếu nhiều trang */}
          {isLoggedIn && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 px-3">
                Trang {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
