import { apiClient } from '@/lib/api-client';
import { authHeaders } from '@/features/auth/token-store';
import type { DashboardStatsDto, RecentFileDto, SystemHealthDto } from '@/lib/types/dashboard';

function withAuth(init: RequestInit = {}): RequestInit {
  return {
    ...init,
    headers: {
      ...authHeaders(),
      ...init.headers,
    },
  };
}

export const dashboardService = {
  /**
   * Lấy thống kê tổng quan KPI, tỷ lệ danh mục và hoạt động 7 ngày (phân quyền Admin / Author)
   */
  async getStats(onlyMine?: boolean): Promise<DashboardStatsDto> {
    const qs = onlyMine !== undefined ? `?onlyMine=${onlyMine}` : '';
    return apiClient<DashboardStatsDto>(`/dashboard/stats${qs}`, withAuth());
  },

  /**
   * Lấy danh sách các tệp tin hình ảnh công thức vừa tải lên MinIO gần đây
   */
  async getRecentFiles(limit: number = 6): Promise<RecentFileDto[]> {
    return apiClient<RecentFileDto[]>(`/dashboard/recent-files?limit=${limit}`, withAuth());
  },

  /**
   * Lấy trạng thái giám sát sức khỏe hệ thống thời gian thực (/health)
   */
  async getSystemHealth(): Promise<SystemHealthDto> {
    try {
      const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1').replace(/\/api\/v1\/?$/, '');
      const res = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      return await res.json();
    } catch {
      return {
        status: 'Unhealthy',
        entries: {},
      };
    }
  },
};
