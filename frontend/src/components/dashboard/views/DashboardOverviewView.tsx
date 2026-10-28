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
      {/* 1. Thông tin tổng quan nhanh (4 KPI Cards thời gian thực từ CSDL) */}
      <DashboardKpiCards stats={stats} isLoading={isStatsLoading} />

      {/* 2. Biểu đồ 7 ngày + Phân bố danh mục Donut + Bài viết mới nhất */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <ActivityTrendChart
            activity7Days={stats.activity7Days}
            isSystemScope={stats.isSystemScope}
          />
        </div>

        <div className="lg:col-span-4">
          <CategoryDonutChart
            categories={stats.categoryDistribution}
            totalRecipes={stats.totalRecipes}
          />
        </div>

        <div className="lg:col-span-3">
          <LatestRecipesList />
        </div>
      </div>

      {/* 3. Bảng quản lý bài viết gần đây kèm bộ lọc đa chiều & phân trang (Toàn chiều rộng) */}
      <div className="w-full">
        <FilteredRecipesTable user={user} isAdmin={isAdmin} />
      </div>

      {/* 4. Thống kê bài viết nổi bật & Phân bố món theo danh mục */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopRecipesList />
        <CategoryBarChart categories={stats.categoryDistribution} />
      </div>
    </div>
  );
}
