import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import SiteHeader from '@/components/site-header';
import Footer from '@/components/common/Footer';

// Cấu hình phông chữ Inter chuẩn với subset 'vietnamese' và 'latin' để hiển thị tiếng Việt sắc nét,
// khắc phục hoàn toàn lỗi vỡ phông và hiển thị dấu hỏi trên các trình duyệt
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata chuẩn SEO tiếng Việt cho ứng dụng Culinary Blog
export const metadata = {
  title: 'Culinary Blog - Khám Phá & Chia Sẻ Công Thức Ẩm Thực',
  description: 'Nền tảng chia sẻ công thức nấu ăn, văn hóa ẩm thực và quản lý danh mục món ăn chuẩn mực.',
  keywords: ['nấu ăn', 'công thức', 'ẩm thực', 'culinary blog', 'món ngon mỗi ngày'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50/30 text-gray-900 antialiased selection:bg-orange-500 selection:text-white`}>
        <Providers>
          <SiteHeader />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
