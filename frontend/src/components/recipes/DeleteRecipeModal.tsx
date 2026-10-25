'use client';

import { useState } from 'react';
import { AlertTriangle, AlertCircle, Trash2, X, Loader2 } from 'lucide-react';
import { ApiError } from '@/lib/api-client';

interface DeleteRecipeModalProps {
  isOpen: boolean;
  recipe: { id: string; title: string } | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => Promise<void>;
}

export default function DeleteRecipeModal({
  isOpen,
  recipe,
  onClose,
  onConfirmDelete,
}: DeleteRecipeModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !recipe) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await onConfirmDelete(recipe.id);
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message || 'Không thể xóa công thức lúc này.');
      } else {
        setErrorMessage('Đã xảy ra lỗi không xác định khi xóa công thức.');
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
              <h3 className="text-base font-bold text-gray-900">Xóa Công Thức</h3>
              <p className="text-xs text-gray-500">Xác nhận thao tác xóa mềm bài viết</p>
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
          <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa công thức <strong>&quot;{recipe.title}&quot;</strong>?
              Hệ thống sẽ thực hiện xóa mềm (Soft Delete). Bài viết sẽ không còn xuất hiện công khai trên hệ thống.
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 transition"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận xóa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
