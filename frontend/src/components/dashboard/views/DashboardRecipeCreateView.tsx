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
import DashboardHeroBanner from '../common/DashboardHeroBanner';
import RecipeAuthorGuideModal from '@/components/recipes/RecipeAuthorGuideModal';
import { ArrowLeft, AlertCircle, CheckCircle2, Loader2, ChefHat, BookOpen } from 'lucide-react';

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
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const createMutation = useCreateRecipe();

  const handleSubmit = async (
    formData: RecipeFormData,
    secondaryFiles: File[] = [],
    targetStatus: 'draft' | 'publish' | 'archive' = 'draft'
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

      // 3. Xử lý xuất bản hoặc lưu nháp hoặc lưu trữ theo quyết định của tác giả
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

      if (targetStatus === 'archive' && newRecipe?.id) {
        setUploadProgress('Đang chuyển công thức vào kho lưu trữ (FR-RCP-007)...');
        try {
          await recipeService.archiveRecipe(newRecipe.id);
          setUploadProgress(null);
          setSuccessMessage('Công thức đã được tạo và chuyển vào kho lưu trữ thành công!');
          setTimeout(() => {
            onSelectTab('recipes-archived');
          }, 1200);
          return;
        } catch (archiveErr) {
          console.error('Lỗi khi lưu trữ ngay:', archiveErr);
          setUploadProgress(null);
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
      {/* 1. HERO BANNER: Thêm mới công thức sử dụng Reusable Component */}
      <DashboardHeroBanner
        backgroundImage="/images/dashboard/banner-recipes.jpg"
        icon={<ChefHat className="w-7 h-7" />}
        title="Thêm công thức mới"
        description="Chia sẻ công thức nấu ăn của bạn với cộng đồng Culinary Blog"
        breadcrumbs={[
          { label: 'Trang chủ', onClick: () => onSelectTab('overview') },
          { label: 'Công thức', onClick: () => onSelectTab('recipes') },
          { label: 'Thêm công thức', active: true },
        ]}
        actions={
          <>
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/25 transition active:scale-95 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-300" />
              <span>Sổ tay hướng dẫn</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('recipes')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 backdrop-blur-sm text-xs font-bold text-stone-200 border border-stone-700 transition active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>
          </>
        }
      />

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

      {/* 2. Form Nhập Liệu Bố Cục 2 Cột Cân Bằng (Xóa triệt để khoảng trắng bên phải) */}
      <div>
        <RecipeForm
          isEdit={false}
          isSubmitting={createMutation.isPending || Boolean(uploadProgress)}
          serverError={serverError}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Modal Sổ tay quy chuẩn biên soạn công thức ẩm thực */}
      <RecipeAuthorGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
