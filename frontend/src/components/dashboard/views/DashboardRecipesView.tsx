'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  useRecipes,
  usePublishRecipe,
  useUnpublishRecipe,
  useArchiveRecipe,
  useDeleteRecipe,
} from '@/features/recipes/hooks';
import { categoryService } from '@/lib/services/category-service';
import type { RecipeSummaryDto, RecipeStatus, RecipeDifficulty } from '@/lib/types/category';
import type { UserProfile } from '@/types/auth';
import DeleteRecipeModal from '@/components/recipes/DeleteRecipeModal';
import Toast, { ToastMessage } from '@/components/common/Toast';
import RecipeDetailView from '@/components/recipes/RecipeDetailView';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChefHat,
  ArrowLeft,
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  Download,
  Filter,
  CheckCircle2,
  Tag,
  Loader2,
  RotateCcw,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import DashboardHeroBanner from '../common/DashboardHeroBanner';

interface DashboardRecipesViewProps {
  user: UserProfile;
  subFilter?: 'all' | 'mine' | 'published' | 'draft' | 'archived';
}

export default function DashboardRecipesView({ user, subFilter = 'all' }: DashboardRecipesViewProps) {
  const isAdmin = user.roles?.includes('Admin') ?? false;

  // State chuyển đổi giữa Screen 2 (Danh sách) và Screen 3 (Chi tiết)
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeSummaryDto | null>(null);

  // State tìm kiếm, lọc & phân trang
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>(() => {
    if (subFilter === 'draft') return '0';
    if (subFilter === 'published') return '1';
    if (subFilter === 'archived') return '2';
    return 'ALL';
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedMaxTime, setSelectedMaxTime] = useState<string>('');
  const [selectedSortBy, setSelectedSortBy] = useState<'newest' | 'oldest' | 'time_asc' | 'time_desc'>('newest');
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  useEffect(() => {
    if (subFilter === 'draft') setSelectedStatus('0');
    else if (subFilter === 'published') setSelectedStatus('1');
    else if (subFilter === 'archived') setSelectedStatus('2');
    else setSelectedStatus('ALL');
    setPage(1);
  }, [subFilter]);

  // Debounce tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Danh mục cho dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 60 * 60 * 1000,
  });

  // Query bài viết
  const queryParams = useMemo(() => {
    // Nếu không phải Admin hoặc đang lọc theo trạng thái tác giả thì lấy bài viết của chính tác giả (onlyMine = true)
    const onlyMine = !isAdmin || subFilter !== 'all';
    return {
      page,
      pageSize,
      searchTerm: debouncedSearch || undefined,
      categoryId: selectedCategory || undefined,
      difficulty: selectedDifficulty !== '' ? (Number(selectedDifficulty) as RecipeDifficulty) : undefined,
      maxTotalTimeMinutes: selectedMaxTime ? Number(selectedMaxTime) : undefined,
      sortBy: selectedSortBy,
      status: selectedStatus !== 'ALL' ? (selectedStatus as RecipeStatus) : undefined,
      onlyMine,
    };
  }, [page, pageSize, debouncedSearch, selectedCategory, selectedDifficulty, selectedMaxTime, selectedSortBy, selectedStatus, isAdmin, subFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory('');
    setSelectedStatus(subFilter === 'draft' ? '0' : 'ALL');
    setSelectedDifficulty('');
    setSelectedMaxTime('');
    setSelectedSortBy('newest');
    setPage(1);
  };

  const hasActiveFilters = !!(
    debouncedSearch ||
    selectedCategory ||
    selectedDifficulty !== '' ||
    selectedMaxTime ||
    selectedSortBy !== 'newest' ||
    (selectedStatus !== 'ALL' && subFilter !== 'draft')
  );

  const {
    data: recipesData,
    isLoading,
    isFetching,
    refetch,
  } = useRecipes(queryParams);

  const recipes = recipesData?.items ?? [];
  const totalCount = recipesData?.totalCount ?? 0;
  const totalPages = recipesData?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));

  // Modal xóa & Toasts
  const [recipeToDelete, setRecipeToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteMutation = useDeleteRecipe();

  const handleConfirmDelete = async () => {
    if (!recipeToDelete) return;
    try {
      await deleteMutation.mutateAsync(recipeToDelete.id);
      addToast('success', 'Đã xóa công thức', `"${recipeToDelete.title}" đã được xóa thành công.`);
      setIsDeleteModalOpen(false);
      setRecipeToDelete(null);
      if (selectedRecipe?.id === recipeToDelete.id) {
        setSelectedRecipe(null);
      }
      refetch();
    } catch {
      addToast('error', 'Xóa thất bại', 'Bạn không có quyền hoặc bài viết không tồn tại.');
    }
  };

  // --------------------------------------------------------------------------
  // SCREEN 3: CHI TIẾT BÀI VIẾT (Khớp 100% trang chi tiết công thức thực tế ngoài độc giả)
  // --------------------------------------------------------------------------
  if (selectedRecipe) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Top bar điều hướng quay lại & nút thao tác trong Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setSelectedRecipe(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-gray-100 px-3.5 py-2 rounded-xl border border-gray-200 transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Quay lại danh sách công thức</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedRecipe.status === 'Published' || String(selectedRecipe.status) === '1'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : selectedRecipe.status === 'Archived' || String(selectedRecipe.status) === '2'
                  ? 'bg-gray-100 text-gray-700 border border-gray-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {selectedRecipe.status === 'Published' || String(selectedRecipe.status) === '1'
                ? 'Đã xuất bản'
                : selectedRecipe.status === 'Archived' || String(selectedRecipe.status) === '2'
                ? 'Đã lưu trữ'
                : 'Bản nháp'}
            </span>

            <Link
              href={`/dashboard?tab=recipes-edit&slug=${encodeURIComponent(selectedRecipe.slug)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition active:scale-95"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa công thức</span>
            </Link>

            <Link
              href={`/recipes/${encodeURIComponent(selectedRecipe.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition"
              title="Mở xem ở trang web công khai ngoài Dashboard"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở tab mới ↗</span>
            </Link>
          </div>
        </div>

        {/* Nội dung chi tiết công thức THỰC TẾ 100% bằng RecipeDetailView */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-10 shadow-xs">
          <RecipeDetailView slug={selectedRecipe.slug} hideBackLink />
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 2: DANH SÁCH BÀI VIẾT (Khớp 100% Screen 2 của Master Mockup)
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>

      {/* HERO BANNER: Kho công thức ẩm thực đồng nhất với phong cách chung */}
      <DashboardHeroBanner
        backgroundImage="/images/dashboard/banner-recipes.jpg"
        icon={<ChefHat className="w-7 h-7" />}
        title={
          subFilter === 'published'
            ? 'Công thức đã xuất bản'
            : subFilter === 'draft'
            ? 'Bản nháp'
            : subFilter === 'archived'
            ? 'Công thức đã lưu trữ'
            : subFilter === 'mine'
            ? 'Công thức của tôi'
            : 'Kho công thức ẩm thực'
        }
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-200 border border-orange-500/30">
            {isFetching && <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-300" />}
            <span>{totalCount.toLocaleString('vi-VN')} công thức</span>
          </span>
        }
        description={
          subFilter === 'published'
            ? 'Danh sách các công thức đã xuất bản công khai trên Culinary Blog'
            : subFilter === 'draft'
            ? 'Danh sách các bản nháp đang trong quá trình biên soạn'
            : subFilter === 'archived'
            ? 'Danh sách các công thức đã lưu trữ / ẩn tạm thời khỏi trang công khai'
            : subFilter === 'mine' || !isAdmin
            ? 'Danh sách các công thức do chính bạn sáng tạo và chia sẻ'
            : 'Quản lý toàn bộ bài viết, công thức nấu ăn và kiểm soát chất lượng ẩm thực trên toàn hệ thống'
        }
        breadcrumbs={[
          { label: 'Trang chủ', href: '/dashboard?tab=overview' },
          { label: 'Công thức ẩm thực', active: true },
        ]}
        actions={
          <>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/25 transition active:scale-95 disabled:opacity-50"
              title="Làm mới danh sách công thức"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>

            <Link
              href="/dashboard?tab=recipes-create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng công thức mới</span>
            </Link>
          </>
        }
      />

      {/* Filter Bar (Khớp Screen 2 + FR-RCP-001) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tiêu đề, tác giả, nội dung..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Dropdown Danh mục */}
          <div className="w-full sm:w-48 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Trạng thái */}
          <div className="w-full sm:w-44 shrink-0">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="1">Đã xuất bản</option>
              <option value="0">Bản nháp</option>
              <option value="2">Đã lưu trữ</option>
            </select>
          </div>

          {/* Nút bật/tắt lọc nâng cao */}
          <button
            type="button"
            onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition shrink-0 ${
              isAdvancedFilterOpen || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Lọc nâng cao</span>
            {isAdvancedFilterOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Nút xóa bộ lọc nhanh */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-100 text-xs font-bold text-rose-600 hover:bg-rose-100 transition shrink-0"
              title="Đặt lại toàn bộ bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>

        {/* Khung lọc nâng cao mở rộng (FR-RCP-001: Độ khó, Thời gian nấu, Sắp xếp) */}
        {isAdvancedFilterOpen && (
          <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
            {/* Lọc Độ khó */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Độ khó:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Tất cả độ khó</option>
                <option value="0">Dễ (Dưới 30 phút)</option>
                <option value="1">Trung bình</option>
                <option value="2">Khó / Cầu kỳ</option>
              </select>
            </div>

            {/* Lọc Thời gian nấu */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Thời gian nấu tối đa:</label>
              <select
                value={selectedMaxTime}
                onChange={(e) => {
                  setSelectedMaxTime(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">Không giới hạn thời gian</option>
                <option value="15">Nấu nhanh (≤ 15 phút)</option>
                <option value="30">Nhanh gọn (≤ 30 phút)</option>
                <option value="60">Tiêu chuẩn (≤ 60 phút)</option>
                <option value="120">Nấu chậm / Hầm (≤ 120 phút)</option>
              </select>
            </div>

            {/* Sắp xếp kết quả */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Sắp xếp theo:</label>
              <select
                value={selectedSortBy}
                onChange={(e) => {
                  setSelectedSortBy(e.target.value as typeof selectedSortBy);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="newest">Mới nhất trước</option>
                <option value="oldest">Cũ nhất trước</option>
                <option value="time_asc">Thời gian nấu tăng dần</option>
                <option value="time_desc">Thời gian nấu giảm dần</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Recipes Table (Khớp Screen 2) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="py-3 px-4 min-w-[240px]">Tiêu đề</th>
                <th className="py-3 px-4 min-w-[120px]">Danh mục</th>
                <th className="py-3 px-4 min-w-[140px]">Tác giả</th>
                <th className="py-3 px-4 text-center w-24">Thời gian</th>
                <th className="py-3 px-4 text-center w-28">Trạng thái</th>
                <th className="py-3 px-4 w-28">Ngày tạo</th>
                <th className="py-3 px-4 text-right w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Đang tải bài viết...
                  </td>
                </tr>
              ) : recipes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <div className="max-w-sm mx-auto space-y-3">
                      <ChefHat className="w-10 h-10 mx-auto text-gray-300" />
                      <p className="font-semibold text-gray-700">Không tìm thấy bài viết nào phù hợp</p>
                      <p className="text-xs text-gray-400">
                        {hasActiveFilters
                          ? 'Hãy thử điều chỉnh hoặc xóa các tiêu chí lọc để xem thêm bài viết.'
                          : 'Hiện chưa có bài viết nào trong mục này.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Xóa bộ lọc</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                recipes.map((recipe, idx) => {
                  const isOwner = recipe.authorId === user.id;
                  const canManage = isOwner || isAdmin;

                  return (
                    <tr key={recipe.id} className="hover:bg-gray-50/70 transition group">
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </td>

                      {/* Tiêu đề + Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                            {recipe.thumbnailUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={recipe.thumbnailUrl}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
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
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <button
                              type="button"
                              onClick={() => setSelectedRecipe(recipe)}
                              className="font-bold text-gray-900 hover:text-blue-600 text-left transition truncate block w-full"
                              title="Xem chi tiết trong Dashboard"
                            >
                              {recipe.title}
                            </button>
                            <span className="text-[10px] text-gray-400 block truncate">
                              /{recipe.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Danh mục */}
                      <td className="py-3 px-4 font-semibold text-gray-700">
                        {recipe.categoryName || 'Món chính'}
                      </td>

                      {/* Tác giả */}
                      <td className="py-3 px-4 text-gray-700">
                        <div className="font-semibold">{recipe.authorName || 'Nguyễn Văn A'}</div>
                        {isOwner && (
                          <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.2 rounded">
                            Bạn
                          </span>
                        )}
                      </td>

                      {/* Thời gian */}
                      <td className="py-3 px-4 text-center font-bold text-gray-700">
                        {recipe.totalTimeMinutes || 30} phút
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3 px-4 text-center">
                        {recipe.status === 'Published' || String(recipe.status) === '1' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                            Đã xuất bản
                          </span>
                        ) : recipe.status === 'Draft' || String(recipe.status) === '0' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                            Nháp
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            Lưu trữ
                          </span>
                        )}
                      </td>

                      {/* Ngày tạo */}
                      <td className="py-3 px-4 text-gray-500 text-[11px]">
                        {new Date(recipe.createdAt).toLocaleDateString('vi-VN')}
                      </td>

                      {/* Thao tác */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedRecipe(recipe)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {canManage && (
                            <>
                              <Link
                                href={`/dashboard?tab=recipes-edit&slug=${encodeURIComponent(recipe.slug)}`}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                title="Chỉnh sửa"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  setRecipeToDelete({ id: recipe.id, title: recipe.title });
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Xóa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Khớp Screen 2) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-500">
          <span>
            Hiển thị <strong>{recipes.length}</strong> trong số <strong>{totalCount}</strong> bài viết
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPage(idx + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                  page === idx + 1
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            {totalPages > 5 && (
              <>
                <span className="px-1 text-gray-400">...</span>
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                    page === totalPages
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteRecipeModal
        isOpen={isDeleteModalOpen}
        recipe={recipeToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={async (id) => {
          await handleConfirmDelete();
        }}
      />
    </div>
  );
}
