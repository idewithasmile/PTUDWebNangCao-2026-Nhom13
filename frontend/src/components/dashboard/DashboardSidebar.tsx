'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  FileText,
  UtensilsCrossed,
  FolderTree,
  Users,
  MessageSquare,
  HardDrive,
  Cpu,
  BarChart3,
  Settings,
  ChefHat,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { UserProfile } from '@/types/auth';

export type DashboardTab =
  | 'overview'
  | 'recipes'
  | 'recipes-mine'
  | 'recipes-draft'
  | 'recipes-scheduled'
  | 'recipes-trash'
  | 'recipes-create'
  | 'recipes-edit'
  | 'categories'
  | 'authors'
  | 'comments'
  | 'files'
  | 'jobs'
  | 'analytics'
  | 'settings';

interface DashboardSidebarProps {
  user: UserProfile;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
}

export default function DashboardSidebar({ user, activeTab, onSelectTab }: DashboardSidebarProps) {
  const isAdmin = user.roles?.includes('Admin');
  const [isArticlesExpanded, setIsArticlesExpanded] = useState(
    activeTab.startsWith('recipes')
  );

  const isArticlesActive = activeTab.startsWith('recipes');

  return (
    <aside className="w-64 bg-[#111726] text-slate-400 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800/60 select-none sticky top-0 h-screen overflow-y-auto z-30">
      {/* 1. Header Logo (Khớp Screen 1 - Culinary Blog Nấu ngon - Sống vui) */}
      <div className="p-5">
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

        {/* 2. Menu Navigation Links (Khớp 9 mục màn hình Master Mockup) */}
        <nav className="mt-6 space-y-1 text-xs">
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

          {/* 2 & 3. Bài viết (Accordion Submenu) */}
          <div>
            <button
              type="button"
              onClick={() => {
                setIsArticlesExpanded(!isArticlesExpanded);
                if (!isArticlesActive) onSelectTab(isAdmin ? 'recipes' : 'recipes-mine');
              }}
              className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
                isArticlesActive
                  ? 'text-white bg-slate-800/60 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Bài viết</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${isArticlesExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {isArticlesExpanded && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-[11px]">
                {/* Chỉ Quản Trị Viên (Admin) mới có quyền xem Tất cả bài viết toàn hệ thống */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => onSelectTab('recipes')}
                    className={`block w-full text-left py-1.5 px-2 rounded-lg transition ${
                      activeTab === 'recipes'
                        ? 'bg-blue-600/30 text-blue-400 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    Tất cả bài viết
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onSelectTab('recipes-mine')}
                  className={`block w-full text-left py-1.5 px-2 rounded-lg transition ${
                    activeTab === 'recipes-mine'
                      ? 'bg-blue-600/30 text-blue-400 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Bài viết của tôi
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('recipes-draft')}
                  className={`block w-full text-left py-1.5 px-2 rounded-lg transition ${
                    activeTab === 'recipes-draft'
                      ? 'bg-blue-600/30 text-blue-400 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Bài nháp
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('recipes-scheduled')}
                  className={`block w-full text-left py-1.5 px-2 rounded-lg transition ${
                    activeTab === 'recipes-scheduled'
                      ? 'bg-blue-600/30 text-blue-400 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Đã lên lịch
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('recipes-trash')}
                  className={`block w-full text-left py-1.5 px-2 rounded-lg transition ${
                    activeTab === 'recipes-trash'
                      ? 'bg-blue-600/30 text-blue-400 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Thùng rác
                </button>
              </div>
            )}
          </div>

          {/* Đăng công thức */}
          <button
            type="button"
            onClick={() => onSelectTab('recipes-create')}
            className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
              activeTab === 'recipes-create'
                ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-4 h-4 shrink-0" />
              <span>Đăng công thức</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* 4. Danh mục */}
          <button
            type="button"
            onClick={() => onSelectTab('categories')}
            className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
              activeTab === 'categories'
                ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderTree className="w-4 h-4 shrink-0" />
              <span>Danh mục</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* 5. Tác giả (Chỉ Admin) */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onSelectTab('authors')}
              className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
                activeTab === 'authors'
                  ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 shrink-0" />
                <span>Tác giả</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 6. Bình luận */}
          <button
            type="button"
            onClick={() => onSelectTab('comments')}
            className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
              activeTab === 'comments'
                ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Bình luận</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* 7. Tệp tin */}
          <button
            type="button"
            onClick={() => onSelectTab('files')}
            className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
              activeTab === 'files'
                ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <HardDrive className="w-4 h-4 shrink-0" />
              <span>Tệp tin</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* 8. Công việc (Job - Chỉ Admin) */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onSelectTab('jobs')}
              className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
                activeTab === 'jobs'
                  ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 shrink-0" />
                <span>Công việc (Job)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 9. Thống kê */}
          <button
            type="button"
            onClick={() => onSelectTab('analytics')}
            className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
              activeTab === 'analytics'
                ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Thống kê</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Cài đặt */}
          <button
            type="button"
            onClick={() => onSelectTab('settings')}
            className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition font-medium text-left ${
              activeTab === 'settings'
                ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 shrink-0" />
              <span>Cài đặt</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      </div>

      {/* 3. Footer Sidebar: Phiên bản & User Profile mini card */}
      <div className="p-4 border-t border-slate-800/60 space-y-3">
        <div className="space-y-1 px-1">
          <p className="text-[11px] text-slate-500 font-medium">Phiên bản 1.1.0</p>
          <p className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Hệ thống hoạt động tốt
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center justify-between p-2 rounded-2xl border transition group text-left ${
            activeTab === 'settings'
              ? 'bg-blue-600/20 border-blue-500/50'
              : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/40'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
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
              <p className="font-bold text-white truncate text-[11px]">
                {user.displayName || user.userName}
              </p>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {isAdmin ? 'Admin' : 'Author'}
              </p>
            </div>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
        </button>
      </div>
    </aside>
  );
}
