import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import AppShell from '@/components/layout/AppShell';

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
  description: 'Nền tảng chia sẻ và học hỏi công thức nấu ăn ngon, văn hóa ẩm thực và quản lý danh mục món ăn chuẩn mực.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      {/* Áp dụng class phông chữ Inter vào thẻ body cùng flex column để sticky footer */}
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-orange-500 selection:text-white`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
