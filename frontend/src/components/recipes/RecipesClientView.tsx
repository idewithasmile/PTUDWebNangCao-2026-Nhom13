'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { UtensilsCrossed, AlertCircle, Loader2, Plus, ChefHat, BookOpen, Search, X } from 'lucide-react';
import { useRecipes } from '@/features/recipes/hooks';
import { hasSession } from '@/features/auth/api';
import type { GetRecipesParams, RecipeDifficulty } from '@/lib/types/recipe';
import RecipeCard from '@/components/recipes/RecipeCard';
import RecipesFilterBar from '@/components/recipes/RecipesFilterBar';
import RecipesPagination from '@/components/recipes/RecipesPagination';
import { toErrorMessage } from '@/features/auth/hooks';

export default function RecipesClientView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLoggedIn = hasSession();

  // Đọc params từ URL searchParams
  const filters = useMemo<GetRecipesParams>(() => {
    const term = searchParams.get('searchTerm') || undefined;
    const catId = searchParams.get('categoryId') || undefined;
    const diff = searchParams.get('difficulty');
    const maxTime = searchParams.get('maxTotalTimeMinutes');
    const sort = searchParams.get('sortBy') as GetRecipesParams['sortBy'];
    const p = searchParams.get('page');
    const ps = searchParams.get('pageSize');
    const onlyMine = searchParams.get('onlyMine') === 'true';

    return {
      searchTerm: term,
      categoryId: catId,
      difficulty: diff ? (Number(diff) as RecipeDifficulty) : undefined,
      maxTotalTimeMinutes: maxTime ? Number(maxTime) : undefined,
      sortBy: sort || 'newest',
      page: p ? Number(p) : 1,
      pageSize: ps ? Number(ps) : 12,
      onlyMine: onlyMine ? true : undefined,
    };
  }, [searchParams]);

  // Hook fetch dữ liệu bài viết
  const { data, isLoading, isError, error, refetch } = useRecipes(filters);

  // Hàm cập nhật URL searchParams khi filter thay đổi
  const updateUrlParams = useCallback(
    (newFilters: Partial<GetRecipesParams>) => {
      const merged = { ...filters, ...newFilters };
      const params = new URLSearchParams();

      if (merged.searchTerm) params.set('searchTerm', merged.searchTerm);
      if (merged.categoryId) params.set('categoryId', merged.categoryId);
      if (merged.difficulty) params.set('difficulty', String(merged.difficulty));
      if (merged.maxTotalTimeMinutes)
        params.set('maxTotalTimeMinutes', String(merged.maxTotalTimeMinutes));
      if (merged.sortBy && merged.sortBy !== 'newest')
        params.set('sortBy', merged.sortBy);
      if (merged.onlyMine) params.set('onlyMine', 'true');

      if (merged.page && merged.page > 1) params.set('page', String(merged.page));
      if (merged.pageSize && merged.pageSize !== 12)
        params.set('pageSize', String(merged.pageSize));

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [filters, pathname, router]
  );

  const handleResetFilters = () => {
    router.push(pathname);
  };

  const pagedResult = data;
  const recipes = pagedResult?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header tiêu đề & Nút tạo mới */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {filters.onlyMine ? 'Công thức Của tôi' : 'Công thức Nấu ăn'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {filters.onlyMine
              ? 'Quản lý, chỉnh sửa và xuất bản các công thức nấu ăn do chính bạn sáng tạo.'
              : 'Khám phá hàng ngàn công thức nấu ăn phong phú, dễ làm và hấp dẫn từ cộng đồng.'}
          </p>
        </div>
        <Link
          href="/recipes/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>Viết công thức mới</span>
        </Link>
      </div>

      {/* Tabs chuyển đổi giữa Tất cả và Công thức của tôi (khi đã login) */}
      {isLoggedIn && (
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => updateUrlParams({ onlyMine: undefined, page: 1 })}
            className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
              !filters.onlyMine
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Khám phá cộng đồng</span>
          </button>

          <button
            type="button"
            onClick={() => updateUrlParams({ onlyMine: true, page: 1 })}
            className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
              filters.onlyMine
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <ChefHat className="h-4 w-4" />
            <span>Công thức của tôi (Quản lý)</span>
          </button>
        </div>
      )}

      {/* Thanh lọc & Sắp xếp */}
      <RecipesFilterBar
        filters={filters}
        onFilterChange={updateUrlParams}
        onResetFilters={handleResetFilters}
      />

      {/* Thông báo kết quả tìm kiếm tích cực */}
      {filters.searchTerm && !isLoading && (
        <div className="flex items-center justify-between rounded-xl bg-orange-50/80 border border-orange-200 px-4 py-2.5 text-xs sm:text-sm text-orange-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-orange-600" />
            <span>
              Kết quả tìm kiếm cho <strong className="font-bold text-orange-800">&ldquo;{filters.searchTerm}&rdquo;</strong>:
              {' '}<span className="font-semibold">{pagedResult?.totalCount ?? 0}</span> công thức nấu ăn
            </span>
          </div>
          <button
            type="button"
            onClick={() => updateUrlParams({ searchTerm: undefined, page: 1 })}
            className="inline-flex items-center gap-1 font-semibold text-orange-700 hover:text-orange-900 hover:underline transition"
            title="Xóa tìm kiếm"
          >
            <X className="h-3.5 w-3.5" />
            <span>Xóa từ khóa</span>
          </button>
        </div>
      )}

      {/* Trường hợp đang tải dữ liệu (Loading Skeleton) */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="aspect-[16/10] w-full animate-pulse bg-gray-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                <div className="pt-4 border-t border-gray-50 flex justify-between">
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trường hợp bị lỗi (Error Alert) */}
      {isError && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
          <AlertCircle className="mb-2 h-10 w-10 text-red-500" />
          <h3 className="text-base font-semibold">Tải danh sách công thức thất bại</h3>
          <p className="mt-1 text-sm text-red-600">
            {toErrorMessage(error, 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối.')}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Danh sách bài viết (Grid) */}
      {!isLoading && !isError && recipes.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Điều hướng Phân trang */}
          <RecipesPagination
            currentPage={pagedResult?.page ?? 1}
            totalPages={pagedResult?.totalPages ?? 1}
            totalCount={pagedResult?.totalCount ?? 0}
            pageSize={pagedResult?.pageSize ?? 12}
            onPageChange={(page) => updateUrlParams({ page })}
          />
        </>
      )}

      {/* Trạng thái trống (Empty State) */}
      {!isLoading && !isError && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            {filters.searchTerm ? <Search className="h-8 w-8" /> : <UtensilsCrossed className="h-8 w-8" />}
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">
            {filters.searchTerm
              ? `Không tìm thấy công thức nào cho "${filters.searchTerm}"`
              : 'Không tìm thấy công thức nào'}
          </h3>
          <p className="mt-1 max-w-md text-sm text-gray-500 leading-relaxed">
            {filters.searchTerm
              ? 'Thử kiểm tra lỗi chính tả, sử dụng từ khóa ngắn hơn hoặc tìm kiếm tiếng Việt không dấu (ví dụ: "pho bo" thay vì "phở bò tái lăn").'
              : 'Không có công thức nấu ăn nào phù hợp với bộ lọc hiện tại của bạn. Hãy thử tìm kiếm từ khóa khác hoặc xóa bộ lọc.'}
          </p>
          <div className="mt-5 flex items-center gap-3">
            {filters.searchTerm ? (
              <button
                type="button"
                onClick={() => updateUrlParams({ searchTerm: undefined, page: 1 })}
                className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-orange-700"
              >
                Xóa từ khóa tìm kiếm
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
