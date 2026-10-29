'use client';

import { Utensils, BookOpen, Users, Calendar } from 'lucide-react';

export default function HomeWhyChooseUs() {
  const features = [
    {
      icon: <Utensils className="w-5 h-5 text-gray-700" />,
      title: 'Công thức đa dạng',
      desc: 'Hàng ngàn món ăn hấp dẫn',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-gray-700" />,
      title: 'Hướng dẫn chi tiết',
      desc: 'Dễ dàng thực hiện tại nhà',
    },
    {
      icon: <Users className="w-5 h-5 text-gray-700" />,
      title: 'Cộng đồng yêu bếp',
      desc: 'Chia sẻ và học hỏi cùng nhau',
    },
    {
      icon: <Calendar className="w-5 h-5 text-gray-700" />,
      title: 'Cập nhật liên tục',
      desc: 'Món mới mỗi tuần',
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#3f3b35] text-white p-6 sm:p-8 lg:p-10 shadow-lg">
      {/* Background texture với ảnh rau củ thảo mộc mờ */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80')`,
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Tiêu đề bên trái */}
        <div className="text-center lg:text-left shrink-0">
          <p className="text-sm font-semibold text-amber-200">Vì sao nên chọn</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Culinary Blog?
          </h3>
        </div>

        {/* 4 Feature Pills bên phải */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
          {features.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-gray-800 shadow-sm">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-white tracking-tight truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-300 font-medium truncate">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
