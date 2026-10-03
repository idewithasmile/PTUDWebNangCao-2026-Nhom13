import { categoryService } from '@/lib/services/category-service';
import RecipeCard from '@/components/recipes/RecipeCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChefHat, ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 600; // ISR revalidate 10 phút (600s) theo SPEC

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const detail = await categoryService.getCategoryBySlug(slug, 1, 1, {
      next: { revalidate: 600 },
    });
    return {
      title: `${detail.category.name} - Công Thức Nấu Ăn | Culinary Blog`,
      description:
        detail.category.description ||
        `Khám phá các công thức nấu ăn ngon thuộc danh mục ${detail.category.name} trên Culinary Blog.`,
      openGraph: {
        title: `${detail.category.name} | Culinary Blog`,
        description:
          detail.category.description ||
          `Tổng hợp công thức nấu ăn ngon cho danh mục ${detail.category.name}.`,
        images: detail.category.imageUrl ? [detail.category.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: 'Danh mục món ăn | Culinary Blog',
      description: 'Tổng hợp công thức nấu ăn ngon',
    };
  }
}

export default async function CategoryDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const pageSize = parseInt(resolvedSearchParams.pageSize || '12', 10);

  let detail;
  try {
    detail = await categoryService.getCategoryBySlug(slug, page, pageSize, {
      next: { revalidate: 600 },
    });
  } catch (error) {
    console.error('Không tìm thấy danh mục:', error);
    notFound();
  }

  const { category, recipes } = detail;

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-orange-600 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-orange-600 transition-colors">
          Danh mục
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900 truncate max-w-[200px]">{category.name}</span>
      </nav>

      {/* Banner Danh mục */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white p-8 sm:p-12 mb-10 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{recipes.totalCount} Công thức xuất bản</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-base sm:text-lg text-orange-100 leading-relaxed max-w-xl">
              {category.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/90 hover:text-white underline underline-offset-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Xem tất cả danh mục khác</span>
            </Link>
          </div>
        </div>

        {/* Trang trí nền */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <ChefHat className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Danh sách Công thức */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Công thức món ăn ({recipes.totalCount})
        </h2>
        {recipes.totalCount > 0 && (
          <span className="text-xs sm:text-sm text-gray-500">
            Trang {recipes.page} / {recipes.totalPages}
          </span>
        )}
      </div>

      {recipes.items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 p-8 max-w-lg mx-auto">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">Chưa có công thức nào</h3>
          <p className="text-sm text-gray-500 mt-2">
            Danh mục này hiện chưa có bài viết công thức nào được xuất bản. Hãy quay lại sau nhé!
          </p>
          <Link
            href="/categories"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 transition"
          >
            Khám phá danh mục khác
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes.items.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Phân trang */}
          {recipes.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              {recipes.hasPreviousPage ? (
                <Link
                  href={`/categories/${slug}?page=${recipes.page - 1}&pageSize=${pageSize}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trang trước</span>
                </Link>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium text-gray-300 cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trang trước</span>
                </button>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: recipes.totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === recipes.page;
                  return (
                    <Link
                      key={p}
                      href={`/categories/${slug}?page=${p}&pageSize=${pageSize}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition ${
                        isActive
                          ? 'bg-orange-600 text-white shadow'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>

              {recipes.hasNextPage ? (
                <Link
                  href={`/categories/${slug}?page=${recipes.page + 1}&pageSize=${pageSize}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                >
                  <span>Trang sau</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium text-gray-300 cursor-not-allowed"
                >
                  <span>Trang sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
