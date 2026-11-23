'use client';

import { useEffect, useState } from 'react';
import type { RecipeIngredientDto, RecipeStepDto } from '@/lib/types/recipe';
import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  Pause,
  Play,
  RotateCcw,
  ShoppingBag,
  X,
} from 'lucide-react';
import { resolveMediaUrl } from '@/lib/utils';

interface CookingModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeTitle: string;
  steps: RecipeStepDto[];
  ingredients: RecipeIngredientDto[];
  servings: number;
  baseServings: number;
}

// ------------------------------------------------------------------------------------------------
// Component Chế Độ Vào Bếp Rảnh Tay (Cooking Mode Fullscreen Modal)
// Tính năng nâng cao hỗ trợ người dùng nấu ăn trực tiếp:
// 1. Chế độ toàn màn hình (Fullscreen) với giao diện tối (Dark mode) tương phản cao.
// 2. Chuyển từng bước lớn rõ ràng (Step-by-step), hỗ trợ phím tắt bàn phím (Mũi tên trái/phải, Esc).
// 3. Tích hợp bộ đếm giờ (Timer) đếm ngược trực tiếp cho từng bước có chỉ định thời gian.
// 4. Giữ màn hình luôn sáng (Screen Wake Lock API) để điện thoại/máy tính bảng không tự tắt khi đang nấu.
// 5. Tự động quy đổi định lượng nguyên liệu theo số khẩu phần ăn đang chọn.
// ------------------------------------------------------------------------------------------------

export default function CookingModeModal({
  isOpen,
  onClose,
  recipeTitle,
  steps,
  ingredients,
  servings,
  baseServings,
}: CookingModeModalProps) {
  // 1. Sắp xếp danh sách các bước chế biến theo số thứ tự (StepNumber) từ nhỏ đến lớn
  const sortedSteps = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

  // 2. Sắp xếp danh sách nguyên liệu theo thứ tự hiển thị (OrderIndex)
  const sortedIngredients = [...ingredients].sort((a, b) => a.orderIndex - b.orderIndex);

  // State lưu vị trí bước nấu hiện tại (bắt đầu từ bước 0)
  const [stepIdx, setStepIdx] = useState(0);

  // State đóng/mở thanh xem nhanh nguyên liệu bên hông
  const [showIngredients, setShowIngredients] = useState(false);

  // Lấy thông tin bước nấu đang được xem
  const activeStep = sortedSteps[stepIdx];

  // Tính số giây hẹn giờ ban đầu cho bước này (nếu có TimerMinutes)
  const initialSeconds = activeStep?.timerMinutes ? activeStep.timerMinutes * 60 : 0;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [timerRunning, setTimerRunning] = useState(false);

  // Khi modal mở ra, luôn đặt lại trạng thái về bước 1 đầu tiên
  useEffect(() => {
    if (isOpen) {
      setStepIdx(0);
      setShowIngredients(false);
    }
  }, [isOpen]);

  // Khi người dùng chuyển sang bước khác, nạp lại thời gian hẹn giờ cho bước mới
  useEffect(() => {
    setSecondsLeft(activeStep?.timerMinutes ? activeStep.timerMinutes * 60 : 0);
    setTimerRunning(false);
  }, [stepIdx, activeStep?.timerMinutes]);

  // Quản lý bộ đếm ngược thời gian (Timer) bằng setInterval mỗi 1000ms (1 giây)
  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) {
      if (secondsLeft === 0) setTimerRunning(false);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timerRunning, secondsLeft]);

  // Tận dụng Screen Wake Lock API của trình duyệt hiện đại:
  // Giữ màn hình thiết bị luôn sáng trong khi nấu ăn, chống tự động khóa máy/tắt màn hình
  useEffect(() => {
    if (!isOpen) return;
    let sentinel: { release?: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> };
    };

    const requestWakeLock = () => {
      nav.wakeLock
        ?.request('screen')
        .then((lock) => {
          sentinel = lock;
        })
        .catch(() => {
          // Trình duyệt không hỗ trợ hoặc người dùng chặn quyền WakeLock
        });
    };

    // Khi người dùng chuyển tab rồi quay lại, xin lại quyền giữ màn hình sáng
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      sentinel?.release?.().catch(() => {});
    };
  }, [isOpen]);

  // Hỗ trợ phím tắt bàn phím: ← (Bước trước), → (Bước tiếp), Esc (Thoát)
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setStepIdx((prev) => Math.min(sortedSteps.length - 1, prev + 1));
      }
      if (e.key === 'ArrowLeft') {
        setStepIdx((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, sortedSteps.length, onClose]);

  // Nếu modal không mở hoặc không có bước nào thì không render gì cả
  if (!isOpen || sortedSteps.length === 0 || !activeStep) return null;

  // Tính tỷ lệ nhân số lượng nguyên liệu: Khẩu phần mục tiêu / Khẩu phần gốc
  const ratio = servings / (baseServings > 0 ? baseServings : 1);

  // Định dạng hiển thị phút:giây (ví dụ 05:09)
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  // Tính tỷ lệ tiến độ hoàn thành thanh Progress bar (theo %)
  const progress = Math.round(((stepIdx + 1) / sortedSteps.length) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chế độ Vào Bếp rảnh tay"
      className="fixed inset-0 z-50 flex flex-col bg-stone-950 text-stone-100 print:hidden"
    >
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-stone-800 px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Chế độ Vào Bếp &bull; {servings} phần
            </p>
            <h2 className="text-base font-bold text-white sm:text-lg line-clamp-1">
              {recipeTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowIngredients((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900 px-3 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800"
          >
            <ShoppingBag className="h-4 w-4 text-orange-400" />
            <span className="hidden sm:inline">Nguyên liệu</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Thoát chế độ Vào Bếp"
            className="inline-flex items-center gap-1 rounded-xl border border-stone-700 bg-stone-900 px-3 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-800"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Thoát</span>
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="h-1.5 w-full bg-stone-900">
        <div
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8 sm:px-12">
          <div className="w-full max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-bold text-orange-300">
              Bước {stepIdx + 1} / {sortedSteps.length}
            </div>

            {activeStep.title && (
              <h3 className="text-2xl font-extrabold text-white sm:text-4xl">
                {activeStep.title}
              </h3>
            )}

            {/* Ảnh minh họa của bước (nếu có) */}
            {activeStep.imageUrl && (
              <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-xl max-w-2xl w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(activeStep.imageUrl)}
                  alt={`Bước ${stepIdx + 1}: ${activeStep.title || 'Hình minh họa'}`}
                  className="aspect-video sm:aspect-[16/9] w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget.parentElement as HTMLElement)?.classList.add('hidden');
                  }}
                />
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs select-none">
                  <ImageIcon className="h-3.5 w-3.5 text-orange-400" />
                  <span>Ảnh bước {stepIdx + 1}</span>
                </div>
              </div>
            )}

            <p className="whitespace-pre-line text-lg leading-relaxed text-stone-200 sm:text-2xl sm:leading-relaxed">
              {activeStep.description}
            </p>

            {activeStep.timerMinutes && activeStep.timerMinutes > 0 && (
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-stone-800 bg-stone-900 p-4">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-6 w-6 text-orange-400" />
                  <span className="font-mono text-2xl font-bold text-white">
                    {mins}:{secs}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTimerRunning((r) => !r)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                  >
                    {timerRunning ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Tạm dừng
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Bắt đầu hẹn giờ
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setSecondsLeft(initialSeconds);
                    }}
                    className="inline-flex items-center gap-1 rounded-xl border border-stone-700 px-3 py-2 text-sm text-stone-300 hover:bg-stone-800"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Đặt lại
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients Drawer */}
        {showIngredients && (
          <aside className="w-80 shrink-0 overflow-y-auto border-l border-stone-800 bg-stone-900 p-5">
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-orange-400">
              Nguyên liệu ({servings} phần)
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-200">
              {sortedIngredients.map((ing) => {
                const qty =
                  ing.quantity !== null && ing.quantity !== undefined
                    ? Math.round(ing.quantity * ratio * 100) / 100
                    : null;
                return (
                  <li key={ing.id} className="border-b border-stone-800 pb-2">
                    <span className="font-semibold text-white">
                      {qty !== null ? qty : ''} {ing.unit ?? ''}
                    </span>{' '}
                    <span>{ing.name}</span>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </div>

      {/* Bottom navigation */}
      <footer className="flex items-center justify-between border-t border-stone-800 px-6 py-4 sm:px-10">
        <button
          type="button"
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          disabled={stepIdx === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-35"
        >
          <ChevronLeft className="h-5 w-5" />
          Bước trước
        </button>

        <span className="text-xs text-stone-400">Phím tắt: ← / → hoặc Esc</span>

        {stepIdx < sortedSteps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStepIdx((i) => Math.min(sortedSteps.length - 1, i + 1))}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
          >
            Bước tiếp theo
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Hoàn thành món ăn!
          </button>
        )}
      </footer>
    </div>
  );
}
