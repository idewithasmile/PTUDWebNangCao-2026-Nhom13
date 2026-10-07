'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { UtensilsCrossed, AlertCircle, Loader2 } from 'lucide-react';
import { useRecipes } from '@/features/recipes/hooks';
import type { GetRecipesParams, RecipeDifficulty } from '@/lib/types/recipe';
import RecipeCard from '@/components/recipes/RecipeCard';
import RecipesFilterBar from '@/components/recipes/RecipesFilterBar';
import RecipesPagination from '@/components/recipes/RecipesPagination';
import { toErrorMessage } from '@/features/auth/hooks';

export default function RecipesClientView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Đọc params từ URL searchParams
  const filters = useMemo<GetRecipesParams>(() => {
    const term = searchParams.get('searchTerm') || undefined;
    const catId = searchParams.get('categoryId') || undefined;
    const diff = searchParams.get('difficulty');
    const maxTime = searchParams.get('maxTotalTimeMinutes');
    const sort = searchParams.get('sortBy') as GetRecipesParams['sortBy'];
    const p = searchParams.get('page');
    const ps = searchParams.get('pageSize');

    return {
      searchTerm: term,
      categoryId: catId,
      difficulty: diff ? (Number(diff) as RecipeDifficulty) : undefined,
      maxTotalTimeMinutes: maxTime ? Number(maxTime) : undefined,
      sortBy: sort || 'newest',
      page: p ? Number(p) : 1,
      pageSize: ps ? Number(ps) : 12,
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
      {/* Header tiêu đề */}
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Công thức Nấu ăn
        </h1>
        <p className="text-sm text-gray-500">
          Khám phá hàng ngàn công thức nấu ăn phong phú, dễ làm và hấp dẫn từ cộng đồng.
        </p>
      </div>

      {/* Thanh lọc & Sắp xếp */}
      <RecipesFilterBar
        filters={filters}
        onFilterChange={updateUrlParams}
        onResetFilters={handleResetFilters}
      />

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
            <UtensilsCrossed className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">
            Không tìm thấy công thức nào
          </h3>
          <p className="mt-1 max-w-md text-sm text-gray-500">
            Không có công thức nấu ăn nào phù hợp với bộ lọc hiện tại của bạn. Hãy thử tìm kiếm từ khóa khác hoặc xóa bộ lọc.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
