'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Users, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import type { UserProfile } from '@/types/auth';

interface DashboardAuthorsViewProps {
  currentUser: UserProfile;
}

interface AuthorItem {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Author';
  recipesCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl: string | null;
}

export default function DashboardAuthorsView({ currentUser }: DashboardAuthorsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Dữ liệu mẫu khớp Screen 5
  const initialAuthors: AuthorItem[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenyana@gmail.com',
      role: 'Admin',
      recipesCount: 48,
      status: 'ACTIVE',
      avatarUrl: null,
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@gmail.com',
      role: 'Author',
      recipesCount: 32,
      status: 'ACTIVE',
      avatarUrl: null,
    },
    {
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@gmail.com',
      role: 'Author',
      recipesCount: 28,
      status: 'ACTIVE',
      avatarUrl: null,
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      email: 'phamthid@gmail.com',
      role: 'Author',
      recipesCount: 15,
      status: 'ACTIVE',
      avatarUrl: null,
    },
    {
      id: '5',
      name: 'Hoàng Văn E',
      email: 'hoangvane@gmail.com',
      role: 'Author',
      recipesCount: 12,
      status: 'ACTIVE',
      avatarUrl: null,
    },
    {
      id: '6',
      name: currentUser.displayName || 'Nguyễn Thành Minh',
      email: currentUser.email || 'test1@gmail.com',
      role: currentUser.roles?.includes('Admin') ? 'Admin' : 'Author',
      recipesCount: 8,
      status: 'ACTIVE',
      avatarUrl: currentUser.avatarUrl,
    },
  ];

  const filtered = useMemo(() => {
    return initialAuthors.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchRole = roleFilter === 'ALL' || a.role === roleFilter;
      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [searchTerm, roleFilter, statusFilter, initialAuthors]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Quản lý tác giả (Khớp Screen 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Tác giả
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Quản trị danh sách thành viên sáng tạo nội dung, phân quyền và trạng thái hoạt động
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Chức năng thêm tác giả đang sẵn sàng.')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm tác giả</span>
        </button>
      </div>

      {/* Filter Bar (Khớp Screen 5) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm tác giả..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="w-full sm:w-44 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Tạm dừng</option>
          </select>
        </div>

        <div className="w-full sm:w-44 shrink-0">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="Author">Author</option>
          </select>
        </div>
      </div>

      {/* Authors Table (Khớp Screen 5) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-16">Ảnh đại diện</th>
                <th className="py-3 px-4 min-w-[160px]">Tên tác giả</th>
                <th className="py-3 px-4 min-w-[200px]">Email</th>
                <th className="py-3 px-4 text-center w-28">Vai trò</th>
                <th className="py-3 px-4 text-center w-24">Bài viết</th>
                <th className="py-3 px-4 text-center w-28">Trạng thái</th>
                <th className="py-3 px-4 text-right w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((author) => (
                <tr key={author.id} className="hover:bg-gray-50/70 transition group">
                  {/* Avatar */}
                  <td className="py-3 px-4">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-gray-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {author.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={author.avatarUrl}
                          alt={author.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{author.name[0].toUpperCase()}</span>
                      )}
                    </div>
                  </td>

                  {/* Tên */}
                  <td className="py-3 px-4 font-bold text-gray-900">
                    {author.name}
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-gray-500">
                    {author.email}
                  </td>

                  {/* Vai trò */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        author.role === 'Admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'
                      }`}
                    >
                      {author.role}
                    </span>
                  </td>

                  {/* Số bài viết */}
                  <td className="py-3 px-4 text-center font-bold text-gray-800">
                    {author.recipesCount}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                      Hoạt động
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-500">
          <span>
            Hiển thị <strong>{paginated.length}</strong> trong số <strong>{filtered.length}</strong> tác giả
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPage(idx + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                  page === idx + 1
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
