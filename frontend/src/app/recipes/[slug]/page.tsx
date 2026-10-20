import Link from 'next/link';
import {
  Clock,
  Users,
  ChefHat,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Share2,
  Printer,
  Heart,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecipeCard from '@/components/recipes/RecipeCard';
import type { Metadata } from 'next';
import type { RecipeSummaryDto } from '@/lib/types/category';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} - Công Thức Nấu Ăn | Culinary Blog`,
    description: `Hướng dẫn từng bước cách làm ${title} thơm ngon chuẩn vị với định lượng nguyên liệu chuẩn xác.`,
  };
}

const RELATED_RECIPES: RecipeSummaryDto[] = [
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
];

export default async function RecipeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Dữ liệu tĩnh mẫu chuẩn hóa cho chi tiết món ăn
  const recipe = {
    title: 'Phở Bò Tái Lăn Hà Nội Truyền Thống',
    description:
      'Nước dùng phở trong vắt, đậm đà vị ngọt thanh từ xương ống ninh nhừ, ngát hương quế, hoa hồi và thảo quả nướng xém. Thịt bò bắp hoa được thái mỏng xào lăn to lửa với tỏi băm thơm lừng, phủ lên bánh phở mềm mượt.',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    prepTime: 30,
    cookTime: 180,
    servings: 4,
    difficulty: 2,
    calories: 520,
    categoryName: 'Món Chính',
    categorySlug: 'mon-chinh',
    author: {
      name: 'Bếp Trưởng Hà',
      bio: 'Bếp trưởng với hơn 15 năm kinh nghiệm ẩm thực truyền thống Bắc Bộ.',
      avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    },
    ingredients: [
      { name: 'Xương ống bò (ninh nước dùng)', amount: '1.5 kg' },
      { name: 'Thịt bắp bò hoa hoặc thăn bò', amount: '500 g' },
      { name: 'Bánh phở tươi sợi nhỏ', amount: '800 g' },
      { name: 'Gừng già & hành tím khô (nướng thơm)', amount: '150 g' },
      { name: 'Gia vị thảo mộc: Hoa hồi, quế, thảo quả, đinh hương, hạt ngò', amount: '1 gói nhỏ' },
      { name: 'Hành hoa, ngò gai, húng quế', amount: '200 g' },
      { name: 'Tỏi băm nhỏ, tiêu bắc rang xay', amount: '2 thìa canh' },
      { name: 'Gia vị: Nước mắm cá cơm truyền thống, muối hầm, đường phèn', amount: 'Vừa đủ' },
    ],
    steps: [
      {
        number: 1,
        title: 'Sơ chế và ninh xương lấy nước dùng ngọt trong',
        description:
          'Xương ống bò rửa sạch, ngâm nước muối loãng 30 phút rồi chần qua nước sôi cùng gừng đập dập. Rửa sạch lại xương dưới vòi nước lạnh, cho vào nồi áp suất hoặc nồi thường ninh cùng 4 lít nước trong 3-4 tiếng. Thường xuyên hớt bọt để nước dùng giữ được độ trong vắt.',
      },
      {
        number: 2,
        title: 'Nướng thơm gia vị thảo mộc',
        description:
          'Hành tím và gừng già nướng trực tiếp trên lửa đến khi dậy mùi thơm và hơi xém vỏ, cạo sạch tro rồi đập dập. Quế, hồi, thảo quả, hạt ngò rang trên chảo khô với lửa nhỏ đến khi thơm ngát, cho vào túi vải buộc chặt rồi thả vào nồi nước dùng ninh cùng.',
      },
      {
        number: 3,
        title: 'Nêm nếm nước dùng',
        description:
          'Vớt bỏ bã thảo mộc, nêm vào nồi nước dùng 3 thìa canh nước mắm nhĩ ngon, 1 thìa canh muối hầm và 1 cục đường phèn nhỏ để tạo hậu vị ngọt sâu tự nhiên.',
      },
      {
        number: 4,
        title: 'Xào lăn thịt bò nhanh trên lửa lớn',
        description:
          'Thịt bò thái lát mỏng ngang thớ, ướp với chút hạt tiêu và thìa dầu ăn. Đun chảo gang thật nóng, cho tỏi băm vào phi thơm vàng rồi trút thịt bò vào đảo nhanh tay trong 45-60 giây đến khi thịt vừa chín tái, giữ trọn vẹn vị mọng nước.',
      },
      {
        number: 5,
        title: 'Trần bánh phở và hoàn thiện bát phở thơm ngon',
        description:
          'Chần bánh phở qua nước sôi, xếp vào bát tô. Rải thịt bò xào lăn, hành hoa, cọng ngò lên trên. Chan nước dùng sôi sùng sục ngập bát. Rắc thêm chút tiêu bắc và thưởng thức nóng kèm quẩy giòn và chanh ớt.',
      },
    ],
  };

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-orange-600 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/recipes" className="hover:text-orange-600 transition-colors">
          Công thức
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900 truncate max-w-[200px]">{recipe.title}</span>
      </nav>

      {/* Header bài viết */}
      <div className="max-w-4xl mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="bg-orange-600">
            {recipe.categoryName}
          </Badge>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            Độ khó: Trung bình
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          {recipe.title}
        </h1>

        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          {recipe.description}
        </p>

        {/* Thông tin tác giả & Thao tác nhanh */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recipe.author.avatarUrl}
              alt={recipe.author.name}
              className="h-10 w-10 rounded-full object-cover border border-gray-200"
            />
            <div>
              <div className="text-sm font-bold text-gray-900">{recipe.author.name}</div>
              <div className="text-xs text-gray-400">Xuất bản: Hôm nay • 15 phút đọc</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Chia sẻ</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Lưu công thức</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Ảnh bìa Hero món ăn */}
      <div className="relative aspect-[16/9] max-h-[500px] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-md mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Bảng thông số nhanh (Stats Bar) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-12">
        <div className="flex items-center gap-3 border-r border-gray-50 last:border-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Chuẩn bị</div>
            <div className="text-sm font-bold text-gray-900">{recipe.prepTime} phút</div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-r border-gray-50 last:border-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Nấu chín</div>
            <div className="text-sm font-bold text-gray-900">{recipe.cookTime} phút</div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-r border-gray-50 last:border-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Khẩu phần</div>
            <div className="text-sm font-bold text-gray-900">{recipe.servings} người ăn</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Năng lượng</div>
            <div className="text-sm font-bold text-gray-900">{recipe.calories} kcal / phần</div>
          </div>
        </div>
      </div>

      {/* Nội dung chi tiết: Nguyên liệu & Các bước làm */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        {/* Cột trái: Danh sách nguyên liệu */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <span>Nguyên Liệu Chuẩn Bị</span>
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">
                {recipe.ingredients.length} món
              </span>
            </div>

            <ul className="space-y-3.5">
              {recipe.ingredients.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-3 text-sm pb-2 border-b border-gray-50 last:border-0"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer text-gray-700 hover:text-orange-600 transition">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span>{item.name}</span>
                  </label>
                  <span className="font-semibold text-gray-900 shrink-0 text-xs sm:text-sm">
                    {item.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cột phải: Các bước thực hiện */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-8">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Hướng Dẫn Từng Bước Thực Hiện
            </h2>

            <div className="space-y-6">
              {recipe.steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-sm font-black text-white shadow-sm">
                    {step.number}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <h3 className="text-base font-bold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hộp thông tin tác giả */}
          <div className="rounded-3xl bg-orange-50/60 border border-orange-100 p-6 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recipe.author.avatarUrl}
              alt={recipe.author.name}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-700">Tác giả công thức</div>
              <h4 className="text-lg font-bold text-gray-900 mt-0.5">{recipe.author.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{recipe.author.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Công thức liên quan */}
      <section className="pt-8 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Món Ăn Cùng Danh Mục</h3>
            <p className="text-xs text-gray-500 mt-1">Gợi ý thêm những món ngon hấp dẫn bạn không nên bỏ lỡ</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/recipes" className="flex items-center gap-1.5">
              <span>Xem thêm</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {RELATED_RECIPES.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
