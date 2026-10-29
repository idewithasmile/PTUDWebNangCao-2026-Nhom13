'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SESSION_REVOKED_EVENT } from '@/lib/api-client';
import { authKeys, toErrorMessage, useLogout, useMe } from '@/features/auth/hooks';
import { hasSession } from '@/features/auth/api';
import { resolveMediaUrl } from '@/lib/utils';
import { PlusCircle, Menu, X, ChefHat, ShieldCheck, LayoutDashboard, Search } from 'lucide-react';

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const qc = useQueryClient();
  const logout = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Chỉ fetch /me khi có access token in-memory (tránh 401 thừa sau reload).
  const me = useMe(hasSession());

  useEffect(() => {
    const onRevoked = () => qc.setQueryData(authKeys.me, null);
    window.addEventListener(SESSION_REVOKED_EVENT, onRevoked);
    return () => window.removeEventListener(SESSION_REVOKED_EVENT, onRevoked);
  }, [qc]);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const user = me.data ?? null;

  const onLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => router.push('/login'),
      onError: (e) => {
        qc.setQueryData(authKeys.me, null);
        if (process.env.NODE_ENV !== 'production') {
          console.error('[header] logout failed, force local logout:', toErrorMessage(e, 'Đăng xuất thất bại.'));
        }
        router.push('/login');
      },
    });
  };

  const navLinks = [
    { href: '/', label: 'Trang chủ', active: pathname === '/' },
    { href: '/recipes', label: 'Công thức', active: (pathname?.startsWith('/recipes') ?? false) && !pathname?.startsWith('/recipes/create') && !pathname?.startsWith('/recipes/new') },
    { href: '/categories', label: 'Danh mục', active: pathname?.startsWith('/categories') ?? false },
  ];

  const isAdmin = user?.roles?.includes('Admin');
  const [headerSearch, setHeaderSearch] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5 transition-colors">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-200 group-hover:scale-105 transition-transform">
              <ChefHat className="h-6 w-6 fill-white text-white" />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-gray-900 leading-tight">
                Culinary<span className="text-orange-500"> Blog</span>
              </span>
              <span className="text-[11px] font-medium text-gray-400">Nấu ngon - Sống vui</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex lg:items-center lg:gap-6 ml-4" aria-label="Menu chính">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 text-sm font-semibold transition-colors ${
                  link.active
                    ? 'text-orange-500 font-bold'
                    : 'text-gray-700 hover:text-orange-500'
                }`}
              >
                {link.label}
                {link.active && (
                  <span className="absolute -bottom-2.5 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Area: Search, Notification Bell, User Auth */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {/* Quick Search on Desktop Header */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (headerSearch.trim()) {
                router.push(`/recipes?searchTerm=${encodeURIComponent(headerSearch.trim())}`);
              }
            }}
            className="relative w-56 xl:w-64"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Tìm kiếm công thức, nguyên liệu..."
              className="w-full rounded-full border-none bg-gray-100/80 py-2 pl-9 pr-4 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1.5 focus:ring-orange-500 transition-all"
            />
          </form>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            title="Thông báo"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white absolute -top-0.5 -right-0.5">
              3
            </span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                {user.avatarUrl ? (
                  <img
                    src={resolveMediaUrl(user.avatarUrl)}
                    alt={user.displayName}
                    className="h-7 w-7 rounded-full object-cover border border-orange-200"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[120px] truncate text-xs font-bold">{user.displayName}</span>
                <span className="text-gray-400 text-xs">▼</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl border border-gray-100 text-xs z-50 space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-semibold transition"
                  >
                    <span>📊 Bảng điều khiển</span>
                  </Link>
                  <Link
                    href="/dashboard?tab=recipes-create"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-orange-600 hover:bg-orange-50 font-bold transition"
                  >
                    <span>✏️ Viết công thức mới</span>
                  </Link>
                  <Link
                    href="/dashboard?tab=profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition"
                  >
                    <span>👤 Hồ sơ cá nhân</span>
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    disabled={logout.isPending}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition"
                  >
                    {logout.isPending ? 'Đang thoát…' : 'Đăng xuất'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1.5 pr-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  <ChefHat className="h-4 w-4" />
                </span>
                <span>Đăng nhập</span>
                <span className="text-[10px] text-gray-400">▼</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <Link
              href="/recipes/create"
              className="inline-flex items-center gap-1 rounded-lg bg-orange-500 p-2 text-white shadow-sm"
              title="Đăng công thức"
            >
              <PlusCircle className="h-5 w-5" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Mở menu di động"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          {/* Mobile Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (headerSearch.trim()) {
                setMobileMenuOpen(false);
                router.push(`/recipes?searchTerm=${encodeURIComponent(headerSearch.trim())}`);
              }
            }}
            className="relative mb-3"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Tìm công thức món ăn..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </form>

          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  link.active
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t border-gray-100 pt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-gray-50 border border-gray-200 text-gray-800 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {user.avatarUrl ? (
                        <img
                          src={resolveMediaUrl(user.avatarUrl)}
                          alt={user.displayName}
                          className="h-6 w-6 rounded-full object-cover border border-orange-200"
                        />
                      ) : (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span>{user.displayName}</span>
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">Bảng điều khiển →</span>
                  </Link>

                  <Link
                    href="/dashboard?tab=recipes-create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-sm"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Đăng công thức mới</span>
                  </Link>

                  <Link
                    href="/dashboard?tab=settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-700"
                  >
                    Hồ sơ & Cài đặt
                  </Link>

                  <button
                    type="button"
                    onClick={onLogout}
                    disabled={logout.isPending}
                    className="rounded-xl bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    {logout.isPending ? 'Đang thoát…' : 'Đăng xuất'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-gray-900 py-2 text-sm font-semibold text-white hover:bg-black"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
