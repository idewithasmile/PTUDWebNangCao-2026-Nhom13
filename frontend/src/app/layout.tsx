import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import SiteHeader from '@/components/site-header';

// Cấu hình phông chữ Inter chuẩn với subset 'vietnamese' và 'latin' để hiển thị tiếng Việt sắc nét,
// khắc phục hoàn toàn lỗi vỡ phông và hiển thị dấu hỏi (Qu?n Tr? Vi?n) trên các trình duyệt
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

// Metadata chuẩn SEO tiếng Việt cho ứng dụng Culinary Blog
export const metadata = {
  title: 'Culinary Blog - Khám Phá & Chia Sẻ Công Thức Ẩm Thực',
  description: 'Nền tảng chia sẻ công thức nấu ăn, văn hóa ẩm thực và quản lý danh mục món ăn chuẩn mực.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      {/* Áp dụng class phông chữ Inter vào thẻ body cùng các tiện ích hiển thị mượt mà */}
      <body className={`${inter.className} min-h-screen bg-gray-50/30 text-gray-900 antialiased`}>
        <Providers>
          <SiteHeader />
          <main className="p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
