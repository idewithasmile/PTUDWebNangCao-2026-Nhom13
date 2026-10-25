import { apiClient } from '@/lib/api-client';
import { authHeaders } from '@/features/auth/token-store';
import type {
  RecipeDetailDto,
  RecipeDto,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  GetRecipesParams,
  RecipeImageDto,
  RecipeIngredientDto,
  RecipeStepDto,
  AddRecipeIngredientRequest,
  UpdateRecipeIngredientRequest,
  AddRecipeStepRequest,
  UpdateRecipeStepRequest,
} from '@/lib/types/recipe';
import type { RecipeSummaryDto, PagedResult } from '@/lib/types/category';

function withAuth(init: RequestInit = {}): RequestInit {
  return {
    ...init,
    headers: {
      ...authHeaders(),
      ...init.headers,
    },
  };
}

export const recipeService = {
  /**
   * FR-RCP-001: GET /recipes — Lấy danh sách công thức phân trang, lọc, sắp xếp
   */
  async getRecipes(params: GetRecipesParams = {}): Promise<PagedResult<RecipeSummaryDto>> {
    const qs = new URLSearchParams();
    if (params.searchTerm) qs.set('searchTerm', params.searchTerm);
    if (params.categoryId) qs.set('categoryId', params.categoryId);
    if (params.difficulty !== undefined) qs.set('difficulty', String(params.difficulty));
    if (params.maxTotalTimeMinutes) qs.set('maxTotalTimeMinutes', String(params.maxTotalTimeMinutes));
    if (params.sortBy) qs.set('sortBy', params.sortBy);
    if (params.onlyMine) qs.set('onlyMine', 'true');
    if (params.status !== undefined) qs.set('status', String(params.status));
    qs.set('page', String(params.page ?? 1));
    qs.set('pageSize', String(params.pageSize ?? 12));

    const queryString = qs.toString();
    const endpoint = queryString ? `/recipes?${queryString}` : '/recipes';
    return apiClient<PagedResult<RecipeSummaryDto>>(endpoint, withAuth());
  },

  /**
   * FR-RCP-002: GET /recipes/{slug} — Lấy chi tiết công thức theo Slug
   */
  async getRecipeBySlug(slug: string, init?: RequestInit): Promise<RecipeDetailDto> {
    return apiClient<RecipeDetailDto>(`/recipes/${encodeURIComponent(slug)}`, withAuth(init));
  },

  /**
   * FR-RCP-003: POST /recipes — Tạo mới công thức (Draft)
   */
  async createRecipe(data: CreateRecipeRequest): Promise<RecipeDto> {
    return apiClient<RecipeDto>('/recipes', withAuth({ method: 'POST', body: JSON.stringify(data) }));
  },

  /**
   * FR-RCP-004: PUT /recipes/{id} — Cập nhật thông tin công thức
   */
  async updateRecipe(id: string, data: UpdateRecipeRequest): Promise<RecipeDto> {
    return apiClient<RecipeDto>(`/recipes/${id}`, withAuth({ method: 'PUT', body: JSON.stringify(data) }));
  },

  /**
   * FR-RCP-005: PATCH /recipes/{id}/publish — Xuất bản công thức
   */
  async publishRecipe(id: string): Promise<RecipeDto> {
    return apiClient<RecipeDto>(`/recipes/${id}/publish`, withAuth({ method: 'PATCH' }));
  },

  /**
   * FR-RCP-005: PATCH /recipes/{id}/unpublish — Hủy xuất bản công thức
   */
  async unpublishRecipe(id: string): Promise<RecipeDto> {
    return apiClient<RecipeDto>(`/recipes/${id}/unpublish`, withAuth({ method: 'PATCH' }));
  },

  /**
   * FR-RCP-006: PATCH /recipes/{id}/archive — Lưu trữ công thức
   */
  async archiveRecipe(id: string): Promise<RecipeDto> {
    return apiClient<RecipeDto>(`/recipes/${id}/archive`, withAuth({ method: 'PATCH' }));
  },

  /**
   * FR-RCP-007: DELETE /recipes/{id} — Xóa mềm công thức (204 No Content)
   */
  async deleteRecipe(id: string): Promise<void> {
    return apiClient<void>(`/recipes/${id}`, withAuth({ method: 'DELETE' }));
  },

  // ---------------------------------------------------------------------------
  // FR-RCP-008: Quản lý Thư viện ảnh (Images Gallery & Primary Image)
  // ---------------------------------------------------------------------------

  /**
   * Tải ảnh công thức lên qua Proxy Backend -> MinIO (FR-RCP-008)
   */
  async uploadRecipeImage(recipeId: string, file: File, altText?: string): Promise<RecipeImageDto> {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('altText', altText);
    }
    return apiClient<RecipeImageDto>(`/recipes/${recipeId}/images`, withAuth({
      method: 'POST',
      body: formData,
    }));
  },

  /**
   * Đặt ảnh làm ảnh đại diện chính (Primary Image) (FR-RCP-008)
   */
  async setPrimaryImage(recipeId: string, imageId: string): Promise<RecipeImageDto> {
    return apiClient<RecipeImageDto>(`/recipes/${recipeId}/images/${imageId}/primary`, withAuth({
      method: 'PATCH',
    }));
  },

  /**
   * Xóa ảnh khỏi thư viện công thức (FR-RCP-008)
   */
  async deleteRecipeImage(recipeId: string, imageId: string): Promise<void> {
    return apiClient<void>(`/recipes/${recipeId}/images/${imageId}`, withAuth({
      method: 'DELETE',
    }));
  },

  // ---------------------------------------------------------------------------
  // FR-RCP-009: Quản lý Nguyên liệu nấu ăn (Ingredients CRUD độc lập)
  // ---------------------------------------------------------------------------

  /**
   * Thêm nguyên liệu mới vào công thức (FR-RCP-009)
   */
  async addRecipeIngredient(recipeId: string, data: Omit<AddRecipeIngredientRequest, 'recipeId'>): Promise<RecipeIngredientDto> {
    return apiClient<RecipeIngredientDto>(`/recipes/${recipeId}/ingredients`, withAuth({
      method: 'POST',
      body: JSON.stringify({ ...data, recipeId }),
    }));
  },

  /**
   * Cập nhật nguyên liệu theo Id (FR-RCP-009)
   */
  async updateRecipeIngredient(
    recipeId: string,
    ingredientId: string,
    data: Omit<UpdateRecipeIngredientRequest, 'recipeId' | 'ingredientId'>
  ): Promise<RecipeIngredientDto> {
    return apiClient<RecipeIngredientDto>(`/recipes/${recipeId}/ingredients/${ingredientId}`, withAuth({
      method: 'PUT',
      body: JSON.stringify({ ...data, recipeId, ingredientId }),
    }));
  },

  /**
   * Xóa nguyên liệu khỏi công thức (FR-RCP-009)
   */
  async deleteRecipeIngredient(recipeId: string, ingredientId: string): Promise<void> {
    return apiClient<void>(`/recipes/${recipeId}/ingredients/${ingredientId}`, withAuth({
      method: 'DELETE',
    }));
  },

  // ---------------------------------------------------------------------------
  // FR-RCP-010: Quản lý Các bước thực hiện (Steps CRUD độc lập)
  // ---------------------------------------------------------------------------

  /**
   * Thêm bước mới vào công thức (FR-RCP-010)
   */
  async addRecipeStep(recipeId: string, data: Omit<AddRecipeStepRequest, 'recipeId'>): Promise<RecipeStepDto> {
    return apiClient<RecipeStepDto>(`/recipes/${recipeId}/steps`, withAuth({
      method: 'POST',
      body: JSON.stringify({ ...data, recipeId }),
    }));
  },

  /**
   * Cập nhật bước thực hiện theo Id (FR-RCP-010)
   */
  async updateRecipeStep(
    recipeId: string,
    stepId: string,
    data: Omit<UpdateRecipeStepRequest, 'recipeId' | 'stepId'>
  ): Promise<RecipeStepDto> {
    return apiClient<RecipeStepDto>(`/recipes/${recipeId}/steps/${stepId}`, withAuth({
      method: 'PUT',
      body: JSON.stringify({ ...data, recipeId, stepId }),
    }));
  },

  /**
   * Xóa bước thực hiện (Backend tự renumber các bước còn lại) (FR-RCP-010)
   */
  async deleteRecipeStep(recipeId: string, stepId: string): Promise<void> {
    return apiClient<void>(`/recipes/${recipeId}/steps/${stepId}`, withAuth({
      method: 'DELETE',
    }));
  },
};
