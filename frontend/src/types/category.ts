import { PagedResult } from './common';
import { RecipeSummaryDto } from './recipe';

/**
 * Kiểu dữ liệu Danh mục món ăn (FR-CAT)
 */
export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  orderIndex: number;
  recipeCount: number;
  rowVersion?: string; // Concurrency token dạng Base64
}

/**
 * Phản hồi chi tiết danh mục kèm danh sách công thức phân trang (FR-CAT-002)
 */
export interface CategoryDetailDto {
  category: CategoryDto;
  recipes: PagedResult<RecipeSummaryDto>;
}

export type CategoryDetailResponseDto = CategoryDetailDto;

/**
 * DTO dữ liệu tạo mới danh mục (FR-CAT-003)
 */
export interface CreateCategoryInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  orderIndex?: number;
}

/**
 * DTO dữ liệu cập nhật danh mục kèm RowVersion Optimistic Concurrency (FR-CAT-004)
 */
export interface UpdateCategoryInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  orderIndex?: number;
  rowVersion: string;
}
