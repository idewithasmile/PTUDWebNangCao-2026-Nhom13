'use client';

import { useState } from 'react';
import RecipeForm from '@/components/recipes/RecipeForm';
import {
  useRecipeDetail,
  useUpdateRecipe,
  usePublishRecipe,
  useUnpublishRecipe,
  useArchiveRecipe,
  useDeleteRecipe,
} from '@/features/recipes/hooks';
import { toErrorMessage } from '@/features/auth/hooks';
import type { RecipeFormData } from '@/features/recipes/schemas';
import type { RecipeDifficulty } from '@/lib/types/recipe';
import type { DashboardTab } from '../DashboardSidebar';
import {
  ArrowLeft,
  ChefHat,
  AlertCircle,
  CheckCircle2,
  Globe,
  EyeOff,
  Archive,
  Trash2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface DashboardRecipeEditViewProps {
  slug: string;
  onSelectTab: (tab: DashboardTab) => void;
}

export default function DashboardRecipeEditView({
  slug,
  onSelectTab,
}: DashboardRecipeEditViewProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { data: recipe, isLoading, isError, error, refetch } = useRecipeDetail(slug);
  const updateMutation = useUpdateRecipe(recipe?.id ?? '');
  const publishMutation = usePublishRecipe();
  const unpublishMutation = useUnpublishRecipe();
  const archiveMutation = useArchiveRecipe();
  const deleteMutation = useDeleteRecipe();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-gray-100 p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs text-gray-500 font-medium">Đang tải thông tin bài viết để chỉnh sửa...</p>
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
          Quay lại danh sách bài viết của tôi
        </button>
      </div>
    );
  }

  const primaryImage =
    recipe.images?.find((img) => img.isPrimary)?.originalUrl ||
    recipe.images?.[0]?.originalUrl;

  const initialValues: Partial<RecipeFormData> = {
    title: recipe.title,
    description: recipe.description,
    instructions: recipe.instructions,
    categoryId: recipe.categoryId,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    calories: recipe.nutrition?.calories ?? 0,
    protein: recipe.nutrition?.protein ?? 0,
    carbs: recipe.nutrition?.carbohydrates ?? 0,
    fat: recipe.nutrition?.fat ?? 0,
    primaryImageUrl: primaryImage ?? '',
    steps: recipe.steps?.map((s) => ({
      title: s.title,
      description: s.description,
      timerMinutes: s.timerMinutes,
      imageUrl: s.imageUrl,
    })),
    ingredients: recipe.ingredients?.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
      notes: i.notes,
    })),
  };

  const handleSubmit = async (formData: RecipeFormData) => {
    setServerError(null);
    setSuccessMessage(null);

    const payload = {
      id: recipe.id,
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
      rowVersionBase64: recipe.rowVersionBase64 || '',
      steps: formData.steps,
      ingredients: formData.ingredients,
      primaryImageUrl: formData.primaryImageUrl,
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMessage('Cập nhật công thức thành công!');
        refetch();
        setTimeout(() => {
          onSelectTab('recipes-mine');
        }, 1200);
      },
      onError: (err) => {
        setServerError(
          toErrorMessage(
            err,
            'Cập nhật công thức thất bại. Vui lòng kiểm tra lại các trường thông tin.'
          )
        );
      },
    });
  };

  const handlePublish = () => {
    setServerError(null);
    publishMutation.mutate(recipe.id, {
      onSuccess: () => {
        setSuccessMessage('Đã xuất bản bài viết thành công!');
        refetch();
      },
      onError: (err) => setServerError(toErrorMessage(err, 'Không thể xuất bản công thức.')),
    });
  };

  const handleUnpublish = () => {
    setServerError(null);
    unpublishMutation.mutate(recipe.id, {
      onSuccess: () => {
        setSuccessMessage('Đã hủy xuất bản bài viết.');
        refetch();
      },
      onError: (err) => setServerError(toErrorMessage(err, 'Không thể hủy xuất bản.')),
    });
  };

  const handleArchive = () => {
    setServerError(null);
    archiveMutation.mutate(recipe.id, {
      onSuccess: () => {
        setSuccessMessage('Đã chuyển bài viết vào kho lưu trữ.');
        refetch();
      },
      onError: (err) => setServerError(toErrorMessage(err, 'Không thể lưu trữ.')),
    });
  };

  const handleDelete = () => {
    setServerError(null);
    deleteMutation.mutate(recipe.id, {
      onSuccess: () => {
        setIsConfirmingDelete(false);
        onSelectTab('recipes-mine');
      },
      onError: (err) => {
        setServerError(toErrorMessage(err, 'Không thể xóa công thức.'));
        setIsConfirmingDelete(false);
      },
    });
  };

  const isActionPending =
    publishMutation.isPending ||
    unpublishMutation.isPending ||
    archiveMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Bar: Breadcrumb + Quản lý trạng thái + Nút quay lại */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <button
              type="button"
              onClick={() => onSelectTab('recipes-mine')}
              className="hover:text-blue-600 transition"
            >
              Bài viết của tôi
            </button>
            <span>/</span>
            <span className="text-gray-700 font-semibold truncate max-w-xs sm:max-w-md">
              Chỉnh sửa: {recipe.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  Chỉnh sửa công thức nấu ăn
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    recipe.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : recipe.status === 'Draft'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {recipe.status === 'Published'
                    ? 'Đã xuất bản'
                    : recipe.status === 'Draft'
                    ? 'Bản nháp'
                    : 'Đã lưu trữ'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Cập nhật thông tin chi tiết, nguyên liệu, hình ảnh và trạng thái bài viết
              </p>
            </div>
          </div>
        </div>

        {/* Thanh công cụ quản lý trạng thái ngay trong Dashboard */}
        <div className="flex flex-wrap items-center gap-2">
          {recipe.status === 'Published' ? (
            <button
              type="button"
              onClick={handleUnpublish}
              disabled={isActionPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition disabled:opacity-50"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Gỡ xuất bản</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isActionPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Xuất bản ngay</span>
            </button>
          )}

          {recipe.status !== 'Archived' && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={isActionPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition disabled:opacity-50"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Lưu trữ</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            disabled={isActionPending}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa bài</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('recipes-mine')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      {/* Thông báo Thành công / Thất bại */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {serverError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3 text-xs font-semibold animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* 2. Form Chỉnh Sửa */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs">
        <RecipeForm
          initialValues={initialValues}
          isEdit={true}
          isSubmitting={updateMutation.isPending}
          serverError={serverError}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Modal Xác nhận xóa */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-red-600">
              <div className="rounded-2xl bg-red-100 p-2.5">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Xác nhận xóa công thức</h4>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa bài viết <span className="font-semibold text-gray-900">&quot;{recipe.title}&quot;</span>? Bài viết sẽ được chuyển vào thùng rác hệ thống.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
