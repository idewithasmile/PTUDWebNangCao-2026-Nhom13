'use client';

import Link from 'next/link';
import { ChefHat, ArrowUp } from 'lucide-react';

export default function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-[#181f2a] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        {/* Hàng trên: Logo, Menu điều hướng ngang & Icon mạng xã hội */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-800">
          {/* Logo & Slogan */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm">
              <ChefHat className="h-6 w-6 fill-white text-white" />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-tight">
                Culinary<span className="text-orange-500"> Blog</span>
              </span>
              <span className="text-[11px] font-medium text-gray-400">Nấu ngon - Sống vui</span>
            </div>
          </Link>

          {/* Menu Điều hướng ngang chuẩn Mockup */}
          <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-orange-400 transition">Trang chủ</Link>
            <span className="text-gray-700">|</span>
            <Link href="/recipes" className="hover:text-orange-400 transition">Công thức</Link>
            <span className="text-gray-700">|</span>
            <Link href="/categories" className="hover:text-orange-400 transition">Danh mục</Link>
            <span className="text-gray-700">|</span>
            <Link href="/recipes?filter=ingredients" className="hover:text-orange-400 transition">Nguyên liệu</Link>
            <span className="text-gray-700">|</span>
            <Link href="/about" className="hover:text-orange-400 transition">Giới thiệu</Link>
            <span className="text-gray-700">|</span>
            <Link href="/contact" className="hover:text-orange-400 transition">Liên hệ</Link>
          </nav>

          {/* Icon Mạng xã hội */}
          <div className="flex items-center gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 hover:bg-[#1877F2] text-white transition text-xs font-bold"
              title="Facebook"
            >
              f
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 hover:bg-[#FF0000] text-white transition text-xs font-bold"
              title="YouTube"
            >
              ▶
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 hover:bg-[#E1306C] text-white transition text-xs font-bold"
              title="Instagram"
            >
              📷
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 hover:bg-black text-white transition text-xs font-bold"
              title="TikTok"
            >
              🎵
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 hover:bg-[#E60023] text-white transition text-xs font-bold"
              title="Pinterest"
            >
              P
            </a>
          </div>
        </div>

        {/* Hàng dưới: Bản quyền & Chính sách */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Culinary Blog. Tất cả các quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-400 transition">Chính sách bảo mật</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-gray-400 transition">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>

      {/* Nút Cuộn lên đầu trang (Back to top) màu cam nổi góc phải */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
        title="Lên đầu trang"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
