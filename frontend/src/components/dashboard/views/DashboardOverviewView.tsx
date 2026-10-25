'use client';

import type { UserProfile } from '@/types/auth';
import type { DashboardStatsDto } from '@/lib/types/dashboard';
import DashboardKpiCards from '../DashboardKpiCards';
import ActivityTrendChart from '../charts/ActivityTrendChart';
import CategoryDonutChart from '../charts/CategoryDonutChart';
import CategoryBarChart from '../charts/CategoryBarChart';
import FilteredRecipesTable from '../tables/FilteredRecipesTable';
import LatestRecipesList from '../widgets/LatestRecipesList';
import TopRecipesList from '../widgets/TopRecipesList';
import WorkflowChecklist from '../widgets/WorkflowChecklist';
import RecentFilesWidget from '../widgets/RecentFilesWidget';
import SystemHealthWidget from '../widgets/SystemHealthWidget';

interface DashboardOverviewViewProps {
  user: UserProfile;
  stats: DashboardStatsDto;
  isStatsLoading: boolean;
  isAdmin: boolean;
}

export default function DashboardOverviewView({
  user,
  stats,
  isStatsLoading,
  isAdmin,
}: DashboardOverviewViewProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Callout 9: Thông tin tổng quan nhanh (4 KPI Cards) */}
      <DashboardKpiCards stats={stats} isLoading={isStatsLoading} />

      {/* Hàng giữa 1: Biểu đồ 7 ngày (10) + Phân bố danh mục Donut (11) + Bài viết mới nhất (12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Callout 10: Biểu đồ thống kê lượt xem 7 ngày gần đây */}
        <div className="lg:col-span-5">
          <ActivityTrendChart
            activity7Days={stats.activity7Days}
            isSystemScope={stats.isSystemScope}
          />
        </div>

        {/* Callout 11: Thống kê danh mục Donut chart */}
        <div className="lg:col-span-4">
          <CategoryDonutChart
            categories={stats.categoryDistribution}
            totalRecipes={stats.totalRecipes}
          />
        </div>

        {/* Callout 12: Bài viết mới nhất */}
        <div className="lg:col-span-3">
          <LatestRecipesList />
        </div>
      </div>

      {/* Hàng giữa 2: Bảng bài viết gần đây kèm bộ lọc & phân trang (13) + Công việc & Lịch trình (14) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Callout 13: Bảng bài viết gần đây */}
        <div className="lg:col-span-8">
          <FilteredRecipesTable user={user} isAdmin={isAdmin} />
        </div>

        {/* Callout 14: Công việc & Lịch trình */}
        <div className="lg:col-span-4">
          <WorkflowChecklist />
        </div>
      </div>

      {/* Hàng chân trang: Được xem nhiều (15) + Theo danh mục (16) + Tệp tin (17) + Trạng thái (18) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Callout 15: Bài viết được xem nhiều nhất */}
        <TopRecipesList />

        {/* Callout 16: Bài viết phổ biến theo danh mục */}
        <CategoryBarChart categories={stats.categoryDistribution} />

        {/* Callout 17: Quản lý tệp tin gần đây */}
        <RecentFilesWidget />

        {/* Callout 18: Trạng thái hệ thống thời gian thực */}
        <SystemHealthWidget isAdmin={isAdmin} />
      </div>
    </div>
  );
}
