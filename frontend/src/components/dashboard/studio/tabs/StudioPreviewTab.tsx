'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RecipeDetailDto } from '@/lib/types/recipe';
import { resolveMediaUrl, formatDate } from '@/lib/utils';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Tag,
  User,
  Calendar,
  Clock,
  Utensils,
  Users,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  ShoppingBag,
  ChefHat,
  Lightbulb,
  ExternalLink,
  Globe,
  EyeOff,
  Archive,
  Loader2,
  ArrowRight,
  Image as ImageIcon,
  Edit2,
  AlertTriangle,
} from 'lucide-react';

interface StudioPreviewTabProps {
  recipe: RecipeDetailDto;
  onRefresh: () => void;
  onSwitchTab: (tab: 'general' | 'gallery' | 'ingredients' | 'steps' | 'preview') => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onArchive: () => void;
  isPublishing?: boolean;
  isUnpublishing?: boolean;
  isArchiving?: boolean;
}

const difficultyMap: Record<number, { label: string; color: string }> = {
  1: { label: 'Dễ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  2: { label: 'Trung bình', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  3: { label: 'Khó', color: 'bg-red-50 text-red-700 border-red-200' },
};

export default function StudioPreviewTab({
  recipe,
  onSwitchTab,
  onPublish,
  onUnpublish,
  onArchive,
  isPublishing = false,
  isUnpublishing = false,
  isArchiving = false,
}: StudioPreviewTabProps) {
  const images = recipe.images ?? [];
  const ingredients = recipe.ingredients ?? [];
  const steps = [...(recipe.steps ?? [])].sort((a, b) => a.stepNumber - b.stepNumber);

  // Tìm ảnh chính mặc định
  const primaryImg = images.find((img) => img.isPrimary) || images[0];
  const [selectedHeroUrl, setSelectedHeroUrl] = useState<string | null>(null);
  const activeHeroUrl = selectedHeroUrl || primaryImg?.originalUrl || null;

  // Kiểm tra điều kiện FR-RCP-005
  const hasValidTitle = (recipe.title?.trim().length ?? 0) >= 5;
  const hasHeroImage = images.length > 0;
  const hasValidIngredients = ingredients.length > 0;
  const hasValidSteps = steps.length > 0;
  const canPublish = hasValidIngredients && hasValidSteps && hasValidTitle;

  const statusNum = Number(recipe.status);
  const isPublished = recipe.status === 'Published' || statusNum === 1;
  const isDraft = recipe.status === 'Draft' || statusNum === 0;
  const isArchived = recipe.status === 'Archived' || statusNum === 2;

  const diffConfig = difficultyMap[Number(recipe.difficulty)] || {
    label: 'Trung bình',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const hasNutrition = Boolean(
    recipe.nutrition &&
      ((recipe.nutrition.calories && recipe.nutrition.calories > 0) ||
        (recipe.nutrition.protein && recipe.nutrition.protein > 0) ||
        (recipe.nutrition.carbohydrates && recipe.nutrition.carbohydrates > 0) ||
        (recipe.nutrition.fat && recipe.nutrition.fat > 0))
  );

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. HEADER ĐIỀU HƯỚNG VÀ CHECKLIST CHẤT LƯỢNG (FR-RCP-005)
          ========================================================================= */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                <Eye className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-gray-900">
                Xem trước bài viết & Quyết định xuất bản
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                <Sparkles className="w-3 h-3" />
                <span>Mô phỏng thực tế độc giả</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Kiểm tra toàn cảnh bài viết sau khi chỉnh sửa trước khi cập nhật hoặc xuất bản trên Culinary Blog.
            </p>
          </div>

          {/* Phím tắt chuyển nhanh về các tab chỉnh sửa */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
            <span className="text-[11px] font-semibold text-gray-400 mr-1">Chỉnh sửa nhanh:</span>
            <button
              type="button"
              onClick={() => onSwitchTab('general')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
            >
              <Edit2 className="w-3 h-3 text-gray-400" />
              <span>1. Thông tin</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchTab('gallery')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
            >
              <Edit2 className="w-3 h-3 text-gray-400" />
              <span>2. Ảnh ({images.length})</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchTab('ingredients')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
            >
              <Edit2 className="w-3 h-3 text-gray-400" />
              <span>3. Nguyên liệu ({ingredients.length})</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchTab('steps')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
            >
              <Edit2 className="w-3 h-3 text-gray-400" />
              <span>4. Các bước ({steps.length})</span>
            </button>
          </div>
        </div>

        {/* 4 Thẻ Checklist điều kiện SRS FR-RCP-005 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            className={`p-3.5 rounded-2xl border ${
              hasValidTitle
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">1. Tiêu đề món ăn</span>
              {hasValidTitle ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <p className="text-[11px] mt-1 text-gray-600">
              {hasValidTitle ? 'Đạt chuẩn (≥ 5 ký tự)' : 'Cần tối thiểu 5 ký tự'}
            </p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border ${
              hasHeroImage
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">2. Hình ảnh món ăn</span>
              {hasHeroImage ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <p className="text-[11px] mt-1 text-gray-600">
              {hasHeroImage ? `${images.length} ảnh trong album` : 'Chưa có ảnh đại diện món ăn'}
            </p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border ${
              hasValidIngredients
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                : 'bg-red-50/50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">3. Danh sách nguyên liệu</span>
              {hasValidIngredients ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <p className="text-[11px] mt-1 text-gray-600">
              {hasValidIngredients
                ? `${ingredients.length} nguyên liệu đã thiết lập`
                : 'Bắt buộc có ≥ 1 nguyên liệu (FR-RCP-005)'}
            </p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border ${
              hasValidSteps
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                : 'bg-red-50/50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">4. Quy trình chế biến</span>
              {hasValidSteps ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <p className="text-[11px] mt-1 text-gray-600">
              {hasValidSteps
                ? `${steps.length} bước thực hiện tuần tự`
                : 'Bắt buộc có ≥ 1 bước làm (FR-RCP-005)'}
            </p>
          </div>
        </div>

        {/* Thanh trạng thái và Quyết định Xuất bản / Gỡ xuất bản */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
          <div className="flex items-center gap-3">
            {canPublish ? (
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-gray-900">
                {canPublish
                  ? 'Công thức đã hoàn thiện và đáp ứng đầy đủ tiêu chuẩn xuất bản (SRS §FR-RCP-005)'
                  : 'Công thức còn thiếu thông tin bắt buộc để xuất bản công khai'}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {isPublished && 'Bài viết đang được hiển thị công khai tới tất cả độc giả.'}
                {isDraft && 'Bài viết đang lưu ở dạng Bản nháp. Chỉ có bạn và Quản trị viên nhìn thấy.'}
                {isArchived && 'Bài viết đang nằm trong Kho lưu trữ.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Nếu đang là Draft: Nút Xuất bản công khai ngay */}
            {isDraft && (
              <button
                type="button"
                onClick={onPublish}
                disabled={!canPublish || isPublishing}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition active:scale-95 disabled:opacity-50 ${
                  canPublish ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-300 cursor-not-allowed'
                }`}
                title={
                  !canPublish
                    ? 'Cần tối thiểu 1 nguyên liệu và 1 bước làm để xuất bản'
                    : 'Xuất bản công thức công khai ngay'
                }
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xuất bản...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Xuất bản công khai ngay</span>
                  </>
                )}
              </button>
            )}

            {/* Nếu đã Published: Nút Xem trang công khai & Nút Gỡ xuất bản */}
            {isPublished && (
              <>
                <Link
                  href={`/recipes/${encodeURIComponent(recipe.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  <span>Xem trang công khai</span>
                </Link>

                <button
                  type="button"
                  onClick={onUnpublish}
                  disabled={isUnpublishing}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 hover:bg-amber-100 transition disabled:opacity-50"
                >
                  {isUnpublishing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  <span>Gỡ về bản nháp</span>
                </button>
              </>
            )}

            {/* Nút Lưu trữ */}
            {!isArchived && (
              <button
                type="button"
                onClick={onArchive}
                disabled={isArchiving}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                title="Chuyển vào kho lưu trữ"
              >
                {isArchiving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Archive className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span>Lưu trữ</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. KHUNG MÔ PHỎNG CHI TIẾT BÀI BÁO THỰC TẾ (LIVE ARTICLE PREVIEW)
          ========================================================================= */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header bài viết */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
              <Tag className="h-3.5 w-3.5" />
              {recipe.categoryName || 'Ẩm thực'}
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${diffConfig.color}`}>
              Độ khó: {diffConfig.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-700">
              <Eye className="w-3.5 h-3.5" />
              Chế độ xem trước trực tiếp
            </span>
            {isPublished && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đang công khai
              </span>
            )}
            {isDraft && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700">
                <AlertCircle className="w-3.5 h-3.5" />
                Bản nháp
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            {recipe.title || 'Tiêu đề công thức món ăn'}
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-gray-600">
            {recipe.description || 'Chưa có phần tóm tắt giới thiệu món ăn...'}
          </p>

          {/* Tác giả & Ngày đăng */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-500 border-t border-gray-100">
            <div className="flex items-center gap-1.5 font-medium text-gray-700">
              <User className="h-4 w-4 text-orange-500" />
              <span>Tác giả: {recipe.authorName || 'Bếp trưởng'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                {recipe.publishedAt
                  ? `Xuất bản: ${formatDate(recipe.publishedAt)}`
                  : `Tạo ngày: ${formatDate(recipe.createdAt)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Khung Ảnh đại diện & Gallery Thumbnail */}
        <div className="space-y-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100">
            {activeHeroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveMediaUrl(activeHeroUrl)}
                alt={recipe.title || 'Ảnh món ăn'}
                className="h-full w-full object-cover object-center transition-all duration-300"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-orange-50 to-amber-50 text-orange-300 gap-2">
                <ImageIcon className="h-14 w-14" />
                <span className="text-xs text-orange-400 font-medium">Chưa có hình ảnh món ăn</span>
              </div>
            )}
          </div>

          {/* Dải ảnh Thumbnail (cho phép bấm chuyển đổi ảnh xem trước) */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              <span className="text-[11px] font-bold text-gray-400 mr-1 shrink-0">
                Album ({images.length}):
              </span>
              {images.map((img) => {
                const isSelected = activeHeroUrl === img.originalUrl;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedHeroUrl(img.originalUrl)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-orange-500 scale-95 shadow-sm ring-2 ring-orange-200'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    title={img.altText || 'Ảnh món ăn'}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveMediaUrl(img.thumbnailUrl || img.originalUrl)}
                      alt={img.altText || 'Thumbnail'}
                      className="h-full w-full object-cover"
                    />
                    {img.isPrimary && (
                      <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/70 text-white text-[8px] font-bold rounded">
                        Chính
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4 Thẻ thông số tóm tắt (Chuẩn bị, Nấu, Tổng thời gian, Khẩu phần) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Chuẩn bị</p>
              <p className="text-sm font-bold text-gray-900">{recipe.prepTimeMinutes || 0} phút</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Thời gian nấu</p>
              <p className="text-sm font-bold text-gray-900">{recipe.cookTimeMinutes || 0} phút</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Tổng thời gian</p>
              <p className="text-sm font-bold text-gray-900">
                {(Number(recipe.prepTimeMinutes) || 0) + (Number(recipe.cookTimeMinutes) || 0)} phút
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Khẩu phần</p>
              <p className="text-sm font-bold text-gray-900">{recipe.servings || 1} người</p>
            </div>
          </div>
        </div>

        {/* Thông tin dinh dưỡng (nếu có) */}
        {hasNutrition && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h4 className="text-sm font-bold text-gray-900">Giá trị Dinh dưỡng (mỗi khẩu phần)</h4>
              <span className="text-[11px] text-gray-400 font-medium">Ước tính</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-red-100 bg-red-50/50 p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Năng lượng</span>
                </div>
                <p className="text-base font-black text-red-950 mt-1">
                  {recipe.nutrition?.calories || 0} kcal
                </p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Chất đạm</span>
                </div>
                <p className="text-base font-black text-blue-950 mt-1">
                  {recipe.nutrition?.protein || 0} g
                </p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  <Wheat className="w-3.5 h-3.5" />
                  <span>Tinh bột</span>
                </div>
                <p className="text-base font-black text-amber-950 mt-1">
                  {recipe.nutrition?.carbohydrates || 0} g
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Chất béo</span>
                </div>
                <p className="text-base font-black text-emerald-950 mt-1">
                  {recipe.nutrition?.fat || 0} g
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bố cục 2 cột: Nguyên liệu & Các bước */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cột 1: Danh sách nguyên liệu */}
          <div className="md:col-span-1 space-y-4 rounded-2xl border border-gray-100 bg-gray-50/40 p-5">
            <div className="flex items-center justify-between border-b border-gray-200/70 pb-3">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <ShoppingBag className="h-4 w-4 text-orange-500" />
                <h4 className="text-base">Nguyên liệu</h4>
              </div>
              <button
                type="button"
                onClick={() => onSwitchTab('ingredients')}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-100/70 hover:bg-orange-100 px-2 py-0.5 rounded-full transition"
                title="Bấm để chỉnh sửa nguyên liệu"
              >
                {ingredients.length} món • Sửa
              </button>
            </div>

            {ingredients.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-gray-400 italic">Chưa có nguyên liệu nào.</p>
                <button
                  type="button"
                  onClick={() => onSwitchTab('ingredients')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  + Thêm nguyên liệu ngay
                </button>
              </div>
            ) : (
              <ul className="space-y-2.5 text-xs">
                {ingredients.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-2 bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        {item.notes && (
                          <p className="text-[10px] text-gray-400 italic">{item.notes}</p>
                        )}
                      </div>
                    </div>
                    {(item.quantity != null || item.unit) && (
                      <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg shrink-0">
                        {item.quantity ?? ''} {item.unit ?? ''}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cột 2: Các bước thực hiện & Ghi chú */}
          <div className="md:col-span-2 space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <ChefHat className="h-5 w-5 text-orange-500" />
                  <h4 className="text-base">Các bước thực hiện</h4>
                </div>
                <button
                  type="button"
                  onClick={() => onSwitchTab('steps')}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-100/70 hover:bg-orange-100 px-2 py-0.5 rounded-full transition"
                  title="Bấm để chỉnh sửa các bước nấu"
                >
                  {steps.length} bước • Sửa
                </button>
              </div>

              {steps.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-xs text-gray-400 italic">Chưa có bước thực hiện nào.</p>
                  <button
                    type="button"
                    onClick={() => onSwitchTab('steps')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    + Thêm bước nấu đầu tiên
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-3.5 p-4 rounded-2xl border border-gray-100 bg-gray-50/30"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-2xs">
                        {step.stepNumber}
                      </span>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-gray-900">
                            {step.title || `Bước ${step.stepNumber}`}
                          </h5>
                          {step.timerMinutes != null && step.timerMinutes > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                              <Clock className="w-3 h-3 text-orange-500" />
                              <span>{step.timerMinutes} phút</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                          {step.description}
                        </p>

                        {/* Ảnh minh họa của bước nếu có */}
                        {step.imageUrl && (
                          <div className="w-40 h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 mt-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={resolveMediaUrl(step.imageUrl)}
                              alt={step.title || `Ảnh bước ${step.stepNumber}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bí quyết & Lưu ý của tác giả nếu có */}
            {recipe.instructions?.trim() && (
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Bí quyết & Lưu ý từ tác giả</span>
                </div>
                <p className="text-xs text-amber-800/90 leading-relaxed whitespace-pre-line">
                  {recipe.instructions}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
