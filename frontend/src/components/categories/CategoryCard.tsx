import Link from 'next/link';
import { CategoryDto } from '@/lib/types/category';
import { ChefHat, BookOpen } from 'lucide-react';

interface CategoryCardProps {
  category: CategoryDto;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100">
        {category.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.imageUrl}
            alt={category.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback khi ảnh lỗi
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ChefHat className="h-16 w-16 text-orange-300 group-hover:scale-110 transition-transform" />
          </div>
        )}

        <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{category.recipeCount} công thức</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
          {category.name}
        </h3>
        {category.description ? (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-400 italic">Chưa có mô tả cho danh mục này.</p>
        )}

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-orange-600 font-medium">
          <span>Khám phá món ngon</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
