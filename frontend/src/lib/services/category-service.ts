import { apiClient } from '@/lib/api-client';
import {
  CategoryDetailDto,
  CategoryDto,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/lib/types/category';

export const categoryService = {
  /**
   * Lấy toàn bộ danh sách danh mục (kèm số lượng recipes)
   */
  async getCategories(init?: RequestInit): Promise<CategoryDto[]> {
    return apiClient<CategoryDto[]>('/categories', {
      ...init,
      method: 'GET',
    });
  },

  /**
   * Lấy chi tiết danh mục theo Slug kèm công thức phân trang
   */
  async getCategoryBySlug(
    slug: string,
    page: number = 1,
    pageSize: number = 12,
    init?: RequestInit
  ): Promise<CategoryDetailDto> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    return apiClient<CategoryDetailDto>(`/categories/${encodeURIComponent(slug)}?${params}`, {
      ...init,
      method: 'GET',
    });
  },

  /**
   * Tạo mới danh mục (Admin)
   */
  async createCategory(data: CreateCategoryInput): Promise<CategoryDto> {
    return apiClient<CategoryDto>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Cập nhật danh mục (Admin - bảo toàn Slug & Concurrency)
   */
  async updateCategory(id: string, data: UpdateCategoryInput): Promise<CategoryDto> {
    return apiClient<CategoryDto>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Xóa mềm danh mục (Admin - cấm xóa nếu còn recipes)
   */
  async deleteCategory(id: string): Promise<void> {
    return apiClient<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
