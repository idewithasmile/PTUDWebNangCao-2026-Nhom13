'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface HomeHeroBannerProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onSearchSubmit?: (term: string) => void;
}

const POPULAR_KEYWORDS = ['Phở bò', 'Bánh mì', 'Gà rán', 'Salad', 'Món chay'];

export default function HomeHeroBanner({
  searchTerm = '',
  onSearchChange,
  onSearchSubmit,
}: HomeHeroBannerProps) {
  const router = useRouter();
  const [localInput, setLocalInput] = useState(searchTerm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = localInput.trim();
    if (query) {
      router.push(`/recipes?searchTerm=${encodeURIComponent(query)}`);
    } else {
      router.push('/recipes');
    }
    onSearchChange?.(localInput);
    onSearchSubmit?.(localInput);
  };

  const handleKeywordClick = (keyword: string) => {
    setLocalInput(keyword);
    router.push(`/recipes?searchTerm=${encodeURIComponent(keyword)}`);
    onSearchChange?.(keyword);
    onSearchSubmit?.(keyword);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-xl min-h-[380px] lg:min-h-[440px] flex items-center">
      {/* Background Image với bát Phở & Món ăn truyền thống */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1920&q=85')`,
        }}
      />

      {/* Dark warm overlay gradient chuyển dần từ trái qua phải */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-900/85 to-black/30 backdrop-blur-[0.5px]" />

      {/* Badge nghệ thuật "Nấu ngon Mỗi ngày ♡" ở góc trên bên phải */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-12 hidden sm:block rotate-3 z-10">
        <div className="relative text-right">
          <span className="font-sans italic text-2xl lg:text-3xl text-white font-black drop-shadow-md tracking-tight block">
            Nấu ngon
          </span>
          <span className="font-sans italic text-3xl lg:text-4xl text-orange-400 font-black drop-shadow-md tracking-tight block">
            Mỗi ngày ♡
          </span>
        </div>
      </div>

      {/* Nội dung bên trái */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-10 sm:px-10 lg:px-12 space-y-5">
        <div className="max-w-2xl space-y-3">
          {/* Chữ script "Khám phá" */}
          <p className="font-serif italic text-amber-400 text-lg sm:text-2xl font-bold tracking-wide">
            Khám phá
          </p>

          {/* Tiêu đề chính */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Hàng ngàn công thức nấu ăn
          </h1>

          {/* Mô tả */}
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal max-w-xl">
            Từ những món ăn truyền thống đến hiện đại, từ đơn giản đến cầu kỳ. Cùng Culinary Blog khám phá và tạo nên những bữa ăn ngon mỗi ngày!
          </p>
        </div>

        {/* Form tìm kiếm phong cách viền tròn sang trọng */}
        <div className="max-w-xl pt-1">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-full p-1.5 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-orange-500"
          >
            <div className="pl-4 pr-2 text-gray-400">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="Tìm kiếm công thức, nguyên liệu, danh mục..."
              className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            {localInput && (
              <button
                type="button"
                onClick={() => {
                  setLocalInput('');
                  onSearchChange?.('');
                  onSearchSubmit?.('');
                }}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="rounded-full bg-orange-500 hover:bg-orange-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Tìm kiếm phổ biến */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
            <span className="text-gray-300 font-medium">Tìm kiếm phổ biến:</span>
            {POPULAR_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => handleKeywordClick(keyword)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  searchTerm === keyword
                    ? 'bg-orange-500 text-white font-bold'
                    : 'bg-black/40 hover:bg-black/60 text-white border border-white/20'
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
