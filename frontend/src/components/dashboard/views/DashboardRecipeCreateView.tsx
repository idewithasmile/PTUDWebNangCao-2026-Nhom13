'use client';

import { useState } from 'react';
import RecipeForm from '@/components/recipes/RecipeForm';
import { useCreateRecipe } from '@/features/recipes/hooks';
import { toErrorMessage } from '@/features/auth/hooks';
import { recipeService } from '@/lib/services/recipe-service';
import type { RecipeFormData } from '@/features/recipes/schemas';
import type { RecipeDifficulty } from '@/lib/types/recipe';
import type { UserProfile } from '@/types/auth';
import type { DashboardTab } from '../DashboardSidebar';
import { ArrowLeft, ChefHat, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface DashboardRecipeCreateViewProps {
  user: UserProfile;
  onSelectTab: (tab: DashboardTab) => void;
}

export default function DashboardRecipeCreateView({
  user,
  onSelectTab,
}: DashboardRecipeCreateViewProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const createMutation = useCreateRecipe();

  const handleSubmit = async (
    formData: RecipeFormData,
    secondaryFiles: File[] = [],
    targetStatus: 'draft' | 'publish' = 'draft'
  ) => {
    setServerError(null);
    setSuccessMessage(null);
    setUploadProgress(null);

    const payload = {
      title: formData.title,
      description: formData.description,
      instructions: formData.instructions,
      prepTimeMinutes: formData.prepTimeMinutes,
      cookTimeMinutes: formData.cookTimeMinutes,
      servings: formData.servings,
      difficulty: formData.difficulty as RecipeDifficulty,
      categoryId: formData.categoryId,
      calories: formData.calories,
      protein: formData.protein,
      carbs: formData.carbs,
      fat: formData.fat,
      steps: formData.steps,
      ingredients: formData.ingredients,
      primaryImageUrl: formData.primaryImageUrl,
    };

    try {
      // 1. Tạo công thức với ảnh chính
      const newRecipe = await createMutation.mutateAsync(payload);

      // 2. Phương án 1: Tự động tải lên các ảnh phụ vào Thư viện ảnh (FR-RCP-008)
      if (secondaryFiles.length > 0 && newRecipe?.id) {
        setUploadProgress(
          `Đang tải lên ${secondaryFiles.length} hình ảnh phụ vào Thư viện ảnh công thức...`
        );
        for (let i = 0; i < secondaryFiles.length; i++) {
          const file = secondaryFiles[i];
          try {
            await recipeService.uploadRecipeImage(newRecipe.id, file);
          } catch (imgErr) {
            console.warn(`Lỗi khi tải ảnh phụ "${file.name}":`, imgErr);
          }
        }
      }

      setUploadProgress(null);

      // 3. Xử lý xuất bản hoặc lưu nháp theo quyết định của tác giả tại Bước 5
      if (targetStatus === 'publish' && newRecipe?.id) {
        setUploadProgress('Đang kích hoạt xuất bản bài viết công khai (FR-RCP-005)...');
        try {
          await recipeService.publishRecipe(newRecipe.id);
          setUploadProgress(null);
          setSuccessMessage(
            'Công thức đã được tạo và xuất bản công khai thành công! Đang chuyển đến bài viết...'
          );
          setTimeout(() => {
            window.location.href = `/recipes/${encodeURIComponent(newRecipe.slug)}`;
          }, 1200);
          return;
        } catch (publishErr) {
          console.error('Lỗi khi xuất bản ngay:', publishErr);
          setUploadProgress(null);
          setServerError(
            'Công thức đã được tạo dưới dạng bản nháp, nhưng chưa thể xuất bản ngay. Đang chuyển vào Recipe Studio...'
          );
          setTimeout(() => {
            window.location.href = `/dashboard?tab=recipes-edit&slug=${encodeURIComponent(newRecipe.slug)}`;
          }, 1500);
          return;
        }
      }

      setSuccessMessage('Công thức đã được lưu bản nháp thành công! Đang chuyển vào Recipe Studio...');

      setTimeout(() => {
        if (newRecipe?.slug) {
          window.location.href = `/dashboard?tab=recipes-edit&slug=${encodeURIComponent(newRecipe.slug)}`;
        } else {
          onSelectTab('recipes-mine');
        }
      }, 1200);
    } catch (err: unknown) {
      setUploadProgress(null);
      setServerError(
        toErrorMessage(err, 'Tạo công thức thất bại. Vui lòng kiểm tra lại các trường dữ liệu.')
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Bar: Breadcrumb + Nút quay lại */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <button
              type="button"
              onClick={() => onSelectTab('recipes')}
              className="hover:text-blue-600 transition"
            >
              Bảng điều khiển
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => onSelectTab('recipes')}
              className="hover:text-blue-600 transition"
            >
              Bài viết
            </button>
            <span>/</span>
            <span className="text-gray-700 font-semibold">Tạo công thức mới</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Đăng công thức ẩm thực mới
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bản nháp mới</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Quy trình 5 bước tạo công thức chuẩn: Thông tin & dinh dưỡng, hình ảnh, nguyên liệu, các bước làm và xem trước bài viết
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab('recipes')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về danh sách bài viết</span>
        </button>
      </div>

      {/* Thông báo Tiến trình tải ảnh phụ */}
      {uploadProgress && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center gap-3 text-xs font-semibold animate-fade-in">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
          <span>{uploadProgress}</span>
        </div>
      )}

      {/* Thông báo Thành công nếu có */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Thông báo Lỗi nếu có */}
      {serverError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs font-semibold animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* 2. Form Nhập Liệu Chi Tiết Với Tab Bar & Phương Án 1 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs">
        <RecipeForm
          isEdit={false}
          isSubmitting={createMutation.isPending || Boolean(uploadProgress)}
          serverError={serverError}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
