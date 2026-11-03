'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type {
  RecipeImageDto,
  RecipeIngredientDto,
  RecipeStepDto,
  RecipeNutritionDto,
} from '@/lib/types/recipe';
import RecipeGalleryViewer from '@/components/recipes/RecipeGalleryViewer';
import RecipeIngredientsList from '@/components/recipes/RecipeIngredientsList';
import RecipeStepsList from '@/components/recipes/RecipeStepsList';
import RecipeNutritionCard from '@/components/recipes/RecipeNutritionCard';
import {
  Clock,
  Users,
  UtensilsCrossed,
  Calendar,
  User,
  Tag,
  Sparkles,
  ArrowLeft,
  X,
  AlertCircle,
  Eye,
  FileText,
} from 'lucide-react';

interface PreviewRecipeData {
  title: string;
  description: string;
  instructions: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: number;
  categoryName: string;
  categoryId?: string;
  images: Array<{
    id?: string;
    originalUrl: string;
    isPrimary: boolean;
    orderIndex?: number;
    altText?: string;
  }>;
  ingredients: Array<{
    id?: string;
    name: string;
    quantity?: number | null;
    unit?: string | null;
    notes?: string | null;
  }>;
  steps: Array<{
    id?: string;
    title?: string;
    description: string;
    timerMinutes?: number | null;
    imageUrl?: string | null;
  }>;
  nutrition: {
    calories?: number | null;
    protein?: number | null;
    carbohydrates?: number | null;
    fat?: number | null;
  };
}

const difficultyLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Dễ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  2: { label: 'Trung bình', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  3: { label: 'Khó', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  4: { label: 'Chuyên gia', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function RecipePreviewStandalonePage() {
  const [data, setData] = useState<PreviewRecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('culinary_recipe_preview_draft');
      if (stored) {
        const parsed = JSON.parse(stored) as PreviewRecipeData;
        setData(parsed);
      }
    } catch (err) {
      console.error('Không thể đọc dữ liệu xem trước công thức:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Đang tải bản xem trước...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-xl py-16 px-4 text-center animate-fade-in">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Chưa có dữ liệu xem trước
            </h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              Bạn chưa nhập thông tin công thức hoặc phiên làm việc đã hết hạn. Hãy quay lại trang tạo công thức để bắt đầu soạn thảo.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard?tab=recipes-create"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition active:scale-95"
            >
              <FileText className="h-4 w-4" />
              <span>Đến trang tạo công thức</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
            >
              <span>Về Bảng điều khiển</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const diff = difficultyLabels[data.difficulty] || difficultyLabels[1];
  const totalTime = (data.prepTimeMinutes || 0) + (data.cookTimeMinutes || 0);

  // Map to RecipeImageDto[]
  const images: RecipeImageDto[] = (data.images || []).map((img, idx) => ({
    id: img.id || `preview-img-${idx}`,
    originalUrl: img.originalUrl,
    mediumUrl: img.originalUrl,
    thumbnailUrl: img.originalUrl,
    altText: img.altText || data.title,
    isPrimary: img.isPrimary,
    orderIndex: img.orderIndex ?? idx,
  }));

  // Map to RecipeIngredientDto[]
  const ingredients: RecipeIngredientDto[] = (data.ingredients || []).map((ing, idx) => ({
    id: ing.id || `preview-ing-${idx}`,
    name: ing.name,
    quantity: ing.quantity ?? null,
    unit: ing.unit || null,
    notes: ing.notes || null,
    orderIndex: idx + 1,
  }));

  // Map to RecipeStepDto[]
  const steps: RecipeStepDto[] = (data.steps || []).map((step, idx) => ({
    id: step.id || `preview-step-${idx}`,
    stepNumber: idx + 1,
    title: step.title || `Bước ${idx + 1}`,
    description: step.description,
    timerMinutes: step.timerMinutes ?? null,
    imageUrl: step.imageUrl || null,
  }));

  const nutrition: RecipeNutritionDto = {
    calories: data.nutrition?.calories ?? null,
    protein: data.nutrition?.protein ?? null,
    carbohydrates: data.nutrition?.carbohydrates ?? null,
    fat: data.nutrition?.fat ?? null,
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. THANH THÔNG BÁO XEM TRƯỚC Ở TRANG MỚI */}
      <div className="sticky top-2 z-40 mx-auto max-w-5xl px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white shadow-xl border border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Đang xem trước bài viết ở trang mới độc lập
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Bản nháp
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Đây là giao diện chuẩn 100% ngoài thực tế khi độc giả xem bài viết công khai.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.close()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20 transition active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              <span>Đóng trang xem trước</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KHUNG NỘI DUNG BÀI VIẾT HOÀN TOÀN GIỐNG RECIPEDETAILVIEW */}
      <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6">
        {/* Breadcrumb điều hướng */}
        <div>
          <button
            type="button"
            onClick={() => window.close()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Đóng và quay lại tab soạn thảo</span>
          </button>
        </div>

        {/* Header thông tin chính */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
              <Tag className="h-3.5 w-3.5" />
              {data.categoryName || 'Ẩm thực'}
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${diff.color}`}>
              Độ khó: {diff.label}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <Sparkles className="w-3 h-3" />
              <span>Trang mới độc lập</span>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {data.title || 'Tiêu đề công thức món ăn'}
          </h1>

          <p className="text-base leading-relaxed text-gray-600">
            {data.description || 'Chưa có phần giới thiệu ngắn cho công thức...'}
          </p>

          {/* Tác giả & Ngày đăng */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-500 border-t border-gray-100">
            <div className="flex items-center gap-1.5 font-medium text-gray-700">
              <User className="h-4 w-4 text-orange-500" />
              <span>Tác giả: Bạn (Bếp trưởng)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Ngày xem trước: Hôm nay</span>
            </div>
          </div>
        </div>

        {/* Khối Hình ảnh công thức chuẩn Gallery Mockup */}
        <RecipeGalleryViewer images={images} recipeTitle={data.title} />

        {/* Các thẻ thông số tóm tắt (Thời gian, Khẩu phần) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Chuẩn bị</p>
              <p className="text-sm font-bold text-gray-900">{data.prepTimeMinutes || 0} phút</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Thời gian nấu</p>
              <p className="text-sm font-bold text-gray-900">{data.cookTimeMinutes || 0} phút</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Tổng thời gian</p>
              <p className="text-sm font-bold text-gray-900">{totalTime} phút</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Khẩu phần</p>
              <p className="text-sm font-bold text-gray-900">{data.servings || 1} phần</p>
            </div>
          </div>
        </div>

        {/* Thông tin dinh dưỡng */}
        <RecipeNutritionCard nutrition={nutrition} />

        {/* Bố cục 2 cột: Cột trái Nguyên liệu & Các bước thực hiện */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Cột 1: Nguyên liệu */}
          <div className="md:col-span-1">
            <RecipeIngredientsList
              ingredients={ingredients}
              servings={data.servings || 1}
            />
          </div>

          {/* Cột 2: Các bước thực hiện */}
          <div className="md:col-span-2">
            <RecipeStepsList
              steps={steps}
              instructions={data.instructions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
