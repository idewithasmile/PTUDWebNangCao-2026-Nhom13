'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/features/auth/hooks';
import { hasSession } from '@/features/auth/api';
import UnifiedDashboardView from '@/components/dashboard/UnifiedDashboardView';
import { Loader2 } from 'lucide-react';

/**
 * Trang Bảng Điều Khiển Trung Tâm (/dashboard).
 * Hiển thị giao diện Dashboard chuẩn mực 18 khu vực chức năng theo thiết kế minh họa:
 * Tự động phân quyền hiển thị theo Role (Admin vs Author), tích hợp 100% dữ liệu REST API thực tế.
 */
export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [canFetch, setCanFetch] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCanFetch(hasSession());
  }, []);

  const { data: user, isLoading, isError } = useMe(canFetch);

  useEffect(() => {
    if (mounted && !hasSession()) {
      router.push('/login');
    }
  }, [mounted, router]);

  if (!mounted || !canFetch || isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#f4f7fc] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        <p className="text-xs text-gray-400 font-medium tracking-wide">
          Đang tải bảng điều khiển của bạn...
        </p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen w-full bg-[#f4f7fc] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm border border-red-100">
            Không thể xác thực danh tính người dùng hoặc phiên đăng nhập đã hết hạn.
          </div>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full py-3 rounded-2xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition shadow-sm"
          >
            Đến trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return <UnifiedDashboardView user={user} />;
}
