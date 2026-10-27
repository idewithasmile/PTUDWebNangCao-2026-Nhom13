'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { RecipeSummaryDto } from '@/lib/types/category';
import { resolveMediaUrl } from '@/lib/utils';
import { Flame, Mail, ChefHat, CheckCircle2, ArrowRight } from 'lucide-react';

interface HomeRightSidebarProps {
  topRecipes: RecipeSummaryDto[];
}

const DEFAULT_MOST_VIEWED = [
  {
    title: 'Phở bò Hà Nội',
    views: '125.6K lượt xem',
    img: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=150&q=80',
    slug: 'pho-bo-ha-noi',
  },
  {
    title: 'Bánh mì bơ tỏi',
    views: '98.4K lượt xem',
    img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=150&q=80',
    slug: 'banh-mi-bo-toi',
  },
  {
    title: 'Gà rán giòn',
    views: '76.2K lượt xem',
    img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=150&q=80',
    slug: 'ga-ran-gion',
  },
  {
    title: 'Salad cá hồi',
    views: '62.8K lượt xem',
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80',
    slug: 'salad-ca-hoi',
  },
  {
    title: 'Chè khúc bạch',
    views: '54.1K lượt xem',
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=150&q=80',
    slug: 'che-khuc-bach',
  },
];

export default function HomeRightSidebar({ topRecipes }: HomeRightSidebarProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
    }
  };

  // Ghép danh sách công thức xem nhiều (ưu tiên bài thật từ DB nếu có)
  const items = topRecipes.length >= 3
    ? topRecipes.slice(0, 5).map((r, idx) => ({
        title: r.title,
        views: `${(125 - idx * 18).toFixed(1)}K lượt xem`,
        img: r.thumbnailUrl ? resolveMediaUrl(r.thumbnailUrl) : DEFAULT_MOST_VIEWED[idx % DEFAULT_MOST_VIEWED.length].img,
        slug: r.slug,
      }))
    : DEFAULT_MOST_VIEWED;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
      {/* =========================================================
          CỘT 1: CÔNG THỨC ĐƯỢC XEM NHIỀU (TOP 5)
          ========================================================= */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 space-y-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-50 text-orange-500 shadow-2xs">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          </span>
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Công thức được xem nhiều
          </h3>
        </div>

        <div className="space-y-3.5 flex-1">
          {items.map((item, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;

            return (
              <Link
                key={item.title + index}
                href={`/recipes/${encodeURIComponent(item.slug)}`}
                className="group flex items-center gap-3 transition-colors"
              >
                {/* Ảnh nhỏ đại diện */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                </div>

                {/* Thứ hạng badge tròn (1, 2, 3: Cam; 4, 5: Xám) */}
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                    isTop3
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {rank}
                </span>

                {/* Tiêu đề & Lượt xem */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {item.views}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          CỘT 2: NGUYÊN LIỆU TƯƠI NGON & ĐĂNG KÝ NHẬN TIN
          ========================================================= */}
      <div className="space-y-5 flex flex-col justify-between">
        {/* Banner Quảng cáo Nguyên liệu */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 p-5 shadow-xs group flex-1 flex flex-col justify-center">
          <div className="space-y-2 relative z-10 max-w-[200px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
              Khám phá
            </span>
            <h4 className="text-base font-black text-gray-900 leading-snug">
              Nguyên liệu tươi ngon
            </h4>
            <p className="text-xs text-gray-600 leading-tight">
              Bí quyết chọn thực phẩm sạch cho món ăn thêm trọn vị mỗi ngày.
            </p>
            <div className="pt-1">
              <Link
                href="/recipes"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
              >
                <span>Khám phá ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80"
            alt="Nguyên liệu tươi ngon"
            className="absolute -right-4 -bottom-4 w-32 h-32 object-cover rounded-full shadow-inner opacity-90 group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Form Đăng ký nhận tin */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-50 text-orange-500 shadow-2xs">
              <Mail className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-black text-gray-900 tracking-tight">
              Đăng ký nhận công thức mới
            </h3>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            Nhận ngay những công thức ngon nhất mỗi tuần vào hộp thư của bạn!
          </p>

          {isSubscribed ? (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã đăng ký nhận bản tin thành công!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
              >
                Đăng ký ngay
              </button>
            </form>
          )}
        </div>
      </div>

      {/* =========================================================
          CỘT 3: THEO DÕI MẠNG XÃ HỘI & TRÍCH DẪN ẨM THỰC
          ========================================================= */}
      <div className="space-y-5 flex flex-col justify-between">
        {/* Theo dõi chúng tôi */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
            Theo dõi chúng tôi
          </h4>
          <p className="text-xs text-gray-500">
            Kết nối với cộng đồng yêu bếp trên các nền tảng mạng xã hội:
          </p>

          <div className="flex items-center gap-2.5 pt-1">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#1877F2] text-white hover:opacity-90 transition shadow-xs text-xs font-bold"
              title="Facebook"
            >
              f
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FF0000] text-white hover:opacity-90 transition shadow-xs text-xs font-bold"
              title="YouTube"
            >
              ▶
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#405DE6] text-white hover:opacity-90 transition shadow-xs text-xs font-bold"
              title="Instagram"
            >
              📷
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-white hover:opacity-90 transition shadow-xs text-xs font-bold"
              title="TikTok"
            >
              🎵
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#E60023] text-white hover:opacity-90 transition shadow-xs text-xs font-bold"
              title="Pinterest"
            >
              P
            </a>
          </div>
        </div>

        {/* Trích dẫn ẩm thực */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fbf7f2] to-[#f5ede2] border border-[#eee2d3] p-5 space-y-3 flex-1 flex flex-col justify-center">
          <span className="font-serif text-4xl font-black text-orange-400 leading-none block">
            “
          </span>
          <p className="text-xs sm:text-sm italic text-gray-700 leading-relaxed font-medium">
            Nấu ăn không chỉ là kỹ năng, mà còn là cách <strong className="text-gray-900 not-italic font-bold">chúng ta thể hiện tình yêu thương</strong> và kết nối gia đình.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-bold text-gray-500">- Culinary Blog -</span>
            <ChefHat className="w-6 h-6 text-orange-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
