'use client';

import { useState } from 'react';
import { useCreateRecipe } from '@/features/recipes/hooks';
import { recipeService } from '@/lib/services/recipe-service';
import type { RecipeFormData } from '@/features/recipes/schemas';
import type { RecipeDifficulty } from '@/lib/types/recipe';
import RecipeForm from '@/components/recipes/RecipeForm';
import { toErrorMessage } from '@/features/auth/hooks';
import type { UserProfile } from '@/types/auth';
import type { DashboardTab } from '../DashboardSidebar';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

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

      // 3. Xử lý xuất bản hoặc lưu nháp theo quyết định của tác giả
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
      {/* 1. HERO BANNER: Thêm mới / Cập nhật công thức chuẩn mockup */}
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 border border-gray-800 shadow-md">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-700 hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
          <div className="space-y-3 max-w-2xl">
            {/* Breadcrumb điều hướng */}
            <div className="flex items-center gap-2 text-xs text-orange-200/80 font-medium">
              <button
                type="button"
                onClick={() => onSelectTab('recipes')}
                className="hover:text-white transition"
              >
                Quản lý công thức
              </button>
              <span>/</span>
              <span className="text-white font-semibold">Thêm công thức</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Thêm mới / Cập nhật công thức
              </h1>
              <p className="text-xs sm:text-sm text-gray-200 font-normal">
                Chia sẻ công thức nấu ăn của bạn với cộng đồng Culinary Blog
              </p>
            </div>
          </div>

          {/* Huy hiệu nghệ thuật: Nấu ngon Mỗi ngày + Nút quay về */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-orange-200 shadow-lg">
              <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="font-serif italic text-base font-semibold tracking-wide text-white">
                Nấu ngon Mỗi ngày
              </span>
              <span className="text-rose-400 text-xs">♥</span>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('recipes')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/20 transition active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về danh sách công thức</span>
            </button>
          </div>
        </div>
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

      {/* 2. Form Nhập Liệu Bố Cục 2 Cột & Lưới Ảnh Giải Pháp 1 */}
      <div>
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
