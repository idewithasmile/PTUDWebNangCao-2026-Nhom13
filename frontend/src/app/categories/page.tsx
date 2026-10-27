import { categoryService } from '@/lib/services/category-service';
import CategoriesClientView from '@/components/categories/CategoriesClientView';
import type { Metadata } from 'next';
import type { CategoryDto } from '@/lib/types/category';

export const dynamic = 'force-dynamic';

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

  try {
    categories = await categoryService.getCategories({
      next: { revalidate: 3600 },
    });
  } catch (err) {
    console.error('Lỗi khi tải danh sách danh mục:', err);
    categories = [];
  }

  return <CategoriesClientView initialCategories={categories} />;
}
