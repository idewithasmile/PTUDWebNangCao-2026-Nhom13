'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Edit2, Eye, EyeOff, MessageSquare, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CommentItem {
  id: string;
  authorName: string;
  avatarUrl: string | null;
  content: string;
  recipeTitle: string;
  recipeSlug: string;
  createdAt: string;
  status: 'VISIBLE' | 'HIDDEN';
}

export default function DashboardCommentsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: '1',
      authorName: 'Trần Thị Mai',
      avatarUrl: null,
      content: 'Công thức rất ngon, mình đã thử và...',
      recipeTitle: 'Cách làm phở bò...',
      recipeSlug: 'pho-bo-truyen-thong',
      createdAt: '16/09/2026 12:14',
      status: 'VISIBLE',
    },
    {
      id: '2',
      authorName: 'Lê Văn Hùng',
      avatarUrl: null,
      content: 'Có thể chia sẻ thêm cách chọn nguyên liệu...',
      recipeTitle: 'Cách nấu cà ri gà...',
      recipeSlug: 'ca-ri-ga-nuoc-cot-dua',
      createdAt: '15/09/2026 16:20',
      status: 'VISIBLE',
    },
    {
      id: '3',
      authorName: 'Nguyễn Thị Hoa',
      avatarUrl: null,
      content: 'Món này có thể thay thế bằng sữa tươi không?',
      recipeTitle: 'Bánh flan mềm...',
      recipeSlug: 'banh-flan-mem-min',
      createdAt: '14/09/2026 16:10',
      status: 'VISIBLE',
    },
    {
      id: '4',
      authorName: 'Phạm Văn Nam',
      avatarUrl: null,
      content: 'Rất tuyệt vời! Cảm ơn tác giả.',
      recipeTitle: 'Salad cá hồi...',
      recipeSlug: 'salad-ca-hoi-tuoi-mat',
      createdAt: '13/09/2026 14:05',
      status: 'VISIBLE',
    },
    {
      id: '5',
      authorName: 'Hoàng Thị Lan',
      avatarUrl: null,
      content: 'Hướng dẫn chi tiết, dễ hiểu.',
      recipeTitle: 'Phở bò Hà Nội',
      recipeSlug: 'pho-bo-truyen-thong',
      createdAt: '12/09/2026 11:45',
      status: 'HIDDEN',
    },
  ]);

  const toggleStatus = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE' } : c
      )
    );
  };

  const filtered = useMemo(() => {
    return comments.filter((c) => {
      const matchSearch =
        c.authorName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        c.content.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        c.recipeTitle.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter, comments]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Quản lý bình luận (Khớp Screen 6) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Bình luận
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Kiểm duyệt và phản hồi các bình luận, trao đổi từ độc giả trên các bài viết
          </p>
        </div>
      </div>

      {/* Filter Bar (Khớp Screen 6) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col lg:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bình luận..."
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
            <option value="VISIBLE">Hiển thị</option>
            <option value="HIDDEN">Đang ẩn</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl shrink-0">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Từ ngày → Đến ngày</span>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition shrink-0"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Lọc</span>
        </button>
      </div>

      {/* Comments Table (Khớp Screen 6) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[160px]">Người bình luận</th>
                <th className="py-3 px-4 min-w-[280px]">Nội dung</th>
                <th className="py-3 px-4 min-w-[180px]">Bài viết</th>
                <th className="py-3 px-4 w-32">Thời gian</th>
                <th className="py-3 px-4 text-center w-28">Trạng thái</th>
                <th className="py-3 px-4 text-right w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50/70 transition group">
                  {/* Người bình luận */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center font-bold text-slate-700 text-[10px] shrink-0">
                        {comment.authorName[0]}
                      </div>
                      <span className="font-bold text-gray-900 truncate">
                        {comment.authorName}
                      </span>
                    </div>
                  </td>

                  {/* Nội dung */}
                  <td className="py-3 px-4 text-gray-700 font-medium line-clamp-2 max-w-sm">
                    {comment.content}
                  </td>

                  {/* Bài viết */}
                  <td className="py-3 px-4 font-semibold text-blue-600 hover:text-blue-700 truncate max-w-xs">
                    <Link href={`/recipes/${comment.recipeSlug}`}>
                      {comment.recipeTitle}
                    </Link>
                  </td>

                  {/* Thời gian */}
                  <td className="py-3 px-4 text-gray-500 text-[11px]">
                    {comment.createdAt}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        comment.status === 'VISIBLE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                      }`}
                    >
                      {comment.status === 'VISIBLE' ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => toggleStatus(comment.id)}
                        className={`p-1.5 rounded-lg transition ${
                          comment.status === 'VISIBLE'
                            ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={comment.status === 'VISIBLE' ? 'Ẩn bình luận' : 'Hiển thị bình luận'}
                      >
                        {comment.status === 'VISIBLE' ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Chỉnh sửa / Phản hồi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
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
            Hiển thị <strong>{paginated.length}</strong> trong số <strong>{filtered.length}</strong> bình luận
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
