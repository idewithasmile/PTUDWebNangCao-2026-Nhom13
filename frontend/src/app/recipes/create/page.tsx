'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RecipeForm from '@/components/recipes/RecipeForm';
import { useCreateRecipe } from '@/features/recipes/hooks';
import { hasSession } from '@/features/auth/api';
import { toErrorMessage } from '@/features/auth/hooks';
import type { RecipeFormData } from '@/features/recipes/schemas';
import type { RecipeDifficulty } from '@/lib/types/recipe';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateRecipePage() {
  const router = useRouter();
  const isLoggedIn = hasSession();
  const [serverError, setServerError] = useState<string | null>(null);

  const createMutation = useCreateRecipe();

  // Kiểm tra quyền đăng nhập sau khi mount để tránh lỗi update component khi render
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  const handleSubmit = async (formData: RecipeFormData) => {
    setServerError(null);

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

    createMutation.mutate(payload, {
      onSuccess: (res) => {
        router.push(res.slug ? `/recipes/${res.slug}` : '/recipes');
      },
      onError: (err) => {
        setServerError(
          toErrorMessage(err, 'Tạo công thức thất bại. Vui lòng thử lại.')
        );
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-orange-600"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Quay lại danh sách công thức</span>
        </Link>
      </div>

      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Tạo Công thức Nấu ăn Mới
        </h1>
        <p className="text-sm text-gray-500">
          Chia sẻ bí quyết nấu ăn độc đáo của bạn tới cộng đồng yêu ẩm thực. Bài viết sẽ lưu ở trạng thái bản nháp.
        </p>
      </div>

      <RecipeForm
        isEdit={false}
        isSubmitting={createMutation.isPending}
        serverError={serverError}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
