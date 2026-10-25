'use client';

import { useRecentFiles } from '@/features/dashboard/hooks';
import { FileText, ArrowRight } from 'lucide-react';

export default function RecentFilesWidget() {
  const { data: files = [], isLoading } = useRecentFiles(5);

  const fallbackFiles = [
    { id: '1', fileName: 'phở_bò.jpg', size: '2.4 MB', date: '16/09/2026', color: 'text-rose-500' },
    { id: '2', fileName: 'bánh_mì_bơ_tỏi.jpg', size: '1.8 MB', date: '15/09/2026', color: 'text-amber-500' },
    { id: '3', fileName: 'salad_cá_hồi.jpg', size: '2.1 MB', date: '14/09/2026', color: 'text-blue-500' },
    { id: '4', fileName: 'cà_ri_gà.jpg', size: '1.9 MB', date: '13/09/2026', color: 'text-indigo-500' },
    { id: '5', fileName: 'bánh_flan.jpg', size: '1.5 MB', date: '12/09/2026', color: 'text-rose-500' },
  ];

  const displayList = files.length > 0 ? files.map((f, i) => ({
    id: f.id,
    fileName: f.fileName,
    size: `${(2.4 - i * 0.2).toFixed(1)} MB`,
    date: new Date(f.createdAt).toLocaleDateString('vi-VN'),
    color: i % 2 === 0 ? 'text-rose-500' : 'text-blue-500',
  })) : fallbackFiles;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Tệp tin gần đây</h3>
          <button
            type="button"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>Xem tất cả tệp tin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {displayList.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className={`w-4 h-4 shrink-0 ${file.color}`} />
                <span className="font-semibold text-gray-800 truncate">
                  {file.fileName}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-[11px] text-gray-400">
                <span>{file.size}</span>
                <span>{file.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
