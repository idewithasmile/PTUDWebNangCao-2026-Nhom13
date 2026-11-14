'use client';

import { useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';

/**
 * Hook tự động ghi nhận lượt xem hợp lệ (Valid View Tracker) cho công thức.
 * Tiêu chí:
 * 1. Dwell time: Thời gian tab active (document.visibilityState === 'visible') >= 12 giây.
 * 2. Tương tác: Độ cuộn trang (scroll depth) >= 25% HOẶC dwell time >= 30 giây (trường hợp bài viết ngắn).
 * 3. One-shot per page load: Chỉ bắn beacon đúng 1 lần duy nhất trong suốt phiên xem trang,
 *    kể cả khi người dùng giữ tab mở quá 30 phút cũng không bao giờ tăng thêm view.
 */
export function useRecipeViewTracker(recipeId: string | undefined): void {
  const hasTrackedRef = useRef(false);
  const activeSecondsRef = useRef(0);
  const maxScrollDepthRef = useRef(0);

  useEffect(() => {
    if (!recipeId) return;

    // Reset cờ theo recipeId
    hasTrackedRef.current = false;
    activeSecondsRef.current = 0;
    maxScrollDepthRef.current = 0;

    const sendViewBeacon = () => {
      if (hasTrackedRef.current) return;
      hasTrackedRef.current = true;

      // Gửi request ghi nhận lượt xem (fire-and-forget, không throw lỗi nếu user out giữa chừng)
      apiClient(`/recipes/${recipeId}/view`, {
        method: 'POST',
      }).catch((err) => {
        // Nuốt lỗi mạng/silent để không ảnh hưởng UX người đọc
        console.debug('[RecipeViewTracker] View beacon response:', err);
      });
    };

    const checkConditions = () => {
      if (hasTrackedRef.current) return;

      const is12sAndScrolled =
        activeSecondsRef.current >= 12 && maxScrollDepthRef.current >= 0.25;
      const is30sDwell = activeSecondsRef.current >= 30;

      if (is12sAndScrolled || is30sDwell) {
        sendViewBeacon();
      }
    };

    // 1. Tính toán scroll depth
    const handleScroll = () => {
      if (hasTrackedRef.current) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const currentDepth = scrollTop / docHeight;
        if (currentDepth > maxScrollDepthRef.current) {
          maxScrollDepthRef.current = currentDepth;
        }
      } else {
        // Trang rất ngắn không cần cuộn -> tính là 100%
        maxScrollDepthRef.current = 1;
      }

      checkConditions();
    };

    // 2. Timer đếm active dwell time (chỉ đếm khi document.visibilityState === 'visible')
    const timer = setInterval(() => {
      if (hasTrackedRef.current) {
        clearInterval(timer);
        return;
      }

      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        activeSecondsRef.current += 1;
        checkConditions();
      }
    }, 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Kiểm tra scroll ngay khi trang load xong
    handleScroll();

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [recipeId]);
}
