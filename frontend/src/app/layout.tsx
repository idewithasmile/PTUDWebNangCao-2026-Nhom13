import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Culinary Blog',
  description: 'Chia sẻ công thức nấu ăn',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <header className="p-4 border-b">
            <h1 className="text-xl font-bold">🍳 Culinary Blog</h1>
          </header>
          <main className="p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
