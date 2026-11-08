'use client';

import { useState, useEffect } from 'react';
import { resolveMediaUrl } from '@/lib/utils';
import {
  Clock,
  ChefHat,
  Users,
  Flame,
  Minus,
  Plus,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Eye,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Heart,
  Bookmark,
  Share2,
  Utensils,
  Check,
  Dumbbell,
  Wheat,
  Droplets,
  Layers,
  SlidersHorizontal,
  Image as ImageIcon,
} from 'lucide-react';

export interface RecipeLivePreviewWidgetProps {
  title?: string;
  description?: string;
  categoryName?: string;
  difficulty?: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  heroImageUrl?: string;
  ingredients?: Array<{
    name: string;
    quantity?: number | null;
    unit?: string | null;
    notes?: string | null;
  }>;
  steps?: Array<{
    title?: string;
    description: string;
    timerMinutes?: number | null;
    imageUrl?: string | null;
  }>;
  nutrition?: {
    calories?: number | null;
    protein?: number | null;
    carbohydrates?: number | null;
    fat?: number | null;
  };
  onOpenFullDashboardPreview: () => void;
  onOpenNewPagePreview: () => void;
  onSwitchToStudio?: () => void;
  onRequestApplyServings?: (targetServings: number, multiplier: number) => void;
}

const difficultyMeta: Record<number, { label: string; color: string }> = {
  1: { label: 'Dễ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  2: { label: 'Trung bình', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  3: { label: 'Khó', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  4: { label: 'Chuyên gia', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function RecipeLivePreviewWidget({
  title = '',
  description = '',
  categoryName = 'Món Việt Nam',
  difficulty = 1,
  prepTimeMinutes = 15,
  cookTimeMinutes = 20,
  servings = 2,
  heroImageUrl = '',
  ingredients = [],
  steps = [],
  nutrition,
  onOpenFullDashboardPreview,
  onOpenNewPagePreview,
  onSwitchToStudio,
  onRequestApplyServings,
}: RecipeLivePreviewWidgetProps) {
  // 1. Chế độ xem mini: 'card' (Thẻ bìa) | 'cooking' (Nấu ăn từng bước) | 'nutrition' (Dinh dưỡng) | 'mobile' (Mô phỏng Mobile)
  const [activeTab, setActiveTab] = useState<'card' | 'cooking' | 'nutrition' | 'mobile'>('card');

  // 2. Tương tác khẩu phần ăn (Realtime Scaling Calculator)
  const [interactiveServings, setInteractiveServings] = useState(servings || 2);
  useEffect(() => {
    if (servings && servings > 0) {
      setInteractiveServings(servings);
    }
  }, [servings]);

  // 3. Tương tác checkbox nguyên liệu
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const toggleIngredientCheck = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // 4. Tương tác Cooking Mode & Mini Timer
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStep = steps[activeStepIndex] || steps[0];
  const stepTimerMinutes = currentStep?.timerMinutes || 5;

  const [timerSecondsLeft, setTimerSecondsLeft] = useState(stepTimerMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    setTimerSecondsLeft((currentStep?.timerMinutes || 5) * 60);
    setIsTimerRunning(false);
  }, [activeStepIndex, currentStep?.timerMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 5. Thả tim & Bookmark thử nghiệm
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showQualityDetails, setShowQualityDetails] = useState(false);

  // 6. Tính toán điểm chất lượng công thức (Recipe Completeness Score)
  const validIngredients = ingredients.filter((i) => i.name && i.name.trim().length > 0);
  const validSteps = steps.filter((s) => s.description && s.description.trim().length > 0);
  const hasImage = Boolean(heroImageUrl && heroImageUrl.trim().length > 0);
  const hasTitle = Boolean(title && title.trim().length >= 5);
  const hasDesc = Boolean(description && description.trim().length >= 10);
  const hasIngs = validIngredients.length >= 2;
  const hasStps = validSteps.length >= 2;
  const hasNutr = Boolean(
    (nutrition?.calories && nutrition.calories > 0) ||
      (nutrition?.protein && nutrition.protein > 0)
  );

  let qualityScore = 0;
  if (hasTitle) qualityScore += 20;
  if (hasImage) qualityScore += 20;
  if (hasDesc) qualityScore += 15;
  if (hasIngs) qualityScore += 20;
  if (hasStps) qualityScore += 15;
  if (hasNutr) qualityScore += 10;

  const totalTimeMinutes = (Number(prepTimeMinutes) || 0) + (Number(cookTimeMinutes) || 0) || 35;
  const baseServings = Math.max(1, servings || 2);
  const scaleMultiplier = interactiveServings / baseServings;

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* =========================================================================
          1. HEADER CARD: TIÊU ĐỀ & ĐIỂM CHẤT LƯỢNG BÀI VIẾT (RECIPE STUDIO QUALITY)
          ========================================================================= */}
      <div className="p-4 bg-gradient-to-r from-stone-50 via-orange-50/30 to-amber-50/40 border-b border-stone-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shadow-orange-500/30">
            🍳
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-none">
              Live Preview Studio
            </h4>
            <p className="text-[10px] text-stone-400 mt-0.5">Mô phỏng thời gian thực</p>
          </div>
        </div>

        {/* Nút chỉ báo điểm chất lượng bài viết */}
        <button
          type="button"
          onClick={() => setShowQualityDetails(!showQualityDetails)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
            qualityScore >= 80
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : qualityScore >= 50
              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
          }`}
          title="Nhấp để xem gợi ý tối ưu chất lượng công thức"
        >
          <Sparkles className="w-3 h-3 text-orange-500" />
          <span>{qualityScore}% Chuẩn vị</span>
        </button>
      </div>

      {/* Popover mở rộng: Checklist chất lượng bài viết */}
      {showQualityDetails && (
        <div className="p-3.5 bg-stone-50/90 border-b border-stone-200/80 text-xs text-stone-600 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between font-bold text-stone-800 text-[11px]">
            <span>Độ hoàn thiện công thức</span>
            <span>{qualityScore} / 100 điểm</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                qualityScore >= 80 ? 'bg-emerald-500' : qualityScore >= 50 ? 'bg-amber-500' : 'bg-orange-500'
              }`}
              style={{ width: `${qualityScore}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
            <span className={`flex items-center gap-1 ${hasTitle ? 'text-emerald-700 font-semibold' : 'text-stone-400'}`}>
              <Check className="w-3 h-3" /> Tiêu đề rõ ràng
            </span>
            <span className={`flex items-center gap-1 ${hasImage ? 'text-emerald-700 font-semibold' : 'text-stone-400'}`}>
              <Check className="w-3 h-3" /> Ảnh bìa món ăn
            </span>
            <span className={`flex items-center gap-1 ${hasDesc ? 'text-emerald-700 font-semibold' : 'text-stone-400'}`}>
              <Check className="w-3 h-3" /> Mô tả dẫn nhập
            </span>
            <span className={`flex items-center gap-1 ${hasIngs ? 'text-emerald-700 font-semibold' : 'text-stone-400'}`}>
              <Check className="w-3 h-3" /> Định lượng nguyên liệu
            </span>
            <span className={`flex items-center gap-1 ${hasStps ? 'text-emerald-700 font-semibold' : 'text-stone-400'}`}>
              <Check className="w-3 h-3" /> Quy trình & Timer
            </span>
            <span className={`flex items-center gap-1 ${hasNutr ? 'text-emerald-700 font-semibold' : 'text-stone-400'}`}>
              <Check className="w-3 h-3" /> Dinh dưỡng Macros
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. THANH CHUYỂN ĐỔI CHẾ ĐỘ XEM TRƯỚC (INTERACTIVE PREVIEW VIEW SWITCHER)
          ========================================================================= */}
      <div className="p-1.5 bg-stone-100/80 border-b border-stone-200/70 grid grid-cols-4 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('card')}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
            activeTab === 'card'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
          }`}
          title="Xem dạng Thẻ công thức trên Feed"
        >
          <Layers className="w-3 h-3" />
          <span>Thẻ bìa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cooking')}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
            activeTab === 'cooking'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
          }`}
          title="Duyệt từng bước và bấm giờ nấu thử"
        >
          <Utensils className="w-3 h-3" />
          <span>Nấu ăn</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('nutrition')}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
            activeTab === 'nutrition'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
          }`}
          title="Xem biểu đồ giá trị dinh dưỡng"
        >
          <Flame className="w-3 h-3" />
          <span>Dinh dưỡng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mobile')}
          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
            activeTab === 'mobile'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
          }`}
          title="Xem mô phỏng trên màn hình điện thoại"
        >
          <Smartphone className="w-3 h-3" />
          <span>Mobile</span>
        </button>
      </div>

      {/* =========================================================================
          3. NỘI DUNG TƯƠNG ỨNG THEO TỪNG TAB XEM TRƯỚC
          ========================================================================= */}
      {/* TAB 1: THẺ BÀI VIẾT (CARD VIEW - MÔ PHỎNG FEED & INTERACTIVE SERVINGS) */}
      {activeTab === 'card' && (
        <div className="space-y-4 animate-fade-in">
          {/* Ảnh bìa + Badge + Nút tương tác thả tim / bookmark */}
          <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 group">
            {heroImageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={resolveMediaUrl(heroImageUrl)}
                alt={title || 'Preview'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
                <ImageIcon className="w-10 h-10 mb-2 stroke-[1.5] text-stone-300" />
                <span className="text-xs font-semibold text-stone-500">Chưa có ảnh đại diện</span>
                <span className="text-[10px] text-stone-400 mt-0.5">Tải ảnh lên để xem trước</span>
              </div>
            )}
            {/* Badge danh mục */}
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-stone-800 text-[11px] font-bold shadow-xs">
              <span>🥗</span>
              <span>{categoryName}</span>
            </div>

            {/* Cụm nút tương tác thử nghiệm góc phải (Like / Bookmark) */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className={`w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition shadow-xs ${
                  isLiked ? 'bg-rose-500 text-white' : 'bg-white/90 text-stone-700 hover:bg-white'
                }`}
                title="Thả tim yêu thích"
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition shadow-xs ${
                  isBookmarked ? 'bg-orange-500 text-white' : 'bg-white/90 text-stone-700 hover:bg-white'
                }`}
                title="Lưu công thức"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="px-5 pb-5 space-y-4">
            {/* Tiêu đề & Mô tả */}
            <div>
              <h3 className="text-base font-bold text-stone-900 line-clamp-2 leading-snug">
                {title?.trim() || 'Tên công thức sẽ hiển thị ở đây'}
              </h3>
              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mt-1">
                {description?.trim() || 'Mô tả ngắn về món ăn sẽ xuất hiện tại đây...'}
              </p>
            </div>

            {/* Hàng 3 thông số nhanh kèm BỘ TĂNG GIẢM KHẨU PHẦN TƯƠNG TÁC */}
            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs text-stone-700">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-semibold">{totalTimeMinutes} phút</span>
              </div>

              <div className="flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold">{difficultyMeta[difficulty || 1]?.label || 'Dễ'}</span>
              </div>

              {/* Bộ điều khiển khẩu phần ăn động */}
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-stone-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setInteractiveServings((p) => Math.max(1, p - 1))}
                  className="w-4 h-4 rounded text-stone-400 hover:text-orange-600 flex items-center justify-center hover:bg-stone-100 transition"
                  title="Giảm khẩu phần"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-stone-900 text-[11px] min-w-[3rem] text-center">
                  {interactiveServings} người
                </span>
                <button
                  type="button"
                  onClick={() => setInteractiveServings((p) => p + 1)}
                  className="w-4 h-4 rounded text-stone-400 hover:text-orange-600 flex items-center justify-center hover:bg-stone-100 transition"
                  title="Tăng khẩu phần"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Banner gợi ý áp dụng khẩu phần mới vào bài viết nếu khác khẩu phần gốc */}
            {interactiveServings !== baseServings && onRequestApplyServings && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-xs animate-fade-in shadow-2xs">
                <div className="text-[11px] text-orange-950 font-medium leading-tight">
                  Xem thử: <strong className="font-bold text-orange-700">{interactiveServings} người</strong> (x{scaleMultiplier.toFixed(1)})
                </div>
                <button
                  type="button"
                  onClick={() => onRequestApplyServings(interactiveServings, scaleMultiplier)}
                  className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold transition shadow-xs shrink-0 active:scale-95 flex items-center gap-1"
                  title="Mở bảng xác nhận điều chỉnh khẩu phần công thức"
                >
                  <span>Áp dụng vào bài</span>
                  <SlidersHorizontal className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            {/* Danh sách nguyên liệu tự động nhân tỷ lệ theo khẩu phần tương tác */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <span>Nguyên liệu</span>
                  {scaleMultiplier !== 1 && (
                    <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded">
                      x{scaleMultiplier.toFixed(1)} khẩu phần
                    </span>
                  )}
                </h5>
                <span className="text-[10px] text-stone-400">Click để tick thử</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {validIngredients.slice(0, 4).map((ing, idx) => {
                  const scaledQty = ing.quantity ? (ing.quantity * scaleMultiplier).toFixed(ing.quantity % 1 === 0 && scaleMultiplier % 1 === 0 ? 0 : 1) : null;
                  const isChecked = Boolean(checkedIngredients[idx]);

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleIngredientCheck(idx)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition select-none ${
                        isChecked
                          ? 'bg-emerald-50/70 border border-emerald-200/70 text-emerald-900'
                          : 'bg-stone-50/80 border border-stone-200/50 hover:bg-stone-100/70 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center transition ${
                            isChecked
                              ? 'bg-emerald-500 text-white'
                              : 'border border-stone-300 bg-white text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={`font-medium truncate ${isChecked ? 'line-through text-stone-400' : ''}`}>
                          {ing.name}
                        </span>
                      </div>
                      <span className="text-stone-500 font-bold text-[11px] shrink-0">
                        {scaledQty ? `${scaledQty} ${ing.unit || ''}` : ing.unit || ''}
                      </span>
                    </div>
                  );
                })}

                {validIngredients.length === 0 && (
                  <p className="text-xs text-stone-400 italic py-2 text-center">Chưa nhập nguyên liệu...</p>
                )}
                {validIngredients.length > 4 && (
                  <p className="text-[11px] text-stone-400 text-center pt-0.5">
                    + {validIngredients.length - 4} nguyên liệu khác
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NẤU ĂN TỪNG BƯỚC (COOKING MODE & INTERACTIVE MINI TIMER) */}
      {activeTab === 'cooking' && (
        <div className="p-5 space-y-4 animate-fade-in">
          {/* Header bước & Điều hướng next/prev */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
              Bước {(activeStepIndex + 1)} / {Math.max(1, validSteps.length)}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((p) => Math.max(0, p - 1))}
                className="p-1 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition"
                title="Bước trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={activeStepIndex >= validSteps.length - 1}
                onClick={() => setActiveStepIndex((p) => Math.min(validSteps.length - 1, p + 1))}
                className="p-1 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition"
                title="Bước tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chi tiết bước hiện tại */}
          {validSteps.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-stone-900 leading-snug">
                {currentStep?.title || `Bước ${activeStepIndex + 1}`}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                {currentStep?.description || 'Chưa có hướng dẫn cho bước này.'}
              </p>

              {/* Ảnh minh họa của bước nấu */}
              {currentStep?.imageUrl && (
                <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 max-h-48 shadow-2xs group/stepimg relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveMediaUrl(currentStep.imageUrl)}
                    alt={currentStep.title || `Ảnh minh họa bước ${activeStepIndex + 1}`}
                    className="w-full h-40 object-cover group-hover/stepimg:scale-102 transition duration-300"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium flex items-center gap-1">
                    <ImageIcon className="w-2.5 h-2.5" />
                    <span>Ảnh bước {activeStepIndex + 1}</span>
                  </div>
                </div>
              )}

              {/* BỘ ĐẾM THỜI GIAN NẤU MINI TƯƠNG TÁC THẬT */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/80 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                    Đồng hồ bấm giờ mini
                  </p>
                  <p className="text-2xl font-black text-stone-900 font-mono tracking-tight mt-0.5">
                    {formatTimer(timerSecondsLeft)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-xs active:scale-95 ${
                      isTimerRunning
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isTimerRunning ? 'Dừng' : 'Bắt đầu'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSecondsLeft((currentStep?.timerMinutes || 5) * 60);
                    }}
                    className="p-1.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-white transition"
                    title="Đặt lại thời gian"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-stone-400 text-xs">
              <Utensils className="w-8 h-8 mx-auto text-stone-300 mb-2" />
              <span>Chưa có bước nấu nào được nhập...</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DINH DƯỠNG & NĂNG LƯỢNG (MACROS VISUALIZER) */}
      {activeTab === 'nutrition' && (
        <div className="p-5 space-y-4 animate-fade-in">
          {/* Tổng calo */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[11px] font-medium text-orange-100">Năng lượng ước tính</p>
              <h3 className="text-2xl font-black mt-0.5">
                {nutrition?.calories || 0} <span className="text-sm font-semibold font-normal">kcal</span>
              </h3>
            </div>
            <span className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl">
              🔥
            </span>
          </div>

          {/* 3 Thanh tỉ lệ thành phần Macros */}
          <div className="space-y-3 pt-1">
            <h5 className="text-xs font-bold text-stone-800">Thành phần dinh dưỡng chính</h5>

            {/* Protein */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Đạm (Protein)
                </span>
                <span className="font-bold text-stone-900">{nutrition?.protein || 0} g</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((nutrition?.protein || 0) / 60) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Tinh bột (Carbs)
                </span>
                <span className="font-bold text-stone-900">{nutrition?.carbohydrates || 0} g</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((nutrition?.carbohydrates || 0) / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Chất béo (Fat)
                </span>
                <span className="font-bold text-stone-900">{nutrition?.fat || 0} g</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((nutrition?.fat || 0) / 40) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-stone-400 italic text-center pt-2">
            * Giá trị dinh dưỡng tính trên 1 khẩu phần ăn tiêu chuẩn.
          </p>
        </div>
      )}

      {/* TAB 4: MÔ PHỎNG GIAO DIỆN SMARTPHONE (MOBILE FRAME PREVIEW) */}
      {activeTab === 'mobile' && (
        <div className="p-4 bg-stone-100 flex justify-center animate-fade-in">
          <div className="w-64 bg-white rounded-3xl border-4 border-stone-800 shadow-xl overflow-hidden text-stone-900">
            {/* Thanh loa thoại notch */}
            <div className="w-full h-4 bg-stone-800 flex justify-center items-center">
              <div className="w-12 h-1 bg-stone-600 rounded-full" />
            </div>

            {/* Màn hình điện thoại */}
            <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto">
              <div className="aspect-16/9 rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center">
                {heroImageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={resolveMediaUrl(heroImageUrl)}
                    alt="Mobile view"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-2 text-center bg-stone-100">
                    <ImageIcon className="w-6 h-6 mb-1 text-stone-300" />
                    <span className="text-[10px] font-medium text-stone-400">Chưa có ảnh</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider">
                  {categoryName}
                </span>
                <h5 className="text-xs font-bold line-clamp-1 leading-snug">
                  {title || 'Tên công thức'}
                </h5>
                <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                  {description || 'Mô tả ngắn...'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1 py-1.5 border-y border-stone-100 text-[9px] text-stone-600 font-medium text-center">
                <span>⏱️ {totalTimeMinutes}p</span>
                <span>👨‍🍳 {difficultyMeta[difficulty || 1]?.label || 'Dễ'}</span>
                <span>👥 {interactiveServings} ng</span>
              </div>

              <button
                type="button"
                onClick={onOpenFullDashboardPreview}
                className="w-full py-1.5 rounded-xl bg-orange-600 text-white text-[10px] font-bold shadow-xs active:scale-95 transition"
              >
                Bắt đầu nấu ngay 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. FOOTER CARD: CÁC NÚT ĐIỀU HƯỚNG XEM TRƯỚC VÀ CHUYỂN STUDIO
          ========================================================================= */}
      <div className="p-4 bg-stone-50/80 border-t border-stone-100 space-y-3">
        {/* Nút to nổi bật: Xem trước toàn cảnh Dashboard */}
        <button
          type="button"
          onClick={onOpenFullDashboardPreview}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition shadow-sm shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-98 group"
        >
          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Xem trước toàn cảnh (Dashboard)</span>
        </button>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] text-stone-400">Xem trên tab mới:</span>
          <button
            type="button"
            onClick={onOpenNewPagePreview}
            className="text-stone-600 hover:text-orange-600 font-bold text-xs inline-flex items-center gap-1 transition"
            title="Mở xem trước ở trang riêng biệt (/recipes/preview)"
          >
            <span>Mở tab riêng</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>

        {/* Banner chuyển sang Recipe Studio (nếu có callback) */}
        {onSwitchToStudio && (
          <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-blue-900 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px]">Recipe Studio 5 tab</span>
            </div>
            <button
              type="button"
              onClick={onSwitchToStudio}
              className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 transition active:scale-95"
            >
              Mở Studio 🎛️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
