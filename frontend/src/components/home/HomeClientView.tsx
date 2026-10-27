'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/lib/services/category-service';
import { useRecipes } from '@/features/recipes/hooks';
import type { RecipeDifficulty } from '@/lib/types/recipe';
import HomeHeroBanner from './HomeHeroBanner';
import HomeFeaturedSpotlight from './HomeFeaturedSpotlight';
import HomeCategorySidebar from './HomeCategorySidebar';
import HomeLatestRecipes from './HomeLatestRecipes';
import HomeCategoryShowcase from './HomeCategoryShowcase';
import HomeStatsAndCommunity from './HomeStatsAndCommunity';

export default function HomeClientView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | undefined>(undefined);
  const [maxTime, setMaxTime] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  // 1. Tải danh sách Danh mục từ REST API thật
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

  // 2. Tải danh sách Công thức đã xuất bản (Status = Published) từ API thật
  const recipesParams = useMemo(
    () => ({
      searchTerm: searchTerm.trim() || undefined,
      categoryId: selectedCategoryId,
      difficulty: selectedDifficulty ? (selectedDifficulty as RecipeDifficulty) : undefined,
      maxTotalTimeMinutes: maxTime,
      sortBy: 'newest' as const,
      status: 'Published' as const, // Nghiệp vụ bảo mật: Chỉ hiển thị bài đã xuất bản ra trang chủ
      page,
      pageSize: 9,
    }),
    [searchTerm, selectedCategoryId, selectedDifficulty, maxTime, page]
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

  // Chọn công thức tiêu biểu cho mục Spotlight (ưu tiên bài đầu tiên có ảnh đại diện)
  const featuredRecipe = useMemo(() => {
    if (searchTerm || selectedCategoryId || selectedDifficulty || maxTime) {
      return null; // Khi người dùng đang lọc/tìm kiếm, ẩn Spotlight để tập trung vào kết quả
    }
    return recipes.find((r) => Boolean(r.thumbnailUrl)) || recipes[0] || null;
  }, [recipes, searchTerm, selectedCategoryId, selectedDifficulty, maxTime]);

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
    setSelectedDifficulty(undefined);
    setMaxTime(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-2 pb-16">
      {/* 1. KHU VỰC HERO BANNER KÈM Ô TÌM KIẾM THỰC TẾ */}
      <HomeHeroBanner
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. CÔNG THỨC TIÊU BIỂU (SPOTLIGHT) */}
      {featuredRecipe && (
        <HomeFeaturedSpotlight recipe={featuredRecipe} />
      )}

      {/* 3. BỐ CỤC 2 CỘT CHÍNH: SIDEBAR DANH MỤC + CÔNG THỨC MỚI NHẤT */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Cột trái: Sidebar Danh mục (Desktop) & Thanh trượt ngang (Mobile) */}
        <HomeCategorySidebar
          categories={categories}
          isLoading={isCategoriesLoading}
          isError={isCategoriesError}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          onRetry={refetchCategories}
        />

        {/* Cột phải: Khối công thức mới nhất + Bộ lọc + Phân trang */}
        <div className="flex-1 min-w-0 w-full">
          <HomeLatestRecipes
            recipes={recipes}
            isLoading={isRecipesLoading}
            isError={isRecipesError}
            totalCount={totalCount}
            page={page}
            pageSize={9}
            totalPages={totalPages}
            selectedCategoryName={selectedCategory?.name}
            searchTerm={searchTerm}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={(diff) => {
              setSelectedDifficulty(diff);
              setPage(1);
            }}
            maxTime={maxTime}
            onSelectMaxTime={(time) => {
              setMaxTime(time);
              setPage(1);
            }}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 600, behavior: 'smooth' });
            }}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* 4. KHÁM PHÁ BỘ SƯU TẬP DANH MỤC TIÊU BIỂU */}
      <HomeCategoryShowcase
        categories={categories}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          setPage(1);
          window.scrollTo({ top: 600, behavior: 'smooth' });
        }}
      />

      {/* 5. KHU VỰC BỔ SUNG: CHỈ SỐ THỰC TẾ & KÊU GỌI ĐÓNG GÓP CÔNG THỨC */}
      <HomeStatsAndCommunity
        totalRecipes={totalCount}
        totalCategories={categories.length}
      />
    </div>
  );
}
