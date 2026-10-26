import { apiClient } from '@/lib/api-client';
import { authHeaders } from '@/features/auth/token-store';
import type {
  RecipeDetailDto,
  RecipeDto,
  RecipeImageDto,
  RecipeIngredientDto,
  RecipeStepDto,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  AddIngredientRequest,
  UpdateIngredientRequest,
  AddStepRequest,
  UpdateStepRequest,
  GetRecipesParams,
  SearchRecipesParams,
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
    if (params.difficulty) qs.set('difficulty', String(params.difficulty));
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
   * FR-SRCH-001: GET /recipes/search — Tìm kiếm toàn văn bản tiếng Việt FTS
   */
  async searchRecipes(params: SearchRecipesParams): Promise<PagedResult<RecipeSummaryDto>> {
    const qs = new URLSearchParams();
    qs.set('searchTerm', params.searchTerm);
    if (params.categoryId) qs.set('categoryId', params.categoryId);
    if (params.difficulty) qs.set('difficulty', String(params.difficulty));
    qs.set('page', String(params.page ?? 1));
    qs.set('pageSize', String(params.pageSize ?? 10));

    return apiClient<PagedResult<RecipeSummaryDto>>(`/recipes/search?${qs.toString()}`, withAuth());
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

  /**
   * FR-RCP-008: POST /recipes/{id}/images — Tải ảnh cho công thức nấu ăn
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
   * FR-RCP-008: PATCH /recipes/{id}/images/{imageId}/primary — Đặt làm ảnh chính
   */
  async setPrimaryRecipeImage(recipeId: string, imageId: string): Promise<RecipeImageDto> {
    return apiClient<RecipeImageDto>(`/recipes/${recipeId}/images/${imageId}/primary`, withAuth({
      method: 'PATCH',
    }));
  },

  /**
   * FR-RCP-008: DELETE /recipes/{id}/images/{imageId} — Xóa ảnh công thức
   */
  async deleteRecipeImage(recipeId: string, imageId: string): Promise<void> {
    return apiClient<void>(`/recipes/${recipeId}/images/${imageId}`, withAuth({
      method: 'DELETE',
    }));
  },

  /**
   * FR-RCP-009: POST /recipes/{id}/ingredients — Thêm nguyên liệu
   */
  async addIngredient(recipeId: string, data: AddIngredientRequest): Promise<RecipeIngredientDto> {
    return apiClient<RecipeIngredientDto>(`/recipes/${recipeId}/ingredients`, withAuth({
      method: 'POST',
      body: JSON.stringify(data),
    }));
  },

  /**
   * FR-RCP-009: PUT /recipes/{id}/ingredients/{ingId} — Cập nhật nguyên liệu
   */
  async updateIngredient(recipeId: string, ingredientId: string, data: UpdateIngredientRequest): Promise<RecipeIngredientDto> {
    return apiClient<RecipeIngredientDto>(`/recipes/${recipeId}/ingredients/${ingredientId}`, withAuth({
      method: 'PUT',
      body: JSON.stringify(data),
    }));
  },

  /**
   * FR-RCP-009: DELETE /recipes/{id}/ingredients/{ingId} — Xóa nguyên liệu
   */
  async deleteIngredient(recipeId: string, ingredientId: string): Promise<void> {
    return apiClient<void>(`/recipes/${recipeId}/ingredients/${ingredientId}`, withAuth({
      method: 'DELETE',
    }));
  },

  /**
   * FR-RCP-010: POST /recipes/{id}/steps — Thêm bước thực hiện
   */
  async addStep(recipeId: string, data: AddStepRequest): Promise<RecipeStepDto> {
    return apiClient<RecipeStepDto>(`/recipes/${recipeId}/steps`, withAuth({
      method: 'POST',
      body: JSON.stringify(data),
    }));
  },

  /**
   * FR-RCP-010: PUT /recipes/{id}/steps/{stepId} — Cập nhật bước thực hiện
   */
  async updateStep(recipeId: string, stepId: string, data: UpdateStepRequest): Promise<RecipeStepDto> {
    return apiClient<RecipeStepDto>(`/recipes/${recipeId}/steps/${stepId}`, withAuth({
      method: 'PUT',
      body: JSON.stringify(data),
    }));
  },

  /**
   * FR-RCP-010: DELETE /recipes/{id}/steps/{stepId} — Xóa bước thực hiện
   */
  async deleteStep(recipeId: string, stepId: string): Promise<void> {
    return apiClient<void>(`/recipes/${recipeId}/steps/${stepId}`, withAuth({
      method: 'DELETE',
    }));
  },
};
