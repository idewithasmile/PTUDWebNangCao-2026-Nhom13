'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isDashboard = pathname ? pathname.startsWith('/dashboard') : false;

  if (isDashboard) {
    // Với các route thuộc /dashboard, render toàn màn hình không có SiteHeader và SiteFooter của trang web công khai
    return <div className="min-h-screen w-full bg-[#f4f7fc] text-slate-800 antialiased">{children}</div>;
  }

  // Các trang công khai thông thường (Trang chủ, Công thức, Danh mục, Đăng nhập, Hồ sơ...)
  return (
    <>
      <SiteHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:px-6 md:py-8">{children}</main>
      <SiteFooter />
    </>
  );
}
