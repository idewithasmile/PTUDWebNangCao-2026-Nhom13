'use client';

import { useState } from 'react';
import { CategoryDto, ProblemDetails } from '@/lib/types/category';
import { AlertTriangle, AlertCircle, Trash2, X, Loader2, ShieldAlert } from 'lucide-react';

import { ApiError } from '@/lib/api-client';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  category: CategoryDto | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => Promise<void>;
}

export default function DeleteCategoryModal({
  isOpen,
  category,
  onClose,
  onConfirmDelete,
}: DeleteCategoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHasRecipesConflict, setIsHasRecipesConflict] = useState(false);

  if (!isOpen || !category) return null;

  const hasRecipes = category.recipeCount > 0;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    setIsHasRecipesConflict(false);

    try {
      await onConfirmDelete(category.id);
      onClose();
    } catch (err: unknown) {
      const problem: ProblemDetails =
        err instanceof ApiError ? err.data : (err as ProblemDetails);

      if (problem?.type === 'CATEGORY_DELETE_HAS_RECIPES' || problem?.status === 409) {
        setIsHasRecipesConflict(true);
        setErrorMessage(
          problem.detail ||
            `Không thể xóa danh mục '${category.name}' vì vẫn còn công thức nấu ăn đang hoạt động theo ràng buộc FR-CAT-005.`
        );
      } else {
        setErrorMessage(problem?.detail || problem?.title || 'Không thể xóa danh mục lúc này.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-rose-50/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Xóa Danh Mục</h3>
              <p className="text-xs text-gray-500">Xác nhận thao tác xóa mềm danh mục</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Cảnh báo nếu danh mục còn công thức */}
          {(hasRecipes || isHasRecipesConflict) ? (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Ràng buộc toàn vẹn dữ liệu (FR-CAT-005)</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                Danh mục <strong>&quot;{category.name}&quot;</strong> hiện đang chứa{' '}
                <strong>{category.recipeCount} công thức nấu ăn</strong> đang hoạt động.
              </p>
              <div className="rounded-xl bg-white/80 p-2.5 border border-amber-200/60 text-xs text-amber-800 font-medium">
                ⚠️ Quy tắc nghiệp vụ ngăn chặn xóa: Bạn phải chuyển các công thức thuộc danh mục này sang
                danh mục khác trước khi thực hiện thao tác xóa mềm.
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa danh mục <strong>&quot;{category.name}&quot;</strong>? Thao tác này sẽ
                ẩn danh mục khỏi trang người dùng (Soft Delete).
              </div>
            </div>
          )}

          {errorMessage && !isHasRecipesConflict && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              {hasRecipes ? 'Đã hiểu' : 'Hủy bỏ'}
            </button>

            {!hasRecipes && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Xác nhận xóa</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
