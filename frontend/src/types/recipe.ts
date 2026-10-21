/**
 * Kiểu dữ liệu Công thức nấu ăn (FR-RCP & FR-SRCH)
 */

export enum RecipeDifficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3,
  Expert = 4,
}

export enum RecipeStatus {
  Draft = 0,
  Pending = 1,
  Published = 2,
  Archived = 3,
}

export interface RecipeNutritionDto {
  calories: number;
  fatGrams: number;
  carbsGrams: number;
  proteinGrams: number;
  fiberGrams?: number;
  sodiumMilligrams?: number;
}

export interface RecipeStepDto {
  id?: string;
  stepNumber: number;
  title: string;
  instruction: string;
  imageUrl?: string | null;
  durationMinutes?: number | null;
}

export interface RecipeIngredientDto {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string | null;
}

export interface RecipeImageDto {
  id?: string;
  originalUrl: string;
  mediumUrl?: string | null;
  thumbnailUrl?: string | null;
  altText?: string | null;
  caption?: string | null;
  isPrimary: boolean;
  orderIndex?: number;
}

export interface RecipeAuthorSummaryDto {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
}

/**
 * Tóm tắt công thức nấu ăn hiển thị trong danh sách và thẻ bài viết (Card)
 */
export interface RecipeSummaryDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: RecipeDifficulty | number;
  status?: RecipeStatus | number;
  thumbnailUrl: string | null;
  authorName: string | null;
  authorId?: string | null;
  author?: RecipeAuthorSummaryDto | null;
  categoryId?: string;
  categoryName?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
}

/**
 * Chi tiết toàn diện công thức nấu ăn (FR-RCP-002)
 */
export interface RecipeDetailDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: RecipeDifficulty | number;
  status: RecipeStatus | number;
  categoryId: string;
  categoryName?: string;
  authorId: string;
  authorName: string;
  author?: RecipeAuthorSummaryDto;
  nutrition?: RecipeNutritionDto;
  steps: RecipeStepDto[];
  ingredients: RecipeIngredientDto[];
  images: RecipeImageDto[];
  rowVersion: string;
  createdAt: string;
  updatedAt?: string | null;
  publishedAt?: string | null;
}

export interface CreateRecipeInput {
  title: string;
  description: string;
  instructions?: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: RecipeDifficulty | number;
  categoryId: string;
  nutrition?: RecipeNutritionDto;
  steps?: Omit<RecipeStepDto, 'id'>[];
  ingredients?: Omit<RecipeIngredientDto, 'id'>[];
}

export interface UpdateRecipeInput extends CreateRecipeInput {
  id: string;
  rowVersion: string;
}

export interface RecipeFilterParams {
  categoryId?: string;
  difficulty?: number;
  maxCookTime?: number;
  sortBy?: 'created' | 'title' | 'time';
  page?: number;
  pageSize?: number;
}

export interface SearchRecipesParams {
  searchTerm: string;
  categoryId?: string;
  difficulty?: number;
  page?: number;
  pageSize?: number;
}
