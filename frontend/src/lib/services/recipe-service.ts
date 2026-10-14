import { apiClient } from '@/lib/api-client';
import { authHeaders } from '@/features/auth/token-store';
import type {
  RecipeDetailDto,
  RecipeDto,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  GetRecipesParams,
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
};
