import Link from 'next/link';
import { ChefHat, Search, SlidersHorizontal, BookOpen, Clock, Users, Sparkles } from 'lucide-react';
import RecipeCard from '@/components/recipes/RecipeCard';
import Pagination from '@/components/common/Pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';
import type { RecipeSummaryDto } from '@/lib/types/category';

export const metadata: Metadata = {
  title: 'Kho Công Thức Nấu Ăn | Culinary Blog',
  description: 'Khám phá hàng trăm công thức món ăn ngon, dễ làm với hướng dẫn từng bước chi tiết và định lượng chuẩn xác.',
};

// Danh sách dữ liệu công thức mẫu phong phú cho trang tĩnh
const SAMPLE_RECIPES: RecipeSummaryDto[] = [
  {
    id: 'r1',
    title: 'Phở Bò Tái Lăn Hà Nội Truyền Thống',
    slug: 'pho-bo-tai-lan-ha-noi-truyen-thong',
    description: 'Nước dùng trong vắt, đậm đà vị hoa hồi quế thảo quả quyện cùng thịt bò xào lăn thơm lừng hành tỏi.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    prepTime: 30,
    cookTime: 180,
    servings: 4,
    difficulty: 2,
    authorName: 'Bếp Trưởng Hà',
  },
  {
    id: 'r2',
    title: 'Cá Hồi Áp Chảo Sốt Chanh Leo Thảo Mộc',
    slug: 'ca-hoi-ap-chao-sot-chanh-leo-thao-moc',
    description: 'Thịt cá hồi mềm béo mọng nước kết hợp sốt chanh leo chua thanh kích thích vị giác cho bữa tối lãng mạn.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: 1,
    authorName: 'Chef Gordon',
  },
  {
    id: 'r3',
    title: 'Bò Kho Tiêu Xanh Nồi Đất Chuẩn Vị Nam Bộ',
    slug: 'bo-kho-tieu-xanh-noi-dat-chuan-vi-nam-bo',
    description: 'Thịt bò gân giòn mềm, sốt sánh quyện vị thơm cay nồng của tiêu xanh tươi ăn kèm bánh mì nóng giòn.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    prepTime: 20,
    cookTime: 90,
    servings: 4,
    difficulty: 2,
    authorName: 'Má Bảy Sài Gòn',
  },
  {
    id: 'r4',
    title: 'Bánh Mì Sourdough Men Tự Nhiên Vỏ Giòn',
    slug: 'banh-mi-sourdough-men-tu-nhien-vo-gion',
    description: 'Bánh mì men tự nhiên thơm mùi lúa mạch lên men, ruột bánh nở đều và lớp vỏ giòn rụm hoàn hảo.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    prepTime: 60,
    cookTime: 45,
    servings: 6,
    difficulty: 3,
    authorName: 'Tiệm Bánh Mơ',
  },
  {
    id: 'r5',
    title: 'Salad Bơ Ức Gà Nướng Sốt Mù Tạt Mật Ong',
    slug: 'salad-bo-uc-ga-nuong-sot-mu-tat-mat-ong',
    description: 'Món ăn Eat Clean thanh mát giàu đạm với bơ sáp béo ngậy, ức gà áp chảo và xà lách giòn ngọt.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    prepTime: 15,
    cookTime: 10,
    servings: 2,
    difficulty: 1,
    authorName: 'Fit Kitchen',
  },
  {
    id: 'r6',
    title: 'Tiramisu Cà Phê Rượu Rum Ý Truyền Thống',
    slug: 'tiramisu-ca-phe-ruou-rum-y-truyen-thong',
    description: 'Bánh ladyfingers đẫm hương espresso hòa quyện cùng lớp kem phô mai mascarpone béo ngậy mịn mượt.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    prepTime: 35,
    cookTime: 0,
    servings: 6,
    difficulty: 2,
    authorName: 'Pastry Chef Linh',
  },
  {
    id: 'r7',
    title: 'Mì Ý Tôm Sốt Kem Tỏi Rượu Vang Trắng',
    slug: 'mi-y-tom-sot-kem-toi-ruou-vang-trang',
    description: 'Sợi mì Spaghetti dai ngon tắm trong sốt kem béo ngậy, tôm sú tươi ngọt và thảo mộc ngò tây thơm mát.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    difficulty: 2,
    authorName: 'Chef Gordon',
  },
  {
    id: 'r8',
    title: 'Gà Hấp Lá Chanh Nước Dừa Xiêm',
    slug: 'ga-hap-la-chanh-nuoc-dua-xiem',
    description: 'Da gà vàng ươm giòn sần sật, thịt gà ta ngọt mềm ngấm hương lá chanh nồng nàn và nước dừa thanh ngọt.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
    prepTime: 20,
    cookTime: 40,
    servings: 5,
    difficulty: 1,
    authorName: 'Má Bảy Sài Gòn',
  },
];

interface RecipesPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    difficulty?: string;
    page?: string;
  }>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q?.toLowerCase().trim() || '';
  const selectedCat = resolvedParams.category || 'all';
  const selectedDiff = resolvedParams.difficulty ? parseInt(resolvedParams.difficulty, 10) : null;
  const currentPage = parseInt(resolvedParams.page || '1', 10);

  // Lọc tĩnh danh sách công thức
  const filteredRecipes = SAMPLE_RECIPES.filter((r) => {
    if (q && !r.title.toLowerCase().includes(q) && !r.description?.toLowerCase().includes(q)) {
      return false;
    }
    if (selectedDiff !== null && !isNaN(selectedDiff) && r.difficulty !== selectedDiff) {
      return false;
    }
    return true;
  });

  const pageSize = 8;
  const totalPages = Math.ceil(filteredRecipes.length / pageSize) || 1;
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header trang */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kho tàng công thức ẩm thực</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          Khám Phá <span className="text-orange-600">Công Thức Nấu Ăn</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
          Tìm kiếm món ăn ngon cho bữa cơm gia đình hôm nay với các bước làm chi tiết và mẹo nấu ăn hữu ích.
        </p>
      </div>

      {/* Thanh tìm kiếm và bộ lọc tĩnh */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm tên món ăn, nguyên liệu, hương vị..."
              defaultValue={q}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500 mr-1">Độ khó:</span>
            {[
              { val: null, label: 'Tất cả' },
              { val: 1, label: 'Dễ' },
              { val: 2, label: 'Trung bình' },
              { val: 3, label: 'Khó' },
            ].map((d) => (
              <Link
                key={d.label}
                href={`/recipes?${d.val ? `difficulty=${d.val}` : ''}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedDiff === d.val || (d.val === null && selectedDiff === null)
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Thống kê kết quả */}
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Tìm thấy <strong>{filteredRecipes.length}</strong> công thức nấu ăn</span>
          <Link href="/recipes" className="text-orange-600 hover:underline">
            Đặt lại bộ lọc
          </Link>
        </div>
      </div>

      {/* Lưới danh sách công thức */}
      {paginatedRecipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 p-8 max-w-lg mx-auto">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">Không tìm thấy công thức phù hợp</h3>
          <p className="text-sm text-gray-500 mt-2">
            Hãy thử tìm với từ khóa khác hoặc đặt lại bộ lọc.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/recipes">Xem tất cả công thức</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Phân trang */}
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/recipes"
            />
          </div>
        </>
      )}
    </div>
  );
}
