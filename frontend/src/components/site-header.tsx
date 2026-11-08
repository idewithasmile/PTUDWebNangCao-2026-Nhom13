'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SESSION_REVOKED_EVENT } from '@/lib/api-client';
import { authKeys, toErrorMessage, useLogout, useMe } from '@/features/auth/hooks';
import { hasSession } from '@/features/auth/api';
import { resolveMediaUrl } from '@/lib/utils';
import { PlusCircle, Menu, X, ChefHat, Search } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';

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
          console.warn('[header] logout failed, force local logout:', toErrorMessage(e, 'Đăng xuất thất bại.'));
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

  const [headerSearch, setHeaderSearch] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5 transition-colors">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-200 dark:shadow-none group-hover:scale-105 transition-transform">
              <ChefHat className="h-6 w-6 fill-white text-white" />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-gray-900 dark:text-zinc-100 leading-tight">
                Culinary<span className="text-orange-500"> Blog</span>
              </span>
              <span className="text-[11px] font-medium text-gray-400 dark:text-zinc-400">Nấu ngon - Sống vui</span>
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
                    : 'text-gray-700 dark:text-zinc-300 hover:text-orange-500 dark:hover:text-orange-400'
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

        {/* Right Area: Search, Notification Bell, ThemeToggle, User Auth */}
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
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-400" />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Tìm kiếm công thức, nguyên liệu..."
              className="w-full rounded-full border-none bg-gray-100/80 dark:bg-zinc-800 py-2 pl-9 pr-4 text-xs text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-1.5 focus:ring-orange-500 transition-all"
            />
          </form>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition"
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
                className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-800 py-1 pl-1 pr-3 text-sm font-medium text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                {user.avatarUrl ? (
                  <img
                    src={resolveMediaUrl(user.avatarUrl)}
                    alt={user.displayName}
                    className="h-7 w-7 rounded-full object-cover border border-orange-200 dark:border-zinc-700"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/60 text-xs font-bold text-orange-700 dark:text-orange-400">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[120px] truncate text-xs font-bold">{user.displayName}</span>
                <span className="text-gray-400 dark:text-zinc-500 text-xs">▼</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-zinc-900 p-2 shadow-xl border border-gray-100 dark:border-zinc-800 text-xs z-50 space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-400 font-semibold transition"
                  >
                    <span>📊 Bảng điều khiển</span>
                  </Link>
                  <div className="border-t border-gray-100 dark:border-zinc-800 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    disabled={logout.isPending}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold transition"
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
                className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-800 py-1 pl-1.5 pr-3 text-xs font-bold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                  <ChefHat className="h-4 w-4" />
                </span>
                <span>Đăng nhập</span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500">▼</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
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
            className="rounded-lg p-2 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Mở menu di động"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 md:hidden">
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-400" />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Tìm công thức món ăn..."
              className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 py-2 pl-9 pr-3 text-sm text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-400 focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </form>

          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  link.active
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                    : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t border-gray-100 dark:border-zinc-800 pt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {user.avatarUrl ? (
                        <img
                          src={resolveMediaUrl(user.avatarUrl)}
                          alt={user.displayName}
                          className="h-6 w-6 rounded-full object-cover border border-orange-200 dark:border-zinc-700"
                        />
                      ) : (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/60 text-xs font-bold text-orange-700 dark:text-orange-400">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span>{user.displayName}</span>
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium">Bảng điều khiển →</span>
                  </Link>

                  <button
                    type="button"
                    onClick={onLogout}
                    disabled={logout.isPending}
                    className="rounded-xl bg-gray-100 dark:bg-zinc-900 py-2 text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
                  >
                    {logout.isPending ? 'Đang thoát…' : 'Đăng xuất'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-gray-200 dark:border-zinc-800 py-2 text-sm font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-gray-900 dark:bg-zinc-100 py-2 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-white"
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
