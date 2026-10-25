'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RecipeDetailDto, RecipeStatus } from '@/lib/types/recipe';
import type { DashboardTab } from '../DashboardSidebar';
import DeleteRecipeModal from '@/components/recipes/DeleteRecipeModal';
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  EyeOff,
  Archive,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface RecipeStudioHeaderProps {
  recipe: RecipeDetailDto;
  onSelectTab: (tab: DashboardTab) => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isPublishing?: boolean;
  isUnpublishing?: boolean;
  isArchiving?: boolean;
  isDeleting?: boolean;
}

export default function RecipeStudioHeader({
  recipe,
  onSelectTab,
  onPublish,
  onUnpublish,
  onArchive,
  onDelete,
  isPublishing = false,
  isUnpublishing = false,
  isArchiving = false,
  isDeleting = false,
}: RecipeStudioHeaderProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const statusNum = Number(recipe.status);
  const isPublished = recipe.status === 'Published' || statusNum === 1;
  const isDraft = recipe.status === 'Draft' || statusNum === 0;
  const isArchived = recipe.status === 'Archived' || statusNum === 2;

  // Nghiệp vụ FR-RCP-005: Không thể Publish nếu chưa có bước thực hiện nào
  const hasSteps = (recipe.steps?.length ?? 0) > 0;

  const isAnyActionPending = isPublishing || isUnpublishing || isArchiving || isDeleting;

  return (
    <>
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        {/* Top: Navigation & Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <button
              type="button"
              onClick={() => onSelectTab('recipes-mine')}
              className="inline-flex items-center gap-1.5 font-bold hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại bài viết</span>
            </button>
            <span>/</span>
            <span className="text-gray-400">Recipe Studio</span>
          </div>

          <div className="flex items-center gap-2">
            {isPublished && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đã xuất bản</span>
              </span>
            )}
            {isDraft && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Bản nháp</span>
              </span>
            )}
            {isArchived && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                <Archive className="w-3.5 h-3.5" />
                <span>Kho lưu trữ</span>
              </span>
            )}
          </div>
        </div>

        {/* Middle: Title & Slug */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight truncate">
              {recipe.title}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              Đường dẫn công khai: <span className="font-mono text-gray-600">/recipes/{recipe.slug}</span>
            </p>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* 1. Nút Xem bài viết công khai */}
            <Link
              href={`/recipes/${encodeURIComponent(recipe.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition shadow-2xs"
              title="Xem bài viết trên giao diện người dùng"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              <span>Xem bài viết</span>
            </Link>

            {/* 2. Xuất bản hoặc Hủy xuất bản (FR-RCP-005) */}
            {isPublished ? (
              <button
                type="button"
                onClick={onUnpublish}
                disabled={isAnyActionPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 hover:bg-amber-100 transition disabled:opacity-50"
              >
                {isUnpublishing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
                <span>Gỡ xuất bản</span>
              </button>
            ) : (
              <div className="relative group">
                <button
                  type="button"
                  onClick={onPublish}
                  disabled={isAnyActionPending || !hasSteps}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition ${
                    hasSteps
                      ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                      : 'bg-emerald-300 cursor-not-allowed opacity-70'
                  }`}
                >
                  {isPublishing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Globe className="w-3.5 h-3.5" />
                  )}
                  <span>Xuất bản ngay</span>
                </button>

                {/* Tooltip cảnh báo FR-RCP-005 nếu chưa có bước nào */}
                {!hasSteps && (
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-64 p-2.5 rounded-xl bg-gray-900 text-white text-[11px] leading-tight shadow-xl">
                    <div className="flex items-start gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        Theo quy định <strong>FR-RCP-005</strong>, công thức phải có ít nhất 1 bước thực hiện trước khi xuất bản.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Lưu trữ (FR-RCP-006) */}
            {!isArchived && (
              <button
                type="button"
                onClick={onArchive}
                disabled={isAnyActionPending}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                title="Lưu trữ công thức"
              >
                {isArchiving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Archive className="w-3.5 h-3.5 text-gray-500" />
                )}
                <span>Lưu trữ</span>
              </button>
            )}

            {/* 4. Xóa vĩnh viễn (FR-RCP-007) */}
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              disabled={isAnyActionPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-100 transition disabled:opacity-50"
              title="Xóa vĩnh viễn công thức"
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Xóa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa an toàn */}
      <DeleteRecipeModal
        isOpen={isConfirmingDelete}
        recipeTitle={recipe.title}
        isLoading={isDeleting}
        onConfirm={() => {
          setIsConfirmingDelete(false);
          onDelete();
        }}
        onCancel={() => setIsConfirmingDelete(false)}
      />
    </>
  );
}
