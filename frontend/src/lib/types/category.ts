export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  orderIndex: number;
  recipeCount: number;
  rowVersion?: string; // Base64 concurrency token
}

export interface RecipeSummaryDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: number; // 1=Easy, 2=Medium, 3=Hard, 4=Expert
  thumbnailUrl: string | null;
  authorName: string | null;
  publishedAt: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CategoryDetailDto {
  category: CategoryDto;
  recipes: PagedResult<RecipeSummaryDto>;
}

export interface CreateCategoryInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  orderIndex: number;
}

export interface UpdateCategoryInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  orderIndex: number;
  rowVersion: string;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}
