'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useRecipeDetail,
  usePublishRecipe,
  useUnpublishRecipe,
  useArchiveRecipe,
  useDeleteRecipe,
  useUpdateRecipe,
} from '@/features/recipes/hooks';
import { toErrorMessage } from '@/features/auth/hooks';
import type { RecipeFormData } from '@/features/recipes/schemas';
import type { RecipeDifficulty } from '@/lib/types/recipe';
import { recipeService } from '@/lib/services/recipe-service';
import RecipeForm from '@/components/recipes/RecipeForm';
import type { DashboardTab } from '../DashboardSidebar';
import DashboardHeroBanner from '../common/DashboardHeroBanner';
import Toast, { ToastMessage } from '@/components/common/Toast';
import RecipeAuthorGuideModal from '@/components/recipes/RecipeAuthorGuideModal';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChefHat,
  ArrowLeft,
  Archive,
  BookOpen,
  Send,
  Eye,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface DashboardRecipeEditViewProps {
  slug: string;
  onSelectTab: (tab: DashboardTab) => void;
}

export default function DashboardRecipeEditView({
  slug,
  onSelectTab,
}: DashboardRecipeEditViewProps) {
  const router = useRouter();
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Lấy dữ liệu chi tiết công thức
  const { data: recipe, isLoading, isError, error, refetch } = useRecipeDetail(slug);

  const publishMutation = usePublishRecipe();
  const unpublishMutation = useUnpublishRecipe();
  const archiveMutation = useArchiveRecipe();
  const deleteMutation = useDeleteRecipe();
  const updateMutation = useUpdateRecipe(recipe?.id || '');

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p className="text-xs text-gray-500 font-medium">Đang tải dữ liệu công thức...</p>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-2xs text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-gray-900">Không tìm thấy công thức</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          {toErrorMessage(error, 'Công thức không tồn tại hoặc bạn không có quyền chỉnh sửa.')}
        </p>
        <button
          type="button"
          onClick={() => onSelectTab('recipes-mine')}
          className="px-4 py-2.5 rounded-2xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition"
        >
          Quay lại danh sách bài viết
        </button>
      </div>
    );
  }

  const statusNum = Number(recipe.status);
  const isPublished = recipe.status === 'Published' || statusNum === 1;
  const isDraft = recipe.status === 'Draft' || statusNum === 0;
  const isArchived = recipe.status === 'Archived' || statusNum === 2;

  // Header quick actions
  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(recipe.id);
      addToast('success', 'Xuất bản thành công', `Công thức "${recipe.title}" đã được hiển thị công khai.`);
      refetch();
    } catch (err: unknown) {
      addToast('error', 'Không thể xuất bản', toErrorMessage(err, 'Vui lòng kiểm tra lại điều kiện công thức.'));
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishMutation.mutateAsync(recipe.id);
      addToast('success', 'Đã gỡ xuất bản', `Công thức "${recipe.title}" đã chuyển về bản nháp.`);
      refetch();
    } catch (err: unknown) {
      addToast('error', 'Hủy xuất bản thất bại', toErrorMessage(err, 'Không thể hủy xuất bản công thức.'));
    }
  };

  const handleArchive = async () => {
    try {
      await archiveMutation.mutateAsync(recipe.id);
      addToast('success', 'Đã lưu trữ', `Công thức "${recipe.title}" đã chuyển vào kho lưu trữ.`);
      refetch();
    } catch (err: unknown) {
      addToast('error', 'Lưu trữ thất bại', toErrorMessage(err, 'Không thể lưu trữ công thức.'));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn công thức "${recipe.title}" không?`)) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(recipe.id);
      addToast('success', 'Đã xóa công thức', `Công thức "${recipe.title}" đã được xóa vĩnh viễn.`);
      setTimeout(() => {
        onSelectTab('recipes-mine');
      }, 800);
    } catch (err: unknown) {
      addToast('error', 'Xóa công thức thất bại', toErrorMessage(err, 'Không thể xóa công thức.'));
    }
  };

  const handleFormSubmit = async (
    formData: RecipeFormData,
    secondaryFiles: File[] = [],
    targetStatus: 'draft' | 'publish' | 'archive' = 'draft'
  ) => {
    if (!recipe) return;
    try {
      // 1. Cập nhật thông tin chính của công thức (FR-RCP-004)
      await updateMutation.mutateAsync({
        id: recipe.id,
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        prepTimeMinutes: Number(formData.prepTimeMinutes),
        cookTimeMinutes: Number(formData.cookTimeMinutes),
        servings: Number(formData.servings),
        difficulty: Number(formData.difficulty) as RecipeDifficulty,
        categoryId: formData.categoryId,
        calories: Number(formData.calories || 0),
        protein: Number(formData.protein || 0),
        carbs: Number(formData.carbs || 0),
        fat: Number(formData.fat || 0),
        rowVersionBase64: recipe.rowVersionBase64 || '',
      });

      // 2. Tải ảnh phụ lên MinIO nếu có
      if (secondaryFiles.length > 0) {
        for (const f of secondaryFiles) {
          try {
            await recipeService.uploadRecipeImage(recipe.id, f);
          } catch (e) {
            console.warn('Lỗi tải ảnh phụ:', e);
          }
        }
      }

      // 3. Đồng bộ hóa Danh sách Nguyên liệu (FR-RCP-009)
      if (formData.ingredients && formData.ingredients.length > 0) {
        const existingIngs = recipe.ingredients || [];
        // Xóa nguyên liệu không còn trong form
        for (const oldIng of existingIngs) {
          if (!formData.ingredients.some((newIng) => newIng.name.trim().toLowerCase() === oldIng.name.trim().toLowerCase())) {
            try {
              await recipeService.deleteIngredient(recipe.id, oldIng.id);
            } catch (e) {
              console.warn('Lỗi xóa nguyên liệu cũ:', e);
            }
          }
        }
        // Thêm hoặc cập nhật nguyên liệu
        for (const newIng of formData.ingredients) {
          if (!newIng.name?.trim()) continue;
          const matched = existingIngs.find(
            (oldIng) => oldIng.name.trim().toLowerCase() === newIng.name.trim().toLowerCase()
          );
          if (matched) {
            try {
              await recipeService.updateIngredient(recipe.id, matched.id, {
                name: newIng.name.trim(),
                quantity: newIng.quantity,
                unit: newIng.unit,
                notes: newIng.notes,
              });
            } catch (e) {
              console.warn('Lỗi cập nhật nguyên liệu:', e);
            }
          } else {
            try {
              await recipeService.addIngredient(recipe.id, {
                name: newIng.name.trim(),
                quantity: newIng.quantity,
                unit: newIng.unit,
                notes: newIng.notes,
              });
            } catch (e) {
              console.warn('Lỗi thêm nguyên liệu mới:', e);
            }
          }
        }
      }

      // 4. Đồng bộ hóa Các bước chế biến (FR-RCP-010)
      if (formData.steps && formData.steps.length > 0) {
        const existingSteps = recipe.steps || [];
        // Cập nhật hoặc thêm bước mới theo index
        for (let i = 0; i < formData.steps.length; i++) {
          const s = formData.steps[i];
          if (!s.description?.trim()) continue;
          if (i < existingSteps.length) {
            try {
              await recipeService.updateStep(recipe.id, existingSteps[i].id, {
                title: s.title || null,
                description: s.description,
                timerMinutes: s.timerMinutes || null,
                imageUrl: s.imageUrl || null,
              });
            } catch (e) {
              console.warn('Lỗi cập nhật bước chế biến:', e);
            }
          } else {
            try {
              await recipeService.addStep(recipe.id, {
                title: s.title || null,
                description: s.description,
                timerMinutes: s.timerMinutes || null,
                imageUrl: s.imageUrl || null,
              });
            } catch (e) {
              console.warn('Lỗi thêm bước chế biến mới:', e);
            }
          }
        }
        // Xóa các bước thừa nếu tác giả giảm bớt số bước
        if (existingSteps.length > formData.steps.length) {
          for (let i = formData.steps.length; i < existingSteps.length; i++) {
            try {
              await recipeService.deleteRecipeStep(recipe.id, existingSteps[i].id);
            } catch (e) {
              console.warn('Lỗi xóa bước thừa:', e);
            }
          }
        }
      }

      // 5. Xử lý chuyển đổi trạng thái nếu người dùng chọn Xuất bản, Lưu trữ hoặc Bản nháp
      if (targetStatus === 'publish' && !isPublished) {
        await publishMutation.mutateAsync(recipe.id);
      } else if (targetStatus === 'archive' && !isArchived) {
        await archiveMutation.mutateAsync(recipe.id);
      } else if (targetStatus === 'draft' && !isDraft) {
        await unpublishMutation.mutateAsync(recipe.id);
      }

      addToast('success', 'Lưu thành công', 'Công thức ẩm thực đã được cập nhật hoàn chỉnh!');
      refetch();
    } catch (err: unknown) {
      addToast('error', 'Cập nhật thất bại', toErrorMessage(err, 'Vui lòng kiểm tra lại dữ liệu.'));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>

      {/* HERO BANNER: Chỉnh sửa công thức theo phong cách ẩm thực */}
      <DashboardHeroBanner
        backgroundImage="/images/dashboard/banner-recipes.jpg"
        icon={<ChefHat className="w-7 h-7" />}
        title={`Chỉnh sửa: ${recipe.title}`}
        badge={
          <>
            {isPublished && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đã xuất bản</span>
              </span>
            )}
            {isDraft && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Bản nháp</span>
              </span>
            )}
            {isArchived && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-500/30 text-stone-300 border border-stone-500/40">
                <Archive className="w-3.5 h-3.5" />
                <span>Kho lưu trữ</span>
              </span>
            )}
            {recipe.categoryName && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                {recipe.categoryName}
              </span>
            )}
          </>
        }
        description={
          <span>
            Hoàn thiện công thức từng bước theo quy chuẩn chuyên nghiệp với Live Preview thời gian thực
          </span>
        }
        breadcrumbs={[
          { label: 'Trang chủ', onClick: () => onSelectTab('overview') },
          { label: 'Công thức của tôi', onClick: () => onSelectTab('recipes-mine') },
          { label: 'Chỉnh sửa công thức', active: true },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsGuideModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/25 transition active:scale-95 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-300" />
              <span className="hidden sm:inline">Sổ tay hướng dẫn</span>
            </button>

            {isPublished && (
              <a
                href={`/recipes/${recipe.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-xs font-bold text-white border border-emerald-500 transition active:scale-95 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem trên Web</span>
              </a>
            )}

            {isPublished && (
              <button
                type="button"
                onClick={handleUnpublish}
                disabled={unpublishMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/80 hover:bg-amber-500 text-xs font-bold text-white border border-amber-400 transition active:scale-95 shadow-xs"
                title="Chuyển về trạng thái bản nháp"
              >
                {unpublishMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>Gỡ xuất bản</span>
              </button>
            )}

            {isDraft && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-xs font-bold text-white shadow-sm transition active:scale-95"
              >
                {publishMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Xuất bản</span>
              </button>
            )}

            {!isArchived && (
              <button
                type="button"
                onClick={handleArchive}
                disabled={archiveMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-stone-200 border border-white/20 transition active:scale-95"
                title="Lưu trữ công thức"
              >
                <Archive className="w-3.5 h-3.5 text-stone-300" />
                <span className="hidden sm:inline">Lưu trữ</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-300 border border-red-500/40 transition active:scale-95"
              title="Xóa công thức"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xóa</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('recipes-mine')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 backdrop-blur-sm text-xs font-bold text-stone-200 border border-stone-700 transition active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>
          </div>
        }
      />

      {/* FORM SOẠN THẢO TỪNG BƯỚC ĐỒNG NHẤT CÓ LIVE PREVIEW THỜI GIAN THỰC */}
      <RecipeForm
        initialValues={{
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
          servings: recipe.servings,
          difficulty: typeof recipe.difficulty === 'number' ? recipe.difficulty : 1,
          categoryId: recipe.categoryId,
          calories: recipe.nutrition?.calories ?? 0,
          protein: recipe.nutrition?.protein ?? 0,
          carbs: recipe.nutrition?.carbohydrates ?? 0,
          fat: recipe.nutrition?.fat ?? 0,
          primaryImageUrl:
            recipe.images?.find((i) => i.isPrimary)?.originalUrl ||
            recipe.images?.[0]?.originalUrl ||
            '',
          ingredients: recipe.ingredients?.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit || '',
            notes: i.notes || '',
          })),
          steps: recipe.steps?.map((s) => ({
            title: s.title,
            description: s.description,
            timerMinutes: s.timerMinutes,
            imageUrl: s.imageUrl || '',
          })),
        }}
        isEdit={true}
        isSubmitting={
          updateMutation.isPending ||
          publishMutation.isPending ||
          archiveMutation.isPending
        }
        onSubmit={handleFormSubmit}
      />

      {/* Modal Sổ tay hướng dẫn */}
      <RecipeAuthorGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
