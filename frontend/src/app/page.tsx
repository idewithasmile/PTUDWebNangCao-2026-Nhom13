import Link from 'next/link';
import {
  UtensilsCrossed,
  ArrowRight,
  ChefHat,
  Clock,
  Sparkles,
  BookOpen,
  Search,
  Flame,
  Award,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 py-4 md:py-8">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-amber-600 px-6 py-16 text-white shadow-xl sm:px-12 sm:py-20 lg:py-24">
        {/* Họa tiết nền mờ ảo */}
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-orange-700/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-200" />
            Nền tảng Ẩm thực & Bí quyết Nấu ăn
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl drop-shadow-sm">
            Khơi nguồn cảm hứng & lan tỏa tinh hoa ẩm thực
          </h1>

          <p className="text-base text-orange-50 sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Hàng trăm công thức chuẩn vị từ mâm cơm gia đình ấm cúng đến các món tiệc tinh tế.
            Cùng học hỏi, sáng tạo và chia sẻ niềm đam mê ẩm thực mỗi ngày.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/recipes"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-orange-600 shadow-md transition-all hover:bg-orange-50 hover:shadow-lg active:scale-95"
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span>Khám phá công thức</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>

            <Link
              href="/recipes/create"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-700/40 backdrop-blur-md border border-white/30 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-700/60 active:scale-95"
            >
              <ChefHat className="h-4 w-4" />
              <span>Chia sẻ món ngon</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Điểm nổi bật & Tính năng */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Trải nghiệm nấu ăn thông minh & trọn vẹn
          </h2>
          <p className="text-sm text-slate-500">
            Mọi công thức đều được tổ chức khoa học, dễ hiểu, giúp bạn tự tin vào bếp dù ở bất kỳ trình độ nào.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-orange-200">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Từng bước chi tiết</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Mỗi món ăn đi kèm nguyên liệu định lượng chuẩn, thời gian ước tính, độ khó và các bước thực hiện từng bước rõ ràng.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-amber-200">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Flame className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Bộ lọc thông minh</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Tìm kiếm công thức nấu ăn chỉ trong tích tắc theo danh mục, độ khó (Dễ, Trung bình, Khó) hoặc giới hạn thời gian nấu.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Cộng đồng tác giả</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Dễ dàng trở thành Tác giả, soạn thảo công thức với trình quản lý trực quan, xuất bản công khai hoặc lưu trữ riêng tư.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Lối tắt nhanh Danh mục & Khám phá */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Bạn muốn nấu món gì hôm nay?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Khám phá các gợi ý thực đơn đa dạng cho mọi bữa ăn gia đình.
            </p>
          </div>
          <Link
            href="/recipes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <span>Xem tất cả công thức</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <Link
            href="/recipes?sortBy=newest"
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-orange-50/60 border border-orange-100 text-center transition-all hover:bg-orange-100 hover:scale-[1.02]"
          >
            <Clock className="h-6 w-6 text-orange-600 mb-2 transition-transform group-hover:scale-110" />
            <span className="text-sm font-bold text-slate-800">Mới cập nhật</span>
            <span className="text-xs text-slate-500">Công thức mới nhất</span>
          </Link>

          <Link
            href="/recipes?difficulty=1"
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center transition-all hover:bg-emerald-100 hover:scale-[1.02]"
          >
            <Sparkles className="h-6 w-6 text-emerald-600 mb-2 transition-transform group-hover:scale-110" />
            <span className="text-sm font-bold text-slate-800">Món dễ làm</span>
            <span className="text-xs text-slate-500">Dành cho người mới</span>
          </Link>

          <Link
            href="/recipes?maxTotalTimeMinutes=30"
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-center transition-all hover:bg-blue-100 hover:scale-[1.02]"
          >
            <Flame className="h-6 w-6 text-blue-600 mb-2 transition-transform group-hover:scale-110" />
            <span className="text-sm font-bold text-slate-800">Dưới 30 phút</span>
            <span className="text-xs text-slate-500">Nấu nhanh gọn lẹ</span>
          </Link>

          <Link
            href="/categories"
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-center transition-all hover:bg-purple-100 hover:scale-[1.02]"
          >
            <Search className="h-6 w-6 text-purple-600 mb-2 transition-transform group-hover:scale-110" />
            <span className="text-sm font-bold text-slate-800">Theo danh mục</span>
            <span className="text-xs text-slate-500">Món Á, Âu, Bánh, v.v.</span>
          </Link>
        </div>
      </section>

      {/* 4. CTA Banner chia sẻ */}
      <section className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Bạn có công thức nấu ăn độc đáo?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Hãy tham gia đóng góp những công thức tâm huyết của bạn vào kho tàng ẩm thực Culinary Blog để chia sẻ cùng hàng nghìn người yêu bếp khác.
          </p>
        </div>
        <Link
          href="/recipes/create"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95"
        >
          <ChefHat className="h-4 w-4" />
          <span>Bắt đầu viết công thức</span>
        </Link>
      </section>
    </div>
  );
}
