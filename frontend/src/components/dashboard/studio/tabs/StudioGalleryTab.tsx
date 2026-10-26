'use client';

import { useState, useRef } from 'react';
import type { RecipeDetailDto, RecipeImageDto } from '@/lib/types/recipe';
import {
  useUploadRecipeImage,
  useSetPrimaryRecipeImage,
  useDeleteRecipeImage,
} from '@/features/recipes/hooks';
import { toErrorMessage } from '@/features/auth/hooks';
import { resolveMediaUrl } from '@/lib/utils';
import {
  Upload,
  Image as ImageIcon,
  Star,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';

interface StudioGalleryTabProps {
  recipe: RecipeDetailDto;
  onRefresh: () => void;
}

export default function StudioGalleryTab({ recipe, onRefresh }: StudioGalleryTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const images = recipe.images ?? [];

  const uploadMutation = useUploadRecipeImage(recipe.id, recipe.slug);
  const setPrimaryMutation = useSetPrimaryRecipeImage(recipe.id, recipe.slug);
  const deleteMutation = useDeleteRecipeImage(recipe.id, recipe.slug);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', `Ảnh "${file.name}" vượt quá kích thước 5MB cho phép.`);
        continue;
      }

      setIsUploading(true);
      try {
        await uploadMutation.mutateAsync({ file, altText: altText || file.name });
        showToast('success', `Đã tải lên "${file.name}" thành công!`);
        onRefresh();
      } catch (err: unknown) {
        showToast('error', toErrorMessage(err, `Tải lên "${file.name}" thất bại.`));
      } finally {
        setIsUploading(false);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSetPrimary = async (image: RecipeImageDto) => {
    if (image.isPrimary) return;
    try {
      await setPrimaryMutation.mutateAsync(image.id);
      showToast('success', 'Đã đặt làm ảnh đại diện chính!');
      onRefresh();
    } catch (err: unknown) {
      showToast('error', toErrorMessage(err, 'Không thể đặt ảnh chính.'));
    }
  };

  const handleDelete = async (image: RecipeImageDto) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi công thức?')) return;
    try {
      await deleteMutation.mutateAsync(image.id);
      showToast('success', 'Đã xóa ảnh thành công.');
      onRefresh();
    } catch (err: unknown) {
      showToast('error', toErrorMessage(err, 'Không thể xóa ảnh.'));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`flex items-center gap-2.5 p-4 rounded-2xl text-xs font-bold animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Upload Box (Kéo thả hoặc chọn file tải lên MinIO) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-base">Tải ảnh mới vào thư viện (FR-RCP-008)</h2>
          </div>
          <span className="text-[11px] text-gray-400">Tối đa 5MB / ảnh (JPG, PNG, WebP)</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Mô tả ảnh / Alt text (Hỗ trợ SEO & Khả năng truy cập):
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="VD: Cận cảnh bát phở bò nóng hổi thơm ngon..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Dropzone Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
            isUploading
              ? 'border-blue-300 bg-blue-50/40 pointer-events-none'
              : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-800">
              {isUploading ? 'Đang tải ảnh lên MinIO...' : 'Nhấn để chọn ảnh hoặc kéo thả ảnh vào đây'}
            </p>
            <p className="text-[11px] text-gray-400">
              Hệ thống tự động lưu trữ an toàn qua MinIO S3 Object Storage và tạo thumbnail.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Grid (Lưới hiển thị thư viện ảnh) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base">Thư viện ảnh đã tải lên ({images.length})</h2>
          </div>
          <span className="text-xs text-gray-400">
            Click &quot;Đặt làm ảnh chính&quot; để đổi ảnh bìa đại diện
          </span>
        </div>

        {images.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-xs font-bold text-gray-600">Chưa có ảnh nào trong thư viện</p>
            <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
              Công thức nấu ăn hấp dẫn hơn khi có nhiều hình ảnh đẹp mắt. Hãy tải lên ảnh nguyên liệu, quá trình nấu hoặc thành phẩm!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {images.map((img) => (
              <div
                key={img.id}
                className={`group relative rounded-2xl overflow-hidden border transition shadow-xs bg-gray-50 flex flex-col ${
                  img.isPrimary
                    ? 'border-amber-400 ring-2 ring-amber-300/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Image Container */}
                <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveMediaUrl(img.mediumUrl || img.originalUrl)}
                    alt={img.altText || 'Ảnh công thức'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      const fallback = resolveMediaUrl(img.originalUrl);
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />

                  {/* Primary Badge */}
                  {img.isPrimary && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-md tracking-wider">
                      <Star className="w-3 h-3 fill-white" />
                      <span>ẢNH ĐẠI DIỆN CHÍNH</span>
                    </div>
                  )}
                </div>

                {/* Card Footer / Actions */}
                <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-gray-100">
                  <span className="text-[11px] text-gray-500 truncate max-w-[140px]" title={img.altText || ''}>
                    {img.altText || 'Không có mô tả'}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img)}
                        disabled={setPrimaryMutation.isPending}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-amber-50 hover:text-amber-700 text-[11px] font-bold text-gray-700 transition"
                        title="Đặt làm ảnh đại diện"
                      >
                        <Star className="w-3 h-3 text-amber-500" />
                        <span>Đặt làm chính</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(imageToImageDto(img))}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Xóa ảnh khỏi công thức"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function imageToImageDto(img: RecipeImageDto): RecipeImageDto {
  return img;
}
