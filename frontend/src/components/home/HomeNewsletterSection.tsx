'use client';

import { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, User, AlertCircle, Send } from 'lucide-react';
import type { CategoryDto } from '@/lib/types/category';
import { newsletterService } from '@/lib/services/newsletter-service';
import { useToastStore } from '@/features/toast/useToastStore';
import { toErrorMessage } from '@/features/auth/hooks';

interface HomeNewsletterSectionProps {
  categories?: CategoryDto[];
}

const DEFAULT_PREFERENCES = [
  { slug: 'mon-viet', label: 'Món Việt truyền thống' },
  { slug: 'mon-a-au', label: 'Món Á - Âu' },
  { slug: 'an-chay-healthy', label: 'Ăn chay / Healthy' },
  { slug: 'banh-trang-mieng', label: 'Bánh & Tráng miệng' },
];

export default function HomeNewsletterSection({ categories = [] }: HomeNewsletterSectionProps) {
  const { addToast } = useToastStore();
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const preferenceOptions =
    categories.length >= 4
      ? categories.slice(0, 4).map((c) => ({ slug: c.slug, label: c.name }))
      : DEFAULT_PREFERENCES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await newsletterService.subscribe({
        email: trimmedEmail,
        customerName: customerName.trim() || undefined,
        favoriteCategorySlug: selectedSlug || undefined,
        source: 'HomeBanner',
      });
      setSuccessMessage(res.message);
      setEmail('');
      setCustomerName('');
      addToast({
        type: 'success',
        title: 'Đăng ký bản tin thành công! 🍲',
        message: res.message,
        duration: 4000,
      });
    } catch (err) {
      setErrorMessage(toErrorMessage(err, 'Không thể đăng ký bản tin lúc này. Vui lòng thử lại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden rounded-3xl border border-orange-200/80 dark:border-zinc-800 bg-gradient-to-br from-orange-50 via-amber-50/70 to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 p-6 sm:p-10 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Cột giới thiệu */}
        <div className="space-y-4 lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-500/20 px-3.5 py-1 text-xs font-bold text-orange-700 dark:text-orange-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Bản tin Ẩm thực Hàng tuần</span>
          </div>
          <h2
            id="newsletter-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-zinc-100"
          >
            Nhận cẩm nang công thức ngon mỗi tuần
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
            Để lại email để nhận thực đơn gợi ý cuối tuần, mẹo chọn nguyên liệu tươi ngon và công thức độc quyền từ các đầu bếp Culinary Blog. Hoàn toàn miễn phí!
          </p>

          {/* Chọn nhanh gu ẩm thực yêu thích */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Gu ẩm thực bạn quan tâm (tùy chọn):
            </p>
            <div className="flex flex-wrap gap-2">
              {preferenceOptions.map((opt) => {
                const isSelected = selectedSlug === opt.slug;
                return (
                  <button
                    key={opt.slug}
                    type="button"
                    onClick={() => setSelectedSlug(isSelected ? '' : opt.slug)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-orange-200/70 dark:border-zinc-700 hover:border-orange-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cột Form đăng ký */}
        <div className="lg:col-span-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-orange-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 sm:p-6 shadow-md shadow-orange-100/50 dark:shadow-none space-y-4"
            noValidate
          >
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="newsletter-name" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300">
                  Tên của bạn (tùy chọn)
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="newsletter-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ví dụ: Minh Anh"
                    maxLength={100}
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/70 dark:bg-zinc-800 py-2.5 pl-9 pr-3 text-sm text-gray-900 dark:text-zinc-100 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="newsletter-email" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300">
                  Địa chỉ Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/70 dark:bg-zinc-800 py-2.5 pl-9 pr-3 text-sm text-gray-900 dark:text-zinc-100 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-3 text-xs font-medium text-red-700 dark:text-red-300"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 p-3 text-xs font-medium text-emerald-700 dark:text-emerald-300"
              >
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 py-3 px-5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:from-orange-700 hover:to-amber-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Đang đăng ký…' : 'Đăng ký nhận bản tin ẩm thực'}</span>
            </button>

            <p className="text-[11px] text-center text-gray-400 dark:text-zinc-500">
              Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký bất kỳ lúc nào chỉ với 1 cú nhấp chuột.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
