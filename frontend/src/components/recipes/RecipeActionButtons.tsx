'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { RecipeDetailDto } from '@/lib/types/recipe';
import { useMe, toErrorMessage } from '@/features/auth/hooks';
import {
  usePublishRecipe,
  useUnpublishRecipe,
  useArchiveRecipe,
  useDeleteRecipe,
} from '@/features/recipes/hooks';
import { Edit, Globe, EyeOff, Archive, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { hasSession } from '@/features/auth/api';

interface RecipeActionButtonsProps {
  recipe: RecipeDetailDto;
}

export default function RecipeActionButtons({ recipe }: RecipeActionButtonsProps) {
  const router = useRouter();
  const isLoggedIn = hasSession();
  const me = useMe(isLoggedIn);
  const user = me.data;

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const publishMutation = usePublishRecipe();
  const unpublishMutation = useUnpublishRecipe();
  const archiveMutation = useArchiveRecipe();
  const deleteMutation = useDeleteRecipe();

  // Chỉ hiển thị cho Tác giả tạo công thức hoặc Admin
  const isOwner = Boolean(
    user && (user.id === recipe.authorId || user.roles?.includes('Admin'))
  );

  if (!isOwner) return null;

  const handlePublish = () => {
    setActionError(null);
    publishMutation.mutate(recipe.id, {
      onError: (err) => {
        setActionError(
          toErrorMessage(
            err,
            'Không thể xuất bản công thức. Vui lòng kiểm tra đã có ít nhất 1 bước thực hiện chưa.'
          )
        );
      },
    });
  };

  const handleUnpublish = () => {
    setActionError(null);
    unpublishMutation.mutate(recipe.id, {
      onError: (err) => {
        setActionError(toErrorMessage(err, 'Không thể hủy xuất bản công thức.'));
      },
    });
  };

  const handleArchive = () => {
    setActionError(null);
    archiveMutation.mutate(recipe.id, {
      onError: (err) => {
        setActionError(toErrorMessage(err, 'Không thể lưu trữ công thức.'));
      },
    });
  };

  const handleDelete = () => {
    setActionError(null);
    deleteMutation.mutate(recipe.id, {
      onSuccess: () => {
        router.push('/recipes');
      },
      onError: (err) => {
        setActionError(toErrorMessage(err, 'Không thể xóa công thức.'));
        setIsConfirmingDelete(false);
      },
    });
  };

  const isPending =
    publishMutation.isPending ||
    unpublishMutation.isPending ||
    archiveMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="space-y-3 rounded-2xl border border-orange-200 bg-orange-50/50 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-orange-200/60 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-900">
          Quản lý bài viết của bạn
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
            recipe.status === 'Published'
              ? 'bg-emerald-100 text-emerald-800'
              : recipe.status === 'Draft'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {recipe.status === 'Published'
            ? 'Đã xuất bản'
            : recipe.status === 'Draft'
            ? 'Bản nháp'
            : 'Đã lưu trữ'}
        </span>
      </div>

      {actionError && (
        <div className="flex items-start gap-2 rounded-xl bg-red-100 p-3 text-xs text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {/* Nút Chỉnh sửa */}
        <Link
          href={`/recipes/${recipe.slug}/edit`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
        >
          <Edit className="h-3.5 w-3.5 text-blue-600" />
          <span>Chỉnh sửa</span>
        </Link>

        {/* Nút Xuất bản / Hủy xuất bản */}
        {recipe.status === 'Published' ? (
          <button
            type="button"
            onClick={handleUnpublish}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900 shadow-sm transition-all hover:bg-amber-200 active:scale-95 disabled:opacity-50"
          >
            {unpublishMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-amber-700" />
            )}
            <span>Hủy xuất bản</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
          >
            {publishMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Globe className="h-3.5 w-3.5" />
            )}
            <span>Xuất bản ngay</span>
          </button>
        )}

        {/* Nút Lưu trữ (Archive) */}
        {recipe.status !== 'Archived' && (
          <button
            type="button"
            onClick={handleArchive}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-100 active:scale-95 disabled:opacity-50"
          >
            {archiveMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Archive className="h-3.5 w-3.5 text-gray-600" />
            )}
            <span>Lưu trữ</span>
          </button>
        )}

        {/* Nút Xóa (Delete) */}
        <button
          type="button"
          onClick={() => setIsConfirmingDelete(true)}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 px-3 py-2 text-xs font-semibold shadow-sm transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Xóa bài</span>
        </button>
      </div>

      {/* Modal Xác nhận xóa */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Xác nhận xóa công thức</h4>
            </div>

            <p className="text-sm text-gray-600">
              Bạn có chắc chắn muốn xóa bài viết <span className="font-semibold text-gray-900">&quot;{recipe.title}&quot;</span>? Hành động này sẽ chuyển công thức vào thùng rác soft delete.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
