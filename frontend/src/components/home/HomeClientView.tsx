'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/lib/services/category-service';
import { useRecipes } from '@/features/recipes/hooks';
import HomeHeroBanner from './HomeHeroBanner';
import HomeCategorySection from './HomeCategorySection';
import HomeFeaturedSpotlight from './HomeFeaturedSpotlight';
import HomeLatestRecipes from './HomeLatestRecipes';
import HomeRightSidebar from './HomeRightSidebar';
import HomeWhyChooseUs from './HomeWhyChooseUs';

export default function HomeClientView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [page, setPage] = useState(1);

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

  // 2. Tải công thức đã xuất bản (Status = Published)
  const recipesParams = useMemo(
    () => ({
      searchTerm: searchTerm.trim() || undefined,
      categoryId: selectedCategoryId,
      sortBy: 'newest' as const,
      status: 'Published' as const,
      page,
      pageSize: 6, // 6 công thức theo lưới chuẩn
    }),
    [searchTerm, selectedCategoryId, page]
  );

  const {
    data: recipesData,
    isLoading: isRecipesLoading,
    isError: isRecipesError,
  } = useRecipes(recipesParams);

  const recipes = recipesData?.items ?? [];
  const totalCount = recipesData?.totalCount ?? 0;
  const totalPages = recipesData?.totalPages ?? 1;

  // Lấy tên danh mục đang chọn để hiển thị tiêu đề
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // Chọn công thức tiêu biểu có ảnh để đưa vào mục Spotlight
  const featuredRecipesList = useMemo(() => {
    const withThumb = recipes.filter((r) => Boolean(r.thumbnailUrl));
    return withThumb.length > 0 ? withThumb : recipes;
  }, [recipes]);

  const currentFeaturedRecipe = featuredRecipesList[featuredIndex % (featuredRecipesList.length || 1)] || null;

  const handleNextFeatured = () => {
    if (featuredRecipesList.length > 1) {
      setFeaturedIndex((prev) => (prev + 1) % featuredRecipesList.length);
    }
  };

  // Handlers
  const handleSearchSubmit = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleSelectCategory = (catId?: string) => {
    setSelectedCategoryId(catId);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategoryId(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-8 sm:space-y-10 py-2 pb-16">
      {/* 1. KHU VỰC HERO BANNER KÈM BÁT PHỞ VÀ Ô TÌM KIẾM SANG TRỌNG */}
      <HomeHeroBanner
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. KHU VỰC DANH MỤC TÁCH RIÊNG THÀNH 1 HÀNG HIỂN THỊ RỘNG RÃI */}
      <HomeCategorySection
        categories={categories}
        isLoading={isCategoriesLoading}
        isError={isCategoriesError}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
        onRetry={refetchCategories}
      />

      {/* 3. BỐ CỤC CHÍNH THÔNG THOÁNG: NỘI DUNG CÔNG THỨC (TRÁI) & SIDEBAR PHỤ (PHẢI) */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* CỘT CHÍNH (TRÁI): Tiêu điểm món nổi bật + Lưới 6 công thức mới nhất */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Spotlight Banner: Món ngon tiêu biểu */}
          {currentFeaturedRecipe && !searchTerm && !selectedCategoryId && (
            <HomeFeaturedSpotlight
              recipe={currentFeaturedRecipe}
              onNext={featuredRecipesList.length > 1 ? handleNextFeatured : undefined}
            />
          )}

          {/* Lưới 6 Công thức mới nhất (2 x 3) */}
          <HomeLatestRecipes
            recipes={recipes}
            isLoading={isRecipesLoading}
            isError={isRecipesError}
            totalCount={totalCount}
            page={page}
            pageSize={6}
            totalPages={totalPages}
            selectedCategoryName={selectedCategory?.name}
            searchTerm={searchTerm}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 500, behavior: 'smooth' });
            }}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* CỘT PHỤ (PHẢI): Top 5 xem nhiều + Promo Nguyên liệu tươi ngon + Nhận bản tin + MXH + Trích dẫn */}
        <HomeRightSidebar topRecipes={recipes} />
      </div>

      {/* 4. KHU VỰC ĐẶC BIỆT: VÌ SAO NÊN CHỌN CULINARY BLOG? */}
      <HomeWhyChooseUs />
    </div>
  );
}
