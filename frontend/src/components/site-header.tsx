'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ChefHat, Menu, X, LayoutDashboard, User, LogOut, BookOpen, Layers } from 'lucide-react';
import { SESSION_REVOKED_EVENT } from '@/lib/api-client';
import { authKeys, toErrorMessage, useLogout, useMe } from '@/features/auth/hooks';
import { hasSession } from '@/features/auth/api';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const qc = useQueryClient();
  const logout = useLogout();

  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const setAuthStoreUser = useAuthStore((s) => s.setUser);
  const clearAuthStore = useAuthStore((s) => s.clearAuth);

  // Chỉ fetch /me khi có access token in-memory (tránh 401 thừa sau reload).
  const me = useMe(hasSession());
  const user = me.data ?? null;

  // Đồng bộ user vào Zustand AuthStore khi React Query fetch thành công
  useEffect(() => {
    setAuthStoreUser(user);
  }, [user, setAuthStoreUser]);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // FR-AUTH-004: api-client đá event khi gặp 401 AUTH_REFRESH_TOKEN_REVOKED → dọn cache
  useEffect(() => {
    const onRevoked = () => {
      qc.setQueryData(authKeys.me, null);
      clearAuthStore();
    };
    window.addEventListener(SESSION_REVOKED_EVENT, onRevoked);
    return () => window.removeEventListener(SESSION_REVOKED_EVENT, onRevoked);
  }, [qc, clearAuthStore]);

  const onLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        clearAuthStore();
        router.push('/login');
      },
      onError: (e) => {
        qc.setQueryData(authKeys.me, null);
        clearAuthStore();
        if (process.env.NODE_ENV !== 'production') {
          console.error('[header] logout failed, force local logout:', toErrorMessage(e, 'Đăng xuất thất bại.'));
        }
        router.push('/login');
      },
    });
  };

  const navLinks = [
    { href: '/', label: 'Trang Chủ', icon: ChefHat },
    { href: '/categories', label: 'Danh Mục', icon: Layers },
    { href: '/recipes', label: 'Công Thức', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo và Menu điều hướng chính */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-black tracking-tight text-gray-900 hover:text-orange-600 transition group"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm group-hover:bg-orange-700 transition">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="text-xl">Culinary<span className="text-orange-600">Blog</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-600">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors',
                    isActive
                      ? 'bg-orange-50 text-orange-700 font-bold'
                      : 'hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Menu người dùng & Xác thực trên Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 pr-1">
                <span className="text-xs text-gray-400">Xin chào,</span>
                <span className="text-sm font-bold text-gray-900 truncate max-w-[140px]" title={user.email}>
                  {user.displayName}
                </span>
              </div>

              {/* Lối tắt Bảng điều khiển Quản Trị Viên */}
              {user.roles?.includes('Admin') ? (
                <Button asChild variant="secondary" size="sm" className="font-bold">
                  <Link href="/dashboard" className="flex items-center gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Quản Trị Viên</span>
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard" className="flex items-center gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
              )}

              <Button asChild variant="ghost" size="sm">
                <Link href="/profile" className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>Hồ sơ</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                disabled={logout.isPending}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200"
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                <span>{logout.isPending ? 'Đang thoát…' : 'Đăng xuất'}</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link href="/register">Đăng ký thành viên</Link>
              </Button>
            </>
          )}
        </div>

        {/* Nút bật/tắt Mobile Menu */}
        <div className="flex sm:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menu thả xuống trên thiết bị di động */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition',
                    isActive
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-1 text-xs text-gray-500">
                  Đăng nhập với: <strong className="text-gray-900">{user.displayName}</strong>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <LayoutDashboard className="h-4 w-4 text-orange-600" />
                  <span>Bảng điều khiển {user.roles?.includes('Admin') ? '(Quản Trị)' : ''}</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <User className="h-4 w-4 text-orange-600" />
                  <span>Hồ sơ cá nhân</span>
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={logout.isPending}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{logout.isPending ? 'Đang đăng xuất…' : 'Đăng xuất'}</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
