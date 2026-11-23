// ------------------------------------------------------------------------------------------------
// Trang Danh Sách & Tìm Kiếm Công Thức Nấu Ăn (Server Component)
// Nhiệm vụ: FR-RCP-004 (Xem danh sách, tìm kiếm, lọc theo danh mục/độ khó, phân trang)
// Kỹ thuật: Sử dụng React <Suspense> bao bọc Client Component để hỗ trợ đọc URL Query Parameters 
// (useSearchParams) mà không phá vỡ khả năng Streaming SSR của Next.js 15.
// ------------------------------------------------------------------------------------------------

import { Suspense } from 'react';
import RecipesClientView from '@/components/recipes/RecipesClientView';
import { Loader2 } from 'lucide-react';

// Thẻ metadata tĩnh cho trang danh mục công thức (phục vụ SEO)
export const metadata = {
  title: 'Công thức Nấu ăn | Culinary Blog',
  description: 'Khám phá hàng ngàn công thức nấu ăn ngon, phong phú và dễ làm.',
};

export default function RecipesPage() {
  return (
    // Bắt buộc dùng Suspense bao bọc component con có hook useSearchParams()
    // Giúp hiển thị spinner xoay tròn mượt mà trong khi nạp tham số tìm kiếm từ URL
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      }
    >
      {/* Component phía Client quản lý state bộ lọc, danh sách thẻ RecipeCard và thanh phân trang */}
      <RecipesClientView />
    </Suspense>
  );
}
