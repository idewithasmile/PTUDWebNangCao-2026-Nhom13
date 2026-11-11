'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/services/dashboard-service';
import { useMe } from '@/features/auth/hooks';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (onlyMine?: boolean, userId?: string) => [...dashboardKeys.all, 'stats', onlyMine, userId] as const,
  recentFiles: (limit: number, userId?: string) => [...dashboardKeys.all, 'recentFiles', limit, userId] as const,
  health: () => [...dashboardKeys.all, 'health'] as const,
};

/**
 * Hook fetch số liệu KPI, biểu đồ và phân bố danh mục
 */
export function useDashboardStats(onlyMine?: boolean, enabled = true) {
  const { data: user } = useMe(false);
  const effectiveUserId = onlyMine ? (user?.id ?? 'me') : 'system';
  return useQuery({
    queryKey: dashboardKeys.stats(onlyMine, effectiveUserId),
    queryFn: () => dashboardService.getStats(onlyMine),
    enabled,
    staleTime: onlyMine ? 0 : 60 * 1000, // 0 cho dữ liệu cá nhân, 1 phút cho toàn hệ thống
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook fetch danh sách tệp tin ảnh tải lên gần đây
 */
export function useRecentFiles(limit: number = 6, enabled = true) {
  const { data: user } = useMe(false);
  return useQuery({
    queryKey: dashboardKeys.recentFiles(limit, user?.id ?? 'me'),
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
