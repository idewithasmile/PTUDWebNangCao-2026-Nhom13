'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  Sparkles,
  Search,
  X,
  SlidersHorizontal,
  FolderOpen,
  UtensilsCrossed,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { CategoryDto } from '@/lib/types/category';
import CategoryCard from '@/components/categories/CategoryCard';
import { useMe } from '@/features/auth/hooks';
import { hasSession } from '@/features/auth/api';

interface CategoriesClientViewProps {
  initialCategories: CategoryDto[];
}

type SortOption = 'popular' | 'name_asc' | 'name_desc' | 'default';
type FilterTab = 'all' | 'has_recipes' | 'popular';

export default function CategoriesClientView({ initialCategories }: CategoriesClientViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const me = useMe(hasSession());
  const user = me.data ?? null;
  const isAdmin = user?.roles?.includes('Admin');

  // Tính toán số liệu thống kê tổng quan
  const stats = useMemo(() => {
    const totalCategories = initialCategories.length;
    const totalRecipes = initialCategories.reduce((sum, c) => sum + (c.recipeCount || 0), 0);
    const topCategory = [...initialCategories].sort((a, b) => b.recipeCount - a.recipeCount)[0];

    return {
      totalCategories,
      totalRecipes,
      topCategoryName: topCategory?.name || 'Chưa có',
      topCategoryCount: topCategory?.recipeCount || 0,
    };
  }, [initialCategories]);

  // Lọc và sắp xếp danh mục linh hoạt
  const filteredCategories = useMemo(() => {
    let result = [...initialCategories];

    // 1. Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // 2. Lọc theo Tab bộ lọc nhanh
    if (activeTab === 'has_recipes') {
      result = result.filter((c) => c.recipeCount > 0);
    } else if (activeTab === 'popular') {
      result = result.filter((c) => c.recipeCount >= 3);
    }

    // 3. Sắp xếp
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.recipeCount - a.recipeCount);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
        break;
      case 'default':
      default:
        result.sort((a, b) => a.orderIndex - b.orderIndex);
        break;
    }

    return result;
  }, [initialCategories, searchTerm, activeTab, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setSortBy('popular');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
        <Link href="/" className="hover:text-orange-600 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Danh mục món ăn</span>
      </nav>

      {/* 2. Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-amber-600 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Thế giới ẩm thực đa dạng</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-sm">
            Danh Mục <span className="text-amber-100">Món Ăn</span>
          </h1>
          <p className="text-base sm:text-lg text-orange-50 leading-relaxed">
            Khám phá hơn <strong className="text-white font-bold">{stats.totalRecipes}</strong> công thức nấu ăn hấp dẫn được phân loại khoa học qua <strong className="text-white font-bold">{stats.totalCategories}</strong> danh mục ẩm thực phong phú.
          </p>
        </div>

        {/* Họa tiết biểu tượng ẩm thực chìm */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <ChefHat className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* 3. Thẻ Thông Số Thống Kê Tổng Quan (Stats Bar) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shrink-0">
            <FolderOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.totalCategories}</div>
            <div className="text-xs font-medium text-gray-500">Danh mục phân loại</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shrink-0">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.totalRecipes}</div>
            <div className="text-xs font-medium text-gray-500">Công thức đã xuất bản</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm transition hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="truncate">
            <div className="text-lg font-bold text-gray-900 truncate" title={stats.topCategoryName}>
              {stats.topCategoryName}
            </div>
            <div className="text-xs font-medium text-gray-500">
              Nhiều món nhất ({stats.topCategoryCount} công thức)
            </div>
          </div>
        </div>
      </div>

      {/* 4. Thanh Công Cụ Dành Cho Quản Trị Viên (Admin Action Bar) */}
      {isAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0" />
            <div className="text-sm font-semibold">
              Khu vực Quản trị viên: Quản lý, tạo mới và sắp xếp danh mục món ăn
            </div>
          </div>
          <Link
            href="/dashboard/categories"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition"
          >
            <span>Trang quản trị danh mục (CRUD)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* 5. Bộ Lọc Tìm Kiếm & Sắp Xếp Danh Mục */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Ô tìm kiếm danh mục thời gian thực */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm danh mục theo tên hoặc mô tả (ví dụ: Món Á, Tráng miệng, Khai vị...)"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                title="Xóa tìm kiếm"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sắp xếp danh mục */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-gray-500 font-medium">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 outline-none focus:border-orange-500"
            >
              <option value="popular">Nhiều công thức nhất (Phổ biến)</option>
              <option value="name_asc">Tên danh mục: A → Z</option>
              <option value="name_desc">Tên danh mục: Z → A</option>
              <option value="default">Thứ tự mặc định hệ thống</option>
            </select>
          </div>
        </div>

        {/* Tabs bộ lọc nhanh */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-50 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Bộ lọc nhanh:</span>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tất cả ({initialCategories.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('has_recipes')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'has_recipes'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Đang có công thức
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('popular')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'popular'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Phổ biến (≥ 3 món)
            </button>
          </div>

          <div className="text-gray-500 font-medium">
            Hiển thị <strong className="text-gray-900">{filteredCategories.length}</strong> / {initialCategories.length} danh mục
          </div>
        </div>
      </div>

      {/* 6. Lưới Danh Mục (Category Grid) */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 p-8 max-w-lg mx-auto space-y-4">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">
            {searchTerm
              ? `Không tìm thấy danh mục nào phù hợp với "${searchTerm}"`
              : 'Chưa có danh mục nào phù hợp với bộ lọc'}
          </h3>
          <p className="text-sm text-gray-500">
            Thử kiểm tra lại chính tả hoặc nhấn nút bên dưới để khôi phục lại danh sách đầy đủ.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}

      {/* 7. Khối Khám Phá Thêm Cuối Trang (Bottom CTA) */}
      <div className="rounded-3xl bg-white border border-gray-100 p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Bạn chưa tìm thấy phong cách món ăn mong muốn?
          </h3>
          <p className="text-sm text-gray-500">
            Hãy khám phá toàn bộ kho công thức nấu ăn hoặc chia sẻ ngay công thức tuyệt chiêu của bạn.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-orange-700 transition"
          >
            <BookOpen className="h-4 w-4" />
            <span>Kho công thức</span>
          </Link>
          <Link
            href="/recipes/create"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <ChefHat className="h-4 w-4" />
            <span>Đăng công thức mới</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
