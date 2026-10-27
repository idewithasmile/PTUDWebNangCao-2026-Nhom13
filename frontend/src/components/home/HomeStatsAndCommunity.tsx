'use client';

import Link from 'next/link';
import { ChefHat, BookOpen, Layers, Users, Sparkles, ArrowRight } from 'lucide-react';
import { hasSession } from '@/features/auth/api';

interface HomeStatsAndCommunityProps {
  totalRecipes?: number;
  totalCategories?: number;
}

export default function HomeStatsAndCommunity({
  totalRecipes = 100,
  totalCategories = 20,
}: HomeStatsAndCommunityProps) {
  const isLoggedIn = hasSession();

  return (
    <section className="space-y-10 pt-4">
      {/* 1. Thanh chỉ số ẩm thực thực tế */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {totalRecipes}+
            </span>
            <p className="text-xs font-semibold text-gray-500">Công thức tuyển chọn</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {totalCategories}
            </span>
            <p className="text-xs font-semibold text-gray-500">Danh mục đa dạng</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              10+
            </span>
            <p className="text-xs font-semibold text-gray-500">Đầu bếp &amp; Tác giả</p>
          </div>
        </div>
      </div>

      {/* 2. Banner Kêu gọi Đóng góp Công thức (Creator CTA) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dành cho người yêu bếp</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Bạn có bí quyết nấu ăn độc đáo muốn chia sẻ?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Trở thành Tác giả trên Culinary Blog để lưu giữ những công thức tâm huyết của bạn,
              sắp xếp định lượng nguyên liệu chuẩn xác và chia sẻ niềm đam mê ẩm thực tới cộng đồng.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {isLoggedIn ? (
              <Link
                href="/dashboard?tab=recipes-create"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-900/40 hover:bg-orange-700 active:scale-95 transition-all"
              >
                <ChefHat className="w-4 h-4" />
                <span>Viết công thức mới</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-900/40 hover:bg-orange-700 active:scale-95 transition-all"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>Đăng ký tác giả ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-gray-700 bg-gray-800/80 text-white text-xs sm:text-sm font-bold hover:bg-gray-800 transition-all"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
