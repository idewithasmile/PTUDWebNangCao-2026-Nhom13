'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Điều hướng trang hồ sơ người dùng vào mục Cài đặt trong Bảng điều khiển (Dashboard)
 */
export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard?tab=profile');
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-[#f4f7fc] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );
}
