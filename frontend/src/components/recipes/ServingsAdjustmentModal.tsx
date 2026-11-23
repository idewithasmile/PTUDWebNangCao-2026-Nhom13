'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Utensils,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  ChefHat,
  SlidersHorizontal,
  Flame,
  Minus,
  Plus,
} from 'lucide-react';

export interface ServingsAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseServings: number;
  targetServings: number;
  multiplier: number;
  ingredients: Array<{
    name: string;
    quantity?: number | null;
    unit?: string | null;
    notes?: string | null;
  }>;
  steps: Array<{
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
  onConfirm: (options: {
    targetServings: number;
    multiplier: number;
    updateIngredients: boolean;
    updateNutrition: boolean;
    updateSteps: boolean;
    modifiedSteps?: Array<{
      title?: string;
      description: string;
      timerMinutes?: number | null;
      imageUrl?: string | null;
    }>;
  }) => void;
}

// ------------------------------------------------------------------------------------------------
// Component Hộp Thoại Tùy Chỉnh Khẩu Phần Ăn (Servings Adjustment Modal)
// Tính năng thông minh:
// 1. Cho phép người dùng tăng/giảm số người ăn (Servings).
// 2. Tự động tính toán lại định lượng (Quantity) cho toàn bộ danh sách nguyên liệu.
// 3. Quét thông minh (Smart Regex Scan) trong mô tả các bước nấu để phát hiện và đồng bộ các con số định lượng.
// 4. Tùy chọn cập nhật chỉ số dinh dưỡng (Calories, Carb, Fat...) tương ứng theo khẩu phần mới.
// ------------------------------------------------------------------------------------------------

export default function ServingsAdjustmentModal({
  isOpen,
  onClose,
  baseServings,
  targetServings,
  multiplier,
  ingredients = [],
  steps = [],
  nutrition,
  onConfirm,
}: ServingsAdjustmentModalProps) {
  // Đảm bảo số khẩu phần gốc tối thiểu bằng 2 nếu dữ liệu bị lỗi <= 0
  const safeBaseServings = baseServings > 0 ? baseServings : 2;

  // State lưu số khẩu phần người dùng đang chọn điều chỉnh
  const [currentServings, setCurrentServings] = useState<number>(() => {
    return targetServings > 0 ? targetServings : safeBaseServings;
  });

  // Chế độ áp dụng bước: 'safe' (chỉ đổi bảng nguyên liệu) hoặc 'sync' (đồng bộ cả con số trong mô tả các bước)
  const [stepMode, setStepMode] = useState<'safe' | 'sync'>('safe');

  // Có cập nhật lại giá trị dinh dưỡng (Calories, Protein...) theo khẩu phần mới hay không
  const [includeNutrition, setIncludeNutrition] = useState(true);

  // Đồng bộ lại state khi modal được mở hoặc props từ cha thay đổi
  useEffect(() => {
    if (isOpen) {
      setCurrentServings(targetServings > 0 ? targetServings : safeBaseServings);
    }
  }, [isOpen, targetServings, safeBaseServings]);

  if (!isOpen) return null;

  // 1. Tính hệ số nhân chính xác (Multiplier): Khẩu phần mới / Khẩu phần gốc (ví dụ: 4 / 2 = 2.0x)
  const currentMultiplier = safeBaseServings > 0 ? currentServings / safeBaseServings : 1;

  // 2. Tính toán trước định lượng mới cho toàn bộ nguyên liệu:
  // newQty = oldQty * currentMultiplier (làm tròn 1 chữ số thập phân nếu là số lẻ)
  const scaledIngredients = ingredients.map((ing) => {
    let newQty: number | null = null;
    if (ing.quantity !== null && ing.quantity !== undefined && !isNaN(Number(ing.quantity))) {
      const raw = Number(ing.quantity) * currentMultiplier;
      newQty = raw % 1 === 0 ? raw : Number(raw.toFixed(1));
    }
    return {
      ...ing,
      oldQty: ing.quantity,
      newQty,
    };
  });

  // 3. Thuật toán Quét & Gợi ý Thông Minh (Smart Regex Scan):
  // Quét nội dung văn bản của từng bước (step.description), tìm kiếm các con số khớp với định lượng nguyên liệu cũ
  // và chuẩn bị sẵn chuỗi văn bản thay thế tương ứng với định lượng mới.
  const stepSuggestions: Array<{
    stepIndex: number;
    title?: string;
    originalText: string;
    suggestedText: string;
    changesCount: number;
  }> = [];

  steps.forEach((step, sIdx) => {
    let modified = step.description;
    let changes = 0;

    scaledIngredients.forEach((ing) => {
      if (ing.oldQty && ing.newQty && ing.oldQty !== ing.newQty) {
        // Tìm pattern số lượng + đơn vị (ví dụ: "300g", "300 g", "300 gram")
        const unitPart = ing.unit ? `\\s*${ing.unit}` : '';
        const regex = new RegExp(`\\b${ing.oldQty}${unitPart}\\b`, 'gi');
        if (regex.test(modified)) {
          modified = modified.replace(regex, `${ing.newQty}${ing.unit ? ` ${ing.unit}` : ''}`);
          changes++;
        }
      }
    });

    // Nếu tìm thấy ít nhất 1 con số cần thay đổi trong bước này thì lưu vào danh sách gợi ý
    if (changes > 0) {
      stepSuggestions.push({
        stepIndex: sIdx,
        title: step.title,
        originalText: step.description,
        suggestedText: modified,
        changesCount: changes,
      });
    }
  });

  // 4. Xử lý khi người dùng nhấn nút Xác Nhận Áp Dụng
  const handleApply = () => {
    const finalSteps =
      stepMode === 'sync'
        ? steps.map((step, idx) => {
            const suggestion = stepSuggestions.find((s) => s.stepIndex === idx);
            return suggestion ? { ...step, description: suggestion.suggestedText } : step;
          })
        : steps;

    onConfirm({
      targetServings: currentServings,
      multiplier: currentMultiplier,
      updateIngredients: true,
      updateNutrition: includeNutrition,
      updateSteps: stepMode === 'sync',
      modifiedSteps: finalSteps,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-stone-200 animate-scale-up overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header Modal */}
        <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-stone-100 bg-gradient-to-r from-orange-50/60 to-amber-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                Xác nhận điều chỉnh khẩu phần công thức
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {currentServings === safeBaseServings ? (
                  <span>
                    Điều chỉnh số lượng nguyên liệu theo số người ăn (Hiện tại: <strong>{safeBaseServings} người</strong>)
                  </span>
                ) : (
                  <span>
                    Cập nhật định lượng khẩu phần từ <strong>{safeBaseServings} người</strong> sang{' '}
                    <strong className="text-orange-600 font-bold">{currentServings} người</strong> (x{currentMultiplier.toFixed(2)})
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Thân Modal (Scrollable Content) */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6">
          {/* Card so sánh & tương tác điều chỉnh khẩu phần */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-center">
              {/* Cột 1: Khẩu phần gốc */}
              <div className="space-y-1 p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Khẩu phần gốc
                </span>
                <div className="text-xl font-bold text-stone-800 flex items-center justify-center gap-1.5">
                  <Users className="w-4 h-4 text-stone-500" />
                  <span>{safeBaseServings} người</span>
                </div>
              </div>

              {/* Cột 2: Hệ số điều chỉnh */}
              <div className="flex flex-col items-center justify-center py-1 sm:py-0">
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full border transition ${
                    currentMultiplier === 1
                      ? 'bg-stone-100 text-stone-600 border-stone-200'
                      : currentMultiplier > 1
                      ? 'bg-orange-100 text-orange-700 border-orange-200 shadow-2xs'
                      : 'bg-amber-100 text-amber-800 border-amber-200 shadow-2xs'
                  }`}
                >
                  x{currentMultiplier.toFixed(2)} lần
                </span>
                <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-stone-500">
                  {currentServings === safeBaseServings ? (
                    <span className="text-stone-400">Chưa thay đổi</span>
                  ) : currentServings > safeBaseServings ? (
                    <span className="text-emerald-600 font-semibold">
                      +{currentServings - safeBaseServings} người
                    </span>
                  ) : (
                    <span className="text-amber-600 font-semibold">
                      -{safeBaseServings - currentServings} người
                    </span>
                  )}
                </div>
              </div>

              {/* Cột 3: Khẩu phần mới (Stepper điều chỉnh trực tiếp) */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white border-2 border-orange-400 shadow-xs">
                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">
                  Khẩu phần mới
                </span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentServings((prev) => Math.max(1, prev - 1))}
                    disabled={currentServings <= 1}
                    className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition active:scale-90 font-bold border border-stone-200 cursor-pointer"
                    title="Giảm 1 người"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1 min-w-[70px]">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={currentServings}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          setCurrentServings(Math.max(1, Math.min(50, val)));
                        } else if (e.target.value === '') {
                          setCurrentServings(1);
                        }
                      }}
                      className="w-10 text-center text-xl font-black text-orange-600 bg-transparent outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-xs font-bold text-stone-500">người</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentServings((prev) => Math.min(50, prev + 1))}
                    disabled={currentServings >= 50}
                    className="w-8 h-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition active:scale-90 font-bold shadow-2xs cursor-pointer"
                    title="Tăng 1 người"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Phím chọn nhanh khẩu phần & tỷ lệ */}
            <div className="pt-2.5 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-stone-500 mr-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  Số người:
                </span>
                {[1, 2, 4, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentServings(num)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer ${
                      currentServings === num
                        ? 'bg-orange-600 text-white shadow-2xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:border-orange-300 hover:bg-orange-50/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-stone-500 mr-1">Tỷ lệ:</span>
                {[
                  { label: '½ (Một nửa)', mult: 0.5 },
                  { label: 'x2 (Gấp đôi)', mult: 2 },
                  { label: 'x3 (Gấp ba)', mult: 3 },
                ].map((preset) => {
                  const targetNum = Math.max(1, Math.round(safeBaseServings * preset.mult));
                  const isActive = currentServings === targetNum;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCurrentServings(targetNum)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition active:scale-95 cursor-pointer ${
                        isActive
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-amber-50/80 border border-amber-200 text-amber-800 hover:bg-amber-100'
                      }`}
                      title={`Điều chỉnh ${preset.label} -> ${targetNum} người`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chọn phương thức xử lý Các bước nấu ăn (Cooking Steps Strategy) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-500" />
              <span>Phương án xử lý các bước chế biến (Cooking Steps)</span>
            </h4>

            <div className="space-y-2.5">
              {/* Lựa chọn 1: Chuẩn đầu bếp - An toàn (Khuyên dùng) */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                  stepMode === 'safe'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50/70'
                }`}
              >
                <input
                  type="radio"
                  name="stepMode"
                  value="safe"
                  checked={stepMode === 'safe'}
                  onChange={() => setStepMode('safe')}
                  className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-stone-300"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      Chế độ 1: Chuẩn đầu bếp & An toàn (Khuyên dùng)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Tự động nhân tỷ lệ <strong>Bảng nguyên liệu</strong> và <strong>Dinh dưỡng</strong>. Giữ nguyên câu chữ mô tả trong các bước để bảo toàn <em>kỹ thuật nấu, nhiệt độ và thời gian chín</em>. Độc giả sẽ nấu theo định lượng mới trên bảng nguyên liệu.
                  </p>
                </div>
              </label>

              {/* Lựa chọn 2: Quét thông minh con số trong các bước */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                  stepMode === 'sync'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50/70'
                }`}
              >
                <input
                  type="radio"
                  name="stepMode"
                  value="sync"
                  checked={stepMode === 'sync'}
                  onChange={() => setStepMode('sync')}
                  className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-stone-300"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      Chế độ 2: Quét & gợi ý đồng bộ con số trong các bước
                    </span>
                    {stepSuggestions.length > 0 && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {stepSuggestions.length} câu có số liệu
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Hệ thống sẽ quét mô tả các bước và tự động thay thế các con số định lượng nguyên liệu tương ứng (ví dụ: từ <em>300g thịt</em> thành <em>{Math.round(300 * currentMultiplier)}g thịt</em>).
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Nếu chọn Chế độ 2: Hiển thị Preview các câu trong bước sẽ được cập nhật */}
          {stepMode === 'sync' && (
            <div className="space-y-2 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 animate-fade-in">
              <h5 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Xem trước các bước được đề xuất cập nhật con số ({stepSuggestions.length})</span>
              </h5>
              {stepSuggestions.length === 0 ? (
                <p className="text-xs text-blue-800/80 italic">
                  Không tìm thấy con số định lượng cụ thể nào trong mô tả các bước. Mô tả các bước sẽ được giữ nguyên an toàn.
                </p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {stepSuggestions.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-blue-100 text-xs space-y-1">
                      <div className="font-bold text-stone-800 text-[11px]">
                        Bước {item.stepIndex + 1}: {item.title || 'Quy trình'}
                      </div>
                      <div className="text-stone-500 line-through text-[11px] leading-snug">
                        {item.originalText}
                      </div>
                      <div className="text-blue-900 font-semibold text-[11px] leading-snug">
                        ➔ {item.suggestedText}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bảng xem trước Nguyên liệu thay đổi */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-500" />
              <span>Bảng nguyên liệu được nhân tỷ lệ ({scaledIngredients.length})</span>
            </h4>
            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <div className="max-h-48 overflow-y-auto divide-y divide-stone-100">
                {scaledIngredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3.5 py-2.5 text-xs hover:bg-stone-50/80 transition">
                    <span className="font-medium text-stone-800 truncate max-w-[200px]">
                      {ing.name}
                    </span>
                    <div className="flex items-center gap-2 font-bold shrink-0">
                      <span className="text-stone-400">
                        {ing.oldQty !== null && ing.oldQty !== undefined
                          ? `${ing.oldQty} ${ing.unit || ''}`
                          : ing.unit || 'Theo vị'}
                      </span>
                      <ArrowRight className="w-3 h-3 text-stone-300" />
                      <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                        {ing.newQty !== null && ing.newQty !== undefined
                          ? `${ing.newQty} ${ing.unit || ''}`
                          : ing.unit || 'Theo vị'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tùy chọn Dinh dưỡng */}
          {nutrition && (nutrition.calories || nutrition.protein) && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <div>
                  <span className="font-bold text-stone-800">Tự động nhân giá trị Dinh dưỡng</span>
                  <p className="text-[10px] text-stone-500">
                    Cập nhật Calo ({nutrition.calories || 0} kcal ➔ {Math.round((nutrition.calories || 0) * currentMultiplier)} kcal)
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeNutrition}
                onChange={(e) => setIncludeNutrition(e.target.checked)}
                className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500 border-stone-300 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* 3. Footer Hành Động */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50/80 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-100 transition active:scale-95 cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {currentServings === safeBaseServings
                ? `Xác nhận giữ nguyên (${currentServings} người)`
                : `Xác nhận áp dụng (${currentServings} người • x${currentMultiplier.toFixed(2)})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
