'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/lib/services/category-service';
import { useUpdateRecipe } from '@/features/recipes/hooks';
import { toErrorMessage } from '@/features/auth/hooks';
import type { RecipeDetailDto, RecipeDifficulty } from '@/lib/types/recipe';
import {
  Save,
  Clock,
  Users,
  Flame,
  ChefHat,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface StudioGeneralTabProps {
  recipe: RecipeDetailDto;
  onRefresh: () => void;
}

interface GeneralFormInputs {
  title: string;
  description: string;
  instructions: string;
  categoryId: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function StudioGeneralTab({ recipe, onRefresh }: StudioGeneralTabProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConflict, setIsConflict] = useState(false);

  // Danh mục cho select dropdown
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 60 * 60 * 1000,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<GeneralFormInputs>({
    defaultValues: {
      title: recipe.title || '',
      description: recipe.description || '',
      instructions: recipe.instructions || '',
      categoryId: recipe.categoryId || '',
      prepTimeMinutes: recipe.prepTimeMinutes || 15,
      cookTimeMinutes: recipe.cookTimeMinutes || 30,
      servings: recipe.servings || 4,
      difficulty: typeof recipe.difficulty === 'number' ? recipe.difficulty : 1,
      calories: recipe.nutrition?.calories ?? 0,
      protein: recipe.nutrition?.protein ?? 0,
      carbs: recipe.nutrition?.carbohydrates ?? 0,
      fat: recipe.nutrition?.fat ?? 0,
    },
  });

  const updateMutation = useUpdateRecipe(recipe.id);

  const onSubmit = async (data: GeneralFormInputs) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsConflict(false);

    try {
      await updateMutation.mutateAsync({
        id: recipe.id,
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        prepTimeMinutes: Number(data.prepTimeMinutes),
        cookTimeMinutes: Number(data.cookTimeMinutes),
        servings: Number(data.servings),
        difficulty: Number(data.difficulty) as RecipeDifficulty,
        categoryId: data.categoryId,
        calories: Number(data.calories),
        protein: Number(data.protein),
        carbs: Number(data.carbs),
        fat: Number(data.fat),
        rowVersionBase64: recipe.rowVersionBase64 || '',
      });

      setSuccessMessage('Đã lưu thông tin chung thành công!');
      onRefresh();
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: unknown) {
      const msg = toErrorMessage(err, 'Lưu thông tin thất bại. Vui lòng thử lại.');
      if (msg.includes('409') || msg.toLowerCase().includes('conflict') || msg.toLowerCase().includes('thay đổi bởi')) {
        setIsConflict(true);
        setErrorMessage('Dữ liệu công thức đã bị thay đổi bởi phiên làm việc khác (Concurrency Conflict).');
      } else {
        setErrorMessage(msg);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
      {/* Alert Messages */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 animate-fade-in">
          <div className="flex items-center gap-2.5 font-bold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {isConflict && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tải lại dữ liệu mới nhất</span>
            </button>
          )}
        </div>
      )}

      {/* Block 1: Thông tin cơ bản */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-900 font-bold">
          <ChefHat className="w-5 h-5 text-blue-600" />
          <h2 className="text-base">1. Thông tin cốt lõi & Giới thiệu</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tiêu đề công thức <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('title', { required: 'Tiêu đề không được để trống' })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              placeholder="VD: Phở Bò Tái Lăn Hà Nội Chuẩn Vị"
            />
            {errors.title && (
              <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Danh mục món ăn <span className="text-red-500">*</span>
              </label>
              <select
                {...register('categoryId', { required: 'Vui lòng chọn danh mục' })}
                disabled={isLoadingCategories}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium bg-white"
              >
                <option value="">-- Chọn danh mục món ăn --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.categoryId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Độ khó thực hiện
              </label>
              <select
                {...register('difficulty')}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium bg-white"
              >
                <option value="0">Dễ (Cho người mới bắt đầu)</option>
                <option value="1">Trung bình (Phổ biến)</option>
                <option value="2">Khó / Cầu kỳ (Nhiều kỹ thuật)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Mô tả ngắn gọn & Cảm hứng món ăn
            </label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              placeholder="Chia sẻ đôi điều về nguồn gốc, hương vị đặc trưng hoặc mẹo nhỏ của món ăn..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Ghi chú / Lời khuyên khi thưởng thức
            </label>
            <textarea
              rows={2}
              {...register('instructions')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              placeholder="Cách dọn kèm rau thơm, nước chấm hoặc bảo quản..."
            />
          </div>
        </div>
      </div>

      {/* Block 2: Thời gian & Khẩu phần */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-900 font-bold">
          <Clock className="w-5 h-5 text-amber-500" />
          <h2 className="text-base">2. Thời gian & Khẩu phần</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Chuẩn bị (phút) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register('prepTimeMinutes', { required: true, min: 1 })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nấu nướng (phút) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register('cookTimeMinutes', { required: true, min: 1 })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Khẩu phần (người) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register('servings', { required: true, min: 1 })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Block 3: Giá trị dinh dưỡng */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-900 font-bold">
          <Flame className="w-5 h-5 text-rose-500" />
          <h2 className="text-base">3. Giá trị dinh dưỡng ước tính (Mỗi khẩu phần)</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Calories (kcal)</label>
            <input
              type="number"
              step="any"
              min={0}
              {...register('calories')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Protein (g)</label>
            <input
              type="number"
              step="any"
              min={0}
              {...register('protein')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Carbs (g)</label>
            <input
              type="number"
              step="any"
              min={0}
              {...register('carbs')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Fat (g)</label>
            <input
              type="number"
              step="any"
              min={0}
              {...register('fat')}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition active:scale-95 disabled:opacity-50"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Lưu thông tin chung</span>
        </button>
      </div>
    </form>
  );
}
