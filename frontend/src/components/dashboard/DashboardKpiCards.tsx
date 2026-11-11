'use client';

import { FileText, CheckCircle2, FileEdit, Users, Archive, ShieldCheck, User, Eye, Bookmark } from 'lucide-react';
import type { DashboardStatsDto } from '@/lib/types/dashboard';

interface DashboardKpiCardsProps {
  stats: DashboardStatsDto;
  isLoading?: boolean;
}

export default function DashboardKpiCards({ stats, isLoading }: DashboardKpiCardsProps) {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Đang tải dữ liệu thống kê"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 animate-pulse"
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-zinc-800 rounded-3xl border border-gray-200 dark:border-zinc-700" />
        ))}
      </div>
    );
  }

  const total = stats.totalRecipes;
  const publishedRatio = total > 0 ? Math.round((stats.publishedRecipes / total) * 100) : 0;
  const draftRatio = total > 0 ? Math.round((stats.draftRecipes / total) * 100) : 0;
  const archivedRatio = total > 0 ? Math.round((stats.archivedRecipes / total) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Scope Indicator Banner */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <div className="flex items-center gap-1.5 font-medium">
          {stats.isSystemScope ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>Phạm vi thống kê: <strong className="text-gray-900 dark:text-zinc-100">Toàn bộ hệ thống (Quản trị viên)</strong></span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Phạm vi thống kê: <strong className="text-gray-900 dark:text-zinc-100">Bài viết của bạn (Tác giả)</strong></span>
            </>
          )}
        </div>
        <span className="text-[11px] text-gray-400">Dữ liệu thời gian thực từ CSDL PostgreSQL</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Thẻ 1: Tổng bài viết */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-5 border border-blue-50/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {stats.isSystemScope ? 'Toàn sàn' : 'Cá nhân'}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider truncate">
              {stats.isSystemScope ? 'Tổng bài viết' : 'Bài của bạn'}
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">
                {stats.totalRecipes.toLocaleString('vi-VN')}
              </h3>
              <span className="text-[10px] text-gray-400">món</span>
            </div>
          </div>
        </div>

        {/* Thẻ 2: Bài viết đã xuất bản */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-5 border border-emerald-50/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {publishedRatio}%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider truncate">
              Đã xuất bản
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">
                {stats.publishedRecipes.toLocaleString('vi-VN')}
              </h3>
              <span className="text-[10px] text-gray-400">công khai</span>
            </div>
          </div>
        </div>

        {/* Thẻ 3: Bản nháp */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-5 border border-amber-50/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileEdit className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              {draftRatio}%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider truncate">
              Bản nháp
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">
                {stats.draftRecipes.toLocaleString('vi-VN')}
              </h3>
              <span className="text-[10px] text-gray-400">đang soạn</span>
            </div>
          </div>
        </div>

        {/* Thẻ 4: Tổng Lượt xem */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-5 border border-sky-50/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
              Tương tác
            </span>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider truncate">
              {stats.isSystemScope ? 'Tổng lượt xem' : 'Lượt xem tích lũy'}
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-sky-600 dark:text-sky-400 tracking-tight">
                {(stats.totalViews ?? 0).toLocaleString('vi-VN')}
              </h3>
              <span className="text-[10px] text-gray-400">lượt</span>
            </div>
          </div>
        </div>

        {/* Thẻ 5: Tổng Lượt lưu (Bookmarks) */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-5 border border-rose-50/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              Yêu thích
            </span>
          </div>
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider truncate">
              {stats.isSystemScope ? 'Tổng lượt lưu' : 'Lượt lưu của bạn'}
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
                {(stats.totalBookmarks ?? 0).toLocaleString('vi-VN')}
              </h3>
              <span className="text-[10px] text-gray-400">lượt</span>
            </div>
          </div>
        </div>

        {/* Thẻ 6: Tác giả (Nếu là Admin) hoặc Bài đã lưu trữ (Nếu là Author) */}
        {stats.isSystemScope && stats.totalAuthors !== null ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-5 border border-purple-50/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                Cộng đồng
              </span>
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider truncate">
                Tổng số Tác giả
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">
                  {stats.totalAuthors.toLocaleString('vi-VN')}
                </h3>
                <span className="text-[10px] text-gray-400">tài khoản</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Archive className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                {archivedRatio}%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider truncate">
                Bài đã lưu trữ
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">
                  {stats.archivedRecipes.toLocaleString('vi-VN')}
                </h3>
                <span className="text-[10px] text-gray-400">kho lưu</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
