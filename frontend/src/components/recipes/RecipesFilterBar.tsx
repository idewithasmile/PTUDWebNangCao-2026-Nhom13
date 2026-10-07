'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, X, SlidersHorizontal, Plus, RotateCcw } from 'lucide-react';
import { categoryService } from '@/lib/services/category-service';
import type { CategoryDto, RecipeDifficulty } from '@/lib/types/category';
import type { GetRecipesParams } from '@/lib/types/recipe';
import { hasSession } from '@/features/auth/api';

interface RecipesFilterBarProps {
  filters: GetRecipesParams;
  onFilterChange: (newFilters: Partial<GetRecipesParams>) => void;
  onResetFilters: () => void;
}

export default function RecipesFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
}: RecipesFilterBarProps) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [searchInput, setSearchInput] = useState(filters.searchTerm ?? '');

  // Load danh sách danh mục để người dùng chọn lọc
  useEffect(() => {
    let isMounted = true;
    categoryService
      .getCategories()
      .then((data) => {
        if (isMounted) setCategories(data);
      })
      .catch(() => {
        // Im lặng nếu không tải được danh mục (user vẫn có thể dùng các bộ lọc khác)
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync search input khi filters.searchTerm thay đổi (ví dụ khi Reset)
  useEffect(() => {
    setSearchInput(filters.searchTerm ?? '');
  }, [filters.searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ searchTerm: searchInput.trim() || undefined, page: 1 });
  };

  const hasActiveFilters = Boolean(
    filters.searchTerm ||
      filters.categoryId ||
      filters.difficulty ||
      filters.maxTotalTimeMinutes ||
      (filters.sortBy && filters.sortBy !== 'newest')
  );

  const isLoggedIn = hasSession();

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Hàng 1: Ô tìm kiếm + Nút Tạo công thức mới */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm công thức nấu ăn..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                onFilterChange({ searchTerm: undefined, page: 1 });
              }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              title="Xóa tìm kiếm"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {isLoggedIn && (
          <Link
            href="/recipes/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo công thức mới</span>
          </Link>
        )}
      </div>

      {/* Hàng 2: Bộ lọc linh hoạt & Sắp xếp */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-sm">
        <div className="flex items-center gap-1.5 font-medium text-gray-700">
          <SlidersHorizontal className="h-4 w-4 text-orange-500" />
          <span>Bộ lọc:</span>
        </div>

        {/* Lọc danh mục */}
        <select
          value={filters.categoryId ?? ''}
          onChange={(e) =>
            onFilterChange({ categoryId: e.target.value || undefined, page: 1 })
          }
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-orange-500"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.recipeCount})
            </option>
          ))}
        </select>

        {/* Lọc độ khó */}
        <select
          value={filters.difficulty ?? ''}
          onChange={(e) =>
            onFilterChange({
              difficulty: e.target.value
                ? (Number(e.target.value) as RecipeDifficulty)
                : undefined,
              page: 1,
            })
          }
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-orange-500"
        >
          <option value="">Tất cả độ khó</option>
          <option value="1">🟢 Dễ</option>
          <option value="2">🟡 Trung bình</option>
          <option value="3">🟠 Khó</option>
          <option value="4">🔴 Chuyên gia</option>
        </select>

        {/* Lọc thời gian tối đa */}
        <select
          value={filters.maxTotalTimeMinutes ?? ''}
          onChange={(e) =>
            onFilterChange({
              maxTotalTimeMinutes: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            })
          }
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-orange-500"
        >
          <option value="">Thời gian thực hiện</option>
          <option value="15">≤ 15 phút</option>
          <option value="30">≤ 30 phút</option>
          <option value="60">≤ 60 phút (1 giờ)</option>
          <option value="120">≤ 120 phút (2 giờ)</option>
        </select>

        {/* Sắp xếp */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">Sắp xếp:</span>
          <select
            value={filters.sortBy ?? 'newest'}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as GetRecipesParams['sortBy'],
                page: 1,
              })
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-orange-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="time_asc">Thời gian: Nhanh nhất</option>
            <option value="time_desc">Thời gian: Chậm nhất</option>
          </select>

          {/* Nút Đặt lại lọc */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-200"
              title="Đặt lại tất cả bộ lọc"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
