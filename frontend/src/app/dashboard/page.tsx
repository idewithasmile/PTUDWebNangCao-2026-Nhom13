import Link from 'next/link';
import {
  FolderTree,
  BookOpen,
  User,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

/**
 * Trang Bảng Điều Khiển Quản Trị (Admin Dashboard).
 * Cung cấp lối tắt điều hướng trực tiếp đến các phân hệ quản lý:
 * - Quản lý Danh mục (FR-CAT): /dashboard/categories
 * - Quản lý Công thức (FR-RCP & FR-SRCH): /recipes
 * - Hồ sơ cá nhân (FR-AUTH): /profile
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Tiêu đề trang và Huy hiệu Quản Trị Viên chuẩn Unicode tiếng Việt */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-orange-600" />
          <span>Quản Trị Viên</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Bảng Điều Khiển Quản Trị
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Trung tâm quản trị nội dung hệ thống Culinary Blog — truy cập nhanh các phân hệ quản lý danh mục, công thức và hồ sơ cá nhân.
        </p>
      </div>

      {/* Lưới các thẻ quản trị chức năng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thẻ 1: Quản lý Danh mục Món ăn (FR-CAT) dẫn trực tiếp đến /dashboard/categories */}
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
              Thêm mới, chỉnh sửa thông tin, sắp xếp thứ tự và quản lý xóa mềm an toàn các danh mục ẩm thực.
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

        {/* Thẻ 2: Quản lý Công thức Nấu ăn (FR-RCP & FR-SRCH) */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
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
              Duyệt xem kho bài viết công thức nấu ăn, các bước thực hiện, thông tin dinh dưỡng và nguyên liệu món ăn.
            </p>
          </div>
          <Link
            href="/recipes"
            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm"
          >
            <span>Xem Danh Sách Công Thức</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Thẻ 3: Hồ sơ cá nhân (FR-AUTH) */}
        <div className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <User className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                Hồ Sơ Cá Nhân
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700">
                FR-AUTH
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Cập nhật tên hiển thị, ảnh đại diện, tiểu sử tác giả và kiểm tra vai trò người dùng trong hệ thống.
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
