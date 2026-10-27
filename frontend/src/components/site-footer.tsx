import Link from 'next/link';
import { ChefHat, Heart, UtensilsCrossed, Sparkles } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-gray-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-lg text-white shadow-sm shadow-orange-200">
                🍳
              </span>
              <span>Culinary<span className="text-orange-600">Blog</span></span>
            </Link>
            <p className="max-w-md text-sm text-gray-500 leading-relaxed">
              Nền tảng chia sẻ và lưu giữ công thức nấu ăn trực tuyến dành cho những người yêu ẩm thực. 
              Khám phá bí quyết chế biến món ăn ngon mỗi ngày, cùng tính toán dinh dưỡng chi tiết và hướng dẫn từng bước chuẩn xác.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ChefHat className="h-4 w-4 text-orange-500" />
              <span>Phát triển bởi Nhóm 13 • PTUDWebNangCao 2026</span>
            </div>
          </div>

          {/* Cột 2: Khám phá ẩm thực */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Khám phá
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="transition hover:text-orange-600">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="transition hover:text-orange-600">
                  Công thức nấu ăn
                </Link>
              </li>
              <li>
                <Link href="/categories" className="transition hover:text-orange-600">
                  Danh mục món ăn
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Tác giả & Đầu bếp */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Dành cho Tác giả
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/recipes/create" className="font-semibold text-orange-600 hover:text-orange-700">
                  + Viết công thức mới
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=settings" className="transition hover:text-orange-600">
                  Hồ sơ cá nhân
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-orange-600">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-orange-600">
                  Tạo tài khoản mới
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-gray-100 pt-6 flex flex-col items-center justify-between gap-4 text-xs text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Culinary Blog. Tất cả các quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            Xây dựng với <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" /> bởi Nhóm 13 (Next.js 15 & .NET 10)
          </p>
        </div>
      </div>
    </footer>
  );
}
