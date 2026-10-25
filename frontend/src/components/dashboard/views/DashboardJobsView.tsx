'use client';

import { useState, useMemo } from 'react';
import {
  Cpu,
  Search,
  RefreshCw,
  Play,
  RotateCcw,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Activity,
} from 'lucide-react';

interface JobItem {
  id: string;
  name: string;
  type: 'Background' | 'System';
  status: 'Đang chạy' | 'Đang chờ' | 'Hoàn thành' | 'Thất bại';
  progress: number;
  createdAt: string;
}

export default function DashboardJobsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mẫu dữ liệu khớp 100% Screen 8 của Master Mockup
  const [jobs, setJobs] = useState<JobItem[]>([
    {
      id: '1',
      name: 'Đồng bộ dữ liệu từ MinIO',
      type: 'Background',
      status: 'Đang chạy',
      progress: 60,
      createdAt: '16/09/2026 10:30',
    },
    {
      id: '2',
      name: 'Tạo thumbnail bài viết',
      type: 'Background',
      status: 'Đang chạy',
      progress: 45,
      createdAt: '16/09/2026 09:45',
    },
    {
      id: '3',
      name: 'Gửi email thông báo',
      type: 'Background',
      status: 'Đang chờ',
      progress: 0,
      createdAt: '16/09/2026 08:20',
    },
    {
      id: '4',
      name: 'Sao lưu dữ liệu DB',
      type: 'System',
      status: 'Hoàn thành',
      progress: 100,
      createdAt: '15/09/2026 22:00',
    },
    {
      id: '5',
      name: 'Tối ưu Full-Text Search',
      type: 'System',
      status: 'Hoàn thành',
      progress: 100,
      createdAt: '15/09/2026 20:15',
    },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleCancel = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'Thất bại', progress: 0 } : j))
    );
  };

  const handleRetry = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'Đang chạy', progress: 20 } : j))
    );
  };

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchSearch = j.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchStatus = statusFilter === 'ALL' || j.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter, jobs]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Công việc (Job) (Khớp Screen 8) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Công việc (Job) và tiến trình</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Giám sát các tác vụ ngầm chạy nền, xử lý ảnh MinIO và tiến trình định kỳ của hệ thống
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="http://localhost:5001/hangfire"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs shadow-2xs transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Hangfire Dashboard</span>
          </a>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Khớp Screen 8) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm công việc..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="w-full sm:w-48 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Đang chạy">Đang chạy</option>
            <option value="Đang chờ">Đang chờ</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Jobs Table (Khớp Screen 8) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[220px]">Tên công việc</th>
                <th className="py-3 px-4 text-center w-28">Loại</th>
                <th className="py-3 px-4 text-center w-32">Trạng thái</th>
                <th className="py-3 px-4 min-w-[180px]">Tiến trình</th>
                <th className="py-3 px-4 w-36">Thời gian tạo</th>
                <th className="py-3 px-4 text-right w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/70 transition group">
                  {/* Tên công việc */}
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {job.name}
                  </td>

                  {/* Loại */}
                  <td className="py-3.5 px-4 text-center text-gray-600 font-medium">
                    <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-700">
                      {job.type}
                    </span>
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        job.status === 'Đang chạy'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : job.status === 'Đang chờ'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                          : job.status === 'Hoàn thành'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>

                  {/* Tiến trình (% bar) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex-1">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            job.status === 'Hoàn thành'
                              ? 'bg-blue-600'
                              : job.status === 'Đang chờ'
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-gray-700 w-9 text-right shrink-0">
                        {job.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Thời gian tạo */}
                  <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                    {job.createdAt}
                  </td>

                  {/* Thao tác */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {job.status === 'Đang chạy' || job.status === 'Đang chờ' ? (
                        <button
                          type="button"
                          onClick={() => handleCancel(job.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hủy tiến trình"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRetry(job.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Chạy lại tiến trình"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
