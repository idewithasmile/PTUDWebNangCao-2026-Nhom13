import { apiClient } from '@/lib/api-client';
import { authHeaders } from '@/features/auth/token-store';
import type { GetUsersParams, PagedUsersResultDto } from '@/lib/types/user-management';

function withAuth(init: RequestInit = {}): RequestInit {
  return {
    ...init,
    headers: {
      ...authHeaders(),
      ...init.headers,
    },
  };
}

export const userService = {
  /**
   * Lấy danh sách người dùng và tác giả phân trang, hỗ trợ lọc vai trò, trạng thái và tìm kiếm
   */
  async getUsers(params: GetUsersParams = {}): Promise<PagedUsersResultDto> {
    const searchParams = new URLSearchParams();

    if (params.searchTerm) searchParams.append('searchTerm', params.searchTerm);
    if (params.role) searchParams.append('role', params.role);
    if (params.isActive !== undefined) searchParams.append('isActive', String(params.isActive));
    if (params.page) searchParams.append('page', String(params.page));
    if (params.pageSize) searchParams.append('pageSize', String(params.pageSize));

    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient<PagedUsersResultDto>(`/users${qs}`, withAuth());
  },

  /**
   * Khóa hoặc mở khóa tài khoản người dùng (chỉ Quản trị viên)
   */
  async toggleUserStatus(userId: string, isActive: boolean): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/users/${userId}/status`, withAuth({
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    }));
  },
};
