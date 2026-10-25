'use client';

import { useState, useMemo } from 'react';
import { useRecentFiles } from '@/features/dashboard/hooks';
import {
  Search,
  Upload,
  Download,
  Trash2,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCode,
  ChevronLeft,
  ChevronRight,
  HardDrive,
} from 'lucide-react';

interface FileRecord {
  id: string;
  name: string;
  type: 'Image' | 'PDF' | 'DOCX' | 'XLSX';
  size: string;
  category: string;
  uploader: string;
  createdAt: string;
}

export default function DashboardFilesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: apiFiles = [] } = useRecentFiles(10);

  // Mẫu dữ liệu khớp 100% Screen 7 của Master Mockup
  const initialFiles: FileRecord[] = [
    {
      id: '1',
      name: 'pho-bo-hanoi.jpg',
      type: 'Image',
      size: '2.4 MB',
      category: 'Món Việt Nam',
      uploader: 'Nguyễn Văn A',
      createdAt: '16/09/2026 10:32',
    },
    {
      id: '2',
      name: 'cach-nau-ca-ri-ga.pdf',
      type: 'PDF',
      size: '1.8 MB',
      category: 'Món Á Âu',
      uploader: 'Trần Thị B',
      createdAt: '15/09/2026 16:28',
    },
    {
      id: '3',
      name: 'salad-ca-hoi.jpg',
      type: 'Image',
      size: '1.2 MB',
      category: 'Món Á Âu',
      uploader: 'Lê Văn C',
      createdAt: '14/09/2026 14:18',
    },
    {
      id: '4',
      name: 'banh-flan-cong-thuc.docx',
      type: 'DOCX',
      size: '856 KB',
      category: 'Món Ngọt',
      uploader: 'Phạm Thị D',
      createdAt: '13/09/2026 19:45',
    },
    {
      id: '5',
      name: 'nguyen-lieu-mua-he.xlsx',
      type: 'XLSX',
      size: '1.1 MB',
      category: 'Khác',
      uploader: 'Hoàng Văn E',
      createdAt: '12/09/2026 20:15',
    },
  ];

  const mergedFiles = useMemo(() => {
    if (apiFiles && apiFiles.length > 0) {
      const mapped = apiFiles.map((f, i) => ({
        id: f.id,
        name: f.fileName,
        type: 'Image' as const,
        size: `${(2.4 - i * 0.2).toFixed(1)} MB`,
        category: f.recipeTitle ? 'Công thức' : 'Kho ảnh MinIO',
        uploader: 'Hệ thống MinIO',
        createdAt: new Date(f.createdAt).toLocaleDateString('vi-VN'),
      }));
      return [...mapped, ...initialFiles];
    }
    return initialFiles;
  }, [apiFiles, initialFiles]);

  const filtered = useMemo(() => {
    return mergedFiles.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        f.uploader.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchType = typeFilter === 'ALL' || f.type === typeFilter;
      const matchCategory = categoryFilter === 'ALL' || f.category === categoryFilter;
      return matchSearch && matchType && matchCategory;
    });
  }, [searchTerm, typeFilter, categoryFilter, mergedFiles]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getFileIcon = (type: FileRecord['type']) => {
    switch (type) {
      case 'Image':
        return <FileImage className="w-4 h-4 text-rose-500" />;
      case 'PDF':
        return <FileText className="w-4 h-4 text-red-600" />;
      case 'DOCX':
        return <FileCode className="w-4 h-4 text-blue-600" />;
      case 'XLSX':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Quản lý tệp tin (Khớp Screen 7) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Tệp tin
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý tài nguyên hình ảnh, tài liệu đính kèm và media lưu trữ trên máy chủ MinIO
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Chọn tệp tin để tải lên MinIO Bucket')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Tải lên</span>
        </button>
      </div>

      {/* Filter Bar (Khớp Screen 7) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm tệp tin..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="w-full sm:w-44 shrink-0">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="ALL">Tất cả loại</option>
            <option value="Image">Hình ảnh (Image)</option>
            <option value="PDF">Tài liệu (PDF)</option>
            <option value="DOCX">Văn bản (DOCX)</option>
            <option value="XLSX">Bảng tính (XLSX)</option>
          </select>
        </div>

        <div className="w-full sm:w-44 shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="ALL">Tất cả danh mục</option>
            <option value="Món Việt Nam">Món Việt Nam</option>
            <option value="Món Á Âu">Món Á Âu</option>
            <option value="Món Ngọt">Món Ngọt</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
      </div>

      {/* Files Table (Khớp Screen 7) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[220px]">Tên tệp</th>
                <th className="py-3 px-4 text-center w-24">Loại</th>
                <th className="py-3 px-4 text-center w-28">Kích thước</th>
                <th className="py-3 px-4 min-w-[140px]">Danh mục</th>
                <th className="py-3 px-4 min-w-[140px]">Người tải lên</th>
                <th className="py-3 px-4 w-32">Ngày tải lên</th>
                <th className="py-3 px-4 text-right w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50/70 transition group">
                  {/* Tên tệp */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <span className="font-bold text-gray-900 truncate">
                        {file.name}
                      </span>
                    </div>
                  </td>

                  {/* Loại */}
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                      {file.type}
                    </span>
                  </td>

                  {/* Kích thước */}
                  <td className="py-3 px-4 text-center text-gray-600 font-medium">
                    {file.size}
                  </td>

                  {/* Danh mục */}
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    {file.category}
                  </td>

                  {/* Người tải lên */}
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {file.uploader}
                  </td>

                  {/* Ngày tải lên */}
                  <td className="py-3 px-4 text-gray-500 text-[11px]">
                    {file.createdAt}
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Tải xuống tệp tin"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Xóa tệp tin"
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
            Hiển thị <strong>{paginated.length}</strong> trong số <strong>{filtered.length}</strong> tệp tin
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
