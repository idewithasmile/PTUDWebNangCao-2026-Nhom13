'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChefHat, Heart, Mail, Send, CheckCircle2 } from 'lucide-react';
import { newsletterService } from '@/lib/services/newsletter-service';
import { useToastStore } from '@/features/toast/useToastStore';
import { toErrorMessage } from '@/features/auth/hooks';

export default function SiteFooter() {
  const { addToast } = useToastStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [footerMsg, setFooterMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleQuickSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFooterMsg(null);
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFooterMsg({ type: 'err', text: 'Email không hợp lệ.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await newsletterService.subscribe({
        email: trimmed,
        source: 'Footer',
      });
      setEmail('');
      setFooterMsg({ type: 'ok', text: 'Đăng ký nhận bản tin thành công!' });
      addToast({
        type: 'success',
        title: 'Đã đăng ký bản tin 🍲',
        message: res.message,
      });
    } catch (err) {
      setFooterMsg({
        type: 'err',
        text: toErrorMessage(err, 'Không thể đăng ký lúc này.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="print:hidden mt-20 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-10">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4 md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-gray-900 dark:text-zinc-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-lg text-white shadow-sm shadow-orange-200 dark:shadow-none">
                🍳
              </span>
              <span>Culinary<span className="text-orange-600">Blog</span></span>
            </Link>
            <p className="max-w-md text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
              Nền tảng chia sẻ và lưu giữ công thức nấu ăn trực tuyến dành cho những người yêu ẩm thực.
              Khám phá bí quyết chế biến món ăn ngon mỗi ngày, cùng tính toán dinh dưỡng chi tiết và hướng dẫn từng bước chuẩn xác.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500">
              <ChefHat className="h-4 w-4 text-orange-500" />
              <span>Phát triển bởi Nhóm 13 • PTUDWebNangCao 2026</span>
            </div>
          </div>

          {/* Cột 2: Khám phá ẩm thực */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-zinc-200">
              Khám phá
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
              <li>
                <Link href="/" className="transition hover:text-orange-600 dark:hover:text-orange-400">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="transition hover:text-orange-600 dark:hover:text-orange-400">
                  Công thức nấu ăn
                </Link>
              </li>
              <li>
                <Link href="/categories" className="transition hover:text-orange-600 dark:hover:text-orange-400">
                  Danh mục món ăn
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Tác giả & Đầu bếp */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-zinc-200">
              Dành cho Tác giả
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
              <li>
                <Link href="/recipes/create" className="font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
                  + Viết công thức mới
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=settings" className="transition hover:text-orange-600 dark:hover:text-orange-400">
                  Hồ sơ cá nhân
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-orange-600 dark:hover:text-orange-400">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-orange-600 dark:hover:text-orange-400">
                  Tạo tài khoản mới
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhanh bản tin qua Email */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-zinc-200">
              Nhận công thức mới
            </h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Để lại email để nhận thực đơn &amp; công thức ngon mỗi tuần.
            </p>
            <form onSubmit={handleQuickSubscribe} className="space-y-2" noValidate>
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email của bạn..."
                    aria-label="Email đăng ký bản tin"
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 py-2 pl-8 pr-2.5 text-xs text-gray-900 dark:text-zinc-100 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label="Đăng ký bản tin"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              {footerMsg && (
                <p
                  className={`flex items-center gap-1 text-[11px] font-medium ${
                    footerMsg.type === 'ok' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {footerMsg.type === 'ok' && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                  <span>{footerMsg.text}</span>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-gray-100 dark:border-zinc-800 pt-6 flex flex-col items-center justify-between gap-4 text-xs text-gray-400 dark:text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Culinary Blog. Tất cả các quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            Xây dựng với <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" /> bởi Nhóm 13 (Next.js 15 &amp; .NET 10)
          </p>
        </div>
      </div>
    </footer>
  );
}
