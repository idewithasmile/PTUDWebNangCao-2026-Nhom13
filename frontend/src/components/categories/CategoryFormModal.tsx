'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CategoryDto, CreateCategoryInput, UpdateCategoryInput } from '@/lib/types/category';
import { X, Loader2, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';

const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự.')
    .max(50, 'Tên danh mục tối đa 50 ký tự.')
    .refine((val) => !/<[^>]*>|javascript:|data:/i.test(val), {
      message: 'Tên danh mục không được chứa mã độc hoặc thẻ HTML.',
    }),
  description: z
    .string()
    .max(500, 'Mô tả tối đa 500 ký tự.')
    .optional()
    .or(z.literal('')),
  imageUrl: z
    .string()
    .url('Đường dẫn ảnh phải là một URL hợp lệ (ví dụ https://...).')
    .max(500, 'Đường dẫn ảnh tối đa 500 ký tự.')
    .optional()
    .or(z.literal('')),
  orderIndex: z.coerce
    .number()
    .min(0, 'Thứ tự hiển thị phải lớn hơn hoặc bằng 0.'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  categoryToEdit: CategoryDto | null;
  onClose: () => void;
  onSubmitCreate: (data: CreateCategoryInput) => Promise<void>;
  onSubmitUpdate: (id: string, data: UpdateCategoryInput) => Promise<void>;
}

export default function CategoryFormModal({
  isOpen,
  categoryToEdit,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: CategoryFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isEdit = !!categoryToEdit;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      orderIndex: 0,
    },
  });

  const previewImageUrl = watch('imageUrl');

  useEffect(() => {
    if (categoryToEdit) {
      reset({
        name: categoryToEdit.name,
        description: categoryToEdit.description || '',
        imageUrl: categoryToEdit.imageUrl || '',
        orderIndex: categoryToEdit.orderIndex,
      });
    } else {
      reset({
        name: '',
        description: '',
        imageUrl: '',
        orderIndex: 0,
      });
    }
    setServerError(null);
  }, [categoryToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      if (isEdit && categoryToEdit) {
        await onSubmitUpdate(categoryToEdit.id, {
          name: data.name,
          description: data.description || null,
          imageUrl: data.imageUrl || null,
          orderIndex: data.orderIndex,
          rowVersion: categoryToEdit.rowVersion || '',
        });
      } else {
        await onSubmitCreate({
          name: data.name,
          description: data.description || null,
          imageUrl: data.imageUrl || null,
          orderIndex: data.orderIndex,
        });
      }
      onClose();
    } catch (err: unknown) {
      const error = err as { detail?: string; title?: string; errors?: Record<string, string[]> };
      if (error?.errors) {
        const firstErrorKey = Object.keys(error.errors)[0];
        setServerError(error.errors[firstErrorKey][0]);
      } else {
        setServerError(error?.detail || error?.title || 'Đã có lỗi xảy ra. Vui lòng kiểm tra lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {isEdit ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
              </h3>
              <p className="text-xs text-gray-500">
                {isEdit ? 'Cập nhật thông tin danh mục ẩm thực' : 'Tạo danh mục mới cho các công thức'}
              </p>
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          {serverError && (
            <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Nếu đang Edit, hiển thị Slug read-only */}
          {isEdit && categoryToEdit && (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Đường dẫn tĩnh (Slug):</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-orange-700">
                  {categoryToEdit.slug}
                </span>
              </div>
              <p className="text-gray-500 italic">
                🔒 Slug được bảo toàn theo FR-CAT-004 để tránh broken links cho các bài viết.
              </p>
            </div>
          )}

          {/* Tên danh mục */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Tên danh mục <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Món nướng, Món chay, Tráng miệng..."
              {...register('name')}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Mô tả ngắn
            </label>
            <textarea
              rows={3}
              placeholder="Giới thiệu khái quát về các món ăn thuộc danh mục này..."
              {...register('description')}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>
            )}
          </div>

          {/* URL Ảnh & Preview */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Đường dẫn hình ảnh (URL)
            </label>
            <input
              type="url"
              placeholder="https://example.com/images/category.jpg"
              {...register('imageUrl')}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
                errors.imageUrl
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
              }`}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-xs text-rose-500">{errors.imageUrl.message}</p>
            )}

            {previewImageUrl && !errors.imageUrl && (
              <div className="mt-2 flex items-center gap-3 p-2 rounded-xl border border-gray-100 bg-gray-50">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <span className="text-xs text-gray-500 truncate">Ảnh xem trước hợp lệ</span>
              </div>
            )}
          </div>

          {/* Thứ tự hiển thị */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Thứ tự hiển thị (Order Index)
            </label>
            <input
              type="number"
              min={0}
              {...register('orderIndex')}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
                errors.orderIndex
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
              }`}
            />
            {errors.orderIndex && (
              <p className="mt-1 text-xs text-rose-500">{errors.orderIndex.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Số nhỏ hơn sẽ được ưu tiên hiển thị trước trên thanh điều hướng.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 transition disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEdit ? 'Lưu thay đổi' : 'Tạo danh mục'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
