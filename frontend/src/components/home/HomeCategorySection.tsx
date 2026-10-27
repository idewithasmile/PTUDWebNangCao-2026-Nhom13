'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CategoryDto } from '@/lib/types/category';
import {
  UtensilsCrossed,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface HomeCategorySectionProps {
  categories: CategoryDto[];
  isLoading: boolean;
  isError: boolean;
  selectedCategoryId?: string;
  onSelectCategory?: (categoryId?: string) => void;
  onRetry?: () => void;
}

// Cấu hình 6 Danh mục chính chuẩn xác theo ảnh thiết kế
const PRIMARY_CATEGORIES_CONFIG = [
  {
    key: 'mon-khai-vi',
    matchName: 'Món khai vị',
    displayName: 'Món Khai Vị',
    slug: 'mon-khai-vi',
    description: 'Các món khai vị nhẹ nhàng, kích thích vị giác.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    fallbackCount: 24,
  },
  {
    key: 'mon-chinh',
    matchName: 'Món chính',
    displayName: 'Món Chính',
    slug: 'mon-chinh',
    description: 'Mâm cơm ấm cúng với những món ăn đậm đà.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    fallbackCount: 85,
  },
  {
    key: 'canh-sup',
    matchName: 'Món canh',
    displayName: 'Canh & Súp',
    slug: 'canh-sup',
    description: 'Những tô canh nóng hổi, thanh mát cho bữa ăn.',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80',
    fallbackCount: 32,
  },
  {
    key: 'mon-chay',
    matchName: 'Món chay',
    displayName: 'Món Chay',
    slug: 'mon-chay',
    description: 'Thanh tịnh và giàu dinh dưỡng từ thực vật.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    fallbackCount: 41,
  },
  {
    key: 'trang-mieng',
    matchName: 'Tráng miệng',
    displayName: 'Tráng Miệng',
    slug: 'trang-mieng',
    description: 'Các món ngọt nhẹ nhàng, kết thúc bữa ăn trọn vẹn.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    fallbackCount: 19,
  },
  {
    key: 'do-uong',
    matchName: 'Đồ uống',
    displayName: 'Đồ Uống',
    slug: 'do-uong',
    description: 'Thức uống giải nhiệt và cà phê truyền thống.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    fallbackCount: 15,
  },
];

export default function HomeCategorySection({
  categories,
  isLoading,
  isError,
  onRetry,
}: HomeCategorySectionProps) {
  const [showAll, setShowAll] = useState(false);
  const totalRecipesCount = categories.reduce((sum, c) => sum + (c.recipeCount || 0), 0);

  // Ánh xạ 6 danh mục chính từ cơ sở dữ liệu thực tế kèm đường dẫn điều hướng trực tiếp
  const primaryCards = PRIMARY_CATEGORIES_CONFIG.map((cfg) => {
    const realCat = categories.find(
      (c) => c.name.toLowerCase().trim() === cfg.matchName.toLowerCase().trim()
    );
    const destinationHref = realCat?.slug
      ? `/categories/${encodeURIComponent(realCat.slug)}`
      : realCat?.id
        ? `/recipes?categoryId=${encodeURIComponent(realCat.id)}`
        : '/categories';

    return {
      ...cfg,
      id: realCat?.id,
      realSlug: realCat?.slug,
      href: destinationHref,
      count: realCat?.recipeCount ?? cfg.fallbackCount,
    };
  });

  // Lọc ra các danh mục còn lại để hiển thị khi bấm "Hiển thị tất cả"
  const remainingCategories = categories.filter(
    (c) => !PRIMARY_CATEGORIES_CONFIG.some((cfg) => cfg.matchName.toLowerCase() === c.name.toLowerCase())
  );

  return (
    <section className="rounded-3xl bg-[#faf6f0] border border-[#ede3d5] p-6 sm:p-8 lg:p-10 space-y-6 shadow-xs">
      {/* 1. Header chuẩn xác theo ảnh thiết kế */}
      <div className="text-center space-y-1.5 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-[#964b28] uppercase tracking-wider">
          DANH MỤC ẨM THỰC
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          Khám phá thế giới ẩm thực đa dạng qua các danh mục đặc sắc
        </p>

        {/* Thanh điều hướng: Khám phá tất cả món / Mở rộng danh mục */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {/* Nút Khám phá tất cả món ăn -> Chuyển thẳng sang trang /recipes */}
          <Link
            href="/recipes"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#964b28] text-white shadow-xs hover:bg-[#7e3d1e] transition-all"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Tất cả món ({totalRecipesCount})</span>
          </Link>

          {/* Nút Hiển thị tất cả / Thu gọn danh mục */}
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-[#964b28] border border-[#e3d0c1] hover:bg-[#f7efe6] transition-all"
          >
            <span>{showAll ? 'Thu gọn danh mục' : `Hiển thị tất cả (${categories.length} danh mục)`}</span>
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-white/70 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex items-center justify-between p-4 bg-red-50 text-red-700 rounded-2xl text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Không thể tải danh sách danh mục</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 font-bold text-red-600 hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      )}

      {/* 2. Lưới 6 Danh mục chính (2 hàng x 3 cột) - MỖI CARD LÀ LINK ĐIỀU HƯỚNG */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {primaryCards.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl bg-white border border-[#ede3d5] transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1 block"
            >
              {/* Banner ảnh món ăn */}
              <div className="relative aspect-[21/9] sm:aspect-[20/9] w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.displayName}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge: {count} công thức góc dưới bên phải */}
                <div className="absolute bottom-2.5 right-2.5">
                  <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#8b4513]/90 text-white backdrop-blur shadow-xs">
                    {card.count} công thức
                  </span>
                </div>
              </div>

              {/* Phần thân thẻ: Tên, Slug tag & Mô tả */}
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#964b28] transition-colors">
                    {card.displayName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#faf0e6] text-[#8b4513]">
                    {card.slug}
                  </span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 3. Phần mở rộng khi nhấn "Hiển thị tất cả" */}
      {showAll && remainingCategories.length > 0 && (
        <div className="pt-4 border-t border-[#ede3d5] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#964b28]" />
              <span>Các danh mục phong phú khác</span>
            </span>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#964b28] hover:underline"
            >
              <span>Xem trang Danh mục đầy đủ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {remainingCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${encodeURIComponent(cat.slug)}`}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#ede3d5] bg-white hover:border-[#964b28] hover:bg-[#faf0e6]/50 text-gray-800 text-center transition-all shadow-2xs hover:shadow-xs group"
              >
                <span className="text-xs font-bold line-clamp-1 group-hover:text-[#964b28] transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] font-medium mt-0.5 text-gray-400">
                  {cat.recipeCount || 0} công thức
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
