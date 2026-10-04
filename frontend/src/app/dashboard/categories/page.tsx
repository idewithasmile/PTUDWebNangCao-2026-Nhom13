'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/lib/services/category-service';
import { CategoryDto, CreateCategoryInput, UpdateCategoryInput } from '@/lib/types/category';
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
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardCategoriesPage() {
  const queryClient = useQueryClient();

  // State quản lý Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryDto | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);

  // State tìm kiếm & phân trang bảng
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // State Toasts thông báo người dùng
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. TanStack Query: Lấy danh sách Categories tự động đồng bộ cache
  // Lưu ý: Không cần nút Refresh thủ công vì TanStack Query tự động invalidate queries khi có mutation
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  // 2. TanStack Mutation: Tạo Danh mục
  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryInput) => categoryService.createCategory(data),
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast('success', 'Tạo danh mục thành công!', `Danh mục "${newCategory.name}" đã được thêm.`);
    },
    onError: (err: unknown) => {
      const error = err as { detail?: string; title?: string };
      addToast('error', 'Tạo danh mục thất bại', error?.detail || error?.title || 'Vui lòng kiểm tra lại thông tin.');
      throw err;
    },
  });

  // 3. TanStack Mutation: Cập nhật Danh mục
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast(
        'success',
        'Cập nhật thành công!',
        `Thông tin danh mục "${updatedCategory.name}" đã được lưu (Slug giữ nguyên).`
      );
    },
    onError: (err: unknown) => {
      const error = err as { detail?: string; title?: string };
      addToast('error', 'Cập nhật thất bại', error?.detail || error?.title || 'Vui lòng kiểm tra lại thông tin.');
      throw err;
    },
  });

  // 4. TanStack Mutation: Xóa Danh mục
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast('success', 'Xóa thành công!', 'Danh mục đã được xóa mềm khỏi hệ thống.');
    },
    onError: (err: unknown) => {
      const error = err as { detail?: string; title?: string };
      addToast('error', 'Không thể xóa danh mục', error?.detail || error?.title || 'Đã có lỗi xảy ra.');
      throw err;
    },
  });

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const term = searchTerm.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term)) ||
        c.slug.toLowerCase().includes(term)
      );
    });
  }, [categories, searchTerm]);

  // Phân trang Client-side cho DataTable
  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  const handleOpenCreate = () => {
    setCategoryToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (category: CategoryDto) => {
    setCategoryToEdit(category);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (category: CategoryDto) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>

      {/* Header Quản trị */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phân hệ Quản trị FR-CAT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Quản Lý Danh Mục Món Ăn
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Thêm mới, cập nhật thông tin và kiểm soát toàn vẹn liên kết công thức của các danh mục.
          </p>
        </div>

        {/* Nút hành động chính: Thêm danh mục mới (đã loại bỏ nút làm mới thủ công gây render lặp dữ liệu) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-sm font-semibold text-white shadow-md hover:bg-orange-700 transition hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Danh Mục Mới</span>
          </button>
        </div>
      </div>

      {/* Thanh tìm kiếm & bộ lọc */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên danh mục, slug, mô tả..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
          />
        </div>

        <div className="text-xs text-gray-500 self-end sm:self-center">
          Tổng cộng: <strong>{filteredCategories.length}</strong> danh mục
        </div>
      </div>

      {/* Bảng Dữ liệu Danh mục (DataTable) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
            <p className="text-sm">Đang tải danh sách danh mục...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-rose-500">
            <p className="font-semibold">Không thể tải dữ liệu danh mục</p>
            <p className="text-xs text-gray-500 mt-1">Vui lòng kiểm tra lại kết nối API Backend.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 rounded-xl bg-orange-100 text-orange-700 text-xs font-semibold hover:bg-orange-200 transition"
            >
              Thử lại
            </button>
          </div>
        ) : paginatedCategories.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-700">Không tìm thấy danh mục phù hợp</p>
            <p className="text-xs text-gray-400 mt-1">
              Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút thêm mới.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6 w-16 text-center">Thứ tự</th>
                  <th className="py-4 px-6 w-20">Ảnh</th>
                  <th className="py-4 px-6">Tên Danh Mục & Mô Tả</th>
                  <th className="py-4 px-6">Slug (URL)</th>
                  <th className="py-4 px-6 text-center">Số Công Thức</th>
                  <th className="py-4 px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-4 px-6 text-center font-mono text-xs text-gray-400">
                      {category.orderIndex}
                    </td>

                    <td className="py-4 px-6">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        {category.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ChefHat className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-gray-900 line-clamp-1">{category.name}</div>
                      {category.description ? (
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                          {category.description}
                        </p>
                      ) : (
                        <span className="text-xs text-gray-300 italic">Chưa có mô tả</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <Link
                        href={`/categories/${category.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-orange-600 hover:text-orange-700 hover:underline"
                        title="Xem trang danh mục trên web"
                      >
                        <span>{category.slug}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          category.recipeCount > 0
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {category.recipeCount} món
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(category)}
                          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition shadow-sm"
                          title="Chỉnh sửa danh mục"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(category)}
                          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-sm"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân trang Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Trang {currentPage} trên tổng số {totalPages} trang
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg font-medium transition ${
                    p === currentPage
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        categoryToEdit={categoryToEdit}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitCreate={async (data) => {
          await createMutation.mutateAsync(data);
        }}
        onSubmitUpdate={async (id, data) => {
          await updateMutation.mutateAsync({ id, data });
        }}
      />

      {/* Modal Xóa kèm kiểm tra ràng buộc FR-CAT-005 */}
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        category={categoryToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={async (id) => {
          await deleteMutation.mutateAsync(id);
        }}
      />
    </div>
  );
}
