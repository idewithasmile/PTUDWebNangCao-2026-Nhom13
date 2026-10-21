import Link from 'next/link';
import { ChefHat, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[550px] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-orange-600 mb-6 shadow-sm">
        <ChefHat className="h-10 w-10" />
      </div>
      <span className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-2">
        Mã lỗi 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
        Không Tìm Thấy Trang Yêu Cầu
      </h1>
      <p className="text-base text-gray-500 max-w-md mb-8 leading-relaxed">
        Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng trong hệ thống Culinary Blog.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="default" size="default">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Về Trang Chủ</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="default">
          <Link href="/recipes" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Xem Công Thức</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
