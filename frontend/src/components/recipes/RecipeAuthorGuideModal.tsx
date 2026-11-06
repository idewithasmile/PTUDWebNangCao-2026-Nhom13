'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  X,
  Camera,
  Scale,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChefHat,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export interface RecipeAuthorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideTab = 'visual' | 'ingredients' | 'steps' | 'publishing';

export default function RecipeAuthorGuideModal({
  isOpen,
  onClose,
}: RecipeAuthorGuideModalProps) {
  const [activeTab, setActiveTab] = useState<GuideTab>('visual');

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-stone-200 animate-scale-up overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header Modal */}
        <div className="flex shrink-0 items-center justify-between px-6 py-5 border-b border-stone-100 bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight leading-snug">
                Sổ tay quy chuẩn ẩm thực Culinary Blog
              </h3>
              <p className="text-xs text-stone-500 mt-0.5 font-normal">
                Cẩm nang chi tiết giúp bài viết đạt chất lượng cao, hấp dẫn độc giả và chuẩn SEO ẩm thực
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition active:scale-95"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Dải Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-stone-100 bg-stone-50/60 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'visual'
                ? 'bg-orange-500 text-white shadow-xs font-bold'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>1. Quy chuẩn hình ảnh</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ingredients')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'ingredients'
                ? 'bg-orange-500 text-white shadow-xs font-bold'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>2. Định lượng nguyên liệu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'steps'
                ? 'bg-orange-500 text-white shadow-xs font-bold'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>3. Quy trình & Hẹn giờ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('publishing')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'publishing'
                ? 'bg-orange-500 text-white shadow-xs font-bold'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4. Vòng đời xuất bản</span>
          </button>
        </div>

        {/* 3. Nội dung Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 text-stone-700 text-xs sm:text-sm">
          {/* TAB 1: QUY CHUẨN HÌNH ẢNH */}
          {activeTab === 'visual' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-950 leading-relaxed">
                  <span className="font-bold">Hình ảnh là linh hồn của món ăn:</span> Độc giả quyết định đọc bài viết trong 3 giây đầu tiên dựa vào độ hấp dẫn, màu sắc và độ sắc nét của bức ảnh thành phẩm!
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <h4 className="font-bold text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Nên làm (Khuyến nghị)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-600">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span><strong>Tỷ lệ khung hình:</strong> 16:9 hoặc 4:3, độ phân giải tối thiểu 1200 × 800 px.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span><strong>Góc chụp:</strong> Góc flat-lay (từ trên xuống 90°) hoặc góc nghiêng 45° đón ánh sáng ban ngày.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span><strong>Bố cục:</strong> Đĩa món ăn là tâm điểm, bài trí thêm rau mùi tươi, lát ớt hoặc dụng cụ bếp mộc mạc.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                  <h4 className="font-bold text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider text-rose-700">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Cần tránh (Lỗi thường gặp)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-600">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>Không dùng ảnh bị nhòe nét, rung tay hoặc chụp trong điều kiện ánh sáng vàng tối.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>Không sử dụng ảnh có chèn logo bản quyền (watermark), số điện thoại hoặc quảng cáo.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>Hạn chế dùng ảnh chụp màn hình bị vỡ nét (pixelated).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ĐỊNH LƯỢNG NGUYÊN LIỆU */}
          {activeTab === 'ingredients' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-3">
                <Scale className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950 leading-relaxed">
                  <span className="font-bold">Định lượng chính xác để thành công:</span> Nấu ăn là nghệ thuật nhưng nêm nếm và sơ chế là khoa học. Định lượng chuẩn giúp độc giả nấu lần đầu là ngon ngay.
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-2">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-orange-500" />
                    <span>Quy chuẩn đơn vị đo lường</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="font-bold text-stone-800 block">Khối lượng</span>
                      <span className="text-stone-500 text-[11px]">gram (g), kg</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="font-bold text-stone-800 block">Thể tích</span>
                      <span className="text-stone-500 text-[11px]">mililit (ml), lít (l)</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="font-bold text-stone-800 block">Thìa gia vị</span>
                      <span className="text-stone-500 text-[11px]">muỗng cà phê, muỗng canh</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                      <span className="font-bold text-stone-800 block">Đếm số lượng</span>
                      <span className="text-stone-500 text-[11px]">quả, tép, củ, nhánh</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Tự động tính toán dinh dưỡng & khẩu phần</span>
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Khi bạn nhập chính xác số lượng và nguyên liệu, hệ thống sẽ tự động hỗ trợ ước lượng Calo, Đạm (Protein), Tinh bột (Carbs) và Chất béo (Fat). Độc giả còn có thể dùng công cụ <strong>"Tự động nhân khẩu phần"</strong> từ 2 người lên 4 người hoặc 6 người tùy ý!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUY TRÌNH & HẸN GIỜ */}
          {activeTab === 'steps' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-950 leading-relaxed">
                  <span className="font-bold">Quy tắc "Một bước - Một thao tác":</span> Tránh viết cả quá trình thành một đoạn văn dài. Hãy chia nhỏ từng bước tuần tự để người nấu dễ làm theo từng phút.
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-2">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                    Cấu trúc một bước chuẩn mực:
                  </h4>
                  <div className="space-y-2 text-xs text-stone-600">
                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <div className="flex items-center justify-between font-bold text-stone-800">
                        <span>Ví dụ: Bước 2 - Áp chảo thịt bò</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">Hẹn giờ: 4 phút</span>
                      </div>
                      <p className="text-stone-600 text-[11px]">
                        Làm nóng chảo với 1 muỗng dầu ăn trên lửa lớn. Cho thịt bò vào đảo nhanh tay trong 4 phút cho chín tái rồi trút ra đĩa riêng.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 space-y-1.5">
                  <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Lợi ích của việc nhập thời gian hẹn giờ (Timer Minutes):</span>
                  </h5>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Khi bạn nhập số phút cho các bước cần canh nhiệt (luộc, nướng, hầm, ủ), độc giả đọc bài có thể bấm trực tiếp vào nút <strong>"Bắt đầu hẹn giờ"</strong> ngay trên màn hình nấu ăn mà không cần thoát ra mở đồng hồ báo thức.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VÒNG ĐỜI XUẤT BẢN */}
          {activeTab === 'publishing' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs text-purple-950 leading-relaxed">
                  <span className="font-bold">Kiểm soát vòng đời bài viết:</span> Bạn hoàn toàn chủ động trong việc lưu nháp, xuất bản công khai hay tạm ẩn công thức để cập nhật mùa sau.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-bold text-[10px] uppercase">
                    Bản nháp (Draft)
                  </span>
                  <h5 className="font-bold text-stone-900 text-xs">Lưu trữ bảo mật</h5>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Dành cho các bài viết đang biên soạn dở dang. Chỉ bạn và Quản trị viên mới có thể xem hoặc sửa đổi.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-bold text-[10px] uppercase">
                    Xuất bản (Published)
                  </span>
                  <h5 className="font-bold text-stone-900 text-xs">Chia sẻ toàn cầu</h5>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Bài viết hiển thị công khai trên trang chủ, kho công thức. Độc giả có thể đánh giá 5 sao, để lại bình luận và lưu yêu thích.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 space-y-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-stone-300 text-stone-800 font-bold text-[10px] uppercase">
                    Lưu trữ (Archived)
                  </span>
                  <h5 className="font-bold text-stone-900 text-xs">Tạm ẩn an toàn</h5>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Ẩn bài viết khỏi độc giả nhưng bảo toàn 100% hình ảnh và công thức, có thể kích hoạt lại bất kỳ lúc nào.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Footer Modal */}
        <div className="flex shrink-0 items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Mẹo: Bạn có thể nhấn nút <strong>&quot;✨ Điền mẫu nhanh&quot;</strong> trong form để tham khảo mẫu chuẩn!</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            <span>Đã hiểu & Bắt đầu viết</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
