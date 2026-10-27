'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Phở bò',
  'Bánh mì',
  'Sườn nướng',
  'Canh chua',
  'Món chay',
];

export default function HomeHeroSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/recipes?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSelectSuggestion = (tag: string) => {
    router.push(`/recipes?searchTerm=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-2 space-y-3">
      {/* Search Input Form */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center rounded-2xl bg-white/95 backdrop-blur-md p-1.5 shadow-xl border border-white/40 focus-within:ring-4 focus-within:ring-orange-300/40 transition-all"
      >
        <div className="flex items-center pl-3.5 pr-2 pointer-events-none text-orange-500">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập tên món ăn, nguyên liệu, ví dụ: Phở bò, Canh chua..."
          className="w-full py-2.5 px-2 text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent outline-none font-medium"
        />
        <button
          type="submit"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-orange-700 active:scale-95 transition-all"
        >
          <span>Tìm kiếm</span>
        </button>
      </form>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-orange-100">
        <span className="font-semibold text-white inline-flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-300" />
          <span>Gợi ý:</span>
        </span>
        {SUGGESTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleSelectSuggestion(tag)}
            className="rounded-full bg-white/15 px-2.5 py-1 text-white hover:bg-white/25 backdrop-blur-sm transition-all"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
