'use client';

import { Utensils, BookOpen, Users, Sparkles } from 'lucide-react';

export default function HomeWhyChooseUs() {
  const features = [
    {
      icon: <Utensils className="w-5 h-5" />,
      title: 'Công thức đa dạng',
      desc: 'Hàng trăm món ăn phong phú từ truyền thống đến hiện đại.',
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Hướng dẫn chi tiết',
      desc: 'Từng bước nấu chuẩn vị, có định lượng và thời gian chính xác.',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Cộng đồng yêu bếp',
      desc: 'Cùng chia sẻ công thức, kinh nghiệm và niềm vui nấu nướng.',
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Cập nhật liên tục',
      desc: 'Món ngon mới và bí quyết ẩm thực được bổ sung mỗi ngày.',
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/95 to-stone-950 text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-stone-800 space-y-7">
      {/* Background texture với ảnh rau củ thảo mộc mờ nghệ thuật */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none mix-blend-overlay scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      {/* Gradient chuyển mềm */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-900/40 pointer-events-none" />

      {/* 1. Tiêu đề khu vực (Tầng trên - Căn giữa trang trọng) */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-600/30 text-orange-400 border border-orange-500/30 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VÌ SAO NÊN CHỌN CULINARY BLOG?</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          Đồng hành cùng đam mê <span className="text-orange-500">nấu nướng</span> mỗi ngày ✨
        </h3>

        <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
          Nơi khơi nguồn cảm hứng ẩm thực, chia sẻ công thức chuẩn vị và gắn kết những trái tim yêu gian bếp gia đình.
        </p>
      </div>

      {/* 2. Lưới 4 Thẻ Giá Trị Cốt Lõi (Tầng dưới - 4 cột thoáng đãng, không bị cắt chữ) */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {features.map((item) => (
          <div
            key={item.title}
            className="group relative rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-orange-500/40 p-4 sm:p-5 transition-all duration-300 flex items-start gap-3.5 shadow-sm hover:-translate-y-0.5"
          >
            {/* Hộp Icon màu cam hổ phách */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-xs group-hover:bg-orange-500 group-hover:text-white group-hover:scale-105 transition-all duration-300">
              {item.icon}
            </div>

            {/* Nội dung: Tiêu đề + Mô tả hiển thị trọn vẹn 100% không bị truncate */}
            <div className="space-y-1 min-w-0">
              <h4 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
