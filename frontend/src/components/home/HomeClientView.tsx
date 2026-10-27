'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/lib/services/category-service';
import { useRecipes } from '@/features/recipes/hooks';
import HomeHeroBanner from './HomeHeroBanner';
import HomeCategorySection from './HomeCategorySection';
import HomeLatestRecipes from './HomeLatestRecipes';
import HomeRightSidebar from './HomeRightSidebar';
import HomeWhyChooseUs from './HomeWhyChooseUs';

export default function HomeClientView() {
  // 1. Tải danh mục thực tế từ REST API
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  // 2. Tải công thức mới nhất đã xuất bản (Status = Published) - lấy 5 món chuẩn bố cục 1 lớn + 4 nhỏ
  const recipesParams = useMemo(
    () => ({
      sortBy: 'newest' as const,
      status: 'Published' as const,
      page: 1,
      pageSize: 5,
    }),
    []
  );

  const {
    data: recipesData,
    isLoading: isRecipesLoading,
    isError: isRecipesError,
  } = useRecipes(recipesParams);

  const recipes = recipesData?.items ?? [];
  const totalCount = recipesData?.totalCount ?? 0;

  return (
    <div className="space-y-8 sm:space-y-12 py-2 pb-16">
      {/* 1. KHU VỰC HERO BANNER KÈM BÁT PHỞ VÀ Ô TÌM KIẾM ĐIỀU HƯỚNG TỚI /recipes */}
      <HomeHeroBanner />

      {/* 2. KHU VỰC DANH MỤC ẨM THỰC: 6 THẺ CHÍNH + HIỂN THỊ TẤT CẢ */}
      <HomeCategorySection
        categories={categories}
        isLoading={isCategoriesLoading}
        isError={isCategoriesError}
        onRetry={refetchCategories}
      />

      {/* 3. KHU VỰC CÔNG THỨC MỚI NHẤT: 1 THẺ LỚN (MÓN HOT) + LƯỚI 2x2 CHUẨN MOCKUP */}
      <HomeLatestRecipes
        recipes={recipes}
        isLoading={isRecipesLoading}
        isError={isRecipesError}
        totalCount={totalCount}
      />

      {/* 4. KHU VỰC CỘNG ĐỒNG & KHÁM PHÁ: XEM NHIỀU NHẤT + NGUYÊN LIỆU + BẢN TIN + MXH */}
      <HomeRightSidebar topRecipes={recipes} />

      {/* 5. KHU VỰC ĐẶC BIỆT: VÌ SAO NÊN CHỌN CULINARY BLOG? */}
      <HomeWhyChooseUs />
    </div>
  );
}
