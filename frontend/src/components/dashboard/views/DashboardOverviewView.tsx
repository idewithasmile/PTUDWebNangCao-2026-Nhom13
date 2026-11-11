'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { UserProfile } from '@/types/auth';
import type { DashboardStatsDto } from '@/lib/types/dashboard';
import DashboardHeroBanner from '../common/DashboardHeroBanner';
import DashboardKpiCards from '../DashboardKpiCards';
import ActivityTrendChart from '../charts/ActivityTrendChart';
import CategoryDonutChart from '../charts/CategoryDonutChart';
import FilteredRecipesTable from '../tables/FilteredRecipesTable';
import LatestRecipesList from '../widgets/LatestRecipesList';
import { ChefHat, ShieldCheck, Plus, BookOpen, Calendar, Clock } from 'lucide-react';

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
  const [timeStr, setTimeStr] = useState('18:24');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const dateFormatted = now.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      setDateStr(`${dayName}, ${dateFormatted}`);
      setTimeStr(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. HERO BANNER: Chào mừng tổng quan hệ thống ẩm thực */}
      <DashboardHeroBanner
        backgroundImage="/images/dashboard/banner-overview.jpg"
        icon={<ChefHat className="w-7 h-7" />}
        title={`Xin chào, ${user.displayName || user.userName}! 👋`}
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-200 border border-orange-500/30">
            {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <ChefHat className="w-3.5 h-3.5" />}
            <span>{isAdmin ? 'Quản trị viên hệ thống' : 'Tác giả bài viết'}</span>
          </span>
        }
        description="Chào mừng bạn quay trở lại Culinary Blog. Hôm nay bạn muốn sáng tạo công thức mới hay khám phá những ý tưởng ẩm thực độc đáo?"
        breadcrumbs={[
          { label: 'Culinary Blog', href: '/' },
          { label: 'Bảng điều khiển', active: true },
        ]}
        actions={
          <>
            <div className="hidden lg:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-orange-100 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-300" />
                <span>{dateStr || 'Hôm nay'}</span>
              </div>
              <span className="text-white/40">|</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-300" />
                <span>{timeStr}</span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/25 transition active:scale-95 shadow-xs"
              title="Quay về trang chủ website"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-300" />
              <span>Xem trang Blog</span>
            </Link>

            <Link
              href="/dashboard?tab=recipes-create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng công thức mới</span>
            </Link>
          </>
        }
      />

      {/* 2. Thông tin tổng quan nhanh (4 KPI Cards thời gian thực từ CSDL PostgreSQL) */}
      <DashboardKpiCards stats={stats} isLoading={isStatsLoading} />

      {/* 3. Biểu đồ tần suất đăng bài 7 ngày thật + Phân bố danh mục Donut + Bài viết mới nhất */}
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

      {/* 4. Bảng quản lý bài viết kèm tìm kiếm, bộ lọc đa chiều & phân trang (Toàn chiều rộng) */}
      <div className="w-full">
        <FilteredRecipesTable user={user} isAdmin={isAdmin} />
      </div>
    </div>
  );
}
