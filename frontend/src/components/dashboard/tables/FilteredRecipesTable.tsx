'use client';

import { useState, useEffect, useMemo } from 'react';
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
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  FileEdit,
  Archive,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChefHat,
  Clock,
  Layers,
} from 'lucide-react';

interface FilteredRecipesTableProps {
  user: UserProfile;
  isAdmin: boolean;
}

export default function FilteredRecipesTable({ user, isAdmin }: FilteredRecipesTableProps) {
  // 1. Quản lý trạng thái bộ lọc & phân trang
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [adminScope, setAdminScope] = useState<'all' | 'mine'>(isAdmin ? 'all' : 'mine');

  // Debounce ô tìm kiếm 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1); // Reset về trang 1 khi gõ từ khóa mới
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset về trang 1 khi đổi bộ lọc
  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setPage(1);
  };

  const handleDifficultyChange = (val: string) => {
    setSelectedDifficulty(val);
    setPage(1);
  };

  // 2. Fetch danh sách Danh mục cho Dropdown bộ lọc
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 60 * 60 * 1000,
  });

  // 3. Fetch dữ liệu bài viết qua REST API (FR-RCP-001)
  const queryParams = useMemo(() => {
    const onlyMine = !isAdmin || adminScope === 'mine';
    return {
      page,
      pageSize,
      searchTerm: debouncedSearch || undefined,
      categoryId: selectedCategory || undefined,
      difficulty: selectedDifficulty !== '' ? (Number(selectedDifficulty) as RecipeDifficulty) : undefined,
      status: selectedStatus !== 'ALL' ? (selectedStatus as RecipeStatus) : undefined,
      onlyMine,
    };
  }, [page, pageSize, debouncedSearch, selectedCategory, selectedDifficulty, selectedStatus, isAdmin, adminScope]);

  const {
    data: recipesData,
    isLoading,
    isFetching,
    refetch,
  } = useRecipes(queryParams);

  const recipes = recipesData?.items ?? [];
  const totalCount = recipesData?.totalCount ?? 0;
  const totalPages = recipesData?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));

  // 4. Modal xóa & Toasts thông báo
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

  // 5. Mutations thao tác trạng thái
  const publishMutation = usePublishRecipe();
  const unpublishMutation = useUnpublishRecipe();
  const archiveMutation = useArchiveRecipe();
  const deleteMutation = useDeleteRecipe();

  const handlePublish = async (recipe: RecipeSummaryDto) => {
    try {
      await publishMutation.mutateAsync(recipe.id);
      addToast('success', 'Xuất bản thành công', `"${recipe.title}" đã được công khai trên hệ thống.`);
      refetch();
    } catch {
      addToast('error', 'Xuất bản thất bại', 'Công thức cần có ít nhất 1 bước thực hiện và 1 nguyên liệu.');
    }
  };

  const handleUnpublish = async (recipe: RecipeSummaryDto) => {
    try {
      await unpublishMutation.mutateAsync(recipe.id);
      addToast('warning', 'Đã chuyển về bản nháp', `"${recipe.title}" không còn hiển thị công khai.`);
      refetch();
    } catch {
      addToast('error', 'Thao tác thất bại', 'Không thể chuyển trạng thái công thức.');
    }
  };

  const handleArchive = async (recipe: RecipeSummaryDto) => {
    try {
      await archiveMutation.mutateAsync(recipe.id);
      addToast('success', 'Đã lưu trữ', `"${recipe.title}" đã được chuyển vào kho lưu trữ.`);
      refetch();
    } catch {
      addToast('error', 'Lưu trữ thất bại', 'Không thể lưu trữ công thức.');
    }
  };

  const handleOpenDeleteModal = (recipe: RecipeSummaryDto) => {
    setRecipeToDelete({ id: recipe.id, title: recipe.title });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!recipeToDelete) return;
    try {
      await deleteMutation.mutateAsync(recipeToDelete.id);
      addToast('success', 'Đã xóa công thức', `"${recipeToDelete.title}" đã được xóa mềm thành công.`);
      setIsDeleteModalOpen(false);
      setRecipeToDelete(null);
      refetch();
    } catch {
      addToast('error', 'Xóa thất bại', 'Bạn không có quyền hoặc công thức không tồn tại.');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('ALL');
    setSelectedDifficulty('');
    setPage(1);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
      {/* Header của bảng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">
              {isAdmin && adminScope === 'all'
                ? 'Quản lý toàn bộ bài viết hệ thống'
                : 'Bài viết gần đây của bạn'}
            </h3>
            {isFetching && <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Lọc đa chiều, phân trang và cập nhật trạng thái trực tiếp theo REST API
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Switch phạm vi dữ liệu cho Admin */}
          {isAdmin && (
            <div className="inline-flex rounded-xl bg-gray-100 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAdminScope('all');
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  adminScope === 'all'
                    ? 'bg-white text-purple-700 shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Toàn hệ thống
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminScope('mine');
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  adminScope === 'mine'
                    ? 'bg-white text-orange-600 shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Bài của tôi
              </button>
            </div>
          )}

          <Link
            href="/recipes/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng công thức</span>
          </Link>
        </div>
      </div>

      {/* Thanh bộ lọc đa chiều (Filter Bar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-gray-100">
        {/* Lọc 1: Ô tìm kiếm từ khóa */}
        <div className="relative lg:col-span-2">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tiêu đề hoặc mô tả..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>

        {/* Lọc 2: Danh mục */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.recipeCount})
              </option>
            ))}
          </select>
        </div>

        {/* Lọc 3: Trạng thái */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Published">Đã xuất bản (Published)</option>
            <option value="Draft">Bản nháp (Draft)</option>
            <option value="Archived">Đã lưu trữ (Archived)</option>
          </select>
        </div>

        {/* Lọc 4: Độ khó + Nút Reset */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDifficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          >
            <option value="">Độ khó</option>
            <option value="1">Dễ (Easy)</option>
            <option value="2">Trung bình (Medium)</option>
            <option value="3">Khó (Hard)</option>
            <option value="4">Chuyên gia (Expert)</option>
          </select>

          <button
            type="button"
            onClick={handleResetFilters}
            title="Đặt lại bộ lọc"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu chính */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Tiêu đề công thức</th>
              <th className="py-3 px-4">Danh mục</th>
              <th className="py-3 px-4">Tác giả</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Thời gian</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                    <span>Đang tải danh sách bài viết từ máy chủ...</span>
                  </div>
                </td>
              </tr>
            ) : recipes.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  <p className="font-semibold text-gray-500">Không tìm thấy công thức nào</p>
                  <p className="text-[11px] mt-1">Vui lòng thử điều chỉnh lại từ khóa hoặc bộ lọc của bạn.</p>
                </td>
              </tr>
            ) : (
              recipes.map((recipe) => {
                const isOwner = recipe.authorId === user.id;
                const canManage = isOwner || isAdmin;

                return (
                  <tr key={recipe.id} className="hover:bg-gray-50/70 transition-colors group">
                    {/* Cột 1: Tiêu đề + Ảnh đại diện */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
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
                              <ChefHat className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                          <Link
                            href={`/recipes/${recipe.slug}`}
                            className="font-bold text-gray-900 hover:text-orange-600 transition truncate block"
                          >
                            {recipe.title}
                          </Link>
                          <span className="text-[11px] text-gray-400 block truncate">
                            /{recipe.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Danh mục */}
                    <td className="py-3.5 px-4 font-medium text-gray-700">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold text-[11px]">
                        {recipe.categoryName || 'Chưa phân loại'}
                      </span>
                    </td>

                    {/* Cột 3: Tác giả */}
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {recipe.authorName || 'Ẩn danh'}
                      {isOwner && (
                        <span className="ml-1 text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                          Bạn
                        </span>
                      )}
                    </td>

                    {/* Cột 4: Trạng thái (Status Badge) */}
                    <td className="py-3.5 px-4">
                      {recipe.status === 'Published' || String(recipe.status) === '1' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          <CheckCircle2 className="w-3 h-3" /> Đã xuất bản
                        </span>
                      ) : recipe.status === 'Draft' || String(recipe.status) === '0' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                          <FileEdit className="w-3 h-3" /> Bản nháp
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          <Archive className="w-3 h-3" /> Đã lưu trữ
                        </span>
                      )}
                    </td>

                    {/* Cột 5: Thời gian */}
                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {new Date(recipe.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Cột 6: Thao tác (Row Actions) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Xem chi tiết */}
                        <Link
                          href={`/recipes/${recipe.slug}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Xem công thức"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        {/* Chuyển đổi trạng thái nhanh */}
                        {canManage && (
                          <>
                            {recipe.status === 'Draft' && (
                              <button
                                type="button"
                                onClick={() => handlePublish(recipe)}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                                title="Xuất bản ngay"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {recipe.status === 'Published' && (
                              <button
                                type="button"
                                onClick={() => handleUnpublish(recipe)}
                                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition"
                                title="Gỡ bài về bản nháp"
                              >
                                <FileEdit className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {recipe.status !== 'Archived' && (
                              <button
                                type="button"
                                onClick={() => handleArchive(recipe)}
                                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                                title="Lưu trữ bài viết"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Sửa bài */}
                            <Link
                              href={`/recipes/edit?id=${recipe.id}`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition"
                              title="Chỉnh sửa công thức"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>

                            {/* Xóa mềm */}
                            <button
                              type="button"
                              onClick={() => handleOpenDeleteModal(recipe)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Xóa công thức"
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

      {/* Điều khiển phân trang (Server-side Pagination) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span>
            Hiển thị{' '}
            <strong className="text-gray-900">
              {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}
            </strong>{' '}
            -{' '}
            <strong className="text-gray-900">
              {Math.min(page * pageSize, totalCount)}
            </strong>{' '}
            trong tổng số <strong className="text-gray-900">{totalCount}</strong> bài viết
          </span>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none"
          >
            <option value="5">5 bài / trang</option>
            <option value="10">10 bài / trang</option>
            <option value="20">20 bài / trang</option>
          </select>
        </div>

        {/* Nút phân trang */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-bold text-gray-900">
            Trang {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            title="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal xác nhận xóa mềm */}
      <DeleteRecipeModal
        isOpen={isDeleteModalOpen}
        recipe={recipeToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRecipeToDelete(null);
        }}
        onConfirmDelete={async (id: string) => {
          await deleteMutation.mutateAsync(id);
          addToast('success', 'Đã xóa công thức', 'Công thức đã được xóa mềm thành công.');
          setIsDeleteModalOpen(false);
          setRecipeToDelete(null);
          refetch();
        }}
      />

      {/* Toast thông báo */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  );
}
