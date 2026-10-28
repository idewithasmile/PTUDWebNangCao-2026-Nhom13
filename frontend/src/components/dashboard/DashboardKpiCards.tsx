'use client';

import { FileText, CheckCircle2, FileEdit, Users, Archive, ShieldCheck, User } from 'lucide-react';
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse"
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-gray-100 rounded-3xl border border-gray-200" />
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
              <span>Phạm vi thống kê: <strong className="text-gray-900">Toàn bộ hệ thống (Quản trị viên)</strong></span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Phạm vi thống kê: <strong className="text-gray-900">Bài viết của bạn (Tác giả)</strong></span>
            </>
          )}
        </div>
        <span className="text-[11px] text-gray-400">Dữ liệu thời gian thực từ CSDL PostgreSQL</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Thẻ 1: Tổng bài viết */}
        <div className="bg-white rounded-3xl p-6 border border-blue-50/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {stats.isSystemScope ? 'Toàn trang' : 'Cá nhân'}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {stats.isSystemScope ? 'Tổng bài viết hệ thống' : 'Tổng bài viết của bạn'}
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {stats.totalRecipes.toLocaleString('vi-VN')}
              </h3>
              <span className="text-[11px] text-gray-400">công thức</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50/50 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Thẻ 2: Bài viết đã xuất bản */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-50/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {publishedRatio}% tổng số
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Bài viết đã xuất bản
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {stats.publishedRecipes.toLocaleString('vi-VN')}
              </h3>
              <span className="text-[11px] text-gray-400">công khai</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-50/50 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Thẻ 3: Bài nháp */}
        <div className="bg-white rounded-3xl p-6 border border-amber-50/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileEdit className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
              {draftRatio}% tổng số
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {stats.isSystemScope ? 'Bản nháp chờ xuất bản' : 'Bản nháp cá nhân'}
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {stats.draftRecipes.toLocaleString('vi-VN')}
              </h3>
              <span className="text-[11px] text-gray-400">đang soạn</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-50/50 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Thẻ 4: Tác giả (Nếu là Admin) hoặc Bài đã lưu trữ (Nếu là Author) */}
        {stats.isSystemScope && stats.totalAuthors !== null ? (
          <div className="bg-white rounded-3xl p-6 border border-purple-50/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                Cộng đồng
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tổng số Tác giả
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {stats.totalAuthors.toLocaleString('vi-VN')}
                </h3>
                <span className="text-[11px] text-gray-400">tài khoản</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-50/50 rounded-full blur-xl pointer-events-none" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Archive className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                {archivedRatio}% tổng số
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Bài đã lưu trữ
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {stats.archivedRecipes.toLocaleString('vi-VN')}
                </h3>
                <span className="text-[11px] text-gray-400">kho lưu trữ</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50/50 rounded-full blur-xl pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}
