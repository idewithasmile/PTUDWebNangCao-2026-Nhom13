'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import RecipeStudioHeader from '../studio/RecipeStudioHeader';
import StudioGeneralTab from '../studio/tabs/StudioGeneralTab';
import StudioGalleryTab from '../studio/tabs/StudioGalleryTab';
import StudioIngredientsTab from '../studio/tabs/StudioIngredientsTab';
import StudioStepsTab from '../studio/tabs/StudioStepsTab';
import StudioPreviewTab from '../studio/tabs/StudioPreviewTab';
import Toast, { ToastMessage } from '@/components/common/Toast';
import { Tabs, type TabItem } from '@/components/ui/tabs';
import {
  FileText,
  Image as ImageIcon,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Eye,
  ChefHat,
  ArrowLeft,
  Archive,
} from 'lucide-react';

interface DashboardRecipeEditViewProps {
  slug: string;
  onSelectTab: (tab: DashboardTab) => void;
}

type StudioActiveTab = 'general' | 'gallery' | 'ingredients' | 'steps' | 'preview';

export default function DashboardRecipeEditView({
  slug,
  onSelectTab,
}: DashboardRecipeEditViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studioTabParam = (searchParams.get('studioTab') as StudioActiveTab) || 'general';
  const modeParam = searchParams.get('mode');

  const [activeTab, setActiveTab] = useState<StudioActiveTab>(studioTabParam);
  const [viewStyle, setViewStyle] = useState<'studio' | 'form'>(
    modeParam === 'studio' ? 'studio' : 'form'
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Lấy dữ liệu bài viết
  const { data: recipe, isLoading, isError, error, refetch } = useRecipeDetail(slug);

  const publishMutation = usePublishRecipe();
  const unpublishMutation = useUnpublishRecipe();
  const archiveMutation = useArchiveRecipe();
  const deleteMutation = useDeleteRecipe();
  const updateMutation = useUpdateRecipe(recipe?.id || '');

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs text-gray-500 font-medium">Đang tải Recipe Studio...</p>
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

  // Chuyển đổi tab Studio
  const handleTabChange = (tab: StudioActiveTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('studioTab', tab);
    router.replace(`/dashboard?${params.toString()}`, { scroll: false });
  };

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

      // Tải ảnh phụ nếu có
      if (secondaryFiles.length > 0) {
        for (const f of secondaryFiles) {
          try {
            await recipeService.uploadRecipeImage(recipe.id, f);
          } catch (e) {
            console.warn('Lỗi tải ảnh phụ:', e);
          }
        }
      }

      // Xử lý chuyển đổi trạng thái nếu người dùng bấm Xuất bản hoặc Lưu trữ
      const statusNum = Number(recipe.status);
      if (targetStatus === 'publish' && recipe.status !== 'Published' && statusNum !== 1) {
        await publishMutation.mutateAsync(recipe.id);
      } else if (targetStatus === 'archive' && recipe.status !== 'Archived' && statusNum !== 2) {
        await archiveMutation.mutateAsync(recipe.id);
      } else if (targetStatus === 'draft' && recipe.status !== 'Draft' && statusNum !== 0) {
        await unpublishMutation.mutateAsync(recipe.id);
      }

      addToast('success', 'Lưu thành công', 'Công thức đã được cập nhật thành công!');
      refetch();
    } catch (err: unknown) {
      addToast('error', 'Cập nhật thất bại', toErrorMessage(err, 'Vui lòng kiểm tra lại dữ liệu.'));
    }
  };

  const imagesCount = recipe.images?.length ?? 0;
  const ingredientsCount = recipe.ingredients?.length ?? 0;
  const stepsCount = recipe.steps?.length ?? 0;

  const studioTabs: TabItem[] = [
    {
      id: 'general',
      label: 'Thông tin & Dinh dưỡng',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'gallery',
      label: 'Thư viện hình ảnh',
      icon: <ImageIcon className="w-4 h-4" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
          {imagesCount}
        </span>
      ),
    },
    {
      id: 'ingredients',
      label: 'Nguyên liệu',
      icon: <Utensils className="w-4 h-4" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
          {ingredientsCount}
        </span>
      ),
    },
    {
      id: 'steps',
      label: 'Các bước thực hiện',
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
          {stepsCount}
        </span>
      ),
    },
    {
      id: 'preview',
      label: 'Xem trước & Tổng quan',
      icon: <Eye className="w-4 h-4" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
          Live
        </span>
      ),
    },
  ];

  const statusNum = Number(recipe.status);
  const isPublished = recipe.status === 'Published' || statusNum === 1;
  const isDraft = recipe.status === 'Draft' || statusNum === 0;
  const isArchived = recipe.status === 'Archived' || statusNum === 2;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>

      {/* Điều hướng Chế độ xem: Soạn thảo đồng nhất (Form) HOẶC Studio 5 Tab */}
      {viewStyle === 'form' ? (
        <div className="space-y-6 animate-fade-in">
          {/* HERO BANNER: Chỉnh sửa công thức đồng nhất 100% với trang Tạo mới */}
          <div className="relative overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50 scale-105 transition-transform duration-700 hover:scale-100"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/60 to-stone-900/20" />

            <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
              <div className="space-y-3 max-w-2xl">
                {/* Breadcrumb điều hướng */}
                <div className="flex items-center gap-2 text-xs text-orange-200/80 font-medium">
                  <button
                    type="button"
                    onClick={() => onSelectTab('overview')}
                    className="hover:text-white transition"
                  >
                    Trang chủ
                  </button>
                  <span>&gt;</span>
                  <button
                    type="button"
                    onClick={() => onSelectTab('recipes-mine')}
                    className="hover:text-white transition"
                  >
                    Công thức của tôi
                  </button>
                  <span>&gt;</span>
                  <span className="text-white font-semibold">Chỉnh sửa</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shrink-0">
                    <ChefHat className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                        Chỉnh sửa công thức
                      </h1>
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
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 font-normal line-clamp-1">
                      Cập nhật thông tin chi tiết và nguyên liệu cho bài viết &quot;{recipe.title}&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Cụm nút hành động Banner */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => alert('Hướng dẫn cập nhật: Bạn có thể sửa đổi tên món, danh mục, nguyên liệu, các bước làm hoặc ảnh. Bấm "Lưu nháp" hoặc "Đăng bài" bên dưới để hoàn tất.')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/25 transition active:scale-95 shadow-xs"
                >
                  <span>▷</span>
                  <span>Xem hướng dẫn</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewStyle('studio')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-bold text-white shadow-sm transition active:scale-95"
                  title="Chuyển sang chế độ biên tập Recipe Studio (5 Tab)"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mở Recipe Studio</span>
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
            </div>
          </div>
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
              })),
            }}
            isEdit={true}
            isSubmitting={updateMutation.isPending || publishMutation.isPending || archiveMutation.isPending}
            onSubmit={handleFormSubmit}
            onSwitchToStudio={() => setViewStyle('studio')}
          />
        </div>
      ) : (
        <>
          {/* Header Studio Bar (FR-RCP-005, 006, 007) */}
          <RecipeStudioHeader
            recipe={recipe}
            onSelectTab={onSelectTab}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
            onArchive={handleArchive}
            onDelete={handleDelete}
            isPublishing={publishMutation.isPending}
            isUnpublishing={unpublishMutation.isPending}
            isArchiving={archiveMutation.isPending}
            isDeleting={deleteMutation.isPending}
            viewStyle={viewStyle}
            onToggleViewStyle={() => setViewStyle('form')}
          />

          {/* Studio Tabs Navigation */}
          <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-2xs">
            <Tabs
              tabs={studioTabs}
              activeTab={activeTab}
              onTabChange={(id) => handleTabChange(id as StudioActiveTab)}
              ariaLabel="Điều hướng Recipe Studio"
            />
          </div>

          {/* Tab Contents */}
          {activeTab === 'general' && (
            <StudioGeneralTab recipe={recipe} onRefresh={refetch} />
          )}

          {activeTab === 'gallery' && (
            <StudioGalleryTab recipe={recipe} onRefresh={refetch} />
          )}

          {activeTab === 'ingredients' && (
            <StudioIngredientsTab recipe={recipe} onRefresh={refetch} />
          )}

          {activeTab === 'steps' && (
            <StudioStepsTab
              recipe={recipe}
              onRefresh={refetch}
              onSwitchTab={(tab) => handleTabChange(tab)}
            />
          )}

          {activeTab === 'preview' && (
            <StudioPreviewTab
              recipe={recipe}
              onRefresh={refetch}
              onSwitchTab={(tab) => handleTabChange(tab)}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onArchive={handleArchive}
              isPublishing={publishMutation.isPending}
              isUnpublishing={unpublishMutation.isPending}
              isArchiving={archiveMutation.isPending}
            />
          )}
        </>
      )}
    </div>
  );
}
