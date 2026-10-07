'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RecipeForm from '@/components/recipes/RecipeForm';
import { useRecipeDetail, useUpdateRecipe } from '@/features/recipes/hooks';
import { useMe, toErrorMessage } from '@/features/auth/hooks';
import { hasSession } from '@/features/auth/api';
import type { RecipeFormData } from '@/features/recipes/schemas';
import type { RecipeDifficulty } from '@/lib/types/recipe';
import { ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';

interface EditRecipePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const router = useRouter();
  const isLoggedIn = hasSession();
  const me = useMe(isLoggedIn);
  const user = me.data;

  const [serverError, setServerError] = useState<string | null>(null);

  const { data: recipe, isLoading, isError, error } = useRecipeDetail(slug);
  const updateMutation = useUpdateRecipe(recipe?.id ?? '');

  // 1. Kiểm tra đăng nhập
  if (!isLoggedIn) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  // 2. Trạng thái Loading
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // 3. Trạng thái Lỗi hoặc không có bài viết
  if (isError || !recipe) {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700">
          <AlertCircle className="mb-2 h-10 w-10 text-red-500" />
          <h3 className="text-lg font-bold">Không thể tải thông tin công thức</h3>
          <p className="mt-1 text-sm text-red-600">
            {toErrorMessage(error, 'Công thức không tồn tại hoặc có lỗi kết nối.')}
          </p>
        </div>
      </div>
    );
  }

  // 4. Kiểm tra quyền tác giả sở hữu
  const isOwner = Boolean(
    user && (user.id === recipe.authorId || user.roles?.includes('Admin'))
  );

  if (!isOwner) {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 p-8 text-amber-800">
          <AlertCircle className="mb-2 h-10 w-10 text-amber-500" />
          <h3 className="text-lg font-bold">Không có quyền chỉnh sửa</h3>
          <p className="mt-1 text-sm text-amber-700">
            Bạn không phải là tác giả của công thức này nên không thể thực hiện chỉnh sửa.
          </p>
          <Link
            href={`/recipes/${recipe.slug}`}
            className="mt-4 rounded-xl bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800"
          >
            Quay lại trang chi tiết
          </Link>
        </div>
      </div>
    );
  }

  // 5. Submit Handler
  const handleSubmit = async (formData: RecipeFormData) => {
    setServerError(null);

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
    };

    updateMutation.mutate(payload, {
      onSuccess: (res) => {
        router.push(`/recipes/${res.slug || recipe.slug}`);
      },
      onError: (err) => {
        setServerError(
          toErrorMessage(
            err,
            'Cập nhật công thức thất bại. Kiểm tra xem dữ liệu có bị xung đột không.'
          )
        );
      },
    });
  };

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
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href={`/recipes/${recipe.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-orange-600"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Quay lại trang chi tiết bài viết</span>
        </Link>
      </div>

      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Chỉnh sửa Công thức Nấu ăn
        </h1>
        <p className="text-sm text-gray-500">
          Cập nhật thông tin công thức <span className="font-semibold text-gray-800">"{recipe.title}"</span>.
        </p>
      </div>

      <RecipeForm
        initialValues={initialValues}
        isEdit={true}
        isSubmitting={updateMutation.isPending}
        serverError={serverError}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
