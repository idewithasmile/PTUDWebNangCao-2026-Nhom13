import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Dashboard quản lý công thức của tôi.</p>
      <div className="mt-4 flex gap-2">
        <Link
          href="/profile"
          className="rounded border px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
        >
          Hồ sơ cá nhân
        </Link>
        <Link
          href="/recipes"
          className="rounded border px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
        >
          Công thức
        </Link>
      </div>
    </main>
  );
}
