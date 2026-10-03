import { categoryService } from '@/lib/services/category-service';
import CategoryCard from '@/components/categories/CategoryCard';
import { ChefHat, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

import { CategoryDto } from '@/lib/types/category';

export const revalidate = 3600; // ISR revalidate 1 giờ theo yêu cầu SPEC

export const metadata: Metadata = {
  title: 'Danh mục món ăn | Culinary Blog',
  description:
    'Khám phá thế giới ẩm thực phong phú với hàng trăm công thức nấu ăn được phân loại theo các danh mục đặc sắc.',
  openGraph: {
    title: 'Danh mục món ăn | Culinary Blog',
    description: 'Khám phá thế giới ẩm thực phong phú cùng Culinary Blog',
  },
};

export default async function CategoriesPage() {
  let categories: CategoryDto[] = [];
  let errorMsg: string | null = null;

  try {
    categories = await categoryService.getCategories({
      next: { revalidate: 3600 },
    });
  } catch (err) {
    console.error('Lỗi khi tải danh sách danh mục:', err);
    errorMsg = 'Không thể tải danh sách danh mục lúc này. Vui lòng thử lại sau.';
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Thế giới ẩm thực</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
          Danh Mục <span className="text-orange-600">Món Ăn</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
          Tìm kiếm cảm hứng cho bữa ăn hàng ngày qua các bộ sưu tập công thức phong phú từ món khai
          vị, món chính, đến các món tráng miệng hấp dẫn.
        </p>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 max-w-xl mx-auto mb-10">
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Grid Danh mục */}
      {!errorMsg && categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 p-8 max-w-lg mx-auto">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">Chưa có danh mục nào</h3>
          <p className="text-sm text-gray-500 mt-2">
            Hệ thống đang được cập nhật các danh mục ẩm thực mới. Bạn hãy quay lại sau nhé!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
