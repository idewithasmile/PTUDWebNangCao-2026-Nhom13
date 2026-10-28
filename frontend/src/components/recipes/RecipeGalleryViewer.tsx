'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RecipeImageDto } from '@/lib/types/recipe';
import { resolveMediaUrl } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  UtensilsCrossed,
} from 'lucide-react';

interface RecipeGalleryViewerProps {
  images?: RecipeImageDto[];
  recipeTitle: string;
}

export default function RecipeGalleryViewer({
  images = [],
  recipeTitle,
}: RecipeGalleryViewerProps) {
  // Sắp xếp đưa ảnh isPrimary lên đầu nếu có
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return (a.orderIndex || 0) - (b.orderIndex || 0);
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const total = sortedImages.length;
  const currentImage = sortedImages[selectedIndex] || null;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setSelectedIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setSelectedIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Phím tắt bàn phím khi mở Lightbox hoặc xem ảnh
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape' && isLightboxOpen) setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, isLightboxOpen]);

  // Nếu không có hình ảnh nào
  if (!total || !currentImage) {
    return (
      <div className="rounded-3xl bg-[#171412] p-4 sm:p-5 border border-stone-800 shadow-xl">
        <div className="flex aspect-[16/10] w-full flex-col items-center justify-center rounded-2xl bg-[#0f0d0c] text-stone-500 border border-stone-800/60">
          <UtensilsCrossed className="h-16 w-16 text-stone-600 mb-2 stroke-[1.5]" />
          <p className="text-sm font-medium text-stone-400">Chưa có hình ảnh món ăn</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Khung chứa Card đen sang trọng đúng chuẩn Mockup */}
      <div className="rounded-3xl bg-[#171412] p-3 sm:p-4 border border-stone-800/80 shadow-2xl transition-all">
        {/* Ảnh chính lớn trung tâm (Main Showcase) */}
        <div className="group relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#0c0a09] border border-stone-800/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentImage.id || selectedIndex}
            src={resolveMediaUrl(currentImage.originalUrl)}
            alt={currentImage.altText || `${recipeTitle} - Ảnh ${selectedIndex + 1}`}
            className="h-full w-full object-cover object-center transition-all duration-300 animate-fade-in cursor-pointer select-none"
            onClick={() => setIsLightboxOpen(true)}
          />

          {/* Badge số thứ tự ảnh */}
          {total > 1 && (
            <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-stone-200 backdrop-blur-md border border-white/10 select-none">
              {selectedIndex + 1} / {total}
            </div>
          )}

          {/* Nút phóng to toàn màn hình */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-stone-200 backdrop-blur-md hover:bg-black/90 hover:text-white transition border border-white/10 shadow-sm"
            title="Xem toàn màn hình"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {/* Mũi tên Previous / Next nếu có nhiều hơn 1 ảnh */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/80 hover:scale-105 transition-all shadow-md"
                title="Ảnh trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/80 hover:scale-105 transition-all shadow-md"
                title="Ảnh tiếp theo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thanh Thumbnails căn giữa bên dưới theo ảnh mẫu */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 pt-3 pb-1 overflow-x-auto">
            {sortedImages.map((img, idx) => {
              const isActive = idx === selectedIndex;
              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`group relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl transition-all duration-200 select-none ${
                    isActive
                      ? 'border-2 border-orange-500 ring-2 ring-orange-500/50 scale-105 shadow-md shadow-orange-950/40'
                      : 'border border-stone-800 opacity-60 hover:opacity-100 hover:border-stone-600 hover:scale-102'
                  }`}
                  title={`Ảnh ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveMediaUrl(img.thumbnailUrl || img.originalUrl)}
                    alt={img.altText || `${recipeTitle} thu nhỏ ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {img.isPrimary && (
                    <span className="absolute bottom-1 right-1 rounded-sm bg-orange-600/90 px-1 py-0.2 text-[9px] font-bold text-white shadow-xs">
                      Chính
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal phóng to ảnh */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Nút đóng */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-md"
            title="Đóng"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Tiêu đề & Thứ tự */}
          <div className="absolute top-5 left-5 z-50 flex items-center gap-3 text-stone-200 text-sm font-medium">
            <span className="font-bold text-orange-400">{recipeTitle}</span>
            {total > 1 && (
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-stone-300">
                {selectedIndex + 1} / {total}
              </span>
            )}
          </div>

          {/* Ảnh phóng to */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveMediaUrl(currentImage.originalUrl)}
              alt={currentImage.altText || recipeTitle}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
            />
          </div>

          {/* Phím điều hướng Lightbox */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-md"
                title="Ảnh trước"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-md"
                title="Ảnh tiếp theo"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
