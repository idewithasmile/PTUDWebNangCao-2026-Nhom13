'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/lib/services/category-service';
import type { CategoryDto, CreateCategoryInput, UpdateCategoryInput } from '@/lib/types/category';
import CategoryFormModal from '@/components/categories/CategoryFormModal';
import DeleteCategoryModal from '@/components/categories/DeleteCategoryModal';
import Toast, { ToastMessage } from '@/components/common/Toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChefHat,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FolderTree,
} from 'lucide-react';

export default function DashboardCategoriesView() {
  const queryClient = useQueryClient();

  // State quản lý Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryDto | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);

  // State tìm kiếm, lọc & phân trang
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // State Toasts thông báo
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Fetch danh sách Categories từ REST API
  const {
    data: categories = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 60 * 1000,
  });

  // 2. Mutation xóa danh mục
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      addToast('success', 'Xóa thành công!', 'Danh mục đã được xóa mềm khỏi hệ thống.');
    },
    onError: (err: unknown) => {
      const error = err as { detail?: string; title?: string };
      addToast('error', 'Không thể xóa danh mục', error?.detail || error?.title || 'Đã có lỗi xảy ra.');
      throw err;
    },
  });

  // 3. Mutation tạo mới danh mục
  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryInput) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      addToast('success', 'Tạo thành công!', 'Danh mục mới đã được tạo.');
    },
    onError: (err: unknown) => {
      const error = err as { detail?: string; title?: string };
      addToast('error', 'Không thể tạo danh mục', error?.detail || error?.title || 'Đã có lỗi xảy ra.');
      throw err;
    },
  });

  // 4. Mutation cập nhật danh mục
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      addToast('success', 'Cập nhật thành công!', 'Danh mục đã được cập nhật.');
    },
    onError: (err: unknown) => {
      const error = err as { detail?: string; title?: string };
      addToast('error', 'Không thể cập nhật danh mục', error?.detail || error?.title || 'Đã có lỗi xảy ra.');
      throw err;
    },
  });

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const term = searchTerm.toLowerCase().trim();
      const matchText =
        c.name.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term)) ||
        c.slug.toLowerCase().includes(term);
      return matchText;
    });
  }, [categories, searchTerm]);

  // Phân trang Client-side
  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

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

      {/* Header Quản lý danh mục (Khớp Screen 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Danh mục</span>
            {isFetching && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý cơ cấu phân loại món ăn và công thức ẩm thực toàn hệ thống
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCategoryToEdit(null);
            setIsFormModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* Filter Bar (Khớp Screen 4) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm danh mục..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="w-full sm:w-48 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Tạm dừng</option>
          </select>
        </div>
      </div>

      {/* Categories Table (Khớp Screen 4) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-16">Hình ảnh</th>
                <th className="py-3 px-4 min-w-[160px]">Tên danh mục</th>
                <th className="py-3 px-4 min-w-[280px]">Mô tả</th>
                <th className="py-3 px-4 text-center w-28">Số bài viết</th>
                <th className="py-3 px-4 text-center w-28">Trạng thái</th>
                <th className="py-3 px-4 text-right w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Không tìm thấy danh mục phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/70 transition group">
                    {/* Hình ảnh */}
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                        {category.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <FolderTree className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>

                    {/* Tên danh mục */}
                    <td className="py-3 px-4 font-bold text-gray-900">
                      <div>{category.name}</div>
                      <div className="text-[10px] text-gray-400 font-normal">/{category.slug}</div>
                    </td>

                    {/* Mô tả */}
                    <td className="py-3 px-4 text-gray-500 line-clamp-2 max-w-md">
                      {category.description || 'Chưa có mô tả cho danh mục này.'}
                    </td>

                    {/* Số bài viết */}
                    <td className="py-3 px-4 text-center font-bold text-gray-800">
                      {category.recipeCount ?? 0}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                        Hoạt động
                      </span>
                    </td>

                    {/* Thao tác */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryToEdit(category);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryToDelete(category);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Khớp Screen 4) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-500">
          <span>
            Hiển thị <strong>{paginatedCategories.length}</strong> trong tổng số{' '}
            <strong>{filteredCategories.length}</strong> danh mục
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                  currentPage === idx + 1
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Form Modal Thêm / Sửa */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        categoryToEdit={categoryToEdit}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitCreate={async (data) => {
          await createMutation.mutateAsync(data);
          setIsFormModalOpen(false);
        }}
        onSubmitUpdate={async (id, data) => {
          await updateMutation.mutateAsync({ id, data });
          setIsFormModalOpen(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        category={categoryToDelete}
        onConfirmDelete={async (id) => {
          await deleteMutation.mutateAsync(id);
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
}
