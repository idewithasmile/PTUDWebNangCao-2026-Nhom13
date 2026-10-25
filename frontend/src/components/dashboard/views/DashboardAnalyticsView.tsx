'use client';

import { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Eye,
  Users,
  FileText,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';

export default function DashboardAnalyticsView() {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'recipes' | 'users' | 'categories' | 'comments'>('overview');

  const categoryViews = [
    { name: 'Món Việt Nam', count: '38.432', percentage: 43.5, color: 'bg-blue-600' },
    { name: 'Món Á Âu', count: '12.546', percentage: 29.7, color: 'bg-indigo-500' },
    { name: 'Món Chay', count: '7.892', percentage: 18.6, color: 'bg-emerald-500' },
    { name: 'Món Ngọt', count: '3.207', percentage: 7.7, color: 'bg-purple-500' },
    { name: 'Khác', count: '1.211', percentage: 2.9, color: 'bg-slate-400' },
  ];

  const devices = [
    { name: 'Máy tính', percentage: 62.4, color: '#3b82f6' },
    { name: 'Điện thoại', percentage: 28.7, color: '#6366f1' },
    { name: 'Tablet', percentage: 8.9, color: '#a855f7' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Thống kê (Khớp Screen 9) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Thống kê
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Báo cáo tổng hợp số liệu tương tác, truy cập và tăng trưởng nội dung
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>01/09/2026 – 16/09/2026</span>
          </div>

          <button
            type="button"
            onClick={() => alert('Xuất báo cáo định dạng Excel / PDF')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs điều hướng (Khớp Screen 9) */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs font-bold overflow-x-auto">
        {[
          { key: 'overview', label: 'Tổng quan' },
          { key: 'recipes', label: 'Bài viết' },
          { key: 'users', label: 'Người dùng' },
          { key: 'categories', label: 'Danh mục' },
          { key: 'comments', label: 'Bình luận' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveSubTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl transition ${
              activeSubTab === tab.key
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3 KPI Summary Cards (Khớp Screen 9) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Tổng lượt xem */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Tổng lượt xem</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                42.368
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> +18%
          </span>
        </div>

        {/* Card 2: Người dùng mới */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Người dùng mới</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                3.482
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> +24%
          </span>
        </div>

        {/* Card 3: Bài viết mới */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Bài viết mới</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                86
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> +12%
          </span>
        </div>
      </div>

      {/* Row: Lượt xem theo danh mục (Left) + Thiết bị truy cập (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái: Lượt xem theo danh mục */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Lượt xem theo danh mục</h3>
            <p className="text-xs text-gray-400 mt-0.5">Thống kê số lượng lượt xem và tỷ trọng</p>
          </div>

          <div className="space-y-4 pt-2">
            {categoryViews.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-900">
                    {item.count}{' '}
                    <span className="text-gray-400 font-normal text-[11px]">
                      ({item.percentage}%)
                    </span>
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${item.color} h-2.5 rounded-full transition-all duration-700`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Thiết bị truy cập (Donut Chart) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Thiết bị truy cập</h3>
            <p className="text-xs text-gray-400 mt-0.5">Phân bổ nền tảng người dùng truy cập</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto py-4">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0">
              <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="55"
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="24"
                  strokeDasharray={`${(62.4 / 100) * 345.6} 345.6`}
                  strokeDashoffset="0"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="55"
                  fill="transparent"
                  stroke="#6366f1"
                  strokeWidth="24"
                  strokeDasharray={`${(28.7 / 100) * 345.6} 345.6`}
                  strokeDashoffset={`-${(62.4 / 100) * 345.6}`}
                />
                <circle
                  cx="80"
                  cy="80"
                  r="55"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="24"
                  strokeDasharray={`${(8.9 / 100) * 345.6} 345.6`}
                  strokeDashoffset={`-${((62.4 + 28.7) / 100) * 345.6}`}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <Monitor className="w-5 h-5 text-gray-500" />
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs font-semibold">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Máy tính: <strong>62,4%</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span>Điện thoại: <strong>28,7%</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Tablet: <strong>8,9%</strong></span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 text-center border-t border-gray-100 pt-3">
            Tỷ lệ chuyển đổi và thời gian lưu trang cao nhất trên Máy tính
          </div>
        </div>
      </div>
    </div>
  );
}
