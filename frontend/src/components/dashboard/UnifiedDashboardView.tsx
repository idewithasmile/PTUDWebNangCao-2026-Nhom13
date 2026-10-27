'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDashboardStats } from '@/features/dashboard/hooks';
import type { UserProfile } from '@/types/auth';
import DashboardSidebar, { type DashboardTab } from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import DashboardOverviewView from './views/DashboardOverviewView';
import DashboardRecipesView from './views/DashboardRecipesView';
import DashboardCategoriesView from './views/DashboardCategoriesView';
import DashboardAuthorsView from './views/DashboardAuthorsView';
import DashboardCommentsView from './views/DashboardCommentsView';
import DashboardFilesView from './views/DashboardFilesView';
import DashboardJobsView from './views/DashboardJobsView';
import DashboardAnalyticsView from './views/DashboardAnalyticsView';
import DashboardRecipeCreateView from './views/DashboardRecipeCreateView';
import DashboardRecipeEditView from './views/DashboardRecipeEditView';
import DashboardProfileSettingsView from './views/DashboardProfileSettingsView';

interface UnifiedDashboardViewProps {
  user: UserProfile;
}

function DashboardContent({ user }: UnifiedDashboardViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = (searchParams.get('tab') as DashboardTab) || 'overview';
  const slugParam = searchParams.get('slug') || '';

  const [activeTab, setActiveTab] = useState<DashboardTab>(tabParam);

  // Sync state if URL search query changes
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleSelectTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  };

  const isAdmin = user.roles?.includes('Admin') ?? false;

  // Lấy dữ liệu thống kê từ API REST (/api/v1/dashboard/stats)
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats(!isAdmin);

  const defaultStats = {
    totalRecipes: 0,
    publishedRecipes: 0,
    draftRecipes: 0,
    archivedRecipes: 0,
    totalAuthors: null,
    categoryDistribution: [],
    activity7Days: [],
    isSystemScope: isAdmin,
  };

  const currentStats = stats ?? defaultStats;

  return (
    <div className="flex min-h-screen w-full bg-[#f4f7fc]">
      {/* 1. Cột trái: Sidebar màu xanh đen chuẩn theo hình ảnh Master Mockup */}
      <DashboardSidebar
        user={user}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* 2. Cột phải: Toàn bộ nội dung Bảng điều khiển (Dashboard Canvas) */}
      <div className="flex-1 min-w-0 p-5 sm:p-7 space-y-6 overflow-x-hidden">
        {/* Header trên cùng (tự động bật Studio Mode khi soạn bài để chống phân tâm) */}
        <DashboardHeader
          user={user}
          isStudioMode={activeTab === 'recipes-create' || activeTab === 'recipes-edit'}
        />

        {/* Chuyển đổi linh hoạt giữa 9 khu vực quản lý bên trong Dashboard */}
        {activeTab === 'overview' && (
          <DashboardOverviewView
            user={user}
            stats={currentStats}
            isStatsLoading={isStatsLoading}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'recipes' && (
          <DashboardRecipesView user={user} subFilter={isAdmin ? 'all' : 'mine'} />
        )}

        {activeTab === 'recipes-mine' && (
          <DashboardRecipesView user={user} subFilter="mine" />
        )}

        {activeTab === 'recipes-draft' && (
          <DashboardRecipesView user={user} subFilter="draft" />
        )}

        {activeTab === 'recipes-scheduled' && (
          <DashboardRecipesView user={user} subFilter="scheduled" />
        )}

        {activeTab === 'recipes-trash' && (
          <DashboardRecipesView user={user} subFilter="trash" />
        )}

        {activeTab === 'recipes-create' && (
          <DashboardRecipeCreateView user={user} onSelectTab={handleSelectTab} />
        )}

        {activeTab === 'recipes-edit' && (
          <DashboardRecipeEditView slug={slugParam} onSelectTab={handleSelectTab} />
        )}

        {activeTab === 'categories' && <DashboardCategoriesView />}

        {activeTab === 'authors' && (
          isAdmin ? (
            <DashboardAuthorsView currentUser={user} />
          ) : (
            <DashboardRecipesView user={user} subFilter="mine" />
          )
        )}

        {activeTab === 'comments' && <DashboardCommentsView />}

        {activeTab === 'files' && <DashboardFilesView />}

        {activeTab === 'jobs' && (
          isAdmin ? (
            <DashboardJobsView />
          ) : (
            <DashboardRecipesView user={user} subFilter="mine" />
          )
        )}

        {activeTab === 'analytics' && <DashboardAnalyticsView />}

        {activeTab === 'settings' && (
          <DashboardProfileSettingsView currentUser={user} />
        )}
      </div>
    </div>
  );
}

export default function UnifiedDashboardView({ user }: UnifiedDashboardViewProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#f4f7fc] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <DashboardContent user={user} />
    </Suspense>
  );
}
