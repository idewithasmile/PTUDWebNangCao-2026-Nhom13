'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  UtensilsCrossed,
  FolderTree,
  User,
  ChefHat,
  ChevronDown,
  Plus,
  ExternalLink,
  LogOut,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import type { UserProfile } from '@/types/auth';
import type { DashboardStatsDto } from '@/lib/types/dashboard';
import { useLogout } from '@/features/auth/hooks';
import { resolveMediaUrl } from '@/lib/utils';

export type DashboardTab =
  | 'overview'
  | 'recipes'
  | 'recipes-mine'
  | 'recipes-published'
  | 'recipes-draft'
  | 'recipes-archived'
  | 'recipes-create'
  | 'recipes-edit'
  | 'categories'
  | 'profile'
  | 'settings';

interface DashboardSidebarProps {
  user: UserProfile;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  stats?: DashboardStatsDto;
}

export default function DashboardSidebar({
  user,
  activeTab,
  onSelectTab,
  stats,
}: DashboardSidebarProps) {
  const router = useRouter();
  const logout = useLogout();
  const isAdmin = user.roles?.includes('Admin');

  const [isRecipesExpanded, setIsRecipesExpanded] = useState(
    activeTab.startsWith('recipes')
  );

  const isRecipesActive =
    activeTab === 'recipes' ||
    activeTab === 'recipes-mine' ||
    activeTab === 'recipes-published' ||
    activeTab === 'recipes-draft' ||
    activeTab === 'recipes-archived';

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => router.push('/login'),
      onError: () => router.push('/login'),
    });
  };

  return (
    <aside className="w-64 bg-[#111726] text-slate-400 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800/60 select-none sticky top-0 h-screen overflow-y-auto z-30">
      {/* 1. Header Logo & Quick Link */}
      <div className="p-5 pb-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none group-hover:text-blue-400 transition-colors">
              Culinary Blog
            </h1>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Nấu ngon - Sống vui</p>
          </div>
        </Link>

        {/* 4. Nút điều hướng Xem Trang chủ / Quay lại Blog */}
        <div className="mt-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/40 transition group"
            title="Mở giao diện đọc công thức công khai"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>Xem trang Blog</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white transition" />
          </Link>
        </div>

        {/* 2. Menu Navigation Links */}
        <nav className="mt-5 space-y-1.5 text-xs">
          {/* 1. Tổng quan */}
          <button
            type="button"
            onClick={() => onSelectTab('overview')}
            className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl font-bold transition text-left ${
              activeTab === 'overview'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Tổng quan</span>
          </button>

          {/* 5. Nút Đăng công thức (Nút hành động độc lập, không có mũi tên >) */}
          <button
            type="button"
            onClick={() => onSelectTab('recipes-create')}
            className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl transition text-left font-bold ${
              activeTab === 'recipes-create'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20'
            }`}
          >
            <Plus className="w-4 h-4 shrink-0 font-extrabold" />
            <span>Đăng công thức mới</span>
          </button>

          {/* 1. Quản lý công thức (Accordion Submenu kèm đủ 4 mục trạng thái SRS) */}
          <div>
            <button
              type="button"
              onClick={() => {
                setIsRecipesExpanded(!isRecipesExpanded);
                if (!isRecipesActive) onSelectTab(isAdmin ? 'recipes' : 'recipes-mine');
              }}
              className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
                isRecipesActive
                  ? 'text-white bg-slate-800/60 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-4 h-4 shrink-0" />
                <span>Quản lý công thức</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${isRecipesExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {isRecipesExpanded && (
              <div className="pl-7 pr-1 py-1 space-y-1 text-[11px]">
                {/* Tất cả công thức */}
                <button
                  type="button"
                  onClick={() => onSelectTab(isAdmin ? 'recipes' : 'recipes-mine')}
                  className={`flex items-center justify-between w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                    activeTab === 'recipes' || activeTab === 'recipes-mine'
                      ? 'bg-blue-600/30 text-blue-400 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span>{isAdmin ? 'Tất cả công thức' : 'Công thức của tôi'}</span>
                  {stats && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                      {stats.totalRecipes}
                    </span>
                  )}
                </button>

                {/* Đã xuất bản (Published - FR-RCP-005) */}
                <button
                  type="button"
                  onClick={() => onSelectTab('recipes-published')}
                  className={`flex items-center justify-between w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                    activeTab === 'recipes-published'
                      ? 'bg-blue-600/30 text-blue-400 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Đã xuất bản</span>
                  </span>
                  {stats && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-emerald-400">
                      {stats.publishedRecipes}
                    </span>
                  )}
                </button>

                {/* Bản nháp (Draft - FR-RCP-003) */}
                <button
                  type="button"
                  onClick={() => onSelectTab('recipes-draft')}
                  className={`flex items-center justify-between w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                    activeTab === 'recipes-draft'
                      ? 'bg-blue-600/30 text-blue-400 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Bản nháp</span>
                  </span>
                  {stats && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-400">
                      {stats.draftRecipes}
                    </span>
                  )}
                </button>

                {/* Đã lưu trữ (Archived - FR-RCP-006) */}
                <button
                  type="button"
                  onClick={() => onSelectTab('recipes-archived')}
                  className={`flex items-center justify-between w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                    activeTab === 'recipes-archived'
                      ? 'bg-blue-600/30 text-blue-400 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    <span>Đã lưu trữ</span>
                  </span>
                  {stats && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                      {stats.archivedRecipes}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 3. Danh mục - Chỉ hiển thị cho Quản Trị Viên (Admin) theo SRS FR-CAT */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onSelectTab('categories')}
              className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
                activeTab === 'categories'
                  ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <FolderTree className="w-4 h-4 shrink-0" />
              <span>Quản lý danh mục</span>
            </button>
          )}

          {/* 2 & 5. Hồ sơ cá nhân (/profile - Độc lập, không có mũi tên >) */}
          <button
            type="button"
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
              activeTab === 'profile' || activeTab === 'settings'
                ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Hồ sơ cá nhân</span>
          </button>
        </nav>
      </div>

      {/* 3. Footer Sidebar: Thẻ Định danh Tác giả & Nút Đăng xuất (FR-AUTH-005, FR-AUTH-006) */}
      <div className="p-4 border-t border-slate-800/60 space-y-3 bg-[#0d121f]">
        {/* User Card */}
        <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-800/40 border border-slate-700/40">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0 border border-slate-600/60">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveMediaUrl(user.avatarUrl)}
                alt={user.displayName || 'Avatar'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span>{(user.displayName || user.userName || 'U')[0].toUpperCase()}</span>
            )}
          </div>

          <div className="min-w-0 flex-1 text-xs">
            <p className="font-bold text-white truncate text-[11px] leading-tight">
              {user.displayName || user.userName}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-[10px] text-emerald-400 font-semibold tracking-tight">
                {isAdmin ? 'Admin' : 'Verified Author'}
              </span>
            </div>
          </div>
        </div>

        {/* Nút Đăng xuất (Logout) */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold transition disabled:opacity-50"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{logout.isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
        </button>

        {/* Phiên bản & trạng thái hệ thống */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 px-1">
          <span>Culinary Blog v1.1.0</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Trực tuyến
          </span>
        </div>
      </div>
    </aside>
  );
}
