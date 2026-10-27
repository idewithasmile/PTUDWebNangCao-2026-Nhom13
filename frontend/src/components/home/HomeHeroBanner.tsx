'use client';

import { useState } from 'react';
import { Search, Sparkles, UtensilsCrossed, ChefHat, ArrowRight, Flame } from 'lucide-react';

interface HomeHeroBannerProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSubmit: (term: string) => void;
}

const POPULAR_KEYWORDS = [
  'Phở bò',
  'Bò bít tết',
  'Thịt kho tàu',
  'Canh chua',
  'Mực xào',
  'Gà hấp',
  'Bún chả',
  'Tráng miệng',
];

export default function HomeHeroBanner({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
}: HomeHeroBannerProps) {
  const [localInput, setLocalInput] = useState(searchTerm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localInput);
    onSearchSubmit(localInput);
  };

  const handleKeywordClick = (keyword: string) => {
    setLocalInput(keyword);
    onSearchChange(keyword);
    onSearchSubmit(keyword);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-amber-600 to-amber-700 px-6 py-12 text-white shadow-xl sm:px-10 sm:py-16 lg:py-20">
      {/* Họa tiết nền mờ ảo nghệ thuật */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-orange-950/25 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center space-y-6">
        {/* Badge Giới thiệu */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase shadow-sm">
          <Sparkles className="h-4 w-4 text-amber-200" />
          <span>Nền tảng Ẩm thực & Chia sẻ Bí quyết Nấu ăn</span>
        </div>

        {/* Tiêu đề chính */}
        <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl drop-shadow-sm leading-tight">
          Khơi nguồn cảm hứng &amp; Lan tỏa{' '}
          <span className="text-amber-200 underline decoration-amber-300/60 decoration-wavy decoration-2">
            tinh hoa ẩm thực
          </span>
        </h1>

        <p className="text-sm text-orange-50 sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
          Khám phá hàng trăm công thức chuẩn vị từ mâm cơm gia đình ấm cúng đến các món tiệc tinh tế.
          Nguyên liệu định lượng chuẩn xác và hướng dẫn từng bước chi tiết.
        </p>

        {/* Ô Tìm Kiếm Công Thức Thực Tế (Search Box) */}
        <div className="max-w-2xl mx-auto pt-2">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-xl border border-white/40 focus-within:ring-4 focus-within:ring-orange-300/50 transition-all"
          >
            <div className="flex items-center pl-3 text-gray-400">
              <Search className="h-5 w-5 text-orange-500" />
            </div>
            <input
              type="text"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="Bạn muốn nấu món gì hôm nay? (Ví dụ: Phở bò, Sườn nướng, Lẩu thái...)"
              className="flex-1 bg-transparent px-2 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            {localInput && (
              <button
                type="button"
                onClick={() => {
                  setLocalInput('');
                  onSearchChange('');
                  onSearchSubmit('');
                }}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                Xóa
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-orange-700 active:scale-95 whitespace-nowrap"
            >
              <span>Tìm kiếm</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Gợi ý từ khóa phổ biến */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="flex items-center gap-1 text-orange-200 font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Gợi ý hôm nay:</span>
            </span>
            {POPULAR_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => handleKeywordClick(keyword)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  searchTerm === keyword
                    ? 'bg-white text-orange-700 font-bold shadow-sm'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
