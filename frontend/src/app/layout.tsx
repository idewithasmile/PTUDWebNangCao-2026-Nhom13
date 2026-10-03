import './globals.css';
import Providers from './providers';
import SiteHeader from '@/components/site-header';

export const metadata = {
  title: 'Culinary Blog',
  description: 'Chia sẻ công thức nấu ăn',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <SiteHeader />
          <main className="p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
