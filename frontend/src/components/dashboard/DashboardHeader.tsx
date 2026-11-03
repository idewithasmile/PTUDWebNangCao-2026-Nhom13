'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  ShieldCheck,
  ChefHat,
  Calendar,
  Clock,
  CloudSun,
} from 'lucide-react';
import type { UserProfile } from '@/types/auth';
import { logoutApi } from '@/features/auth/api';

interface DashboardHeaderProps {
  user: UserProfile;
  isStudioMode?: boolean;
}

export default function DashboardHeader({ user, isStudioMode = false }: DashboardHeaderProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('18:24');
  const [dateStr, setDateStr] = useState('Thứ Ba, 16/09/2026');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('dashboard-search-input');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore
    }
    router.push('/login');
  };

  const isAdmin = user.roles?.includes('Admin');

  return (
    <div className="space-y-6">
      {/* 1. Top Bar: Search + Notification + User Pill */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Thanh tìm kiếm toàn hệ thống */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="dashboard-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết, công thức, danh mục... (Ctrl + K)"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
          </form>
        </div>

        {/* Right Controls: Notifications + Theme + User Pill */}
        <div className="flex items-center justify-end gap-3 shrink-0">
          {/* Bell Notification */}
          <button
            type="button"
            className="relative p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-2xs transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
              3
            </span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-2xs transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-xs shrink-0">
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

              <div className="text-left text-xs leading-tight">
                <div className="font-bold text-gray-800 dark:text-zinc-200">{user.displayName || user.userName}</div>
                <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
                  {isAdmin ? 'Admin' : 'Author'}
                </div>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 py-2 z-50 animate-fade-in text-xs">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800">
                  <p className="font-bold text-gray-900 dark:text-zinc-100 truncate">{user.displayName}</p>
                  <p className="text-gray-500 dark:text-zinc-400 text-[11px] truncate">{user.email}</p>
                </div>

                <Link
                  href="/dashboard?tab=profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 transition"
                >
                  <User className="w-4 h-4" />
                  <span>Hồ sơ cá nhân</span>
                </Link>

                <div className="border-t border-gray-100 dark:border-zinc-800 my-1" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Greeting & Real-time Weather Bar */}
      {!isStudioMode && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 animate-fade-in">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
              Xin chào, {user.displayName || user.userName}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Chào mừng bạn quay trở lại Culinary Blog. Hãy cùng khám phá những món ăn ngon và chia sẻ đam mê ẩm thực!
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 dark:text-zinc-300 shrink-0">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              <span>{timeStr}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-100/60 dark:border-blue-900/40 shadow-2xs">
              <CloudSun className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span>Đà Lạt 22°C • Trời quang mây</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
