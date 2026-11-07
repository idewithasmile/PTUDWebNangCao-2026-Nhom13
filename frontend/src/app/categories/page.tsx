import { categoryService } from '@/lib/services/category-service';
import CategoriesClientView from '@/components/categories/CategoriesClientView';
import type { Metadata } from 'next';

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
  const { categories, isOffline } = await categoryService.getCategoriesSafe({
    next: { revalidate: 3600 },
  });

  return <CategoriesClientView initialCategories={categories} isOffline={isOffline} />;
}
