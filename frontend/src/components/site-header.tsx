'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SESSION_REVOKED_EVENT } from '@/lib/api-client';
import { authKeys, toErrorMessage, useLogout, useMe } from '@/features/auth/hooks';
import { hasSession } from '@/features/auth/api';
import { PlusCircle, Menu, X, Utensils, BookOpen, Layers, ChefHat } from 'lucide-react';

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
    { href: '/recipes', label: 'Công thức', active: pathname.startsWith('/recipes') && !pathname.startsWith('/recipes/create') && !pathname.startsWith('/recipes/new') },
    { href: '/categories', label: 'Danh mục', active: pathname.startsWith('/categories') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-gray-900 transition-colors hover:text-orange-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-lg text-white shadow-sm shadow-orange-200">
              🍳
            </span>
            <span>Culinary<span className="text-orange-600">Blog</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Menu chính">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition-all ${
                  link.active
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Action / Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Nút Xem bài viết của tôi & Nút Tạo công thức mới (dành cho User đã đăng nhập) */}
          {user && (
            <div className="flex items-center gap-2">
              <Link
                href="/recipes?onlyMine=true"
                className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50/70 px-3 py-1.5 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-orange-100"
              >
                <ChefHat className="h-3.5 w-3.5 text-orange-600" />
                <span>Bài viết của tôi</span>
              </Link>

              <Link
                href="/recipes/create"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition-all hover:from-orange-600 hover:to-amber-600 active:scale-95"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Đăng công thức</span>
              </Link>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{user.displayName}</span>
              </Link>
              <button
                type="button"
                onClick={onLogout}
                disabled={logout.isPending}
                className="rounded-xl bg-gray-900 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
              >
                {logout.isPending ? 'Đang thoát…' : 'Đăng xuất'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-gray-200 px-3.5 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gray-900 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Đăng ký
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
          <nav className="flex flex-col gap-2">
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
                  <div className="px-3 py-1 text-xs text-gray-500">
                    Đăng nhập bởi: <span className="font-semibold text-gray-900">{user.displayName}</span>
                  </div>
                  <Link
                    href="/recipes?onlyMine=true"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 py-2 text-sm font-bold text-orange-700"
                  >
                    <ChefHat className="h-4 w-4 text-orange-600" />
                    <span>Bài viết của tôi</span>
                  </Link>
                  <Link
                    href="/recipes/create"
                    className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-sm"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Đăng công thức mới</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center justify-center rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-700"
                  >
                    Hồ sơ cá nhân
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
                    className="flex items-center justify-center rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
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
