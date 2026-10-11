import './globals.css';
import Providers from './providers';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

export const metadata = {
  title: 'Culinary Blog - Khám Phá & Chia Sẻ Công Thức Ẩm Thực',
  description: 'Nền tảng chia sẻ và học hỏi công thức nấu ăn ngon mỗi ngày cho cộng đồng ẩm thực Việt.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-orange-500 selection:text-white">
        <Providers>
          <SiteHeader />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:px-6 md:py-8">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
