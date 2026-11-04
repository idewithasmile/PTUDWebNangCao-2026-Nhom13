'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ChefHat,
  UserCheck,
  UserX,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  BookOpen,
  Mail,
  Eye,
  Lock,
  Unlock,
  AlertCircle,
  X,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import type { UserProfile } from '@/types/auth';
import type {
  PagedUsersResultDto,
  UserSummaryDto,
} from '@/lib/types/user-management';
import { userService } from '@/lib/services/user-service';
import { resolveMediaUrl } from '@/lib/utils';

interface DashboardUsersViewProps {
  user: UserProfile;
  isAdmin: boolean;
}

export default function DashboardUsersView({
  user,
  isAdmin,
}: DashboardUsersViewProps) {
  // State quản lý danh sách & bộ lọc
  const [data, setData] = useState<PagedUsersResultDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal xem chi tiết
  const [selectedUser, setSelectedUser] = useState<UserSummaryDto | null>(null);

  // Modal xác nhận khóa / mở khóa tài khoản
  const [userToToggle, setUserToToggle] = useState<{
    id: string;
    name: string;
    targetStatus: boolean;
  } | null>(null);
  const [isSubmittingToggle, setIsSubmittingToggle] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Debounce tìm kiếm 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset về trang 1 khi gõ từ khóa mới
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Hàm tải dữ liệu người dùng
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userService.getUsers({
        searchTerm: debouncedSearch.trim() || undefined,
        role: roleFilter !== 'All' ? roleFilter : undefined,
        isActive:
          statusFilter === 'Active'
            ? true
            : statusFilter === 'Inactive'
            ? false
            : undefined,
        page,
        pageSize,
      });
      setData(res);
    } catch (err) {
      console.error('Lỗi khi tải danh sách người dùng:', err);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, roleFilter, statusFilter, page, pageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Xử lý khóa / mở khóa tài khoản
  const handleConfirmToggleStatus = async () => {
    if (!userToToggle) return;
    setIsSubmittingToggle(true);
    try {
      const res = await userService.toggleUserStatus(
        userToToggle.id,
        userToToggle.targetStatus
      );
      setToastMessage(res.message || 'Cập nhật trạng thái người dùng thành công.');
      setUserToToggle(null);
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái.';
      alert(msg);
    } finally {
      setIsSubmittingToggle(false);
    }
  };

  // Tự ẩn thông báo toast sau 4 giây
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const stats = data?.stats;

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Toast thông báo thành công */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header & Giới thiệu phạm vi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {isAdmin ? 'Quản lý Người dùng & Tác giả' : 'Cộng đồng Tác giả & Quản trị'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {isAdmin
                  ? 'Xem, tìm kiếm, lọc phân quyền và quản trị toàn bộ tài khoản trong hệ thống'
                  : 'Khám phá danh bạ tác giả, đầu bếp ẩm thực và giao lưu chia sẻ công thức'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => loadUsers()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 2. Dải thẻ thống kê nhanh (KPI Summary Strip) */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-50 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tổng tài khoản
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                {stats.totalUsers.toLocaleString('vi-VN')}
              </h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-50 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Quản trị viên
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                {stats.totalAdmins.toLocaleString('vi-VN')}
              </h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-50 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tác giả bài viết
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                {stats.totalAuthors.toLocaleString('vi-VN')}
              </h3>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-50 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Đang hoạt động
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                {stats.totalActive.toLocaleString('vi-VN')}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* 3. Thanh tìm kiếm, bộ lọc & công tắc chế độ xem */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Ô tìm kiếm từ khóa */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên hiển thị, tên đăng nhập hoặc email..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Nhóm bộ lọc & Nút view mode */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Lọc theo vai trò */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-medium">Vai trò:</span>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="All">Tất cả vai trò</option>
                <option value="Admin">Quản trị viên (Admin)</option>
                <option value="Author">Tác giả (Author)</option>
                {isAdmin && <option value="Reader">Độc giả (Reader)</option>}
              </select>
            </div>

            {/* Lọc theo trạng thái (chỉ Admin) */}
            {isAdmin && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Trạng thái:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="All">Tất cả</option>
                  <option value="Active">Đang hoạt động</option>
                  <option value="Inactive">Đã khóa</option>
                </select>
              </div>
            )}

            {/* Chuyển đổi Dạng bảng vs Dạng lưới */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Xem dạng bảng"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Xem dạng lưới thẻ"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Thông báo kết quả tìm kiếm */}
        {data && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>
              Tìm thấy <strong className="text-slate-800">{data.totalCount}</strong> tài khoản
              {debouncedSearch && ` khớp với từ khóa "${debouncedSearch}"`}
            </span>
            <span>Trang {data.page} / {Math.max(1, data.totalPages)}</span>
          </div>
        )}
      </div>

      {/* 4. Nội dung hiển thị chính (Bảng hoặc Lưới) */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Đang tải danh sách tài khoản từ cơ sở dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-3xl border border-red-200 text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => loadUsers()}
            className="text-xs font-bold text-red-600 underline hover:text-red-800"
          >
            Thử lại
          </button>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">Không tìm thấy người dùng phù hợp</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Hãy thử tìm kiếm với từ khóa khác hoặc thiết lập lại bộ lọc vai trò và trạng thái.
          </p>
          {(searchTerm || roleFilter !== 'All' || statusFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('All');
                setStatusFilter('All');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition"
            >
              Đặt lại tất cả bộ lọc
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* ================= CHẾ ĐỘ DẠNG BẢNG (TABLE VIEW) ================= */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Tài khoản & Tên</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Vai trò</th>
                  <th className="py-3.5 px-4 text-center">Công thức</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Ngày tham gia</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.items.map((u) => {
                  const isAdminRole = u.roles.includes('Admin');
                  const isAuthorRole = u.roles.includes('Author');

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Cột 1: Avatar + Tên */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs">
                            {u.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={resolveMediaUrl(u.avatarUrl)}
                                alt={u.displayName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span>{(u.displayName || u.userName || 'U')[0].toUpperCase()}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">
                              {u.displayName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono truncate">
                              @{u.userName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Email */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {u.email || '—'}
                      </td>

                      {/* Cột 3: Vai trò */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <span
                              key={r}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                r === 'Admin'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : r === 'Author'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {r === 'Admin' ? 'Quản trị viên' : r === 'Author' ? 'Tác giả' : r}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Cột 4: Số lượng công thức */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg text-xs">
                          <ChefHat className="w-3.5 h-3.5 text-orange-600" />
                          <span>{u.totalRecipes}</span>
                          <span className="text-[10px] text-emerald-600 font-normal">
                            ({u.publishedRecipes} đã đăng)
                          </span>
                        </span>
                      </td>

                      {/* Cột 5: Trạng thái kích hoạt */}
                      <td className="py-3 px-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Đã khóa</span>
                          </span>
                        )}
                      </td>

                      {/* Cột 6: Ngày tham gia */}
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                      </td>

                      {/* Cột 7: Nút Thao tác */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition"
                            title="Xem chi tiết người dùng"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() =>
                                setUserToToggle({
                                  id: u.id,
                                  name: u.displayName,
                                  targetStatus: !u.isActive,
                                })
                              }
                              disabled={u.id === user.id}
                              className={`p-1.5 rounded-lg transition ${
                                u.id === user.id
                                  ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                                  : u.isActive
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                              }`}
                              title={
                                u.id === user.id
                                  ? 'Không thể tự khóa tài khoản của chính mình'
                                  : u.isActive
                                  ? 'Tạm khóa tài khoản'
                                  : 'Mở khóa tài khoản'
                              }
                            >
                              {u.isActive ? (
                                <Lock className="w-3.5 h-3.5" />
                              ) : (
                                <Unlock className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= CHẾ ĐỘ DẠNG LƯỚI THẺ (GRID CARDS VIEW) ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.items.map((u) => {
            const isAdminRole = u.roles.includes('Admin');
            const isAuthorRole = u.roles.includes('Author');

            return (
              <div
                key={u.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Banner header của thẻ */}
                  <div className="h-16 bg-linear-to-r from-blue-600/10 via-purple-600/10 to-amber-600/10 relative p-3 flex justify-between items-start">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        isAdminRole
                          ? 'bg-purple-100 text-purple-700 border-purple-200'
                          : isAuthorRole
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}
                    >
                      {isAdminRole ? 'Quản trị viên' : isAuthorRole ? 'Tác giả' : 'Độc giả'}
                    </span>

                    {u.isActive ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs ring-4 ring-white" title="Đang hoạt động" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shadow-xs ring-4 ring-white" title="Đã khóa" />
                    )}
                  </div>

                  {/* Avatar và Thông tin chính */}
                  <div className="px-5 -mt-7">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md flex items-center justify-center font-bold text-slate-700 text-base">
                      {u.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveMediaUrl(u.avatarUrl)}
                          alt={u.displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{(u.displayName || u.userName || 'U')[0].toUpperCase()}</span>
                      )}
                    </div>

                    <div className="mt-2.5">
                      <h4 className="font-extrabold text-slate-900 text-sm truncate">
                        {u.displayName}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        @{u.userName}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 min-h-8">
                      {u.bio || 'Chưa có lời giới thiệu cá nhân.'}
                    </p>
                  </div>
                </div>

                {/* Footer thông số và nút tác vụ */}
                <div className="p-5 pt-3 border-t border-slate-100 mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-orange-500" />
                      <span>{u.totalRecipes} món ăn</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(u)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem hồ sơ</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() =>
                          setUserToToggle({
                            id: u.id,
                            name: u.displayName,
                            targetStatus: !u.isActive,
                          })
                        }
                        disabled={u.id === user.id}
                        className={`p-2 rounded-xl transition ${
                          u.id === user.id
                            ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'
                            : u.isActive
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                        }`}
                        title={
                          u.id === user.id
                            ? 'Không thể tự khóa tài khoản'
                            : u.isActive
                            ? 'Tạm khóa'
                            : 'Mở khóa'
                        }
                      >
                        {u.isActive ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Phân trang (Pagination) */}
      {data && data.totalPages > 1 && (
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!data.hasPreviousPage}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trang trước</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Trang <strong className="text-slate-900">{data.page}</strong> / {data.totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={!data.hasNextPage}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <span>Trang sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= MODAL CHI TIẾT NGƯỜI DÙNG ================= */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="h-20 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 relative p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-6 -mt-10 space-y-4">
              <div className="flex items-end justify-between">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-lg flex items-center justify-center font-bold text-slate-700 text-2xl">
                  {selectedUser.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveMediaUrl(selectedUser.avatarUrl)}
                      alt={selectedUser.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {(selectedUser.displayName || selectedUser.userName || 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-1">
                    {selectedUser.roles.map((r) => (
                      <span
                        key={r}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {r === 'Admin' ? 'Quản trị viên' : r === 'Author' ? 'Tác giả' : r}
                      </span>
                    ))}
                  </div>
                  {selectedUser.isActive ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Đang hoạt động
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Đã bị khóa
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {selectedUser.displayName}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  @{selectedUser.userName}
                </p>
              </div>

              {selectedUser.bio && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">Tiểu sử:</p>
                  <p>{selectedUser.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] text-slate-400">Email liên hệ</p>
                  <p className="font-semibold text-slate-800 truncate mt-0.5">
                    {selectedUser.email || '—'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] text-slate-400">Ngày tham gia</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {new Date(selectedUser.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-100">
                  <p className="text-[11px] text-orange-600 font-medium">Tổng bài viết</p>
                  <p className="text-base font-extrabold text-orange-700 mt-0.5">
                    {selectedUser.totalRecipes} món
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <p className="text-[11px] text-emerald-600 font-medium">Đã xuất bản</p>
                  <p className="text-base font-extrabold text-emerald-700 mt-0.5">
                    {selectedUser.publishedRecipes} món
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                >
                  Đóng thông tin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN KHÓA / MỞ KHÓA TÀI KHOẢN ================= */}
      {userToToggle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setUserToToggle(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto bg-slate-100 text-slate-800">
              {userToToggle.targetStatus ? (
                <Unlock className="w-6 h-6 text-emerald-600" />
              ) : (
                <Lock className="w-6 h-6 text-rose-600" />
              )}
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">
                {userToToggle.targetStatus
                  ? 'Kích hoạt lại tài khoản?'
                  : 'Tạm khóa tài khoản người dùng?'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bạn có chắc chắn muốn {userToToggle.targetStatus ? 'mở khóa' : 'tạm khóa'} tài khoản của{' '}
                <strong className="text-slate-800">{userToToggle.name}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setUserToToggle(null)}
                disabled={isSubmittingToggle}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleStatus}
                disabled={isSubmittingToggle}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  userToToggle.targetStatus
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isSubmittingToggle && (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Xác nhận</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
