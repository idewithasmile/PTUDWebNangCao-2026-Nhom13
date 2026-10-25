'use client';

import Link from 'next/link';
import {
  FolderTree,
  BookOpen,
  User,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Activity,
  HeartPulse,
  ExternalLink,
  ChefHat,
  Sparkles,
} from 'lucide-react';
import type { UserProfile } from '@/types/auth';

interface AdminDashboardViewProps {
  user: UserProfile;
}

export default function AdminDashboardView({ user }: AdminDashboardViewProps) {
  return (
    <div className="mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Tiêu đề trang và Huy hiệu Quản Trị Viên */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Quản Trị Viên Cấp Cao</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Trung Tâm Quản Trị Hệ Thống
          </h1>
          <p className="mt-1 text-sm text-gray-300 max-w-2xl">
            Xin chào {user.displayName || user.userName}! Bạn đang có toàn quyền quản trị danh mục, giám sát tiến trình nền Hangfire, hệ thống phân tích log và kiểm soát dữ liệu toàn trang.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/recipes/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition transform active:scale-95"
          >
            <ChefHat className="w-5 h-5" />
            <span>Đăng Công Thức</span>
          </Link>
        </div>
      </div>

      {/* Lưới các thẻ quản trị chức năng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Thẻ 1: Quản lý Danh mục Món ăn (FR-CAT) */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FolderTree className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                Quản Lý Danh Mục
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-700">
                FR-CAT
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Thêm mới, chỉnh sửa thông tin, sắp xếp thứ tự và quản lý xóa mềm an toàn các danh mục ẩm thực trên hệ thống.
            </p>
          </div>
          <Link
            href="/dashboard/categories"
            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-orange-600 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 transition"
          >
            <span>Vào Quản Lý Danh Mục</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Thẻ 2: Quản lý Toàn Bộ Công Thức (FR-RCP & FR-SRCH) */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Quản Lý Công Thức
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                FR-RCP
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Duyệt xem toàn bộ kho bài viết nấu ăn, kiểm duyệt công thức, tìm kiếm nâng cao với quyền quản trị viên cao nhất.
            </p>
          </div>
          <Link
            href="/recipes"
            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm"
          >
            <span>Xem Toàn Bộ Công Thức</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Thẻ 3: Tác Vụ Ngầm Hangfire Dashboard (FR-JOB) */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                Hangfire Jobs
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                FR-JOB
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Giám sát hàng đợi gửi email chào mừng (FR-JOB-001), tiến trình resize ảnh MinIO (FR-JOB-002) và lịch tự động sinh sitemap SEO (FR-JOB-003).
            </p>
          </div>
          <a
            href="http://localhost:5001/hangfire"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition shadow-sm"
          >
            <span>Mở Hangfire Dashboard</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Thẻ 4: Giám Sát Log & Tracing (FR-OBS Seq) */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Seq Log Server
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                FR-OBS
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Truy vết lỗi hệ thống tập trung, phân tích Serilog có đính kèm CorrelationId, UserId và Distributed Traces chuẩn OpenTelemetry.
            </p>
          </div>
          <a
            href="http://localhost:5341"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-800 hover:bg-indigo-100 transition shadow-sm"
          >
            <span>Mở Seq Logs Server</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Thẻ 5: Kiểm Tra Sức Khỏe API (Health Checks) */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                Health Checks
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700">
                Liveness
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Kiểm tra tính sẵn sàng (Readiness) và độ phản hồi (Liveness) của kết nối PostgreSQL, Redis Cache và tiến trình API.
            </p>
          </div>
          <a
            href="http://localhost:5001/health/live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <span>Xem Endpoint /health</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Thẻ 6: Hồ sơ cá nhân (FR-AUTH) */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <User className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                Hồ Sơ Quản Trị
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700">
                FR-AUTH
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Cập nhật tên hiển thị, ảnh đại diện, tiểu sử và kiểm tra quyền hạn tài khoản quản trị trong hệ thống.
            </p>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-purple-600 hover:border-purple-200 transition shadow-sm"
          >
            <span>Xem Hồ Sơ Cá Nhân</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
