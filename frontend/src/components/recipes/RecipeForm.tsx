'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipeFormSchema, type RecipeFormData } from '@/features/recipes/schemas';
import { categoryService } from '@/lib/services/category-service';
import { fileService } from '@/lib/services/file-service';
import { resolveMediaUrl } from '@/lib/utils';
import type { CategoryDto } from '@/lib/types/category';
import {
  Loader2,
  AlertCircle,
  Save,
  Utensils,
  Clock,
  Users,
  Flame,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  UploadCloud,
  Link as LinkIcon,
  X,
  Star,
  FileText,
  Eye,
  ChefHat,
  Heart,
  Send,
  MoveUp,
  MoveDown,
  ChevronDown,
  ChevronUp,
  Check,
  Tag,
  Dumbbell,
  Wheat,
  Droplets,
  ExternalLink,
  Lightbulb,
  ArrowLeft,
  Archive,
  Calendar,
  User,
  ShoppingBag,
} from 'lucide-react';

export interface GalleryFileItem {
  id: string;
  file?: File;
  previewUrl: string;
  isPrimary: boolean;
  name?: string;
  size?: number;
}

const difficultyLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Dễ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  2: { label: 'Trung bình', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  3: { label: 'Khó', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  4: { label: 'Chuyên gia', color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

interface RecipeFormProps {
  initialValues?: Partial<RecipeFormData>;
  isEdit?: boolean;
  isSubmitting: boolean;
  serverError?: string | null;
  onSubmit: (
    data: RecipeFormData,
    secondaryFiles?: File[],
    targetStatus?: 'draft' | 'publish' | 'archive'
  ) => Promise<void>;
}

// Một số URL ảnh món ăn chất lượng cao gợi ý nhanh
const sampleImages = [
  { label: 'Phở bò', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80' },
  { label: 'Món nướng / Xào', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Salad thanh đạm', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Bánh tráng miệng', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80' },
];

export default function RecipeForm({
  initialValues,
  isEdit = false,
  isSubmitting,
  serverError,
  onSubmit,
}: RecipeFormProps) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Chế độ xem: 'edit' (Soạn thảo theo bố cục 2 cột) | 'preview' (Xem trước toàn cảnh ngay trong Dashboard)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [submitTarget, setSubmitTarget] = useState<'draft' | 'publish' | 'archive'>('draft');

  // Thư viện ảnh (Giải pháp 1: Multi-Image Smart Grid Uploader)
  const [galleryItems, setGalleryItems] = useState<GalleryFileItem[]>(() => {
    if (initialValues?.primaryImageUrl) {
      return [
        {
          id: 'initial-primary',
          previewUrl: initialValues.primaryImageUrl,
          isPrimary: true,
          name: 'Ảnh chính hiện tại',
        },
      ];
    }
    return [];
  });
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState('card-general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      instructions: initialValues?.instructions ?? '',
      primaryImageUrl: initialValues?.primaryImageUrl ?? '',
      categoryId: initialValues?.categoryId ?? '',
      prepTimeMinutes: initialValues?.prepTimeMinutes ?? 15,
      cookTimeMinutes: initialValues?.cookTimeMinutes ?? 30,
      servings: initialValues?.servings ?? 4,
      difficulty: initialValues?.difficulty ?? 2,
      calories: initialValues?.calories ?? 0,
      protein: initialValues?.protein ?? 0,
      carbs: initialValues?.carbs ?? 0,
      fat: initialValues?.fat ?? 0,
      ingredients:
        initialValues?.ingredients && initialValues.ingredients.length > 0
          ? initialValues.ingredients
          : [{ name: '', quantity: null, unit: '', notes: '' }],
      steps:
        initialValues?.steps && initialValues.steps.length > 0
          ? initialValues.steps
          : [{ title: 'Bước 1: Chuẩn bị', description: '', timerMinutes: null }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: 'ingredients' });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
    move: moveStep,
  } = useFieldArray({ control, name: 'steps' });

  const watchedImageUrl = watch('primaryImageUrl');
  const watchedTitle = watch('title');
  const watchedDescription = watch('description');
  const watchedCategoryId = watch('categoryId');
  const watchedDifficulty = watch('difficulty');
  const watchedPrepTime = watch('prepTimeMinutes');
  const watchedCookTime = watch('cookTimeMinutes');
  const watchedServings = watch('servings');
  const watchedCalories = watch('calories');
  const watchedProtein = watch('protein');
  const watchedCarbs = watch('carbs');
  const watchedFat = watch('fat');
  const watchedInstructions = watch('instructions');
  const watchedIngredients = watch('ingredients');
  const watchedSteps = watch('steps');

  // Lấy danh mục từ backend
  useEffect(() => {
    let isMounted = true;
    categoryService
      .getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(data);
          setIsLoadingCategories(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingCategories(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Xử lý chọn nhiều tệp ảnh (Giải pháp 1: Multi-File Selection)
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploadError(null);
    const newItems: GalleryFileItem[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

    Array.from(selectedFiles).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`Tệp "${file.name}" vượt quá kích thước tối đa 5MB.`);
        return;
      }
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setUploadError(`Định dạng tệp "${file.name}" không hợp lệ. Hệ thống chỉ hỗ trợ JPEG, PNG, WebP hoặc AVIF.`);
        return;
      }
      const blobUrl = URL.createObjectURL(file);
      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl: blobUrl,
        isPrimary: false,
        name: file.name,
        size: file.size,
      });
    });

    if (newItems.length > 0) {
      setGalleryItems((prev) => {
        const hasExistingPrimary = prev.some((item) => item.isPrimary);
        if (!hasExistingPrimary && newItems.length > 0) {
          newItems[0].isPrimary = true;
          setValue('primaryImageUrl', newItems[0].previewUrl);
        }
        return [...prev, ...newItems];
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Đổi ảnh chính
  const handleSetPrimary = (id: string) => {
    setGalleryItems((prev) => {
      const updated = prev.map((item) => ({
        ...item,
        isPrimary: item.id === id,
      }));
      const primaryItem = updated.find((i) => i.id === id);
      if (primaryItem) {
        setValue('primaryImageUrl', primaryItem.previewUrl);
      }
      return updated;
    });
  };

  // Xóa ảnh khỏi gallery
  const handleRemoveItem = (id: string) => {
    setGalleryItems((prev) => {
      const target = prev.find((item) => item.id === id);
      const remaining = prev.filter((item) => item.id !== id);

      if (target?.isPrimary && remaining.length > 0) {
        remaining[0].isPrimary = true;
        setValue('primaryImageUrl', remaining[0].previewUrl);
      } else if (remaining.length === 0) {
        setValue('primaryImageUrl', '');
      }

      return remaining;
    });
  };

  // Thêm ảnh từ URL trực tiếp
  const handleAddFromUrl = (url: string, label = 'Ảnh từ URL') => {
    if (!url.trim()) return;
    const newItem: GalleryFileItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      previewUrl: url.trim(),
      isPrimary: false,
      name: label,
    };
    setGalleryItems((prev) => {
      const hasExistingPrimary = prev.some((item) => item.isPrimary);
      if (!hasExistingPrimary && prev.length === 0) {
        newItem.isPrimary = true;
        setValue('primaryImageUrl', newItem.previewUrl);
      }
      return [...prev, newItem];
    });
    setUrlInput('');
  };

  // Nút điền nhanh mẫu nguyên liệu và các bước làm
  const handleFillSampleStepsAndIngredients = () => {
    setValue('title', 'Phở Bò Hà Nội Truyền Thống');
    setValue(
      'description',
      'Món phở bò thơm ngon đậm đà phong vị Hà thành với nước dùng ninh từ xương ống hầm thảo mộc thơm lừng, thịt bò mềm ngọt và bánh phở dai mịn.'
    );
    setValue(
      'instructions',
      'Bí quyết nước dùng trong: Phải chần kỹ xương ống với gừng đập dập và muối trước khi ninh. Trong quá trình ninh không đậy nắp vung và vớt bọt liên tục. Thêm chút đường phèn và nước mắm ngon ở 15 phút cuối cùng để dậy mùi thanh nhẹ.'
    );
    setValue('prepTimeMinutes', 30);
    setValue('cookTimeMinutes', 120);
    setValue('servings', 4);
    setValue('difficulty', 2);
    setValue('calories', 450);
    setValue('protein', 28);
    setValue('carbs', 55);
    setValue('fat', 12);

    if (categories.length > 0) {
      setValue('categoryId', categories[0].id);
    }

    // Nạp nguyên liệu mẫu
    setValue('ingredients', [
      { name: 'Xương ống bò', quantity: 1, unit: 'kg', notes: 'Rửa sạch chặt khúc' },
      { name: 'Thịt bò phi lê hoặc nạm', quantity: 500, unit: 'g', notes: 'Thái lát thật mỏng' },
      { name: 'Bánh phở tươi', quantity: 800, unit: 'g', notes: 'Chần nước sôi trước khi dùng' },
      { name: 'Hành tây & Gừng', quantity: 2, unit: 'củ', notes: 'Nướng thơm cạo vỏ' },
      { name: 'Hoa hồi, quế, thảo quả', quantity: 1, unit: 'gói', notes: 'Rang thơm cho vào túi lọc' },
      { name: 'Hành hoa & ngò gai', quantity: 100, unit: 'g', notes: 'Rửa sạch thái nhỏ' },
    ]);

    // Nạp các bước làm mẫu
    setValue('steps', [
      {
        title: 'Bước 1: Sơ chế và ninh xương',
        description: 'Chần xương bò với nước sôi và muối trong 5 phút. Rửa lại nước lạnh rồi cho vào nồi lớn với 3 lít nước, ninh lửa nhỏ trong 2 giờ.',
        timerMinutes: 120,
      },
      {
        title: 'Bước 2: Chuẩn bị gia vị thảo mộc',
        description: 'Nướng thơm gừng và hành tây, rang hồi quế thảo quả rồi cho tất cả vào nồi nước dùng đang sôi lăn tăn.',
        timerMinutes: 15,
      },
      {
        title: 'Bước 3: Nêm nếm nước dùng',
        description: 'Nêm hạt nêm, muối hạt, đường phèn và chút nước mắm truyền thống cho vừa miệng.',
        timerMinutes: 10,
      },
      {
        title: 'Bước 4: Hoàn thiện và thưởng thức',
        description: 'Trần bánh phở xếp vào tô, xếp thịt bò tái/chín lên trên, rắc hành ngò rồi chan nước dùng thật sôi vào.',
        timerMinutes: 5,
      },
    ]);

    if (galleryItems.length === 0) {
      handleAddFromUrl(
        'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80',
        'Phở bò mẫu'
      );
    }
  };

  // Cuộn mượt đến các khối neo
  const scrollToAnchor = (id: string) => {
    setActiveAnchor(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const onValidationError = (formErrors: FieldErrors<RecipeFormData>) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstError = formErrors[errorKeys[0] as keyof RecipeFormData];
      setUploadError(
        firstError?.message
          ? String(firstError.message)
          : 'Vui lòng kiểm tra lại các trường thông tin bắt buộc còn thiếu.'
      );
      if (viewMode === 'preview') {
        setViewMode('edit');
      }
      scrollToAnchor('card-general');
    }
  };

  // Xử lý gửi biểu mẫu
  const executeFormSubmission = async (
    formData: RecipeFormData,
    target: 'draft' | 'publish' | 'archive' = 'draft'
  ) => {
    setUploadError(null);
    setSubmitTarget(target);
    let primaryUrl = formData.primaryImageUrl;
    const primaryItem = galleryItems.find((item) => item.isPrimary) || galleryItems[0];
    const secondaryFiles: File[] = galleryItems
      .filter((item) => !item.isPrimary && item.file instanceof File)
      .map((item) => item.file as File);

    // Nếu ảnh chính là File cục bộ mới tải lên -> Upload lên MinIO qua fileService
    if (primaryItem && primaryItem.file instanceof File) {
      setIsUploadingPrimary(true);
      try {
        const uploadRes = await fileService.uploadFile(primaryItem.file, 'recipes');
        if (uploadRes?.url) {
          primaryUrl = uploadRes.url;
          formData.primaryImageUrl = uploadRes.url;
        } else {
          throw new Error('Không nhận được đường dẫn hình ảnh từ hệ thống lưu trữ.');
        }
      } catch (err: unknown) {
        console.error('Lỗi khi tải ảnh chính lên MinIO:', err);
        setUploadError(
          err instanceof Error
            ? err.message
            : 'Không thể tải ảnh chính lên hệ thống lưu trữ MinIO. Vui lòng thử lại.'
        );
        setIsUploadingPrimary(false);
        return;
      } finally {
        setIsUploadingPrimary(false);
      }
    } else if (primaryItem) {
      primaryUrl = primaryItem.previewUrl;
      formData.primaryImageUrl = primaryItem.previewUrl;
    }

    await onSubmit(formData, secondaryFiles, target);
  };

  const triggerSubmitWithTarget = (target: 'draft' | 'publish' | 'archive') => {
    setSubmitTarget(target);
    handleSubmit(
      (data) => executeFormSubmission(data, target),
      onValidationError
    )();
  };

  // Tính toán điều kiện sẵn sàng xuất bản (SRS FR-RCP-005)
  const hasValidTitle = Boolean(watchedTitle && watchedTitle.trim().length >= 5);
  const selectedCategory = categories.find((c) => c.id === watchedCategoryId);
  const categoryDisplayName = selectedCategory?.name || 'Chưa chọn danh mục';

  const primaryGalleryItem = galleryItems.find((item) => item.isPrimary) || galleryItems[0];
  const effectiveHeroImage =
    selectedPreviewImage || primaryGalleryItem?.previewUrl || watchedImageUrl || '';

  const hasHeroImage = Boolean(effectiveHeroImage);
  const validIngredients = watchedIngredients?.filter((i) => i.name && i.name.trim().length > 0) || [];
  const hasValidIngredients = validIngredients.length > 0;
  const validSteps = watchedSteps?.filter((s) => s.description && s.description.trim().length > 0) || [];
  const hasValidSteps = validSteps.length > 0;

  const canPublish = hasValidTitle && hasValidIngredients && hasValidSteps;

  const hasNutrition = Boolean(
    (watchedCalories && watchedCalories > 0) ||
      (watchedProtein && watchedProtein > 0) ||
      (watchedCarbs && watchedCarbs > 0) ||
      (watchedFat && watchedFat > 0)
  );

  // Mở xem chi tiết ở một trang mới hoàn chỉnh độc lập (/recipes/preview)
  const handleOpenNewPagePreview = () => {
    try {
      const previewData = {
        title: watchedTitle?.trim() || 'Tiêu đề công thức món ăn',
        description: watchedDescription?.trim() || '',
        instructions: watchedInstructions?.trim() || '',
        prepTimeMinutes: watchedPrepTime || 0,
        cookTimeMinutes: watchedCookTime || 0,
        servings: watchedServings || 1,
        difficulty: watchedDifficulty || 1,
        categoryName: categoryDisplayName,
        categoryId: watchedCategoryId,
        images: galleryItems.map((item, idx) => ({
          id: item.id,
          originalUrl: item.previewUrl,
          isPrimary: item.isPrimary,
          orderIndex: idx,
          altText: item.name || watchedTitle,
        })),
        ingredients: validIngredients,
        steps: validSteps,
        nutrition: {
          calories: watchedCalories || 0,
          protein: watchedProtein || 0,
          carbohydrates: watchedCarbs || 0,
          fat: watchedFat || 0,
        },
      };
      localStorage.setItem('culinary_recipe_preview_draft', JSON.stringify(previewData));
      window.open('/recipes/preview', '_blank');
    } catch (err) {
      console.error('Không thể mở trang xem trước mới:', err);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-8"
    >
      {/* Thông báo lỗi server (nếu có) */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-red-900">Không thể {isEdit ? 'cập nhật' : 'tạo'} công thức</h4>
            <p className="mt-0.5 leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* Thông báo lỗi upload ảnh */}
      {uploadError && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-amber-900">Lưu ý khi tải hình ảnh</h4>
            <p className="mt-0.5 leading-relaxed">{uploadError}</p>
          </div>
        </div>
      )}

      {/* =========================================================================
          CHẾ ĐỘ 1: XEM TRƯỚC BÀI VIẾT TOÀN CẢNH TRONG DASHBOARD (VIEWMODE = PREVIEW)
          ========================================================================= */}
      {viewMode === 'preview' ? (
        <div className="space-y-6 animate-fade-in">
          {/* Thanh Header Điều khiển Xem trước & Các nút quyết định xuất bản / lưu trữ */}
          <div className="sticky top-2 z-30 rounded-3xl border border-gray-200 bg-white/95 backdrop-blur-md p-4 sm:p-6 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                    <Eye className="w-4 h-4" />
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    Xem trước bài viết trong Bảng điều khiển
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    <Sparkles className="w-3 h-3" />
                    <span>Mô phỏng 100% ngoài thực tế</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Kiểm tra toàn cảnh bài viết. Khi đã thấy ưng ý, bạn có thể chọn Đăng bài, Lưu nháp hoặc Lưu trữ ngay tại đây.
                </p>
              </div>

              {/* Nút quay lại chế độ soạn thảo */}
              <button
                type="button"
                onClick={() => {
                  setViewMode('edit');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition shrink-0 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại chỉnh sửa</span>
              </button>
            </div>

            {/* Cụm nút hành động quyết định */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs">
                {canPublish ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Đủ điều kiện xuất bản (SRS §FR-RCP-005)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Cần tối thiểu 1 nguyên liệu và 1 bước làm để xuất bản</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Nút Lưu bản nháp */}
                <button
                  type="button"
                  onClick={() => triggerSubmitWithTarget('draft')}
                  disabled={isSubmitting || isUploadingPrimary}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition shadow-2xs active:scale-95 disabled:opacity-50"
                  title="Lưu lại bản nháp để tiếp tục chỉnh sửa sau"
                >
                  {isSubmitting && submitTarget === 'draft' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-gray-500" />
                  )}
                  <span>Lưu bản nháp</span>
                </button>

                {/* 2. Nút Lưu trữ */}
                <button
                  type="button"
                  onClick={() => triggerSubmitWithTarget('archive')}
                  disabled={isSubmitting || isUploadingPrimary}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition shadow-2xs active:scale-95 disabled:opacity-50"
                  title="Tạm ẩn và lưu trữ công thức"
                >
                  {isSubmitting && submitTarget === 'archive' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Archive className="w-3.5 h-3.5 text-gray-500" />
                  )}
                  <span>Lưu trữ</span>
                </button>

                {/* 3. Nút Xuất bản công khai ngay */}
                <button
                  type="button"
                  onClick={() => triggerSubmitWithTarget('publish')}
                  disabled={!canPublish || isSubmitting || isUploadingPrimary}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition active:scale-95 disabled:opacity-50 ${
                    canPublish
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  title={
                    canPublish
                      ? 'Đăng bài viết công khai ngay'
                      : 'Cần có tối thiểu 1 nguyên liệu và 1 bước làm để xuất bản'
                  }
                >
                  {isSubmitting && submitTarget === 'publish' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xuất bản...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Đăng bài (Xuất bản)</span>
                    </>
                  )}
                </button>

                {/* 4. Nút Mở ở tab mới (nếu muốn xem riêng biệt) */}
                <button
                  type="button"
                  onClick={handleOpenNewPagePreview}
                  className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200 transition shadow-2xs"
                  title="Mở xem ở một tab trình duyệt mới độc lập (/recipes/preview)"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tab mới ↗</span>
                </button>
              </div>
            </div>
          </div>

          {/* Khung mô phỏng chi tiết bài báo thực tế (Live Article Preview) */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
            {/* Header bài viết */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                  <Tag className="h-3.5 w-3.5" />
                  {categoryDisplayName}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    difficultyLabels[watchedDifficulty || 1]?.color || ''
                  }`}
                >
                  Độ khó: {difficultyLabels[watchedDifficulty || 1]?.label || 'Dễ'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-700">
                  <Eye className="w-3.5 h-3.5" />
                  Chế độ xem trước Dashboard
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                {watchedTitle?.trim() || 'Tiêu đề công thức món ăn của bạn'}
              </h1>

              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                {watchedDescription?.trim() || 'Chưa nhập mô tả ngắn cho bài viết...'}
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

            {/* Khung Ảnh đại diện & Gallery Thumbnail */}
            <div className="space-y-3">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100">
                {effectiveHeroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveMediaUrl(effectiveHeroImage)}
                    alt={watchedTitle || 'Ảnh món ăn'}
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
              {galleryItems.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  <span className="text-[11px] font-bold text-gray-400 mr-1 shrink-0">
                    Album ({galleryItems.length}):
                  </span>
                  {galleryItems.map((img) => {
                    const isSelected = effectiveHeroImage === img.previewUrl;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setSelectedPreviewImage(img.previewUrl)}
                        className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-orange-500 scale-95 shadow-sm ring-2 ring-orange-200'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={img.name || 'Ảnh món ăn'}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveMediaUrl(img.previewUrl)}
                          alt={img.name || 'Ảnh món ăn'}
                          className="h-full w-full object-cover"
                        />
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
                  <p className="text-sm font-bold text-gray-900">{watchedPrepTime || 0} phút</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Utensils className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Thời gian nấu</p>
                  <p className="text-sm font-bold text-gray-900">{watchedCookTime || 0} phút</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Tổng thời gian</p>
                  <p className="text-sm font-bold text-gray-900">
                    {(Number(watchedPrepTime) || 0) + (Number(watchedCookTime) || 0)} phút
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Khẩu phần</p>
                  <p className="text-sm font-bold text-gray-900">{watchedServings || 1} người</p>
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
                      {watchedCalories || 0} kcal
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span>Chất đạm</span>
                    </div>
                    <p className="text-base font-black text-blue-950 mt-1">
                      {watchedProtein || 0} g
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                      <Wheat className="w-3.5 h-3.5" />
                      <span>Tinh bột</span>
                    </div>
                    <p className="text-base font-black text-amber-950 mt-1">
                      {watchedCarbs || 0} g
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Chất béo</span>
                    </div>
                    <p className="text-base font-black text-emerald-950 mt-1">
                      {watchedFat || 0} g
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
                  <span className="text-[11px] font-bold text-gray-500">
                    {validIngredients.length} món
                  </span>
                </div>

                {validIngredients.length === 0 ? (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-xs text-gray-400 italic">Chưa có nguyên liệu nào.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('edit');
                        scrollToAnchor('card-ingredients');
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      + Thêm nguyên liệu ngay
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2.5 text-xs">
                    {validIngredients.map((item, idx) => (
                      <li
                        key={`preview-ing-${idx}`}
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
                    <span className="text-[11px] font-bold text-gray-500">
                      {validSteps.length} bước
                    </span>
                  </div>

                  {validSteps.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-xs text-gray-400 italic">Chưa có bước thực hiện nào.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode('edit');
                          scrollToAnchor('card-steps');
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        + Thêm bước thực hiện ngay
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {validSteps.map((step, idx) => (
                        <div
                          key={`preview-step-${idx}`}
                          className="flex items-start gap-3.5 p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-2xs">
                            {idx + 1}
                          </span>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <h5 className="text-xs font-bold text-gray-900">
                                {step.title || `Bước ${idx + 1}`}
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bí quyết & Lưu ý của tác giả nếu có */}
                {watchedInstructions?.trim() && (
                  <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4.5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>Bí quyết & Lưu ý từ tác giả</span>
                    </div>
                    <p className="text-xs text-amber-800/90 leading-relaxed whitespace-pre-line">
                      {watchedInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cụm nút hành động dưới cùng */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-gray-200 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setViewMode('edit');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại chỉnh sửa</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => triggerSubmitWithTarget('draft')}
                disabled={isSubmitting || isUploadingPrimary}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition shadow-2xs active:scale-95 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-gray-500" />
                <span>Lưu bản nháp</span>
              </button>

              <button
                type="button"
                onClick={() => triggerSubmitWithTarget('archive')}
                disabled={isSubmitting || isUploadingPrimary}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition shadow-2xs active:scale-95 disabled:opacity-50"
              >
                <Archive className="w-3.5 h-3.5 text-gray-500" />
                <span>Lưu trữ</span>
              </button>

              <button
                type="button"
                onClick={() => triggerSubmitWithTarget('publish')}
                disabled={!canPublish || isSubmitting || isUploadingPrimary}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition active:scale-95 disabled:opacity-50 ${
                  canPublish
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Đăng bài (Xuất bản)</span>
              </button>

              <button
                type="button"
                onClick={handleOpenNewPagePreview}
                className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 border border-purple-200 transition shadow-2xs"
                title="Mở xem ở một tab trình duyệt mới độc lập"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Tab mới ↗</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            CHẾ ĐỘ 2: SOẠN THẢO BỐ CỤC 2 CỘT + THẺ XEM TRƯỚC BÊN DƯỚI (VIEWMODE = EDIT)
            ========================================================================= */
        <div className="space-y-8 animate-fade-in">
          {/* Thanh gợi ý điền nhanh khi tạo bài mới */}
          {!isEdit && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-orange-200/80 bg-orange-50/50 px-5 py-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2 text-orange-950 font-medium">
                <Sparkles className="h-4 w-4 text-orange-600 shrink-0" />
                <span>Bạn muốn thử nghiệm nhanh bố cục? Hãy bấm nút điền dữ liệu mẫu đầy đủ:</span>
              </div>
              <button
                type="button"
                onClick={handleFillSampleStepsAndIngredients}
                className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition shrink-0 active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Điền mẫu hoàn chỉnh</span>
              </button>
            </div>
          )}

          {/* Thanh điều hướng nhanh các mục (Smooth Anchor Pills) */}
          <div className="sticky top-4 z-20 flex items-center justify-between gap-2 overflow-x-auto rounded-2xl bg-white/95 backdrop-blur-md p-2 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => scrollToAnchor('card-general')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeAnchor === 'card-general'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>1. Thông tin & Ảnh ({galleryItems.length})</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToAnchor('card-ingredients')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeAnchor === 'card-ingredients'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>2. Nguyên liệu ({ingredientFields.length})</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToAnchor('card-steps')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeAnchor === 'card-steps'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>3. Các bước làm ({stepFields.length})</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToAnchor('card-preview')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeAnchor === 'card-preview'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>4. Thẻ xem trước</span>
              </button>
            </div>

            {/* Nút Xem trước chi tiết bài viết ngay trong Dashboard */}
            <button
              type="button"
              onClick={() => {
                setViewMode('preview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition shrink-0 shadow-2xs active:scale-95"
              title="Xem trước bài viết đầy đủ trong Bảng điều khiển"
            >
              <Eye className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden sm:inline">Xem trước bài viết</span>
              <span className="sm:hidden">Xem trước</span>
            </button>
          </div>

          {/* BỐ CỤC 2 CỘT: CỘT SOẠN THẢO (70%) + CỘT TRẠNG THÁI STICKY (30%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CỘT TRÁI (LỚN): CÁC KHỐI NHẬP LIỆU CHÍNH */}
            <div className="lg:col-span-8 space-y-8">
              {/* KHỐI 1: THÔNG TIN CÔNG THỨC & LƯỚI ẢNH GIẢI PHÁP 1 */}
              <div
                id="card-general"
                className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                      Thông tin công thức
                    </h3>
                    <p className="text-xs text-gray-400">
                      Ảnh món ăn đại diện, phân loại danh mục, thời gian và thông tin cốt lõi
                    </p>
                  </div>
                </div>

                {/* Bố cục bên trong: Cột Trái là Lưới ảnh (Giải pháp 1), Cột Phải là Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* LƯỚI ẢNH THÔNG MINH (GIẢI PHÁP 1) */}
                  <div className="md:col-span-5 space-y-3">
                    <label className="block text-xs font-bold text-gray-700">
                      Ảnh món ăn & Thư viện <span className="text-red-500">*</span>
                    </label>

                    {/* 1. KHUNG ẢNH CHÍNH (PRIMARY COVER) */}
                    <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-orange-400 transition-all bg-gray-50 aspect-4/3 flex flex-col items-center justify-center text-center p-4">
                      {effectiveHeroImage ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveMediaUrl(effectiveHeroImage)}
                            alt={watchedTitle || 'Ảnh món ăn'}
                            className="w-full h-full object-cover rounded-xl"
                          />
                          {/* Huy hiệu ảnh bìa chính */}
                          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-600 text-white shadow-md">
                            <Star className="w-3 h-3 fill-white" />
                            Ảnh đại diện chính
                          </span>

                          {/* Lớp phủ hành động khi hover */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-xl bg-white text-gray-900 text-xs font-bold shadow hover:bg-orange-50 hover:text-orange-600 transition"
                            >
                              Đổi ảnh khác
                            </button>
                            {primaryGalleryItem && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(primaryGalleryItem.id)}
                                className="p-1.5 rounded-xl bg-red-600 text-white shadow hover:bg-red-700 transition"
                                title="Xóa ảnh này"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2.5 flex flex-col items-center">
                          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">Tải ảnh món ăn lên</p>
                            <p className="text-[11px] text-gray-400">JPG, PNG, WebP (tối đa 5MB)</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition shadow-xs active:scale-95"
                          >
                            Chọn ảnh
                          </button>
                        </div>
                      )}

                      {/* Input file hỗ trợ MULTIPLE cho Giải pháp 1 */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleMultipleFilesChange}
                        className="hidden"
                      />
                    </div>

                    {/* 2. DẢI ẢNH PHỤ (SECONDARY THUMBNAILS STRIP) - GIẢI PHÁP 1 */}
                    {galleryItems.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                          <span>Đã chọn ({galleryItems.length} ảnh):</span>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-orange-600 hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Thêm ảnh khác
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {galleryItems.map((item) => (
                            <div
                              key={item.id}
                              className={`relative group rounded-xl overflow-hidden border-2 aspect-square bg-gray-100 cursor-pointer transition ${
                                item.isPrimary
                                  ? 'border-orange-500 ring-2 ring-orange-200'
                                  : 'border-transparent hover:border-gray-300'
                              }`}
                              onClick={() => handleSetPrimary(item.id)}
                              title={item.isPrimary ? 'Ảnh đại diện chính' : 'Bấm để chọn làm ảnh chính'}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={resolveMediaUrl(item.previewUrl)}
                                alt={item.name || 'Ảnh món ăn'}
                                className="w-full h-full object-cover"
                              />
                              {item.isPrimary && (
                                <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold shadow">
                                  ★
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(item.id);
                                }}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                                title="Xóa ảnh"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab chuyển cách nhập ảnh: Tải lên hoặc Dán URL */}
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Hoặc dán URL hình ảnh:</span>
                        <button
                          type="button"
                          onClick={() =>
                            setImageInputMode(imageInputMode === 'upload' ? 'url' : 'upload')
                          }
                          className="text-blue-600 font-bold hover:underline"
                        >
                          {imageInputMode === 'upload' ? '+ Dán link URL' : 'Thu gọn'}
                        </button>
                      </div>

                      {imageInputMode === 'url' && (
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/anh-mon-an.jpg"
                            className="flex-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddFromUrl(urlInput)}
                            className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition shrink-0"
                          >
                            Thêm
                          </button>
                        </div>
                      )}

                      {/* Ảnh gợi ý nhanh */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-gray-400">Ảnh gợi ý:</span>
                        {sampleImages.map((s) => (
                          <button
                            key={s.label}
                            type="button"
                            onClick={() => handleAddFromUrl(s.url, s.label)}
                            className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-[10px] text-gray-600 font-medium transition"
                          >
                            + {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FORM FIELDS BÊN PHẢI (CỘT 7/12) */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Tên công thức */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        Tên công thức <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('title')}
                        disabled={isSubmitting}
                        placeholder="VD: Phở bò Hà Nội, Bánh mì chảo, Canh chua cá lóc..."
                        className="w-full rounded-2xl border border-gray-200 p-3.5 text-xs sm:text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                      {errors.title && (
                        <p className="text-[11px] font-semibold text-red-600">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Danh mục & Khẩu phần */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-700">
                          Danh mục món ăn <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register('categoryId')}
                          disabled={isSubmitting || isLoadingCategories}
                          className="w-full rounded-2xl border border-gray-200 p-3 text-xs font-medium outline-none transition focus:border-orange-500 bg-white"
                        >
                          <option value="">-- Chọn danh mục --</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        {errors.categoryId && (
                          <p className="text-[11px] font-semibold text-red-600">
                            {errors.categoryId.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-700">
                          Độ khó chế biến
                        </label>
                        <select
                          {...register('difficulty', { valueAsNumber: true })}
                          disabled={isSubmitting}
                          className="w-full rounded-2xl border border-gray-200 p-3 text-xs font-medium outline-none transition focus:border-orange-500 bg-white"
                        >
                          <option value={1}>Dễ (Người mới bắt đầu)</option>
                          <option value={2}>Trung bình (Bữa cơm gia đình)</option>
                          <option value={3}>Khó (Cần kỹ thuật nêm nếm)</option>
                          <option value={4}>Chuyên gia (Đầu bếp chuyên nghiệp)</option>
                        </select>
                      </div>
                    </div>

                    {/* Thời gian chuẩn bị & Thời gian nấu & Khẩu phần */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-gray-600">
                          Chuẩn bị (phút)
                        </label>
                        <div className="relative">
                          <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            {...register('prepTimeMinutes', { valueAsNumber: true })}
                            disabled={isSubmitting}
                            min="0"
                            placeholder="15"
                            className="w-full rounded-xl border border-gray-200 py-2 pl-8 pr-2 text-xs outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-gray-600">
                          Nấu chín (phút)
                        </label>
                        <div className="relative">
                          <Clock className="w-3.5 h-3.5 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            {...register('cookTimeMinutes', { valueAsNumber: true })}
                            disabled={isSubmitting}
                            min="0"
                            placeholder="30"
                            className="w-full rounded-xl border border-gray-200 py-2 pl-8 pr-2 text-xs outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-gray-600">
                          Khẩu phần (người)
                        </label>
                        <div className="relative">
                          <Users className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            {...register('servings', { valueAsNumber: true })}
                            disabled={isSubmitting}
                            min="1"
                            placeholder="4"
                            className="w-full rounded-xl border border-gray-200 py-2 pl-8 pr-2 text-xs outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mô tả ngắn */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        Mô tả ngắn gọn về món ăn <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        {...register('description')}
                        disabled={isSubmitting}
                        placeholder="Mô tả hương vị, nguồn gốc hoặc cảm xúc khi thưởng thức món ăn này..."
                        className="w-full rounded-2xl border border-gray-200 p-3.5 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 leading-relaxed"
                      />
                      {errors.description && (
                        <p className="text-[11px] font-semibold text-red-600">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* KHỐI 2: DANH SÁCH NGUYÊN LIỆU (SRS §FR-RCP-003) */}
              <div
                id="card-ingredients"
                className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                          Nguyên liệu cần chuẩn bị
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ingredientFields.length} món
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Ghi rõ định lượng và đơn vị giúp người đọc dễ dàng chuẩn bị nguyên liệu
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => appendIngredient({ name: '', quantity: null, unit: '', notes: '' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-xs active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm nguyên liệu</span>
                  </button>
                </div>

                {/* Danh sách các trường nguyên liệu */}
                <div className="space-y-3">
                  {ingredientFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition"
                    >
                      <span className="w-6 text-center text-xs font-bold text-gray-400 shrink-0">
                        #{idx + 1}
                      </span>

                      {/* Tên nguyên liệu */}
                      <div className="flex-1 sm:max-w-xs">
                        <input
                          type="text"
                          {...register(`ingredients.${idx}.name`)}
                          placeholder="Tên nguyên liệu (VD: Thịt thăn bò)"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Định lượng */}
                      <div className="w-24">
                        <input
                          type="number"
                          step="any"
                          {...register(`ingredients.${idx}.quantity`, { valueAsNumber: true })}
                          placeholder="Số lượng"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Đơn vị */}
                      <div className="w-24">
                        <input
                          type="text"
                          {...register(`ingredients.${idx}.unit`)}
                          placeholder="Đơn vị (g, muỗng)"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Ghi chú */}
                      <div className="flex-1 sm:max-w-xs">
                        <input
                          type="text"
                          {...register(`ingredients.${idx}.notes`)}
                          placeholder="Ghi chú (thái mỏng, băm nhỏ...)"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Nút xóa */}
                      {ingredientFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
                          title="Xóa nguyên liệu này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Gợi ý thêm nhanh */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                  <span className="font-semibold text-gray-400 mr-1">Gợi ý nhanh:</span>
                  {['Hành tím', 'Tỏi băm', 'Nước mắm', 'Hạt nêm', 'Tiêu xay', 'Dầu ăn'].map((ing) => (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => appendIngredient({ name: ing, quantity: 1, unit: 'muỗng', notes: '' })}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-[11px] font-semibold text-gray-700 transition"
                    >
                      + {ing}
                    </button>
                  ))}
                </div>
              </div>

              {/* KHỐI 3: CÁC BƯỚC THỰC HIỆN CÓ HẸN GIỜ (SRS §FR-RCP-004) */}
              <div
                id="card-steps"
                className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                          Các bước thực hiện
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {stepFields.length} bước nấu
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Hướng dẫn rõ ràng kèm đồng hồ đếm ngược giúp người nấu làm theo dễ dàng
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      appendStep({
                        title: `Bước ${stepFields.length + 1}: `,
                        description: '',
                        timerMinutes: null,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-xs active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm bước</span>
                  </button>
                </div>

                {/* Danh sách các bước làm */}
                <div className="space-y-4">
                  {stepFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="rounded-2xl border border-gray-200/80 bg-gray-50/50 p-4 sm:p-5 space-y-3 relative group hover:border-gray-300 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-black shadow-xs">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            {...register(`steps.${idx}.title`)}
                            placeholder={`Tiêu đề bước ${idx + 1} (VD: Sơ chế rau củ...)`}
                            className="font-bold text-sm text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-gray-400 placeholder:font-normal"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => moveStep(idx, idx - 1)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
                              title="Chuyển lên trên"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {idx < stepFields.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveStep(idx, idx + 1)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
                              title="Chuyển xuống dưới"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {stepFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStep(idx)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Xóa bước này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Nội dung chi tiết bước */}
                      <textarea
                        rows={2}
                        {...register(`steps.${idx}.description`)}
                        placeholder="Mô tả chi tiết những gì cần làm trong bước này..."
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                      {/* Bộ đếm thời gian (Timer) */}
                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-3 py-1.5 text-xs text-gray-600">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold text-gray-700">Hẹn giờ (Timer):</span>
                          <input
                            type="number"
                            {...register(`steps.${idx}.timerMinutes`, { valueAsNumber: true })}
                            placeholder="0"
                            min="0"
                            className="w-12 text-center font-bold text-gray-900 border-b border-gray-300 outline-none p-0 focus:border-blue-600"
                          />
                          <span className="text-gray-400 text-[11px]">phút</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KHỐI 4: MÔ TẢ CHI TIẾT & MẸO NẤU (INSTRUCTIONS) */}
              <div
                id="card-instructions"
                className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                        Mô tả chi tiết & Mẹo nấu gia truyền
                      </h3>
                      <p className="text-xs text-gray-400">
                        Chia sẻ các lưu ý về lửa, cách chọn nguyên liệu tươi hoặc mẹo nêm nếm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={4}
                    {...register('instructions')}
                    disabled={isSubmitting}
                    placeholder="Nhập hướng dẫn chi tiết cách nấu, mẹo chọn nguyên liệu hoặc lưu ý khi bảo quản..."
                    className="w-full rounded-2xl border border-gray-200 p-4 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 leading-relaxed font-sans"
                  />
                  <div className="flex justify-end text-[11px] text-gray-400">
                    <span>{(watchedInstructions?.length || 0)}/2000 ký tự</span>
                  </div>
                </div>
              </div>

              {/* KHỐI 5: THÔNG TIN DINH DƯỠNG (TUỲ CHỌN - ACCORDION) */}
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
                <button
                  type="button"
                  onClick={() => setIsNutritionOpen(!isNutritionOpen)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900">
                        Giá trị dinh dưỡng trên mỗi khẩu phần (Tuỳ chọn)
                      </h4>
                      <p className="text-[11px] text-gray-400">Calo, Protein, Carbs, Chất béo</p>
                    </div>
                  </div>
                  <div className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                    {isNutritionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isNutritionOpen && (
                  <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in border-t border-gray-100 mt-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" /> Calo (kcal)
                      </label>
                      <input
                        type="number"
                        {...register('calories', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                        <Dumbbell className="w-3 h-3 text-blue-500" /> Đạm / Protein (g)
                      </label>
                      <input
                        type="number"
                        {...register('protein', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                        <Wheat className="w-3 h-3 text-amber-500" /> Tinh bột / Carbs (g)
                      </label>
                      <input
                        type="number"
                        {...register('carbs', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-rose-500" /> Chất béo / Fat (g)
                      </label>
                      <input
                        type="number"
                        {...register('fat', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CỘT PHẢI (STICKY): BẢNG TRẠNG THÁI CÔNG THỨC & NÚT HÀNH ĐỘNG */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
              {/* CARD TRẠNG THÁI CÔNG THỨC */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-gray-900 font-black text-sm">
                  <Send className="w-4 h-4 text-orange-600 rotate-45" />
                  <span>Trạng thái công thức</span>
                </div>

                {/* Stepper 3 trạng thái chuẩn SRS */}
                <div className="space-y-4">
                  {/* Nấc 1: Bản nháp */}
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-orange-50/60 border border-orange-200/60">
                    <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-orange-950">Bản nháp (Draft)</h4>
                      <p className="text-[11px] text-orange-800/80 mt-0.5">
                        Lưu lại để tiếp tục chỉnh sửa sau, chỉ mình bạn thấy.
                      </p>
                    </div>
                  </div>

                  {/* Nấc 2: Xuất bản */}
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/70 border border-gray-200/70">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Xuất bản (Published)</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Công khai cho cộng đồng Culinary Blog đón đọc và lưu lại.
                      </p>
                    </div>
                  </div>

                  {/* Nấc 3: Lưu trữ */}
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/70 border border-gray-200/70">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Lưu trữ (Archived)</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Tạm ẩn công thức khỏi trang công khai khi chưa dùng tới.
                      </p>
                    </div>
                  </div>
                </div>

                {/* BẢNG KIỂM TRA ĐIỀU KIỆN XUẤT BẢN (SRS §FR-RCP-005) */}
                <div className="rounded-2xl bg-gray-50 p-4 space-y-2.5 text-xs">
                  <h5 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
                    Điều kiện xuất bản công khai:
                  </h5>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {hasValidTitle ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={hasValidTitle ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        Tiêu đề & Danh mục hợp lệ
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasValidIngredients ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={hasValidIngredients ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        Tối thiểu 1 nguyên liệu ({validIngredients.length})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasValidSteps ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={hasValidSteps ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        Tối thiểu 1 bước thực hiện ({validSteps.length})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasHeroImage ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={hasHeroImage ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        Ảnh món ăn đại diện ({galleryItems.length} ảnh)
                      </span>
                    </div>
                  </div>
                </div>

                {/* CỤM NÚT HÀNH ĐỘNG CHÍNH */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => triggerSubmitWithTarget('publish')}
                    disabled={isSubmitting || isUploadingPrimary}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting && submitTarget === 'publish' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Xuất bản công khai ngay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerSubmitWithTarget('draft')}
                    disabled={isSubmitting || isUploadingPrimary}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting && submitTarget === 'draft' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 text-gray-500" />
                    )}
                    <span>Lưu bản nháp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerSubmitWithTarget('archive')}
                    disabled={isSubmitting || isUploadingPrimary}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition active:scale-95 disabled:opacity-50"
                    title="Chuyển vào kho lưu trữ"
                  >
                    {isSubmitting && submitTarget === 'archive' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Archive className="w-4 h-4 text-gray-500" />
                    )}
                    <span>Lưu trữ</span>
                  </button>
                </div>
              </div>

              {/* CARD MẸO NHỎ CHO TÁC GIẢ */}
              <div className="rounded-3xl border border-amber-200/70 bg-amber-50/40 p-5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Mẹo viết bài thu hút:</span>
                </div>
                <p className="text-amber-800/90 leading-relaxed text-[11px]">
                  Ảnh bìa sáng rõ, các bước nấu có thời gian hẹn giờ cụ thể sẽ giúp công thức của bạn nhận được nhiều lượt tim và xuất hiện ở mục tiêu điểm trang chủ!
                </p>
              </div>
            </div>
          </div>

          {/* KHỐI DƯỚI CÙNG: XEM TRƯỚC THEO THỜI GIAN THỰC (LIVE PREVIEW CARD) */}
          <div
            id="card-preview"
            className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-gray-900 font-black text-sm">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-600" />
                <span>Xem trước bài viết trên trang chủ (Live Preview)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('preview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition shadow-2xs"
                  title="Xem toàn cảnh bài viết ngay trong Dashboard"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem chi tiết trong Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenNewPagePreview}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition shadow-2xs"
                  title="Mở xem chi tiết bài viết ở một tab mới độc lập (/recipes/preview)"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở tab mới ↗</span>
                </button>
              </div>
            </div>

            {/* Horizontal Recipe Card chuẩn Mockup */}
            <div className="rounded-2xl border border-gray-200/80 overflow-hidden bg-white hover:border-gray-300 transition flex flex-col md:flex-row items-stretch">
              {/* Cột ảnh đại diện */}
              <div className="md:w-80 h-52 md:h-auto relative bg-gray-100 shrink-0">
                {effectiveHeroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveMediaUrl(effectiveHeroImage)}
                    alt={watchedTitle || 'Preview'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                    <ImageIcon className="w-8 h-8 mb-1 text-gray-300" />
                    <span className="text-xs">Chưa có ảnh món ăn</span>
                  </div>
                )}

                {/* Dải ảnh nhỏ bên dưới preview nếu có nhiều ảnh */}
                {galleryItems.length > 1 && (
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 p-1 rounded-xl bg-black/40 backdrop-blur-xs">
                    {galleryItems.slice(0, 5).map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedPreviewImage(item.previewUrl)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          effectiveHeroImage === item.previewUrl
                            ? 'w-4 bg-orange-500'
                            : 'bg-white/80 hover:bg-white'
                        }`}
                        title={`Xem ảnh ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Cột nội dung tóm tắt */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-snug">
                      {watchedTitle?.trim() || 'Tên công thức sẽ hiển thị ở đây'}
                    </h4>
                    <button
                      type="button"
                      className="p-1.5 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition shrink-0"
                      title="Yêu thích món ăn"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {watchedDescription?.trim() ||
                      'Mô tả ngắn về món ăn sẽ xuất hiện tại đây, giúp người dùng hiểu nhanh nội dung công thức.'}
                  </p>
                </div>

                {/* Thông số & Nút hành động */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{(watchedPrepTime || 0) + (watchedCookTime || 0)} phút</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-gray-400" />
                      <span>{difficultyLabels[watchedDifficulty || 1]?.label || 'Dễ'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>{watchedServings || 1} người</span>
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-semibold">
                      {categoryDisplayName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Nút Xem chi tiết bài viết ngay trong Dashboard */}
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('preview');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50/80 hover:bg-orange-100/80 border border-orange-200 hover:border-orange-300 px-3.5 py-1.5 rounded-xl transition shadow-2xs active:scale-95"
                      title="Xem trước bài viết đầy đủ trong Bảng điều khiển"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem chi tiết →</span>
                    </button>

                    {/* Nút Mở ở tab mới */}
                    <button
                      type="button"
                      onClick={handleOpenNewPagePreview}
                      className="p-1.5 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition border border-transparent hover:border-purple-200"
                      title="Mở xem ở một tab trình duyệt mới độc lập"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
