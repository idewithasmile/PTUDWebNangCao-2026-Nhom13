'use client';

import { useState } from 'react';
import { AlertTriangle, AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { ApiError } from '@/lib/api-client';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

  if (!recipe) return null;

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
    <Dialog
      isOpen={isOpen}
      onClose={isDeleting ? () => {} : onClose}
      ariaLabelledBy="delete-recipe-title"
      ariaDescribedBy="delete-recipe-desc"
    >
      {/* Modal Header */}
      <DialogHeader
        className="bg-rose-50/50"
        onClose={isDeleting ? undefined : onClose}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle id="delete-recipe-title">Xóa Công Thức</DialogTitle>
            <DialogDescription id="delete-recipe-desc">
              FR-RCP-007: Xác nhận thao tác xóa mềm bài viết
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {/* Modal Content */}
      <DialogContent>
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
      </DialogContent>

      {/* Modal Footer */}
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isDeleting}
          className="rounded-xl text-xs font-semibold"
        >
          Hủy bỏ
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleConfirm}
          disabled={isDeleting}
          className="rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
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
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
