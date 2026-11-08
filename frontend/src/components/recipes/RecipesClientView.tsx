'use client';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  UtensilsCrossed,
  AlertCircle,
  Loader2,
  Plus,
  ChefHat,
  BookOpen,
  Search,
  X,
  Sparkles,
  FolderOpen,
} from 'lucide-react';
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
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900 dark:text-zinc-100">
          {filters.onlyMine ? 'Công thức của tôi' : 'Công thức nấu ăn'}
        </span>
      </nav>

      {/* 2. Hero Banner Ẩm Thực Cao Cấp (Option 1) */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl min-h-[290px] sm:min-h-[330px] flex items-center p-6 sm:p-10 lg:p-12">
        {/* Nền ảnh ẩm thực chất lượng cao */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=85')`,
          }}
        />

        {/* Lớp phủ Dark Warm Gradient mờ ảo sang trọng */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-900/85 to-black/40 backdrop-blur-[0.5px]" />

        {/* Badge nghệ thuật góc trên bên phải */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-10 hidden sm:block rotate-2 z-10 pointer-events-none">
          <div className="text-right">
            <span className="font-sans italic text-xl lg:text-2xl text-amber-300 font-black drop-shadow-md tracking-tight block">
              Hương Vị Việt
            </span>
            <span className="text-[11px] uppercase tracking-widest text-white/80 font-semibold">
              Chuẩn vị • Đậm đà ♡
            </span>
          </div>
        </div>

        {/* Nội dung Banner */}
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold backdrop-blur-md">
            {filters.onlyMine ? (
              <>
                <ChefHat className="w-3.5 h-3.5 text-amber-300" />
                <span>Gian bếp sáng tạo của bạn</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Kho tàng ẩm thực tuyển chọn</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight">
            {filters.onlyMine ? (
              <>
                Công Thức <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">Của Tôi</span>
              </>
            ) : (
              <>
                Kho Tàng <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">Công Thức Nấu Ăn</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-stone-200 leading-relaxed drop-shadow-xs max-w-xl">
            {filters.onlyMine
              ? 'Quản lý, tinh chỉnh và chia sẻ những công thức tâm huyết do chính bạn sáng tạo đến cộng đồng yêu ẩm thực.'
              : `Khám phá hơn ${pagedResult?.totalCount || 100}+ công thức món ngon chuẩn vị từ mâm cơm gia đình ấm cúng đến ẩm thực tiệc hiện đại, hướng dẫn chi tiết từng bước dễ làm.`}
          </p>

          {/* Quick Stats Badges */}
          {!filters.onlyMine && (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-1 text-xs text-stone-300 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                🍲 <strong>{pagedResult?.totalCount || 100}+</strong> Món ngon
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                🥗 <strong>20+</strong> Danh mục
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                👨‍🍳 <strong>100%</strong> Có bí quyết đầu bếp
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Link
              href="/recipes/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-amber-600 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Viết công thức mới</span>
            </Link>

            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Duyệt theo danh mục</span>
            </Link>
          </div>
        </div>

        {/* Họa tiết chìm nghệ thuật góc phải dưới */}
        <div className="absolute -right-6 -bottom-10 opacity-10 pointer-events-none text-white">
          <UtensilsCrossed className="w-64 h-64" />
        </div>
      </div>

      {/* Tabs chuyển đổi giữa Tất cả và Công thức của tôi (khi đã login) */}
      {isLoggedIn && (
        <div className="flex border-b border-gray-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => updateUrlParams({ onlyMine: undefined, page: 1 })}
            className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${
              !filters.onlyMine
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Khám phá cộng đồng</span>
            {pagedResult?.totalCount !== undefined && !filters.onlyMine && (
              <span className="ml-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[11px] font-bold px-2 py-0.5">
                {pagedResult.totalCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => updateUrlParams({ onlyMine: true, page: 1 })}
            className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${
              filters.onlyMine
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <ChefHat className="h-4 w-4" />
            <span>Công thức của tôi (Quản lý)</span>
            {pagedResult?.totalCount !== undefined && filters.onlyMine && (
              <span className="ml-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[11px] font-bold px-2 py-0.5">
                {pagedResult.totalCount}
              </span>
            )}
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
