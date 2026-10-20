import Link from 'next/link';
import {
  ChefHat,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecipeCard from '@/components/recipes/RecipeCard';
import CategoryCard from '@/components/categories/CategoryCard';
import { categoryService } from '@/lib/services/category-service';
import type { CategoryDto, RecipeSummaryDto } from '@/lib/types/category';

// Dữ liệu tĩnh mẫu công thức nổi bật cho giao diện blog
const FEATURED_RECIPES: RecipeSummaryDto[] = [
  {
    id: 'f1',
    title: 'Phở Bò Tái Lăn Hà Nội Truyền Thống',
    slug: 'pho-bo-tai-lan-ha-noi-truyen-thong',
    description: 'Nước dùng trong vắt, đậm đà vị hoa hồi quế thảo quả quyện cùng thịt bò xào lăn thơm lừng hành tỏi.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    prepTime: 30,
    cookTime: 180,
    servings: 4,
    difficulty: 2,
    authorName: 'Bếp Trưởng Hà',
    publishedAt: '2026-10-15T00:00:00Z',
  },
  {
    id: 'f2',
    title: 'Cá Hồi Áp Chảo Sốt Chanh Leo Thảo Mộc',
    slug: 'ca-hoi-ap-chao-sot-chanh-leo-thao-moc',
    description: 'Thịt cá hồi mềm béo mọng nước kết hợp sốt chanh leo chua thanh kích thích vị giác cho bữa tối lãng mạn.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: 1,
    authorName: 'Chef Gordon',
    publishedAt: '2026-10-14T00:00:00Z',
  },
  {
    id: 'f3',
    title: 'Bò Kho Tiêu Xanh Nồi Đất Chuẩn Vị Nam Bộ',
    slug: 'bo-kho-tieu-xanh-noi-dat-chuan-vi-nam-bo',
    description: 'Thịt bò gân giòn mềm, sốt sánh quyện vị thơm cay nồng của tiêu xanh tươi ăn kèm bánh mì nóng giòn.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    prepTime: 20,
    cookTime: 90,
    servings: 4,
    difficulty: 2,
    authorName: 'Má Bảy Sài Gòn',
    publishedAt: '2026-10-12T00:00:00Z',
  },
  {
    id: 'f4',
    title: 'Bánh Mì Sourdough Men Tự Nhiên Vỏ Giòn',
    slug: 'banh-mi-sourdough-men-tu-nhien-vo-gion',
    description: 'Bánh mì men tự nhiên thơm mùi lúa mạch lên men, ruột bánh nở đều và lớp vỏ giòn rụm hoàn hảo.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    prepTime: 60,
    cookTime: 45,
    servings: 6,
    difficulty: 3,
    authorName: 'Tiệm Bánh Mơ',
    publishedAt: '2026-10-10T00:00:00Z',
  },
];

// Danh mục mẫu dự phòng nếu backend chưa khởi động
const FALLBACK_CATEGORIES: CategoryDto[] = [
  {
    id: 'c1',
    name: 'Món Khai Vị',
    slug: 'mon-khai-vi',
    description: 'Các món gỏi, súp thanh nhẹ đánh thức vị giác trước bữa ăn.',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    orderIndex: 1,
    recipeCount: 14,
  },
  {
    id: 'c2',
    name: 'Món Chính',
    slug: 'mon-chinh',
    description: 'Tổng hợp món kho, xào, nướng, canh bổ dưỡng cho bữa cơm gia đình.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    orderIndex: 2,
    recipeCount: 38,
  },
  {
    id: 'c3',
    name: 'Món Tráng Miệng',
    slug: 'mon-trang-mieng',
    description: 'Chè, bánh ngọt, pudding mát lạnh ngọt ngào kết thúc bữa tiệc.',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    orderIndex: 3,
    recipeCount: 22,
  },
  {
    id: 'c4',
    name: 'Bánh & Bữa Sáng',
    slug: 'banh-va-bua-sang',
    description: 'Bánh mì, pancake, waffle tràn đầy năng lượng cho ngày mới.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    orderIndex: 4,
    recipeCount: 19,
  },
];

export default function Home() {
  const featuredCats = FALLBACK_CATEGORIES.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-transparent py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Cột chữ */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>Khám phá đam mê ẩm thực</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
                Nấu Ngon Mỗi Ngày Với <span className="text-orange-600 underline decoration-orange-300 underline-offset-8">Culinary Blog</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Bộ sưu tập công thức nấu ăn phong phú từ món ăn gia đình truyền thống đến ẩm thực quốc tế hiện đại. Từng bước thực hiện chi tiết, định lượng chuẩn xác và lời khuyên từ đầu bếp.
              </p>

              {/* Nút hành động */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Button asChild size="lg" className="rounded-2xl shadow-lg shadow-orange-500/20 font-bold">
                  <Link href="/recipes" className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Khám Phá Công Thức</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-2xl">
                  <Link href="/categories" className="flex items-center gap-2">
                    <span>Xem Danh Mục</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Thống kê nhanh */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-900">500+</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Công thức chuẩn vị</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-900">50+</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Danh mục ẩm thực</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-900">10k+</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Người yêu bếp</div>
                </div>
              </div>
            </div>

            {/* Cột ảnh Hero */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80"
                    alt="Món ngon hấp dẫn"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <Badge variant="default" className="mb-2 bg-orange-600">
                      Gợi ý hôm nay
                    </Badge>
                    <h3 className="text-xl font-bold line-clamp-1">Sườn Nướng Mật Ong Xì Dầu</h3>
                    <p className="text-xs text-orange-200 mt-1 line-clamp-2">
                      Vị ngọt thơm đậm đà, thịt mềm mọng nước chỉ với 45 phút thực hiện.
                    </p>
                  </div>
                </div>

                {/* Huy hiệu nổi bật trôi nổi */}
                <div className="absolute -top-4 -left-4 rounded-2xl bg-white p-3.5 shadow-xl border border-gray-100 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">100% Thử nghiệm</div>
                    <div className="text-[11px] text-gray-400">Được kiểm chứng bởi bếp trưởng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Danh mục nổi bật */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phân loại phong phú</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Danh Mục Món Ăn Nổi Bật
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/categories" className="flex items-center gap-1.5">
              <span>Xem tất cả danh mục</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredCats.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. Công thức thịnh hành */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Được yêu thích nhất</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Công Thức Mới Cập Nhật
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/recipes" className="flex items-center gap-1.5">
              <span>Xem tất cả công thức</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {FEATURED_RECIPES.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* 4. Giá trị nổi bật (Features) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-8 sm:p-12 shadow-xl">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-200">
              Trải nghiệm ẩm thực hoàn hảo
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-2">
              Tại Sao Bạn Nên Chọn Culinary Blog?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/20">
              <div className="h-10 w-10 rounded-xl bg-white text-orange-600 flex items-center justify-center mb-4 font-black">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">Định Lượng Chuẩn Xác</h3>
              <p className="text-sm text-orange-100 leading-relaxed">
                Từng thìa gia vị, gram nguyên liệu được cân đong đo đếm chuẩn mực, giúp bạn tự tin vào bếp thành công ngay lần đầu.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/20">
              <div className="h-10 w-10 rounded-xl bg-white text-orange-600 flex items-center justify-center mb-4 font-black">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">Lưu Trữ Ảnh MinIO S3</h3>
              <p className="text-sm text-orange-100 leading-relaxed">
                Hình ảnh món ăn sắc nét độ phân giải cao được tải trực tiếp lên MinIO Object Storage với khả năng truy xuất nhanh chóng.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/20">
              <div className="h-10 w-10 rounded-xl bg-white text-orange-600 flex items-center justify-center mb-4 font-black">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">Quản Trị Linh Hoạt (FR-CAT)</h3>
              <p className="text-sm text-orange-100 leading-relaxed">
                Phân hệ danh mục thông minh với kiểm soát toàn vẹn liên kết công thức, hỗ trợ xóa mềm và cập nhật thời gian thực.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
