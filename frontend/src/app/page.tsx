import { Suspense } from 'react';
import HomeClientView from '@/components/home/HomeClientView';
import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Culinary Blog - Nền Tảng Công Thức Ẩm Thực & Món Ngon Mỗi Ngày',
  description:
    'Khám phá hàng trăm công thức nấu ăn chuẩn vị từ mâm cơm gia đình đến món tiệc tinh tế. Hướng dẫn chi tiết từng bước, định lượng nguyên liệu và bảng tính dinh dưỡng chuẩn xác.',
};

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] w-full flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          <p className="text-xs text-gray-500 font-medium">Đang tải trang chủ Culinary Blog...</p>
        </div>
      }
    >
      <HomeClientView />
    </Suspense>
  );
}
