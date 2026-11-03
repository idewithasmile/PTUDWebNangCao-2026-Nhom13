'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipeFormSchema, type RecipeFormData } from '@/features/recipes/schemas';
import { categoryService } from '@/lib/services/category-service';
import { fileService } from '@/lib/services/file-service';
import { resolveMediaUrl } from '@/lib/utils';
import type { CategoryDto } from '@/lib/types/category';
import RecipeGalleryViewer from '@/components/recipes/RecipeGalleryViewer';
import RecipeIngredientsList from '@/components/recipes/RecipeIngredientsList';
import RecipeStepsList from '@/components/recipes/RecipeStepsList';
import RecipeNutritionCard from '@/components/recipes/RecipeNutritionCard';
import type {
  RecipeImageDto,
  RecipeIngredientDto,
  RecipeStepDto,
  RecipeNutritionDto,
} from '@/lib/types/recipe';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
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
  Dumbbell,
  Wheat,
  Droplets,
  Lightbulb,
  Check,
  Tag,
  UtensilsCrossed,
  Calendar,
  User,
} from 'lucide-react';

export interface GalleryFileItem {
  id: string;
  file?: File;
  previewUrl: string;
  isPrimary: boolean;
  name: string;
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
    targetStatus?: 'draft' | 'publish'
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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewModalActiveImage, setPreviewModalActiveImage] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
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
      isPrimary: galleryItems.length === 0,
      name: label,
    };
    setGalleryItems((prev) => {
      const updated = [...prev, newItem];
      if (newItem.isPrimary) {
        setValue('primaryImageUrl', url.trim());
      }
      return updated;
    });
    setUrlInput('');
  };

  // Điền dữ liệu mẫu nhanh để kiểm thử
  const handleFillSampleStepsAndIngredients = () => {
    setValue('title', 'Phở bò tái chín Hà Nội truyền thống');
    setValue(
      'description',
      'Món phở bò gia truyền với nước dùng hầm xương ngọt thanh, thơm hương quế hồi thảo quả và bánh phở dai mềm đặc trưng xứ kinh kỳ.'
    );
    if (categories.length > 0) {
      setValue('categoryId', categories[0].id);
    }
    setValue('prepTimeMinutes', 30);
    setValue('cookTimeMinutes', 180);
    setValue('servings', 4);
    setValue('difficulty', 2);
    setValue('calories', 450);
    setValue('protein', 28);
    setValue('carbs', 55);
    setValue('fat', 12);
    setValue(
      'instructions',
      'Bí quyết: Nướng gừng, hành tím cho xém thơm rồi rửa sạch trước khi bỏ vào hầm xương. Luôn hớt bọt liên tục ở lửa nhỏ để nước dùng trong vắt.'
    );

    setValue('ingredients', [
      { name: 'Xương ống bò tươi', quantity: 1000, unit: 'gam', notes: 'Rửa sạch, chần nước sôi' },
      { name: 'Bánh phở tươi', quantity: 500, unit: 'gam', notes: 'Trụng qua nước sôi' },
      { name: 'Thịt bò thăn / bắp bò', quantity: 300, unit: 'gam', notes: 'Thái lát mỏng' },
      { name: 'Hành hoa, ngò gai, chanh ớt', quantity: 1, unit: 'bó', notes: 'Rửa sạch thái nhỏ' },
    ]);

    setValue('steps', [
      {
        title: 'Bước 1: Sơ chế và ninh nước dùng',
        description: 'Chần xương bò trong nước sôi có gừng đập dập 5 phút, rửa sạch rồi hầm cùng hành nướng trong 3 giờ.',
        timerMinutes: 180,
      },
      {
        title: 'Bước 2: Chuẩn bị thịt bò và rau thơm',
        description: 'Thái mỏng thịt bò tái. Cắt nhỏ hành lá, ngò gai, đầu hành chẻ sợi.',
        timerMinutes: 15,
      },
      {
        title: 'Bước 3: Trụng bánh phở và hoàn thiện',
        description: 'Trụng bánh phở cho vào tô, xếp thịt bò lên trên, chan nước dùng đang sôi sùng sục và thưởng thức.',
        timerMinutes: 5,
      },
    ]);

    if (galleryItems.length === 0 && !watchedImageUrl) {
      handleAddFromUrl(sampleImages[0].url, sampleImages[0].label);
    }
  };

  const onValidationError = (formErrors: FieldErrors<RecipeFormData>) => {
    // Cuộn tới mục có lỗi đầu tiên
    if (formErrors.title || formErrors.description || formErrors.categoryId) {
      scrollToAnchor('card-general');
    } else if (formErrors.ingredients) {
      scrollToAnchor('card-ingredients');
    } else if (formErrors.steps) {
      scrollToAnchor('card-steps');
    }
  };

  const scrollToAnchor = (id: string) => {
    setActiveAnchor(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Nộp form hoàn chỉnh với target 'draft' hoặc 'publish'
  const executeFormSubmission = async (
    formData: RecipeFormData,
    target: 'draft' | 'publish'
  ) => {
    setUploadError(null);

    const primaryItem = galleryItems.find((item) => item.isPrimary) || galleryItems[0];
    const secondaryItems = galleryItems.filter((item) => item !== primaryItem && item.file);
    const secondaryFiles = secondaryItems.map((item) => item.file).filter(Boolean) as File[];

    let primaryUrl = formData.primaryImageUrl;

    // Nếu ảnh chính là file cục bộ, upload lên MinIO trước
    if (primaryItem && primaryItem.file) {
      setIsUploadingPrimary(true);
      try {
        const uploadRes = await fileService.uploadFile(primaryItem.file, 'recipes');
        if (uploadRes && uploadRes.url) {
          primaryUrl = uploadRes.url;
          formData.primaryImageUrl = uploadRes.url;
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

  const triggerSubmitWithTarget = (target: 'draft' | 'publish') => {
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

  // Dữ liệu mô phỏng chuẩn DTO để nạp vào các component chi tiết của trang công khai (Đồng bộ 100% với RecipeDetailView)
  const previewImages: RecipeImageDto[] = galleryItems.map((item, idx) => ({
    id: item.id || `preview-img-${idx}`,
    originalUrl: item.previewUrl,
    mediumUrl: item.previewUrl,
    thumbnailUrl: item.previewUrl,
    altText: watchedTitle || 'Ảnh món ăn',
    isPrimary: item.isPrimary,
    orderIndex: idx,
  }));

  if (previewImages.length === 0 && effectiveHeroImage) {
    previewImages.push({
      id: 'preview-default-img',
      originalUrl: effectiveHeroImage,
      mediumUrl: effectiveHeroImage,
      thumbnailUrl: effectiveHeroImage,
      altText: watchedTitle || 'Ảnh món ăn',
      isPrimary: true,
      orderIndex: 0,
    });
  }

  const previewIngredients: RecipeIngredientDto[] = validIngredients.map((item, idx) => ({
    id: `preview-ing-${idx}`,
    name: item.name,
    quantity: item.quantity !== undefined ? item.quantity : null,
    unit: item.unit || null,
    notes: item.notes || null,
    orderIndex: idx + 1,
  }));

  const previewSteps: RecipeStepDto[] = validSteps.map((step, idx) => ({
    id: `preview-step-${idx}`,
    stepNumber: idx + 1,
    title: step.title || `Bước ${idx + 1}`,
    description: step.description,
    timerMinutes: step.timerMinutes ?? null,
    imageUrl: null,
  }));

  const hasNutrition = Boolean(
    watchedCalories || watchedProtein || watchedCarbs || watchedFat
  );
  const previewNutrition: RecipeNutritionDto = {
    calories: watchedCalories ?? null,
    protein: watchedProtein ?? null,
    carbohydrates: watchedCarbs ?? null,
    fat: watchedFat ?? null,
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

      {/* =========================================================================
          THANH ĐIỀU HƯỚNG NHANH CÁC MỤC (SMOOTH ANCHOR PILLS)
          ========================================================================= */}
      <div className="sticky top-4 z-20 flex items-center gap-2 overflow-x-auto rounded-2xl bg-white/95 backdrop-blur-md p-2 border border-gray-100 shadow-sm">
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
          <span>4. Xem trước (Live Preview)</span>
        </button>
      </div>

      {/* =========================================================================
          BỐ CỤC 2 CỘT: CỘT SOẠN THẢO (70%) + CỘT TRẠNG THÁI STICKY (30%)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI (LỚN): CÁC KHỐI NHẬP LIỆU CHÍNH */}
        <div className="lg:col-span-8 space-y-8">
          {/* -------------------------------------------------------------------
              KHỐI 1: THÔNG TIN CÔNG THỨC & LƯỚI ẢNH GIẢI PHÁP 1
              ------------------------------------------------------------------- */}
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

                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5">
                      {galleryItems.map((item) => (
                        <div
                          key={item.id}
                          className={`relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                            item.isPrimary
                              ? 'border-orange-500 ring-2 ring-orange-200'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={resolveMediaUrl(item.previewUrl)}
                            alt={item.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setSelectedPreviewImage(item.previewUrl)}
                          />

                          {/* Hover menu: đặt làm chính hoặc xóa */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {!item.isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(item.id)}
                                className="p-1 rounded bg-white text-orange-600 hover:bg-orange-100"
                                title="Đặt làm ảnh chính"
                              >
                                <Star className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 rounded bg-red-600 text-white hover:bg-red-700"
                              title="Xóa ảnh này"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Nút cộng ảnh nhỏ */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-400 text-gray-400 hover:text-orange-600 flex flex-col items-center justify-center transition"
                        title="Thêm ảnh phụ"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-[9px] font-bold mt-0.5">+ Ảnh</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Chọn nhanh link URL hoặc ảnh mẫu */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-gray-500">
                  <button
                    type="button"
                    onClick={() => setImageInputMode((m) => (m === 'upload' ? 'url' : 'upload'))}
                    className="text-gray-500 hover:text-orange-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <LinkIcon className="w-3 h-3" />
                    {imageInputMode === 'upload' ? 'Nhập link ảnh từ web' : 'Quay lại tải file'}
                  </button>

                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Mẫu:</span>
                    <button
                      type="button"
                      onClick={() => handleAddFromUrl(sampleImages[0].url, sampleImages[0].label)}
                      className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700 font-semibold"
                    >
                      Phở
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddFromUrl(sampleImages[2].url, sampleImages[2].label)}
                      className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700 font-semibold"
                    >
                      Salad
                    </button>
                  </div>
                </div>

                {imageInputMode === 'url' && (
                  <div className="flex gap-2 pt-1 animate-fade-in">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Dán đường dẫn ảnh https://..."
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddFromUrl(urlInput)}
                      className="px-3 py-1.5 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-900 transition"
                    >
                      Thêm
                    </button>
                  </div>
                )}
              </div>

              {/* FORM FIELDS CƠ BẢN */}
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
                    placeholder="Nhập tên công thức..."
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
                  )}
                </div>

                {/* Danh mục */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('categoryId')}
                    disabled={isSubmitting || isLoadingCategories}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                  >
                    <option value="">Chọn danh mục món ăn...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-xs text-red-500 font-medium">{errors.categoryId.message}</p>
                  )}
                </div>

                {/* Thời gian chuẩn bị & Thời gian nấu */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Thời gian chuẩn bị
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        {...register('prepTimeMinutes', { valueAsNumber: true })}
                        disabled={isSubmitting}
                        placeholder="0"
                        min="0"
                        className="w-full rounded-2xl border border-gray-200 pl-10 pr-12 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        phút
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Thời gian nấu
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        {...register('cookTimeMinutes', { valueAsNumber: true })}
                        disabled={isSubmitting}
                        placeholder="0"
                        min="0"
                        className="w-full rounded-2xl border border-gray-200 pl-10 pr-12 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        phút
                      </span>
                    </div>
                  </div>
                </div>

                {/* Độ khó & Khẩu phần */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Độ khó
                    </label>
                    <div className="relative">
                      <ChefHat className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        {...register('difficulty', { valueAsNumber: true })}
                        disabled={isSubmitting}
                        className="w-full rounded-2xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                      >
                        <option value={1}>Dễ</option>
                        <option value={2}>Trung bình</option>
                        <option value={3}>Khó</option>
                        <option value={4}>Chuyên gia</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Khẩu phần
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        {...register('servings', { valueAsNumber: true })}
                        disabled={isSubmitting}
                        placeholder="1"
                        min="1"
                        className="w-full rounded-2xl border border-gray-200 pl-10 pr-14 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        người
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mô tả ngắn */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Mô tả ngắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    {...register('description')}
                    disabled={isSubmitting}
                    placeholder="Mô tả ngắn gọn về món ăn..."
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              KHỐI 2: DANH SÁCH NGUYÊN LIỆU (SRS §FR-RCP-003)
              ------------------------------------------------------------------- */}
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
                      Nguyên liệu món ăn
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {ingredientFields.length} nguyên liệu
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Danh sách nguyên liệu rõ ràng giúp người đọc dễ dàng định lượng chuẩn xác
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => appendIngredient({ name: '', quantity: null, unit: '', notes: '' })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm dòng</span>
              </button>
            </div>

            {/* Bảng nguyên liệu */}
            <div className="space-y-3">
              {ingredientFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-2xl bg-gray-50/70 border border-gray-200/70 hover:border-gray-300 transition"
                >
                  <span className="w-6 text-center text-xs font-bold text-gray-400 shrink-0">
                    #{idx + 1}
                  </span>

                  {/* Tên nguyên liệu */}
                  <div className="flex-1">
                    <input
                      type="text"
                      {...register(`ingredients.${idx}.name`)}
                      placeholder="Tên nguyên liệu (VD: Thịt thăn bò...)"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Định lượng */}
                  <div className="w-24 sm:w-28 shrink-0">
                    <input
                      type="number"
                      step="any"
                      {...register(`ingredients.${idx}.quantity`, { valueAsNumber: true })}
                      placeholder="Số lượng"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Đơn vị tính */}
                  <div className="w-24 sm:w-28 shrink-0">
                    <input
                      type="text"
                      {...register(`ingredients.${idx}.unit`)}
                      placeholder="gam, ml, muỗng..."
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-orange-500"
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

          {/* -------------------------------------------------------------------
              KHỐI 3: CÁC BƯỚC THỰC HIỆN CÓ HẸN GIỜ (SRS §FR-RCP-004)
              ------------------------------------------------------------------- */}
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

          {/* -------------------------------------------------------------------
              KHỐI 4: MÔ TẢ CHI TIẾT & MẸO NẤU (INSTRUCTIONS)
              ------------------------------------------------------------------- */}
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

          {/* -------------------------------------------------------------------
              KHỐI 5: THÔNG TIN DINH DƯỠNG (TUỲ CHỌN - ACCORDION)
              ------------------------------------------------------------------- */}
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

        {/* =====================================================================
            CỘT PHẢI (STICKY): BẢNG TRẠNG THÁI CÔNG THỨC & NÚT HÀNH ĐỘNG
            ===================================================================== */}
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
                {isSubmitting ? (
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
                <Save className="w-4 h-4 text-gray-500" />
                <span>Lưu bản nháp</span>
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

      {/* =========================================================================
          KHỐI DƯỚI CÙNG: XEM TRƯỚC THEO THỜI GIAN THỰC (LIVE PREVIEW CARD)
          ========================================================================= */}
      <div
        id="card-preview"
        className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-5"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-900 font-black text-sm">
          <Eye className="w-4 h-4 text-orange-600" />
          <span>Xem trước bài viết trên trang chủ (Live Preview)</span>
        </div>

        {/* Horizontal Recipe Card chuẩn Mockup */}
        <div className="rounded-2xl border border-gray-200/80 overflow-hidden bg-white hover:border-gray-300 transition flex flex-col md:flex-row items-stretch">
          {/* Cột ảnh đại diện */}
          <div className="md:w-80 h-52 md:h-auto relative bg-gray-100 shrink-0">
            {effectiveHeroImage ? (
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

              <button
                type="button"
                onClick={() => {
                  setPreviewModalActiveImage(effectiveHeroImage);
                  setIsPreviewModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50/80 hover:bg-orange-100/80 border border-orange-200 hover:border-orange-300 px-3.5 py-1.5 rounded-xl transition self-start sm:self-auto shadow-2xs active:scale-95"
              >
                <span>Xem chi tiết</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL XEM TRƯỚC BÀI VIẾT THỰC TẾ (LIVE FULL ARTICLE PREVIEW DIALOG)
          ========================================================================= */}
      <Dialog
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        className="w-full max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden"
        ariaLabelledBy="preview-dialog-title"
      >
        {/* Header của Modal */}
        <DialogHeader onClose={() => setIsPreviewModalOpen(false)} className="bg-gray-50/90 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle id="preview-dialog-title" className="text-base font-black text-gray-900">
                Mô phỏng bài viết thực tế ngoài trang công khai
              </DialogTitle>
              <p className="text-xs text-gray-500 font-normal">
                Đây là giao diện chuẩn độc giả sẽ nhìn thấy khi công thức được xuất bản
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Nội dung bài viết chi tiết bên trong Modal - Đồng bộ 100% với RecipeDetailView */}
        <div className="p-6 sm:p-10 space-y-8 overflow-y-auto flex-1 bg-white">
          {/* Header thông tin chính (Khớp 100% RecipeDetailView) */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                <Tag className="h-3.5 w-3.5" />
                {categoryDisplayName}
              </span>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyLabels[watchedDifficulty || 1]?.color || ''}`}>
                Độ khó: {difficultyLabels[watchedDifficulty || 1]?.label || 'Dễ'}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {watchedTitle?.trim() || 'Tên công thức nấu ăn của bạn'}
            </h1>

            <p className="text-base leading-relaxed text-gray-600">
              {watchedDescription?.trim() || 'Chưa nhập mô tả ngắn cho bài viết.'}
            </p>

            {/* Tác giả & Ngày đăng */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-500 border-t border-gray-100">
              <div className="flex items-center gap-1.5 font-medium text-gray-700">
                <User className="h-4 w-4 text-orange-500" />
                <span>Tác giả: Bạn (Author)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Ngày đăng: Hôm nay</span>
              </div>
            </div>
          </div>

          {/* Khối Hình ảnh công thức chuẩn Gallery Viewer của trang công khai */}
          <RecipeGalleryViewer images={previewImages} recipeTitle={watchedTitle || 'Món ăn'} />

          {/* Các thẻ thông số tóm tắt (Thời gian, Khẩu phần - Khớp 100% RecipeDetailView) */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Chuẩn bị</p>
                <p className="text-sm font-bold text-gray-900">{watchedPrepTime || 0} phút</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Thời gian nấu</p>
                <p className="text-sm font-bold text-gray-900">{watchedCookTime || 0} phút</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Tổng thời gian</p>
                <p className="text-sm font-bold text-gray-900">{(watchedPrepTime || 0) + (watchedCookTime || 0)} phút</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Khẩu phần</p>
                <p className="text-sm font-bold text-gray-900">{watchedServings || 1} phần</p>
              </div>
            </div>
          </div>

          {/* Thông tin dinh dưỡng */}
          {hasNutrition && <RecipeNutritionCard nutrition={previewNutrition} />}

          {/* Bố cục 2 cột: Cột trái Nguyên liệu & Các bước thực hiện (Khớp 100% RecipeDetailView) */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Cột 1: Nguyên liệu */}
            <div className="md:col-span-1">
              <RecipeIngredientsList
                ingredients={previewIngredients}
                servings={watchedServings || 1}
              />
            </div>

            {/* Cột 2: Các bước thực hiện */}
            <div className="md:col-span-2">
              <RecipeStepsList
                steps={previewSteps}
                instructions={watchedInstructions}
              />
            </div>
          </div>
        </div>

        {/* Footer của Modal */}
        <DialogFooter className="bg-gray-50/90 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-2 text-xs">
            {canPublish ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đủ điều kiện xuất bản công khai
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5" />
                Chưa đủ điều kiện xuất bản (cần $\ge 1$ nguyên liệu và $\ge 1$ bước)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 transition active:scale-95"
            >
              Đóng xem trước
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPreviewModalOpen(false);
                triggerSubmitWithTarget('publish');
              }}
              disabled={isSubmitting || isUploadingPrimary}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white shadow transition active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Xuất bản ngay</span>
            </button>
          </div>
        </DialogFooter>
      </Dialog>
    </form>
  );
}
