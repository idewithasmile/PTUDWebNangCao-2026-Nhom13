'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/services/dashboard-service';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (onlyMine?: boolean) => [...dashboardKeys.all, 'stats', onlyMine] as const,
  recentFiles: (limit: number) => [...dashboardKeys.all, 'recentFiles', limit] as const,
  health: () => [...dashboardKeys.all, 'health'] as const,
};

/**
 * Hook fetch số liệu KPI, biểu đồ và phân bố danh mục
 */
export function useDashboardStats(onlyMine?: boolean, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.stats(onlyMine),
    queryFn: () => dashboardService.getStats(onlyMine),
    enabled,
    staleTime: 60 * 1000, // 1 phút
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook fetch danh sách tệp tin ảnh tải lên gần đây
 */
export function useRecentFiles(limit: number = 6, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.recentFiles(limit),
    queryFn: () => dashboardService.getRecentFiles(limit),
    enabled,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook fetch trạng thái sức khỏe hệ thống (Health Check)
 */
export function useSystemHealth(enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.health(),
    queryFn: () => dashboardService.getSystemHealth(),
    enabled,
    refetchInterval: 30 * 1000, // Tự động làm mới mỗi 30 giây
    staleTime: 15 * 1000,
  });
}
