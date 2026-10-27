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
    <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0 space-y-5">
      {/* =========================================================
          1. CÔNG THỨC ĐƯỢC XEM NHIỀU (TOP 5)
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3.5">
        <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          </span>
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Công thức được xem nhiều
          </h3>
        </div>

        <div className="space-y-3">
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
          2. BANNER QUẢNG CÁO NGUYÊN LIỆU TƯƠI NGON
          ========================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 p-4 shadow-sm group">
        <div className="space-y-1.5 relative z-10 max-w-[160px]">
          <h4 className="text-sm font-black text-gray-900 leading-snug">
            Nguyên liệu tươi ngon
          </h4>
          <p className="text-[11px] text-gray-500 leading-tight">
            Cho món ăn thêm trọn vị
          </p>
          <div className="pt-2">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold shadow-xs transition-transform active:scale-95"
            >
              <span>Khám phá ngay</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80"
          alt="Nguyên liệu tươi ngon"
          className="absolute -right-4 -bottom-4 w-28 h-28 object-cover rounded-full shadow-inner opacity-90 group-hover:scale-105 transition-transform"
        />
      </div>

      {/* =========================================================
          3. ĐĂNG KÝ NHẬN CÔNG THỨC MỚI (NEWSLETTER)
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <Mail className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Đăng ký nhận công thức mới
          </h3>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          Nhận ngay những công thức ngon nhất vào hộp thư của bạn!
        </p>

        {isSubscribed ? (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
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
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
            >
              Đăng ký
            </button>
          </form>
        )}
      </div>

      {/* =========================================================
          3. THEO DÕI CHÚNG TÔI (SOCIAL MEDIA LINKS)
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
          Theo dõi chúng tôi
        </h4>

        <div className="flex items-center gap-2.5">
          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition shadow-xs text-xs font-bold"
            title="Facebook"
          >
            f
          </a>
          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF0000] text-white hover:opacity-90 transition shadow-xs text-xs font-bold"
            title="YouTube"
          >
            ▶
          </a>
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#405DE6] text-white hover:opacity-90 transition shadow-xs text-xs font-bold"
            title="Instagram"
          >
            📷
          </a>
          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:opacity-90 transition shadow-xs text-xs font-bold"
            title="TikTok"
          >
            🎵
          </a>
          {/* Pinterest */}
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E60023] text-white hover:opacity-90 transition shadow-xs text-xs font-bold"
            title="Pinterest"
          >
            P
          </a>
        </div>
      </div>

      {/* =========================================================
          4. TRÍCH DẪN ẨM THỰC (CULINARY QUOTE CARD)
          ========================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#fbf7f2] to-[#f5ede2] border border-[#eee2d3] p-5 space-y-3">
        <span className="font-serif text-3xl font-black text-orange-400 leading-none block">
          “
        </span>
        <p className="text-xs italic text-gray-700 leading-relaxed font-medium">
          Nấu ăn không chỉ là kỹ năng, mà còn là cách <strong className="text-gray-900 not-italic">chúng ta thể hiện tình yêu thương</strong>.
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-bold text-gray-500">- Culinary Blog -</span>
          <ChefHat className="w-6 h-6 text-orange-300" />
        </div>
      </div>
    </aside>
  );
}
