'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RecipeDetailDto, RecipeStatus } from '@/lib/types/recipe';
import type { DashboardTab } from '../DashboardSidebar';
import { ConfirmDialog } from '@/components/ui/dialog';
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
  const [isConfirmingPublish, setIsConfirmingPublish] = useState(false);
  const [isConfirmingUnpublish, setIsConfirmingUnpublish] = useState(false);
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);

  const statusNum = Number(recipe.status);
  const isPublished = recipe.status === 'Published' || statusNum === 1;
  const isDraft = recipe.status === 'Draft' || statusNum === 0;
  const isArchived = recipe.status === 'Archived' || statusNum === 2;

  // Nghiệp vụ FR-RCP-005: BẮT BUỘC phải có ít nhất 1 bước và 1 nguyên liệu mới được Publish
  const hasSteps = (recipe.steps?.length ?? 0) > 0;
  const hasIngredients = (recipe.ingredients?.length ?? 0) > 0;
  const canPublish = hasSteps && hasIngredients;

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
                onClick={() => setIsConfirmingUnpublish(true)}
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
                  onClick={() => setIsConfirmingPublish(true)}
                  disabled={isAnyActionPending || !canPublish}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition ${
                    canPublish
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

                {/* Tooltip cảnh báo FR-RCP-005 nếu chưa đủ điều kiện */}
                {!canPublish && (
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-72 p-3 rounded-2xl bg-gray-900 text-white text-[11px] leading-relaxed shadow-xl animate-fade-in">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-300">Quy tắc xuất bản (FR-RCP-005):</p>
                        <ul className="mt-1 space-y-1">
                          <li className={hasIngredients ? 'text-emerald-400 font-medium' : 'text-rose-300'}>
                            {hasIngredients ? '✓ Đã có nguyên liệu' : '✗ Cần ít nhất 1 nguyên liệu'}
                          </li>
                          <li className={hasSteps ? 'text-emerald-400 font-medium' : 'text-rose-300'}>
                            {hasSteps ? '✓ Đã có bước thực hiện' : '✗ Cần ít nhất 1 bước hướng dẫn'}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Phân cách trực quan giữa nhóm hành động xuất bản và nhóm lưu trữ/xóa */}
            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

            {/* 3. Lưu trữ (FR-RCP-006) */}
            {!isArchived && (
              <button
                type="button"
                onClick={() => setIsConfirmingArchive(true)}
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

      {/* Modal xác nhận xuất bản */}
      <ConfirmDialog
        isOpen={isConfirmingPublish}
        title="Xác nhận xuất bản công thức"
        subtitle="FR-RCP-005: Xuất bản công thức công khai"
        variant="success"
        confirmLabel="Xuất bản ngay"
        cancelLabel="Xem lại"
        isLoading={isPublishing}
        onClose={() => setIsConfirmingPublish(false)}
        onConfirm={async () => {
          setIsConfirmingPublish(false);
          await onPublish();
        }}
        description={
          <div className="space-y-2">
            <p>
              Bạn có chắc chắn muốn xuất bản công thức <strong>&quot;{recipe.title}&quot;</strong>?
            </p>
            <p className="text-gray-500">
              Sau khi xuất bản, công thức sẽ hiển thị công khai cho tất cả độc giả và được lập chỉ mục tìm kiếm trên toàn hệ thống.
            </p>
          </div>
        }
      />

      {/* Modal xác nhận gỡ xuất bản */}
      <ConfirmDialog
        isOpen={isConfirmingUnpublish}
        title="Xác nhận gỡ xuất bản"
        subtitle="Chuyển công thức về trạng thái bản nháp"
        variant="warning"
        confirmLabel="Gỡ xuất bản"
        cancelLabel="Hủy"
        isLoading={isUnpublishing}
        onClose={() => setIsConfirmingUnpublish(false)}
        onConfirm={async () => {
          setIsConfirmingUnpublish(false);
          await onUnpublish();
        }}
        description={
          <div className="space-y-2">
            <p>
              Bạn có chắc chắn muốn gỡ xuất bản công thức <strong>&quot;{recipe.title}&quot;</strong>?
            </p>
            <p className="text-gray-500">
              Công thức sẽ được đưa về trạng thái <strong>Bản nháp (Draft)</strong> và không còn hiển thị công khai với độc giả.
            </p>
          </div>
        }
      />

      {/* Modal xác nhận lưu trữ */}
      <ConfirmDialog
        isOpen={isConfirmingArchive}
        title="Xác nhận lưu trữ"
        subtitle="FR-RCP-006: Chuyển công thức vào kho lưu trữ"
        variant="info"
        confirmLabel="Lưu trữ"
        cancelLabel="Hủy"
        isLoading={isArchiving}
        onClose={() => setIsConfirmingArchive(false)}
        onConfirm={async () => {
          setIsConfirmingArchive(false);
          await onArchive();
        }}
        description={
          <div className="space-y-2">
            <p>
              Chuyển công thức <strong>&quot;{recipe.title}&quot;</strong> vào kho lưu trữ cá nhân?
            </p>
            <p className="text-gray-500">
              Bài viết sẽ bị ẩn khỏi danh sách công khai nhưng vẫn được bảo toàn nguyên vẹn trong hồ sơ của bạn.
            </p>
          </div>
        }
      />

      {/* Modal xác nhận xóa an toàn */}
      <DeleteRecipeModal
        isOpen={isConfirmingDelete}
        recipe={recipe}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirmDelete={async () => {
          setIsConfirmingDelete(false);
          await onDelete();
        }}
      />
    </>
  );
}
