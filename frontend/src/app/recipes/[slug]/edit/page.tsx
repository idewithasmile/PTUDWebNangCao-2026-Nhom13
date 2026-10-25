'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EditRecipePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Điều hướng trang chỉnh sửa công thức vào không gian làm việc Bảng điều khiển (Dashboard)
 */
export default function EditRecipeRedirectPage({ params }: EditRecipePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  useEffect(() => {
    router.replace(`/dashboard?tab=recipes-edit&slug=${encodeURIComponent(slug)}`);
  }, [slug, router]);

  return (
    <div className="min-h-screen w-full bg-[#f4f7fc] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );
}
