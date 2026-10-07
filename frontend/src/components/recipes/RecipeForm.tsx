'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { recipeFormSchema, type RecipeFormData } from '@/features/recipes/schemas';
import { categoryService } from '@/lib/services/category-service';
import type { CategoryDto } from '@/lib/types/category';
import { Loader2, AlertCircle, Save, ArrowLeft, Utensils, Clock, Users, Flame } from 'lucide-react';

interface RecipeFormProps {
  initialValues?: Partial<RecipeFormData>;
  isEdit?: boolean;
  isSubmitting: boolean;
  serverError?: string | null;
  onSubmit: (data: RecipeFormData) => Promise<void>;
}

export default function RecipeForm({
  initialValues,
  isEdit = false,
  isSubmitting,
  serverError,
  onSubmit,
}: RecipeFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      instructions: initialValues?.instructions ?? '',
      categoryId: initialValues?.categoryId ?? '',
      prepTimeMinutes: initialValues?.prepTimeMinutes ?? 15,
      cookTimeMinutes: initialValues?.cookTimeMinutes ?? 30,
      servings: initialValues?.servings ?? 4,
      difficulty: initialValues?.difficulty ?? 2,
      calories: initialValues?.calories ?? 0,
      protein: initialValues?.protein ?? 0,
      carbs: initialValues?.carbs ?? 0,
      fat: initialValues?.fat ?? 0,
    },
  });

  // Fetch danh sách danh mục để điền vào dropdown
  useEffect(() => {
    let isMounted = true;
    categoryService
      .getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(data);
          setIsLoadingCategories(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingCategories(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Thông báo lỗi server (nếu có) */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-red-900">Không thể {isEdit ? 'cập nhật' : 'tạo'} công thức</h4>
            <p className="mt-0.5 leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* Khối 1: Thông tin cơ bản */}
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
          <Utensils className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">Thông tin cơ bản</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Tiêu đề công thức */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Tiêu đề công thức <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              disabled={isSubmitting}
              placeholder="Ví dụ: Phở Bò Tái Nạm Hà Nội Truyền Thống"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            />
            {errors.title && (
              <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Chọn Danh mục */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Danh mục món ăn <span className="text-red-500">*</span>
            </label>
            <select
              {...register('categoryId')}
              disabled={isSubmitting || isLoadingCategories}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-500 font-medium">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Chọn Độ khó */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Mức độ khó <span className="text-red-500">*</span>
            </label>
            <select
              {...register('difficulty')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            >
              <option value="1">🟢 Dễ (Cho người mới bắt đầu)</option>
              <option value="2">🟡 Trung bình (Yêu cầu kỹ năng cơ bản)</option>
              <option value="3">🟠 Khó (Nhiều công đoạn)</option>
              <option value="4">🔴 Chuyên gia (Kỹ thuật phức tạp)</option>
            </select>
            {errors.difficulty && (
              <p className="text-xs text-red-500 font-medium">{errors.difficulty.message}</p>
            )}
          </div>

          {/* Mô tả ngắn */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Mô tả ngắn <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              {...register('description')}
              disabled={isSubmitting}
              placeholder="Giới thiệu hương vị, nguồn gốc hoặc điểm đặc sắc của món ăn này..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Khối 2: Thời gian & Khẩu phần */}
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
          <Clock className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">Thời gian & Khẩu phần</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Thời gian chuẩn bị */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Thời gian chuẩn bị (phút) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register('prepTimeMinutes')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            />
            {errors.prepTimeMinutes && (
              <p className="text-xs text-red-500 font-medium">{errors.prepTimeMinutes.message}</p>
            )}
          </div>

          {/* Thời gian nấu */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Thời gian nấu (phút) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register('cookTimeMinutes')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            />
            {errors.cookTimeMinutes && (
              <p className="text-xs text-red-500 font-medium">{errors.cookTimeMinutes.message}</p>
            )}
          </div>

          {/* Số khẩu phần */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Số khẩu phần (người) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register('servings')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            />
            {errors.servings && (
              <p className="text-xs text-red-500 font-medium">{errors.servings.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Khối 3: Hướng dẫn chung */}
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
          <Utensils className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">Hướng dẫn chung & Lưu ý</h3>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Nội dung hướng dẫn chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            {...register('instructions')}
            disabled={isSubmitting}
            placeholder="Ghi chú tổng quan về các quy trình nấu, lưu ý nhiệt độ hoặc mẹo nhỏ giúp món ăn ngon hơn..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
          />
          {errors.instructions && (
            <p className="text-xs text-red-500 font-medium">{errors.instructions.message}</p>
          )}
        </div>
      </div>

      {/* Khối 4: Thông tin Dinh dưỡng (Không bắt buộc) */}
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
          <Flame className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">Thông tin Dinh dưỡng (mỗi khẩu phần)</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Năng lượng (Kcal)</label>
            <input
              type="number"
              step="0.1"
              min={0}
              {...register('calories')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Đạm - Protein (g)</label>
            <input
              type="number"
              step="0.1"
              min={0}
              {...register('protein')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Tinh bột - Carbs (g)</label>
            <input
              type="number"
              step="0.1"
              min={0}
              {...register('carbs')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Chất béo - Fat (g)</label>
            <input
              type="number"
              step="0.1"
              min={0}
              {...register('fat')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Thanh điều hướng Nút bấm */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Hủy bỏ</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-orange-700 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{isEdit ? 'Cập nhật công thức' : 'Tạo mới bản nháp'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
