'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Điều hướng trang tạo công thức vào không gian làm việc Bảng điều khiển (Dashboard)
 */
export default function CreateRecipeRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard?tab=recipes-create');
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-[#f4f7fc] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
    </div>
  );
}
