'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hiện nút khi người dùng đã cuộn qua 450px
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 transition-all duration-300 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        aria-label="Cuộn lên đầu trang"
        title="Cuộn lên đầu trang"
      >
        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />

        {/* Tooltip ẩn hiện nhẹ trên Desktop */}
        <span className="pointer-events-none absolute -top-8 right-1/2 translate-x-1/2 whitespace-nowrap rounded-md bg-stone-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 shadow-sm border border-stone-800 hidden sm:block">
          Lên đầu trang
        </span>
      </button>
    </div>
  );
}
