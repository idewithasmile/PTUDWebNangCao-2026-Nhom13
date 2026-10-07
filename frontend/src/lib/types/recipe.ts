import type { RecipeDifficulty, RecipeStatus } from './category';

// --- Detail DTOs ---
export interface RecipeNutritionDto {
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
}

export interface RecipeStepDto {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  timerMinutes: number | null;
  imageUrl: string | null;
}

export interface RecipeIngredientDto {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
  orderIndex: number;
}

export interface RecipeImageDto {
  id: string;
  originalUrl: string;
  mediumUrl: string | null;
  thumbnailUrl: string | null;
  altText: string | null;
  isPrimary: boolean;
  orderIndex: number;
}

export interface RecipeDetailDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: RecipeDifficulty;
  status: RecipeStatus;
  categoryId: string;
  categoryName: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string | null;
  publishedAt: string | null;
  nutrition: RecipeNutritionDto;
  steps: RecipeStepDto[];
  ingredients: RecipeIngredientDto[];
  images: RecipeImageDto[];
}

// --- RecipeDto (trả về từ Backend sau khi Create/Update/Publish/Unpublish/Archive) ---
export interface RecipeDto {
  id: string;
  title: string;
  slug: string;
  status: RecipeStatus;
  createdAt: string;
}

// --- Request types (gửi lên Backend) ---
export interface CreateRecipeRequest {
  title: string;
  description: string;
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: RecipeDifficulty;
  categoryId: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UpdateRecipeRequest extends CreateRecipeRequest {
  id: string;
  rowVersion?: string; // Base64 concurrency token nếu có
}

// --- Query params ---
export interface GetRecipesParams {
  searchTerm?: string;
  categoryId?: string;
  difficulty?: RecipeDifficulty;
  maxTotalTimeMinutes?: number;
  sortBy?: 'newest' | 'oldest' | 'time_asc' | 'time_desc';
  page?: number;
  pageSize?: number;
}
