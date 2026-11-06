'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RecipeDetailDto } from '@/lib/types/recipe';
import type { DashboardTab } from '../DashboardSidebar';
import { ConfirmDialog } from '@/components/ui/dialog';
import DeleteRecipeModal from '@/components/recipes/DeleteRecipeModal';
import { resolveMediaUrl, formatDuration } from '@/lib/utils';
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  EyeOff,
  Archive,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ChefHat,
  FolderTree,
  Clock,
  Users,
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
  viewStyle?: 'studio' | 'form';
  onToggleViewStyle?: () => void;
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
  onToggleViewStyle,
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

  // Lấy ảnh đại diện ẩm thực của chính món ăn làm nền Banner, hoặc fallback ảnh ẩm thực chất lượng cao
  const primaryImg = recipe.images?.find((img) => img.isPrimary) || recipe.images?.[0];
  const heroImage = primaryImg
    ? resolveMediaUrl(primaryImg.originalUrl || primaryImg.mediumUrl || primaryImg.thumbnailUrl)
    : '/images/dashboard/banner-recipes.jpg';

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  return (
    <>
      {/* 1. HERO BANNER: Recipe Studio 360 mang phong cách ẩm thực cao cấp */}
      <div className="relative overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 shadow-md">
        {/* Ảnh nền món ăn với hiệu ứng zoom nhẹ khi hover */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 scale-105 transition-transform duration-700 hover:scale-100 pointer-events-none"
          style={{
            backgroundImage: `url('${heroImage}')`,
          }}
        />

        {/* Lớp phủ Scrim Gradient 3 tầng chống chói, bảo đảm tương phản text chuẩn WCAG AA */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-900/80 to-stone-900/40 pointer-events-none" />

        {/* Nội dung chính trên Hero Banner */}
        <div className="relative z-10 p-6 sm:p-8 space-y-6 text-white">
          {/* Top Row: Điều hướng Breadcrumbs & Trạng thái bài viết */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-orange-200/90 flex-wrap">
              <button
                type="button"
                onClick={() => onSelectTab('recipes')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition active:scale-95 shadow-xs font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại danh sách</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <Link
                href="/dashboard?tab=overview"
                className="hover:text-white transition underline-offset-2 hover:underline"
              >
                Trang chủ
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <button
                type="button"
                onClick={() => onSelectTab('recipes')}
                className="hover:text-white transition underline-offset-2 hover:underline"
              >
                Công thức
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="text-white font-semibold line-clamp-1 max-w-[220px]">
                {recipe.title}
              </span>
            </div>

            {/* Cụm huy hiệu trạng thái */}
            <div className="flex items-center gap-2">
              {isPublished && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã xuất bản</span>
                </span>
              )}
              {isDraft && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Bản nháp</span>
                </span>
              )}
              {isArchived && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-500/30 text-stone-300 border border-stone-500/40 backdrop-blur-md">
                  <Archive className="w-3.5 h-3.5" />
                  <span>Kho lưu trữ</span>
                </span>
              )}
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-200 border border-orange-500/40 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Recipe Studio 360°</span>
              </span>
            </div>
          </div>

          {/* Middle: Tiêu đề món ăn & Metadata ẩm thực sắc nét */}
          <div className="flex items-start gap-4 max-w-4xl pt-1">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-xl shrink-0 mt-1">
              <ChefHat className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-2.5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm leading-snug">
                {recipe.title}
              </h1>

              {/* Các thẻ thông tin ẩm thực chi tiết */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                {recipe.categoryName && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-orange-200 font-medium">
                    <FolderTree className="w-3.5 h-3.5 text-orange-400" />
                    <span>{recipe.categoryName}</span>
                  </span>
                )}
                {totalTime > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-stone-200 font-medium">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>{formatDuration(totalTime)}</span>
                  </span>
                )}
                {recipe.servings > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-stone-200 font-medium">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    <span>{recipe.servings} khẩu phần</span>
                  </span>
                )}
                {recipe.authorName && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-stone-200 font-medium">
                    <ChefHat className="w-3.5 h-3.5 text-orange-400" />
                    <span>{recipe.authorName}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-400 font-mono">
                Đường dẫn công khai:{' '}
                <span className="text-orange-200/90 font-medium">
                  /recipes/{recipe.slug}
                </span>
              </p>
            </div>
          </div>

          {/* Bottom Toolbar: Cụm thanh công cụ tác vụ chuyên nghiệp (Kính mờ sang trọng) */}
          <div className="border-t border-white/15 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {onToggleViewStyle && (
                <button
                  type="button"
                  onClick={onToggleViewStyle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-xs font-bold text-white transition active:scale-95 shadow-sm"
                  title="Chuyển sang chế độ Soạn thảo 1 trang"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-300" />
                  <span>Dạng Soạn thảo 1 trang</span>
                </button>
              )}

              <Link
                href={`/recipes/${encodeURIComponent(recipe.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-xs font-bold text-orange-200 hover:text-white transition active:scale-95 shadow-sm"
                title="Mở xem bài viết ở một trang mới độc lập (/recipes/...)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem ở trang mới ↗</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {isPublished ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmingUnpublish(true)}
                  disabled={isAnyActionPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-md border border-amber-500/40 text-xs font-bold text-amber-200 transition active:scale-95 shadow-sm disabled:opacity-50"
                >
                  {isUnpublishing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  <span>Gỡ xuất bản</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingPublish(true)}
                  disabled={isAnyActionPending || !canPublish}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition active:scale-95 ${
                    canPublish
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                      : 'bg-emerald-900/60 cursor-not-allowed opacity-60 border border-emerald-700/40'
                  }`}
                >
                  {isPublishing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Globe className="w-3.5 h-3.5" />
                  )}
                  <span>Xuất bản ngay</span>
                </button>
              )}

              {!isArchived && (
                <button
                  type="button"
                  onClick={() => setIsConfirmingArchive(true)}
                  disabled={isAnyActionPending}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-stone-300 hover:text-white transition active:scale-95 disabled:opacity-50"
                  title="Lưu trữ công thức"
                >
                  {isArchiving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Archive className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  <span>Lưu trữ</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                disabled={isAnyActionPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 backdrop-blur-md border border-rose-500/40 text-xs font-bold text-rose-200 transition active:scale-95 disabled:opacity-50"
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
