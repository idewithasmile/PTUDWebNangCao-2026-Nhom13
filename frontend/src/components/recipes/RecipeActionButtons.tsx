'use client';

import Link from 'next/link';
import type { RecipeDetailDto } from '@/lib/types/recipe';
import { useMe } from '@/features/auth/hooks';
import { Edit, ChefHat } from 'lucide-react';
import { hasSession } from '@/features/auth/api';

interface RecipeActionButtonsProps {
  recipe: RecipeDetailDto;
}

/**
 * Thanh thông báo tác giả trên trang xem công thức công khai.
 * Cung cấp lối tắt điều hướng trực tiếp vào Recipe Studio trong Dashboard.
 */
export default function RecipeActionButtons({ recipe }: RecipeActionButtonsProps) {
  const isLoggedIn = hasSession();
  const me = useMe(isLoggedIn);
  const user = me.data;

  // Chỉ hiển thị cho Tác giả tạo công thức hoặc Admin
  const isOwner = Boolean(
    user && (user.id === recipe.authorId || user.roles?.includes('Admin'))
  );

  if (!isOwner) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm border border-slate-700/60 animate-fade-in my-2">
      <div className="flex items-center gap-2.5 text-xs">
        <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
          <ChefHat className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span>Bạn là tác giả bài viết này</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                recipe.status === 'Published'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : recipe.status === 'Draft'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-gray-700 text-gray-300 border border-gray-600'
              }`}
            >
              {recipe.status === 'Published'
                ? 'Đã xuất bản'
                : recipe.status === 'Draft'
                ? 'Bản nháp'
                : 'Đã lưu trữ'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Quản lý chi tiết, cập nhật nguyên liệu hoặc đổi trạng thái công thức
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/dashboard?tab=recipes-edit&slug=${encodeURIComponent(recipe.slug)}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Quản lý & Chỉnh sửa trong Dashboard →</span>
        </Link>
      </div>
    </div>
  );
}
