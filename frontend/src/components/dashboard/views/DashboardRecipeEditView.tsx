'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  useRecipeDetail,
  usePublishRecipe,
  useUnpublishRecipe,
  useArchiveRecipe,
  useDeleteRecipe,
} from '@/features/recipes/hooks';
import { toErrorMessage } from '@/features/auth/hooks';
import type { DashboardTab } from '../DashboardSidebar';
import RecipeStudioHeader from '../studio/RecipeStudioHeader';
import StudioGeneralTab from '../studio/tabs/StudioGeneralTab';
import StudioGalleryTab from '../studio/tabs/StudioGalleryTab';
import StudioIngredientsTab from '../studio/tabs/StudioIngredientsTab';
import StudioStepsTab from '../studio/tabs/StudioStepsTab';
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
} from 'lucide-react';

interface DashboardRecipeEditViewProps {
  slug: string;
  onSelectTab: (tab: DashboardTab) => void;
}

type StudioActiveTab = 'general' | 'gallery' | 'ingredients' | 'steps';

export default function DashboardRecipeEditView({
  slug,
  onSelectTab,
}: DashboardRecipeEditViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studioTabParam = (searchParams.get('studioTab') as StudioActiveTab) || 'general';

  const [activeTab, setActiveTab] = useState<StudioActiveTab>(studioTabParam);
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
  ];

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

      {/* 1. Header Studio Bar (FR-RCP-005, 006, 007) */}
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
      />

      {/* 2. Studio Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-2xs">
        <Tabs
          tabs={studioTabs}
          activeTab={activeTab}
          onTabChange={(id) => handleTabChange(id as StudioActiveTab)}
          ariaLabel="Điều hướng Recipe Studio"
        />
      </div>

      {/* 3. Tab Contents */}
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
        <StudioStepsTab recipe={recipe} onRefresh={refetch} />
      )}
    </div>
  );
}
