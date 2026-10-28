'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/features/auth/hooks';
import { hasSession } from '@/features/auth/api';

export default function DashboardCategoriesRedirect() {
  const router = useRouter();
  const { data: user, isLoading } = useMe(hasSession());

  useEffect(() => {
    if (!isLoading) {
      if (user?.roles?.includes('Admin')) {
        router.replace('/dashboard?tab=categories');
      } else {
        router.replace('/dashboard?tab=overview');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen w-full bg-[#f4f7fc] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );
}
