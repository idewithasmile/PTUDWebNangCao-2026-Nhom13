import type { RecipeDifficulty, RecipeStatus } from './category';
export type { RecipeDifficulty, RecipeStatus };

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
  rowVersionBase64?: string | null;
}

// --- RecipeDto (trả về từ Backend sau khi Create/Update/Publish/Unpublish/Archive) ---
export interface RecipeDto {
  id: string;
  title: string;
  slug: string;
  status: RecipeStatus;
  createdAt: string;
}

// --- DTOs cho Step & Ingredient khi tạo / sửa ---
export interface CreateRecipeStepDto {
  title?: string;
  description: string;
  timerMinutes?: number | null;
  imageUrl?: string | null;
}

export interface CreateRecipeIngredientDto {
  name: string;
  quantity?: number | null;
  unit?: string | null;
  notes?: string | null;
}

// --- Sub-resource Requests (FR-RCP-009, FR-RCP-010) ---
export interface AddRecipeIngredientRequest {
  recipeId: string;
  name: string;
  quantity?: number | null;
  unit?: string | null;
  notes?: string | null;
  sortOrder?: number | null;
}

export interface UpdateRecipeIngredientRequest {
  recipeId: string;
  ingredientId: string;
  name: string;
  quantity?: number | null;
  unit?: string | null;
  notes?: string | null;
  sortOrder?: number | null;
}

export interface AddRecipeStepRequest {
  recipeId: string;
  description: string;
  title?: string | null;
  timerMinutes?: number | null;
  imageUrl?: string | null;
}

export interface UpdateRecipeStepRequest {
  recipeId: string;
  stepId: string;
  description: string;
  title?: string | null;
  timerMinutes?: number | null;
  imageUrl?: string | null;
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
  steps?: CreateRecipeStepDto[];
  ingredients?: CreateRecipeIngredientDto[];
  primaryImageUrl?: string;
}

export interface UpdateRecipeRequest extends CreateRecipeRequest {
  id: string;
  rowVersionBase64?: string; // Base64 concurrency token
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
  onlyMine?: boolean;
  status?: RecipeStatus;
}
