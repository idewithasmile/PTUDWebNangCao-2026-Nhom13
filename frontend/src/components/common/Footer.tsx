import Link from 'next/link';
import { ChefHat, Heart, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white text-gray-600 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Cột 1: Thương hiệu và Giới thiệu */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 hover:text-orange-600 transition">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm">
                <ChefHat className="h-5 w-5" />
              </span>
              <span>Culinary Blog</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
              Nền tảng chia sẻ và lưu trữ công thức nấu ăn trực tuyến. Khám phá hàng ngàn công thức ẩm thực độc đáo, hướng dẫn chi tiết từng bước và kết nối với cộng đồng đam mê nấu nướng trên khắp Việt Nam.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nền tảng ẩm thực hiện đại - Next.js 15 & .NET 10</span>
            </div>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
              Khám Phá
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-600 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-orange-600 transition-colors">
                  Danh mục món ăn
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-orange-600 transition-colors">
                  Kho công thức
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-orange-600 transition-colors">
                  Bảng quản trị
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Tài khoản & Hỗ trợ */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
              Tài Khoản
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="hover:text-orange-600 transition-colors">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-orange-600 transition-colors">
                  Đăng ký thành viên
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-orange-600 transition-colors">
                  Hồ sơ cá nhân
                </Link>
              </li>
              <li className="pt-2">
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Mail className="h-3.5 w-3.5" />
                  support@culinaryblog.vn
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Culinary Blog (Nhóm 13 - PTUD Web Nâng Cao). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Được phát triển với <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> bởi Nhóm 13
          </p>
        </div>
      </div>
    </footer>
  );
}
