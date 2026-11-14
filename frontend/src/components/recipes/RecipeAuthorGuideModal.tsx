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
  Bookmark,
  Eye,
  Check,
  Info,
  Timer,
  FileText,
  HelpCircle,
  TrendingUp,
  Sliders,
  CheckSquare,
  Square,
  Award,
  Layers,
} from 'lucide-react';

export interface RecipeAuthorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: GuideTab;
}

export type GuideTab =
  | 'foundation'
  | 'visuals'
  | 'ingredients'
  | 'workflow'
  | 'publishing'
  // Hỗ trợ backward compatibility nếu có truyền tab cũ
  | 'video'
  | 'visual'
  | 'steps';

interface ChecklistItem {
  id: string;
  label: string;
  desc: string;
}

const QUALITY_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'c1',
    label: 'Tiêu đề rõ ràng, mô tả cuốn hút',
    desc: 'Có tên món + đặc trưng nổi bật (ví dụ: giòn rụm, chua ngọt, chuẩn vị Hà Nội).',
  },
  {
    id: 'c2',
    label: 'Tải ít nhất 2 ảnh sắc nét & chọn 1 ảnh chính (IsPrimary)',
    desc: 'Ảnh ngang tỉ lệ 16:9 hoặc 4:3, ảnh đại diện là đĩa thức ăn thành phẩm đẹp nhất.',
  },
  {
    id: 'c3',
    label: 'Nguyên liệu nhập đúng định lượng & đơn vị chuẩn',
    desc: 'Số lượng dạng số, đơn vị g, kg, ml, thìa canh... để hệ thống tự động nhân khẩu phần.',
  },
  {
    id: 'c4',
    label: 'Chia bước nấu theo nguyên tắc "1 bước - 1 thao tác"',
    desc: 'Mô tả súc tích, kèm dấu hiệu nhận biết món ăn đã chín hay đạt yêu cầu.',
  },
  {
    id: 'c5',
    label: 'Gắn số phút Smart Timer ở các bước cần canh lửa',
    desc: 'Điền số phút để độc giả chạm nút đếm ngược có chuông báo trực tiếp khi nấu.',
  },
  {
    id: 'c6',
    label: 'Chọn đúng danh mục món ăn & độ khó thực tế',
    desc: 'Giúp bài viết hiển thị chính xác trong bộ lọc tìm kiếm và bảng xếp hạng.',
  },
];

export default function RecipeAuthorGuideModal({
  isOpen,
  onClose,
  initialTab = 'foundation',
}: RecipeAuthorGuideModalProps) {
  // Chuẩn hóa tab ban đầu
  const normalizeTab = (tab?: GuideTab): 'foundation' | 'visuals' | 'ingredients' | 'workflow' | 'publishing' => {
    if (!tab || tab === 'video' || tab === 'foundation') return 'foundation';
    if (tab === 'visual' || tab === 'visuals') return 'visuals';
    if (tab === 'steps' || tab === 'workflow') return 'workflow';
    if (tab === 'ingredients') return 'ingredients';
    if (tab === 'publishing') return 'publishing';
    return 'foundation';
  };

  const [activeTab, setActiveTab] = useState<'foundation' | 'visuals' | 'ingredients' | 'workflow' | 'publishing'>(
    normalizeTab(initialTab)
  );

  // State cho Checklist tương tác
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleChecklist = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const completionPercentage = Math.round((totalChecked / QUALITY_CHECKLIST_ITEMS.length) * 100);

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

  // Reset tab khi mở modal
  useEffect(() => {
    if (isOpen) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-stone-200 animate-scale-up overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header Modal */}
        <div className="flex shrink-0 items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-stone-100 bg-gradient-to-r from-orange-50/90 via-amber-50/60 to-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight leading-snug">
                  Sổ tay quy chuẩn ẩm thực Culinary Blog
                </h3>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-700 uppercase tracking-wide border border-orange-200">
                  Chuẩn mực 2026
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 font-normal">
                Cẩm nang toàn diện 5 giai đoạn giúp công thức của bạn chuẩn vị, chuyên nghiệp và tiếp cận hàng nghìn độc giả
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

        {/* 2. Dải Navigation Tabs (5 Trụ Cột Logic) */}
        <div className="flex items-center gap-1.5 px-5 sm:px-7 pt-3 pb-2 border-b border-stone-100 bg-stone-50/70 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('foundation')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'foundation'
                ? 'bg-orange-500 text-white shadow-xs font-bold'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Khởi tạo &amp; SEO</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visuals')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'visuals'
                ? 'bg-orange-500 text-white shadow-xs font-bold'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>2. Hình ảnh &amp; MinIO</span>
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
            <span>3. Định lượng &amp; Dinh dưỡng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workflow')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'workflow'
                ? 'bg-orange-500 text-white shadow-xs font-bold'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>4. Quy trình &amp; Smart Timer</span>
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
            <span>5. Xuất bản &amp; Độc giả</span>
          </button>
        </div>

        {/* 3. Nội dung Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-7 space-y-6 text-stone-700 text-xs sm:text-sm">
          {/* TAB 1: KHỞI TẠO & SEO */}
          {activeTab === 'foundation' && (
            <div className="space-y-5 animate-fade-in">
              {/* Banner Giới thiệu */}
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-950 leading-relaxed">
                  <span className="font-bold">Nền tảng của một công thức xuất sắc:</span> Tiêu đề và phần mở đầu quyết định tới 80% việc độc giả có bấm vào xem công thức của bạn hay không giữa hàng trăm công thức khác trên trang chủ!
                </div>
              </div>

              {/* Khối 1: Công thức đặt tiêu đề chuẩn SEO */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2 text-orange-700">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span>Công thức đặt Tiêu đề chuẩn SEO ẩm thực</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-mono text-[10px] font-bold">
                    Tối thiểu 6 ký tự
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1.5 shadow-xs">
                  <span className="font-bold text-stone-900 block">Cấu trúc khuyên dùng:</span>
                  <p className="font-mono text-orange-700 bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-100">
                    [Tên món ăn] + [Phương pháp / Hương vị đặc trưng] + [Bối cảnh / Nguồn gốc]
                  </p>
                </div>

                {/* Bảng so sánh tiêu đề */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                      ❌ Sơ sài (Tránh dùng)
                    </span>
                    <p className="font-medium text-rose-950">&quot;Sườn&quot;, &quot;Món bò ngon&quot;, &quot;Canh chua&quot;</p>
                    <span className="text-[11px] text-rose-700 block mt-1">Không tạo sự tò mò, khó tìm kiếm.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                      ⚠️ Tạm chấp nhận
                    </span>
                    <p className="font-medium text-amber-950">&quot;Cách làm sườn xào chua ngọt&quot;</p>
                    <span className="text-[11px] text-amber-700 block mt-1">Đủ nghĩa nhưng chưa có điểm nhấn riêng.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                      ⭐ Chuẩn SEO xuất sắc
                    </span>
                    <p className="font-medium text-emerald-950">
                      &quot;Sườn Xào Chua Ngọt Sốt Me Giòn Rụm Chuẩn Vị Mẹ Nấu&quot;
                    </p>
                    <span className="text-[11px] text-emerald-700 block mt-1">Hấp dẫn vị giác, chuẩn bộ lọc tìm kiếm.</span>
                  </div>
                </div>
              </div>

              {/* Khối 2: Nghệ thuật viết tóm tắt & Phân loại thông số */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-stone-800">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>Mô tả tóm tắt (Storytelling 2-3 câu)</span>
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Khơi gợi vị giác bằng cách miêu tả màu sắc, hương thơm, độ giòn hay sự béo ngậy. Hãy chia sẻ lý do món ăn này đặc biệt (ví dụ: món đổi vị cuối tuần, bí quyết ướp vị gia truyền, hay công thức nhanh 15 phút cho người bận rộn).
                  </p>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 italic text-[11px] text-stone-500">
                    &quot;Từng miếng sườn óng ánh sốt me chua ngọt đậm đà, bên ngoài giòn nhẹ bên trong mềm mọng, cực kỳ hao cơm cho bữa tối sum vầy.&quot;
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-stone-800">
                    <Sliders className="w-4 h-4 text-orange-500" />
                    <span>Thiết lập thông số chuẩn xác</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-orange-600">•</span>
                      <span><strong>Thời gian chuẩn bị &amp; Nấu:</strong> Phân tách rõ số phút sơ chế (Prep) và số phút nấu (Cook) để người đọc chủ động giờ giấc.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-orange-600">•</span>
                      <span><strong>Độ khó thực tế:</strong> Chọn đúng mức <em>Dễ</em> (dưới 30p, gia vị cơ bản), <em>Trung bình</em> (cần canh lửa), hoặc <em>Khó</em> (nhiều kỹ thuật).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-orange-600">•</span>
                      <span><strong>Gắn Danh mục &amp; Tags:</strong> Chọn đúng danh mục mẹ (Món kho, Món canh, Bò, Heo, Chay...) giúp bộ lọc tìm kiếm tiếng Việt hoạt động chính xác.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUY CHUẨN HÌNH ẢNH & MINIO */}
          {activeTab === 'visuals' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-start gap-3">
                <Camera className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-950 leading-relaxed">
                  <span className="font-bold">Hình ảnh đại diện là ấn tượng đầu tiên:</span> Độc giả quyết định bấm vào công thức trong 3 giây đầu tiên nhờ màu sắc tươi ngon, độ sắc nét và góc chụp kích thích vị giác của bức ảnh thành phẩm!
                </div>
              </div>

              {/* Khối quy chuẩn kỹ thuật ảnh */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                    Tỷ lệ vàng khung hình
                  </span>
                  <h5 className="font-bold text-stone-900 text-sm">16:9 hoặc 4:3 (Ảnh ngang)</h5>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    Độ phân giải tối thiểu khuyến nghị: 1200 × 800 px. Tránh ảnh dọc chụp bằng điện thoại gây cắt xén trên giao diện máy tính.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                    Ảnh chính (IsPrimary)
                  </span>
                  <h5 className="font-bold text-stone-900 text-sm">Bắt buộc chọn 1 ảnh</h5>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    Bấm &quot;Đặt làm ảnh chính&quot; cho ảnh đĩa ăn thành phẩm trọn vẹn nhất. Ảnh này sẽ làm thumbnail ngoài trang chủ và mạng xã hội.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                    Hệ thống MinIO S3
                  </span>
                  <h5 className="font-bold text-stone-900 text-sm">Đám mây tốc độ cao</h5>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    Tải lên trực tiếp an toàn, hỗ trợ định dạng hiện đại JPG, PNG, WebP (tối đa 10MB/ảnh) giúp tải nhanh không vỡ hạt.
                  </p>
                </div>
              </div>

              {/* Bảng so sánh Nên làm vs Tránh làm khi chụp ảnh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Nên làm (Khuyến nghị chuẩn Studio)</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Ánh sáng tự nhiên:</strong> Luôn chụp cạnh cửa sổ đón ánh sáng xiên dịu buổi sáng hoặc xế chiều.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Góc chụp 45° kinh điển:</strong> Tuyệt vời cho các món có chiều cao như phở, bún, lẩu, đồ xếp tầng.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Góc Flat-lay 90° (Từ trên xuống):</strong> Phù hợp cho mâm cơm nhiều đĩa, khay bánh hoặc bàn tiệc.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Điểm xuyết đạo cụ bếp:</strong> Thêm vài nhánh ngò rí, lát ớt tươi, chiếc khăn trải bàn mộc hoặc đôi đũa gỗ.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                  <h4 className="font-bold text-rose-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Tránh làm (Lỗi thường gặp)</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>Bật Flash điện thoại trực diện:</strong> Làm gắt bóng, cháy sáng và đĩa thức ăn trông bóng nhờn, giả tạo.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>Ánh đèn huỳnh quang vàng tối:</strong> Khiến màu sắc rau củ và thịt bị xỉn màu, trông mất vệ sinh.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>Bối cảnh bừa bộn:</strong> Để lọt rác thực phẩm, dao kéo lộn xộn hoặc vỏ bao bì gia vị vào khung hình.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>Vành đĩa dính bẩn:</strong> Quên lau sạch vết sốt lem nhem quanh thành đĩa trước khi chụp ảnh.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ĐỊNH LƯỢNG & DINH DƯỠNG */}
          {activeTab === 'ingredients' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-start gap-3">
                <Scale className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-950 leading-relaxed">
                  <span className="font-bold">Định lượng chuẩn là chìa khóa của công nghệ:</span> Khi bạn điền số lượng dạng số chuẩn và đơn vị phổ biến, hệ thống sẽ tự động kích hoạt tính năng <strong>Tự động nhân khẩu phần ăn</strong> và <strong>Bảng tính dinh dưỡng Calo / Macros</strong> cho độc giả!
                </div>
              </div>

              {/* Bảng quy chuẩn 4 nhóm đơn vị đo */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-orange-500" />
                  <span>Quy chuẩn 4 nhóm đơn vị đo lường được hệ thống hỗ trợ</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Khối lượng</span>
                    <span className="font-bold text-stone-900 font-mono text-sm">g, kg</span>
                    <p className="text-[11px] text-stone-500">Ví dụ: 500g thịt thăn bò, 1kg xương ống bò. Tránh viết tắt tùy tiện như &quot;lạng&quot;.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Thể tích</span>
                    <span className="font-bold text-stone-900 font-mono text-sm">ml, lít</span>
                    <p className="text-[11px] text-stone-500">Ví dụ: 300ml nước dừa tươi, 1.5 lít nước lọc. Chuẩn hóa thể tích chất lỏng.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Thìa đo lường</span>
                    <span className="font-bold text-stone-900 font-mono text-sm">thìa canh, thìa cà phê</span>
                    <p className="text-[11px] text-stone-500">Thìa canh (tbsp ~ 15ml), thìa cà phê (tsp ~ 5ml). Ví dụ: 2 thìa canh nước mắm.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Đơn vị tự nhiên</span>
                    <span className="font-bold text-stone-900 font-mono text-sm">quả, củ, nhánh, tép</span>
                    <p className="text-[11px] text-stone-500">Ví dụ: 3 quả trứng gà, 4 tép tỏi, 2 củ hành tím, 1 nhánh sả.</p>
                  </div>
                </div>
              </div>

              {/* Giải thích tính năng Nhân khẩu phần & Dinh dưỡng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                  <h5 className="font-bold text-amber-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Cơ chế Nhân khẩu phần tự động (Servings Auto-Scaler)</span>
                  </h5>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Độc giả vào bài viết có thể bấm nút <strong className="text-orange-700">[+]</strong> hoặc <strong className="text-orange-700">[-]</strong> để tăng giảm khẩu phần ăn (từ 2 người lên 4, 6 hay 8 người). Hệ thống sẽ tự động nhân tỷ lệ từng dòng nguyên liệu tương ứng.
                  </p>
                  <p className="text-[11px] text-amber-800 font-medium">
                    ⚠️ <strong>Lưu ý:</strong> Không viết số lượng gộp vào ô tên (ví dụ: viết &quot;Thịt bò 500g&quot; vào 1 ô). Hãy tách rõ: Tên = &quot;Thịt thăn bò&quot;, Số lượng = &quot;500&quot;, Đơn vị = &quot;g&quot;.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-stone-800">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span>Ước lượng Dinh dưỡng tự động (Calories &amp; Macros)</span>
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Dựa vào danh sách nguyên liệu và định lượng của bạn, hệ thống ước tính 4 chỉ số vàng: <strong>Calo (kcal)</strong>, <strong>Đạm (Protein)</strong>, <strong>Tinh bột (Carb)</strong> và <strong>Chất béo (Fat)</strong>.
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Tính năng này thu hút đặc biệt cộng đồng độc giả tập gym, người theo chế độ Eat-Clean, Keto hoặc người ăn kiêng kiểm soát đường huyết.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QUY TRÌNH & SMART TIMER */}
          {activeTab === 'workflow' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-950 leading-relaxed">
                  <span className="font-bold">Một bước - Một hành động:</span> Viết các bước mạch lạc, súc tích và gắn tính năng <strong>Bộ hẹn giờ thông minh (Smart Timer)</strong> giúp người nấu yên tâm canh lửa mà không lo món ăn bị khét hay quá chín!
                </div>
              </div>

              {/* Hướng dẫn nguyên tắc chia bước */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-500" />
                  <span>Cấu trúc 4 bước tiêu chuẩn của một món ăn ngon</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1 shadow-xs">
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-bold text-[10px]">Bước 1</span>
                    <h5 className="font-bold text-stone-900">Sơ chế nguyên liệu</h5>
                    <p className="text-[11px] text-stone-500">Rửa sạch, thái mỏng, chần nước sôi khử mùi tanh của thịt cá, ngâm nước đá cho rau giòn.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1 shadow-xs">
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-bold text-[10px]">Bước 2</span>
                    <h5 className="font-bold text-stone-900">Tẩm ướp gia vị</h5>
                    <p className="text-[11px] text-stone-500">Trộn các loại gia vị, để ngấm trong 15-30 phút để nguyên liệu thấm sâu vào từng thớ thịt.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1 shadow-xs">
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-bold text-[10px]">Bước 3</span>
                    <h5 className="font-bold text-stone-900">Chế biến nhiệt chính</h5>
                    <p className="text-[11px] text-stone-500">Xào lửa lớn, kho nhỏ lửa, ninh xương hoặc nướng lò. Đây là bước cần gắn Smart Timer.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1 shadow-xs">
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-bold text-[10px]">Bước 4</span>
                    <h5 className="font-bold text-stone-900">Hoàn thiện &amp; Dọn đĩa</h5>
                    <p className="text-[11px] text-stone-500">Trình bày ra đĩa, rắc hành ngò tiêu xay, dọn kèm nước chấm và thưởng thức khi còn nóng hổi.</p>
                  </div>
                </div>
              </div>

              {/* Hướng dẫn Smart Timer */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                      <Timer className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">Tính năng độc quyền: Bộ đếm giờ thông minh (Smart Timer)</h5>
                      <span className="text-[11px] text-stone-400">Tương tác trực tiếp trên màn hình của độc giả</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-extrabold uppercase">
                    Tiện ích nấu ăn
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-300 pt-1">
                  <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1">
                    <strong className="text-orange-400 block">Cách gắn Timer khi soạn thảo:</strong>
                    <p className="text-[11px] text-stone-400">
                      Tại bất kỳ bước nào cần canh thời gian, bạn chỉ cần nhập số phút vào ô <em>&quot;Thời gian hẹn giờ (phút)&quot;</em> (ví dụ: luộc trứng 6 phút, ninh xương 45 phút, hấp cá 15 phút).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 space-y-1">
                    <strong className="text-emerald-400 block">Trải nghiệm của người xem khi nấu:</strong>
                    <p className="text-[11px] text-stone-400">
                      Người xem bấm nút &quot;Bắt đầu hẹn giờ&quot; ngay trên điện thoại hoặc máy tính. Đồng hồ sẽ đếm ngược tích tắc và phát chuông báo khi hết giờ mà không cần thoát ứng dụng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: XUẤT BẢN & ĐỘC GIẢ */}
          {activeTab === 'publishing' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-950 leading-relaxed">
                  <span className="font-bold">Từ bản nháp đến công thức triệu lượt xem:</span> Hiểu rõ 3 trạng thái của bài viết, cách giữ chân độc giả bằng nút Bookmark và thuật toán lọt top bảng xếp hạng &quot;Hot nhất tuần&quot;!
                </div>
              </div>

              {/* 3 trạng thái của công thức */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-extrabold uppercase">
                    Bản nháp (Draft)
                  </span>
                  <h5 className="font-bold text-stone-900 text-sm">Lưu trữ riêng tư</h5>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Chỉ bạn mới có quyền xem và chỉnh sửa trong Dashboard. Phù hợp khi bạn chưa hoàn tất các bước hoặc chưa có đủ ảnh đẹp.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                    Đã xuất bản (Published)
                  </span>
                  <h5 className="font-bold text-emerald-950 text-sm">Công khai toàn hệ thống</h5>
                  <p className="text-xs text-emerald-900/80 leading-relaxed">
                    Hiển thị ngay trên Trang chủ, trang Danh mục và xuất hiện trong bộ tìm kiếm. Bắt đầu tích lũy lượt xem và bookmark thực.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                    Lưu trữ (Archived)
                  </span>
                  <h5 className="font-bold text-amber-950 text-sm">Tạm ẩn bài viết</h5>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    Tạm thời ẩn bài viết khỏi trang chủ khi món ăn mang tính thời vụ hoặc bạn muốn nâng cấp lại nội dung mà không bị mất dữ liệu.
                  </p>
                </div>
              </div>

              {/* Sổ tay cá nhân & BXH Hot nhất tuần */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-stone-800">
                    <Bookmark className="w-4 h-4 text-rose-500" />
                    <span>Hệ thống Bookmarks (Lưu vào sổ tay cá nhân)</span>
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Độc giả có thể bấm biểu tượng trái tim / bookmark để lưu công thức của bạn vào <em>Sổ tay ẩm thực cá nhân</em>. Khi người dùng muốn nấu lại, họ sẽ mở ngay trong Dashboard của họ.
                  </p>
                  <p className="text-[11px] text-stone-500 italic">
                    💡 Bí quyết: Công thức có bảng nguyên liệu chính xác và bước nấu ngắn gọn thường đạt tỷ lệ lưu bài viết cao gấp 3 lần!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-stone-800">
                    <TrendingUp className="w-4 h-4 text-cyan-500" />
                    <span>Thuật toán BXH &quot;Hot nhất tuần&quot;</span>
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Mỗi lượt xem thực tế được ghi nhận an toàn qua bộ đệm Redis (chống spam F5). Bảng xếp hạng xu hướng hàng tuần được tổng hợp tự động dựa trên tổng lượt xem và số lượt bookmark trong 7 ngày gần nhất.
                  </p>
                  <p className="text-[11px] text-stone-500 italic">
                    🔥 Khi lọt top Hot nhất tuần, bài viết sẽ được gắn huy hiệu &quot;Xu hướng&quot; và ghim tại vị trí banner đắt giá ngoài trang chủ.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. PHẦN TƯƠNG TÁC CHUNG: BẢNG KIỂM TRA CHẤT LƯỢNG TRƯỚC KHI XUẤT BẢN */}
          <div className="mt-6 pt-5 border-t border-stone-200/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-orange-500" />
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                  Bảng tự kiểm tra chất lượng (Pre-Publish Quality Checklist)
                </h4>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500">Độ hoàn thiện:</span>
                <span className="font-bold font-mono text-orange-600">{completionPercentage}%</span>
                <span className="text-[11px] text-stone-400">({totalChecked}/{QUALITY_CHECKLIST_ITEMS.length} tiêu chí)</span>
              </div>
            </div>

            {/* Thanh tiến độ phần trăm */}
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden ring-1 ring-stone-200">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  completionPercentage === 100
                    ? 'bg-emerald-500'
                    : completionPercentage >= 50
                    ? 'bg-orange-500'
                    : 'bg-amber-400'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            {/* 6 Tiêu chí dạng lưới tương tác */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {QUALITY_CHECKLIST_ITEMS.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleChecklist(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300/30'
                        : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-xs font-bold block ${
                          isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-stone-800'
                        }`}
                      >
                        {item.label}
                      </span>
                      <p className="text-[11px] text-stone-500 leading-snug mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Thông điệp khích lệ */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  {completionPercentage === 100 ? (
                    <strong className="text-emerald-700">Xuất sắc! Công thức của bạn đã đạt tiêu chuẩn 10/10 để xuất bản.</strong>
                  ) : completionPercentage >= 50 ? (
                    <span>Khá tốt! Hãy hoàn thiện nốt các tiêu chí còn lại để bài viết đạt tương tác cao nhất.</span>
                  ) : (
                    <span>Hãy tick chọn các tiêu chí bạn đã làm để kiểm tra độ hoàn thiện của bài viết.</span>
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition active:scale-95 shrink-0"
              >
                <span>Bắt đầu viết công thức ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
