'use client';

import { useState, useRef } from 'react';
import type { RecipeImageDto } from '@/lib/types/recipe';
import {
  useUploadRecipeImage,
  useSetPrimaryRecipeImage,
  useDeleteRecipeImage,
} from '@/features/recipes/hooks';
import { toErrorMessage } from '@/features/auth/hooks';
import {
  UploadCloud,
  CheckCircle2,
  Trash2,
  Star,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface RecipeImageGalleryManagerProps {
  recipeId: string;
  images: RecipeImageDto[];
  isOwner: boolean;
  onChanged?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export default function RecipeImageGalleryManager({
  recipeId,
  images,
  isOwner,
  onChanged,
}: RecipeImageGalleryManagerProps) {
  const [altText, setAltText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadRecipeImage(recipeId);
  const setPrimaryMutation = useSetPrimaryRecipeImage(recipeId);
  const deleteMutation = useDeleteRecipeImage(recipeId);

  const isBusy =
    uploadMutation.isPending ||
    setPrimaryMutation.isPending ||
    deleteMutation.isPending;

  const handleUploadFile = async (file: File) => {
    setErrorMsg(null);
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg('Dung lượng tệp vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      setErrorMsg('Định dạng không hỗ trợ. Chỉ chấp nhận ảnh JPEG, PNG, WebP, AVIF.');
      return;
    }

    uploadMutation.mutate(
      { file, altText: altText.trim() || undefined },
      {
        onSuccess: () => {
          setAltText('');
          if (fileInputRef.current) fileInputRef.current.value = '';
          onChanged?.();
        },
        onError: (err) => {
          setErrorMsg(toErrorMessage(err, 'Tải ảnh lên thất bại. Vui lòng thử lại.'));
        },
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isOwner || isBusy) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleSetPrimary = (imageId: string) => {
    setErrorMsg(null);
    setPrimaryMutation.mutate(imageId, {
      onSuccess: () => onChanged?.(),
      onError: (err) => setErrorMsg(toErrorMessage(err, 'Đặt ảnh chính thất bại.')),
    });
  };

  const handleDelete = (imageId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi công thức?')) return;
    setErrorMsg(null);
    deleteMutation.mutate(imageId, {
      onSuccess: () => onChanged?.(),
      onError: (err) => setErrorMsg(toErrorMessage(err, 'Xóa ảnh thất bại.')),
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <ImageIcon className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">Bộ sưu tập ảnh công thức (FR-RCP-008)</h3>
        </div>
        <span className="text-xs font-semibold text-gray-500">
          {images.length} ảnh
        </span>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid danh sách ảnh hiện có */}
      {images.length === 0 ? (
        <p className="text-xs text-gray-400 italic">Chưa có ảnh nào trong bộ sưu tập.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`group relative aspect-[4/3] overflow-hidden rounded-xl border bg-gray-50 shadow-sm transition-all ${
                img.isPrimary ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumbnailUrl || img.originalUrl}
                alt={img.altText || 'Ảnh món ăn'}
                className="h-full w-full object-cover"
              />

              {/* Huy hiệu ảnh chính */}
              {img.isPrimary && (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                  <Star className="h-3 w-3 fill-white" />
                  <span>Ảnh chính</span>
                </span>
              )}

              {/* Lớp phủ thao tác khi hover (dành cho chủ sở hữu) */}
              {isOwner && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 p-2">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleSetPrimary(img.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-orange-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-50"
                    >
                      <Star className="h-3 w-3" />
                      <span>Đặt làm ảnh chính</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleDelete(img.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Xóa ảnh</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Khu vực Upload ảnh mới (cho Owner / Admin) */}
      {isOwner && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-800">Thêm ảnh mới vào công thức</h4>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              disabled={isBusy}
              placeholder="Mô tả ảnh / Alt text (tùy chọn, vd: Thành phẩm sau khi ninh 30 phút)"
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-orange-500"
            />
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              isDragOver
                ? 'border-orange-500 bg-orange-50/50'
                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/20'
            }`}
          >
            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center gap-2 text-orange-600">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-xs font-semibold">Đang tải ảnh lên MinIO & xử lý thumbnail...</span>
              </div>
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-orange-500 mb-1" />
                <p className="text-xs font-semibold text-gray-700">
                  Kéo thả ảnh vào đây hoặc{' '}
                  <label
                    htmlFor={`recipe-img-upload-${recipeId}`}
                    className="cursor-pointer text-orange-600 underline hover:text-orange-700"
                  >
                    chọn từ máy
                  </label>
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Định dạng: JPG, PNG, WebP, AVIF | Tối đa 5MB. Ảnh đầu tiên sẽ tự động làm ảnh chính.
                </p>
                <input
                  id={`recipe-img-upload-${recipeId}`}
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={isBusy}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
