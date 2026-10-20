import { apiClient } from '@/lib/api-client';
import { FileUploadResponse, RecipeImageDto } from '@/types';

export const fileService = {
  /**
   * Tải tệp tin lên hệ thống lưu trữ MinIO (Proxy qua Backend - FR-FILE-001)
   * Giới hạn kích thước <= 5MB, hỗ trợ JPEG, PNG, WebP, AVIF.
   *
   * @param file File cần tải lên
   * @param folder Thư mục đích (vd: 'avatars', 'recipes')
   */
  async uploadFile(file: File, folder?: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const query = folder ? `?folder=${encodeURIComponent(folder)}` : '';
    return apiClient<FileUploadResponse>(`/files/upload${query}`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Xóa tệp tin khỏi hệ thống lưu trữ MinIO (FR-FILE-002)
   * Idempotent: Thành công kể cả khi tệp không còn tồn tại trên bucket.
   *
   * @param fileUrl URL tệp tin cần xóa
   */
  async deleteFile(fileUrl: string): Promise<void> {
    return apiClient<void>(`/files?url=${encodeURIComponent(fileUrl)}`, {
      method: 'DELETE',
    });
  },

  /**
   * Tải ảnh cho công thức nấu ăn (FR-RCP-008)
   * Tự động gán IsPrimary = true nếu là ảnh đầu tiên.
   *
   * @param recipeId Id công thức
   * @param file File ảnh
   * @param altText Văn bản thay thế cho ảnh
   */
  async uploadRecipeImage(recipeId: string, file: File, altText?: string): Promise<RecipeImageDto> {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) {
      formData.append('altText', altText);
    }

    return apiClient<RecipeImageDto>(`/recipes/${recipeId}/images`, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Đặt ảnh làm ảnh đại diện chính của công thức (FR-RCP-008)
   *
   * @param recipeId Id công thức
   * @param imageId Id ảnh
   */
  async setPrimaryRecipeImage(recipeId: string, imageId: string): Promise<RecipeImageDto> {
    return apiClient<RecipeImageDto>(`/recipes/${recipeId}/images/${imageId}/primary`, {
      method: 'PATCH',
    });
  },

  /**
   * Xóa ảnh khỏi công thức nấu ăn (FR-RCP-008)
   * Nếu xóa ảnh đại diện chính, hệ thống tự động gán ảnh đầu tiên còn lại làm primary.
   *
   * @param recipeId Id công thức
   * @param imageId Id ảnh
   */
  async deleteRecipeImage(recipeId: string, imageId: string): Promise<void> {
    return apiClient<void>(`/recipes/${recipeId}/images/${imageId}`, {
      method: 'DELETE',
    });
  },
};
