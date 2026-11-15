'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  MailX,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import {
  newsletterService,
  type NewsletterSubscriberDto,
  type NewsletterSubscribersListDto,
} from '@/lib/services/newsletter-service';
import { useToastStore } from '@/features/toast/useToastStore';
import { toErrorMessage } from '@/features/auth/hooks';

export default function DashboardSubscribersView() {
  const { addToast } = useToastStore();
  const [data, setData] = useState<NewsletterSubscribersListDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const [isExporting, setIsExporting] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<NewsletterSubscriberDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadSubscribers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await newsletterService.getSubscribers({
        search: debouncedSearch.trim() || undefined,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
        page,
        pageSize,
      });
      setData(res);
    } catch (err) {
      setError(toErrorMessage(err, 'Không thể tải danh sách email khách hàng.'));
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, page]);

  useEffect(() => {
    loadSubscribers();
  }, [loadSubscribers]);

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const blob = await newsletterService.exportCsv(
        statusFilter === 'all' ? undefined : statusFilter === 'active',
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `culinary-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      addToast({
        type: 'success',
        title: 'Xuất file CSV thành công',
        message: 'Danh sách email khách hàng đã được tải xuống.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Lỗi xuất CSV',
        message: toErrorMessage(err, 'Không thể xuất file CSV.'),
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!subscriberToDelete) return;
    setIsDeleting(true);
    try {
      await newsletterService.deleteSubscriber(subscriberToDelete.id);
      addToast({
        type: 'success',
        title: 'Đã xóa khách hàng',
        message: `Đã xóa ${subscriberToDelete.email} khỏi danh sách bản tin.`,
      });
      setSubscriberToDelete(null);
      await loadSubscribers();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Không thể xóa',
        message: toErrorMessage(err, 'Đã xảy ra lỗi khi xóa.'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / pageSize)) : 1;
  const totalAll = (data?.activeCount ?? 0) + (data?.unsubscribedCount ?? 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-[11px] font-bold text-orange-300 border border-orange-500/30">
            <Mail className="h-3.5 w-3.5" />
            <span>Chăm sóc Khách hàng &amp; Bản tin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Danh sách Email Khách hàng
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Quản lý độc giả đã để lại email nhận công thức nấu ăn và bản tin hàng tuần.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={loadSubscribers}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting || totalAll === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isExporting ? 'Đang xuất…' : 'Xuất CSV'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center gap-4 shadow-2xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Tổng số đăng ký</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100">{totalAll}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center gap-4 shadow-2xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Đang nhận bản tin</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {data?.activeCount ?? 0}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center gap-4 shadow-2xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <MailX className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Đã hủy đăng ký</p>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {data?.unsubscribedCount ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo email, tên khách hàng, chủ đề…"
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {status === 'all' ? 'Tất cả' : status === 'active' ? 'Đang hoạt động' : 'Đã hủy'}
            </button>
          ))}
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-500 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span>Đang tải danh sách khách hàng…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-rose-500" />
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <button
              type="button"
              onClick={loadSubscribers}
              className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold"
            >
              Thử lại
            </button>
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Mail className="h-10 w-10 mx-auto text-slate-300 dark:text-zinc-700" />
            <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">Chưa có email khách hàng nào</p>
            <p className="text-xs text-slate-400">
              Các khách hàng để lại email tại trang chủ, footer hoặc trang công thức sẽ hiển thị tại đây.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3.5">Email khách hàng</th>
                  <th className="px-4 py-3.5">Tên hiển thị</th>
                  <th className="px-4 py-3.5">Chủ đề quan tâm</th>
                  <th className="px-4 py-3.5">Nguồn</th>
                  <th className="px-4 py-3.5">Trạng thái</th>
                  <th className="px-4 py-3.5">Ngày đăng ký</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition">
                    <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-zinc-100">{item.email}</td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-zinc-300">
                      {item.customerName || <span className="italic text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      {item.favoriteCategorySlug ? (
                        <span className="inline-flex rounded-full bg-orange-50 dark:bg-orange-500/15 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:text-orange-300">
                          {item.favoriteCategorySlug}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex rounded-lg bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-zinc-300">
                        {item.source}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Đang nhận
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Đã hủy
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-zinc-400">
                      {new Date(item.subscribedAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSubscriberToDelete(item)}
                        className="inline-flex items-center gap-1 rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                        title="Xóa khách hàng này"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 px-4 py-3 text-xs text-slate-500">
            <span>
              Trang {page} / {totalPages} ({data.totalCount} kết quả)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 dark:border-zinc-700 p-1.5 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 dark:border-zinc-700 p-1.5 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal xác nhận xóa */}
      {subscriberToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !isDeleting && setSubscriberToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">Xác nhận xóa email khách hàng</h3>
              <button
                type="button"
                onClick={() => setSubscriberToDelete(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-zinc-300">
              Bạn có chắc chắn muốn xóa <strong>{subscriberToDelete.email}</strong> khỏi danh sách nhận bản tin ẩm thực?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setSubscriberToDelete(null)}
                className="rounded-xl border border-slate-200 dark:border-zinc-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-zinc-300"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
              >
                {isDeleting ? 'Đang xóa…' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
