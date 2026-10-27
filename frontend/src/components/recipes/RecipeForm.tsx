'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { recipeFormSchema, type RecipeFormData } from '@/features/recipes/schemas';
import { categoryService } from '@/lib/services/category-service';
import { fileService } from '@/lib/services/file-service';
import { resolveMediaUrl } from '@/lib/utils';
import type { CategoryDto } from '@/lib/types/category';
import { Tabs, TabPanel, type TabItem } from '@/components/ui/tabs';
import {
  Loader2,
  AlertCircle,
  Save,
  ArrowLeft,
  ArrowRight,
  Utensils,
  Clock,
  Users,
  Flame,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Upload,
  Link as LinkIcon,
  X,
  Star,
  FileText,
  Check,
  Eye,
  Tag,
  ShoppingBag,
  ChefHat,
  Dumbbell,
  Wheat,
  Droplets,
  Calendar,
  User,
  Lightbulb,
} from 'lucide-react';

export type RecipeFormTab = 'general' | 'gallery' | 'ingredients' | 'steps' | 'preview';

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RecipeFormTab>('general');
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Tab 2: Thư viện ảnh (Phương án 1: Multi-Image Upload)
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
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  const [submitTarget, setSubmitTarget] = useState<'draft' | 'publish'>('draft');
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

  // Fetch danh mục từ backend
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

  // Xử lý chọn nhiều tệp ảnh (Phương án 1)
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

    if (newItems.length === 0) return;

    setGalleryItems((prev) => {
      const combined = [...prev, ...newItems];
      // Nếu chưa có ảnh nào là ảnh chính, đặt ảnh đầu tiên làm ảnh chính
      const hasPrimary = combined.some((item) => item.isPrimary);
      if (!hasPrimary && combined.length > 0) {
        combined[0].isPrimary = true;
        setValue('primaryImageUrl', combined[0].previewUrl);
      }
      return combined;
    });

    // Reset input file để có thể chọn tiếp
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Đặt 1 ảnh trong gallery làm ảnh chính (Primary)
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

  // Xóa ảnh khỏi danh sách gallery
  const handleRemoveImage = (id: string) => {
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

  // Thêm ảnh từ URL mẫu
  const handleAddSampleImage = (url: string, label: string) => {
    const newItem: GalleryFileItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      previewUrl: url,
      isPrimary: galleryItems.length === 0,
      name: label,
    };
    setGalleryItems((prev) => {
      const updated = [...prev, newItem];
      if (newItem.isPrimary) {
        setValue('primaryImageUrl', url);
      }
      return updated;
    });
  };

  // Điền dữ liệu mẫu nhanh
  const handleFillSampleStepsAndIngredients = () => {
    setValue('ingredients', [
      { name: 'Thịt bò thăn tươi', quantity: 300, unit: 'gram', notes: 'Thái lát mỏng vừa ăn' },
      { name: 'Hành tây trắng', quantity: 1, unit: 'củ', notes: 'Bổ múi cau' },
      { name: 'Tỏi cô đơn', quantity: 3, unit: 'tép', notes: 'Băm nhuyễn' },
      { name: 'Dầu hào & Nước tương', quantity: 2, unit: 'thìa canh', notes: 'Gia vị ướp đậm đà' },
    ]);
    setValue('steps', [
      {
        title: 'Bước 1: Sơ chế và ướp nguyên liệu',
        description: 'Thịt bò rửa sạch, thấm khô và thái lát mỏng. Ướp cùng 1 thìa tỏi băm, dầu hào, tiêu xay trong 15 phút cho ngấm gia vị.',
        timerMinutes: 15,
      },
      {
        title: 'Bước 2: Tiến hành xào nhanh trên lửa lớn',
        description: 'Phi thơm tỏi trên chảo lửa lớn, cho thịt bò vào đảo nhanh tay trong 2 phút rồi trút ra đĩa. Tiếp tục xào hành tây chín tới.',
        timerMinutes: 5,
      },
      {
        title: 'Bước 3: Hoàn thiện và trình bày',
        description: 'Trộn đều thịt bò với hành tây trên chảo, rắc hành lá cắt khúc và tiêu xay thơm lừng. Bày ra đĩa dùng nóng với cơm trắng.',
        timerMinutes: 2,
      },
    ]);
    if (galleryItems.length === 0 && !watchedImageUrl) {
      handleAddSampleImage(sampleImages[0].url, sampleImages[0].label);
    }
  };

  // Tự động chuyển tab tương ứng khi validation thất bại
  const onValidationError = (formErrors: FieldErrors<RecipeFormData>) => {
    if (
      formErrors.title ||
      formErrors.description ||
      formErrors.categoryId ||
      formErrors.difficulty ||
      formErrors.prepTimeMinutes ||
      formErrors.cookTimeMinutes ||
      formErrors.servings ||
      formErrors.instructions ||
      formErrors.calories ||
      formErrors.protein ||
      formErrors.carbs ||
      formErrors.fat
    ) {
      setActiveTab('general');
    } else if (formErrors.primaryImageUrl) {
      setActiveTab('gallery');
    } else if (formErrors.ingredients) {
      setActiveTab('ingredients');
    } else if (formErrors.steps) {
      setActiveTab('steps');
    }
  };

  // Xử lý nộp form hoàn chỉnh với target 'draft' hoặc 'publish'
  const executeFormSubmission = async (
    formData: RecipeFormData,
    target: 'draft' | 'publish'
  ) => {
    setUploadError(null);

    // Xác định ảnh chính và các ảnh phụ
    const primaryItem = galleryItems.find((item) => item.isPrimary) || galleryItems[0];
    const secondaryItems = galleryItems.filter((item) => item !== primaryItem && item.file);
    const secondaryFiles = secondaryItems.map((item) => item.file).filter(Boolean) as File[];

    let primaryUrl = formData.primaryImageUrl;

    // Nếu ảnh chính là file cục bộ từ máy tính, upload lên MinIO trước
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
        setActiveTab('gallery');
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
    setSubmitTarget(target);
    handleSubmit(
      (data) => executeFormSubmission(data, target),
      onValidationError
    )();
  };

  // Kiểm tra lỗi theo từng tab để hiển thị cảnh báo đỏ trên tab bar
  const hasGeneralErrors = Boolean(
    errors.title ||
    errors.description ||
    errors.categoryId ||
    errors.difficulty ||
    errors.prepTimeMinutes ||
    errors.cookTimeMinutes ||
    errors.servings ||
    errors.instructions ||
    errors.calories ||
    errors.protein ||
    errors.carbs ||
    errors.fat
  );
  const hasGalleryErrors = Boolean(errors.primaryImageUrl);
  const hasIngredientsErrors = Boolean(errors.ingredients);
  const hasStepsErrors = Boolean(errors.steps);

  const isGeneralCompleted = Boolean(
    (watchedTitle?.trim()?.length ?? 0) >= 5 &&
    (watchedDescription?.trim()?.length ?? 0) >= 10 &&
    watchedCategoryId
  );
  const isGalleryCompleted = Boolean(
    galleryItems.length > 0 || watchedImageUrl
  );
  const isIngredientsCompleted = Boolean(
    (watchedIngredients?.length ?? 0) > 0 &&
    Boolean(watchedIngredients?.[0]?.name?.trim())
  );
  const isStepsCompleted = Boolean(
    (watchedSteps?.length ?? 0) > 0 &&
    Boolean(watchedSteps?.[0]?.description?.trim())
  );

  // Tính toán điều kiện sẵn sàng xuất bản (SRS FR-RCP-005)
  const hasValidTitle = Boolean(watchedTitle && watchedTitle.trim().length >= 5);
  const hasValidDescription = Boolean(watchedDescription && watchedDescription.trim().length >= 10);
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

  // Điều kiện để được phép xuất bản bài viết công khai theo FR-RCP-005
  const canPublish = hasValidTitle && hasValidIngredients && hasValidSteps;

  const wizardTabs: TabItem[] = [
    {
      id: 'general',
      label: 'Thông tin & Dinh dưỡng',
      isCompleted: isGeneralCompleted,
      badge: hasGeneralErrors ? (
        <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white ml-1 inline-block" />
      ) : undefined,
    },
    {
      id: 'gallery',
      label: 'Thư viện hình ảnh',
      isCompleted: isGalleryCompleted,
      badge: galleryItems.length > 0 ? (
        <span className="px-1.5 py-0.5 text-[10px] rounded-full font-bold bg-white/20 ml-1">
          {galleryItems.length}
        </span>
      ) : hasGalleryErrors ? (
        <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white ml-1 inline-block" />
      ) : undefined,
    },
    {
      id: 'ingredients',
      label: 'Nguyên liệu',
      isCompleted: isIngredientsCompleted,
      badge: ingredientFields.length > 0 ? (
        <span className="px-1.5 py-0.5 text-[10px] rounded-full font-bold bg-white/20 ml-1">
          {ingredientFields.length}
        </span>
      ) : hasIngredientsErrors ? (
        <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white ml-1 inline-block" />
      ) : undefined,
    },
    {
      id: 'steps',
      label: 'Các bước thực hiện',
      isCompleted: isStepsCompleted,
      badge: stepFields.length > 0 ? (
        <span className="px-1.5 py-0.5 text-[10px] rounded-full font-bold bg-white/20 ml-1">
          {stepFields.length}
        </span>
      ) : hasStepsErrors ? (
        <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white ml-1 inline-block" />
      ) : undefined,
    },
    {
      id: 'preview',
      label: 'Xem trước & Xuất bản',
      isCompleted: canPublish,
      badge: canPublish ? (
        <span className="px-1.5 py-0.5 text-[10px] rounded-full font-bold bg-emerald-500 text-white ml-1">
          Sẵn sàng
        </span>
      ) : undefined,
    },
  ];

  return (
    <form
      onSubmit={handleSubmit((data) => executeFormSubmission(data, submitTarget), onValidationError)}
      className="space-y-6"
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

      {/* Trợ giúp nhanh khi tạo công thức mới */}
      {!isEdit && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/50 px-4 py-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900 font-medium">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Gợi ý: Bạn có thể điền nhanh dữ liệu mẫu nguyên liệu và quy trình để thử nghiệm giao diện:</span>
          </div>
          <button
            type="button"
            onClick={handleFillSampleStepsAndIngredients}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition shrink-0 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Điền mẫu nhanh</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB NAVIGATION BAR - Đầy đủ 4 Tab tiêu chuẩn (FR-RCP)
          ========================================================================= */}
      <Tabs
        tabs={wizardTabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as RecipeFormTab)}
        variant="stepper"
        ariaLabel="Quy trình 4 bước tạo và chỉnh sửa công thức"
      />

      {/* =========================================================================
          TAB 1: THÔNG TIN CHUNG & DINH DƯỠNG
          ========================================================================= */}
      {activeTab === 'general' && (
        <div className="space-y-6 animate-fade-in">
          {/* Thông tin cốt lõi */}
          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
              <FileText className="h-5 w-5 text-orange-500" />
              <h3 className="text-base sm:text-lg">Thông tin cơ bản món ăn</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Tiêu đề */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Tiêu đề công thức <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title')}
                  disabled={isSubmitting}
                  placeholder="Ví dụ: Phở bò tái lăn truyền thống Hà Nội..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
                )}
              </div>

              {/* Mô tả ngắn */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Mô tả ngắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  {...register('description')}
                  disabled={isSubmitting}
                  placeholder="Giới thiệu đôi nét về hương vị, xuất xứ hoặc điểm đặc sắc của món ăn..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
                />
                {errors.description && (
                  <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
                )}
              </div>

              {/* Danh mục */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Danh mục món ăn <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('categoryId')}
                  disabled={isSubmitting || isLoadingCategories}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
                >
                  <option value="">-- Chọn danh mục --</option>
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

              {/* Độ khó */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Độ khó thực hiện <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('difficulty')}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
                >
                  <option value={1}>Dễ (Người mới bắt đầu)</option>
                  <option value={2}>Trung bình (Thành thạo cơ bản)</option>
                  <option value={3}>Khó (Yêu cầu kỹ năng)</option>
                  <option value={4}>Chuyên gia (Món tiệc cầu kỳ)</option>
                </select>
                {errors.difficulty && (
                  <p className="text-xs text-red-500 font-medium">{errors.difficulty.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Thời gian & Khẩu phần */}
          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
              <Clock className="h-5 w-5 text-orange-500" />
              <h3 className="text-base sm:text-lg">Thời gian & Khẩu phần</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Thời gian chuẩn bị (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  {...register('prepTimeMinutes')}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                {errors.prepTimeMinutes && (
                  <p className="text-xs text-red-500 font-medium">{errors.prepTimeMinutes.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Thời gian nấu (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  {...register('cookTimeMinutes')}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                {errors.cookTimeMinutes && (
                  <p className="text-xs text-red-500 font-medium">{errors.cookTimeMinutes.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Số khẩu phần (người) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  {...register('servings')}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                {errors.servings && (
                  <p className="text-xs text-red-500 font-medium">{errors.servings.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Hướng dẫn chung & Lưu ý của tác giả */}
          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
              <Utensils className="h-5 w-5 text-orange-500" />
              <h3 className="text-base sm:text-lg">Hướng dẫn chung & Lưu ý của tác giả</h3>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Ghi chú tổng quan hoặc mẹo nhỏ <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                {...register('instructions')}
                disabled={isSubmitting}
                placeholder="Ghi chú tổng quan về cách chọn nguyên liệu tươi, lưu ý nhiệt độ hoặc mẹo giúp món ăn thơm ngon chuẩn vị..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
              {errors.instructions && (
                <p className="text-xs text-red-500 font-medium">{errors.instructions.message}</p>
              )}
            </div>
          </div>

          {/* Thông số dinh dưỡng ước tính */}
          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
              <Flame className="h-5 w-5 text-orange-500" />
              <h3 className="text-base sm:text-lg">Dinh dưỡng ước tính (Mỗi khẩu phần)</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Calo (kcal)</label>
                <input
                  type="number"
                  step="any"
                  min={0}
                  {...register('calories')}
                  disabled={isSubmitting}
                  placeholder="vd: 450"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Protein (g)</label>
                <input
                  type="number"
                  step="any"
                  min={0}
                  {...register('protein')}
                  disabled={isSubmitting}
                  placeholder="vd: 25"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Carbs (g)</label>
                <input
                  type="number"
                  step="any"
                  min={0}
                  {...register('carbs')}
                  disabled={isSubmitting}
                  placeholder="vd: 40"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Chất béo (g)</label>
                <input
                  type="number"
                  step="any"
                  min={0}
                  {...register('fat')}
                  disabled={isSubmitting}
                  placeholder="vd: 12"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: HÌNH ẢNH MÓN ĂN (Phương án 1 - Multi-image Thumbnail Strip)
          ========================================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <ImageIcon className="h-5 w-5 text-orange-500" />
              <div>
                <h3 className="text-base sm:text-lg">Thư viện hình ảnh món ăn</h3>
                <p className="text-xs text-gray-500 font-normal mt-0.5">
                  Hỗ trợ tải nhiều ảnh cùng lúc (Phương án 1). Ảnh gắn huy hiệu ⭐ là ảnh đại diện chính.
                </p>
              </div>
            </div>

            {/* Switch chế độ chọn ảnh */}
            <div className="inline-flex rounded-xl bg-gray-100 p-0.5 text-xs font-semibold self-start sm:self-center">
              <button
                type="button"
                onClick={() => setImageInputMode('upload')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                  imageInputMode === 'upload'
                    ? 'bg-white text-orange-600 shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Chọn ảnh từ máy (Nhiều ảnh)</span>
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                  imageInputMode === 'url'
                    ? 'bg-white text-orange-600 shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Nhập URL / Ảnh mẫu</span>
              </button>
            </div>
          </div>

          {/* Vùng tải tệp lên */}
          {imageInputMode === 'upload' ? (
            <div>
              <label
                htmlFor="multi-file-upload"
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all text-center ${
                  isUploadingPrimary
                    ? 'border-orange-400 bg-orange-50/50 cursor-wait'
                    : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50/20'
                }`}
              >
                {isUploadingPrimary ? (
                  <>
                    <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-3" />
                    <span className="text-sm font-bold text-orange-700">
                      Đang xử lý tải ảnh lên máy chủ MinIO...
                    </span>
                    <span className="text-xs text-orange-500 mt-1">
                      Hệ thống đang chuẩn bị ảnh cho công thức của bạn
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                      <Upload className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      Bấm để chọn một hoặc nhiều ảnh từ máy tính / điện thoại
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Hỗ trợ chọn cùng lúc nhiều tệp PNG, JPG, JPEG, WebP (Tối đa 5MB mỗi ảnh)
                    </span>
                  </>
                )}
                <input
                  id="multi-file-upload"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFilesChange}
                  disabled={isSubmitting || isUploadingPrimary}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Dán đường dẫn ảnh: https://example.com/anh-mon-an.jpg"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        handleAddSampleImage(val, 'Ảnh từ URL');
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>

              {/* Gợi ý ảnh nhanh */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Chọn nhanh ảnh mẫu chất lượng cao:</span>
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddSampleImage(s.url, s.label)}
                    className="rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition-colors border border-orange-200/50"
                  >
                    + {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DẢI ẢNH THUMBNAIL STRIP & BỘ SƯU TẬP ẢNH ĐÃ CHỌN (Phương án 1) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-2">
                <span>Ảnh đã chọn ({galleryItems.length})</span>
                {galleryItems.length > 0 && (
                  <span className="text-[11px] text-gray-500 font-normal">
                    (Bấm vào bất kỳ ảnh nào để đặt làm ảnh đại diện chính)
                  </span>
                )}
              </div>
              {galleryItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setGalleryItems([]);
                    setValue('primaryImageUrl', '');
                  }}
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  Xóa tất cả ảnh
                </button>
              )}
            </div>

            {galleryItems.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-500">Chưa có hình ảnh nào được chọn</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Bạn có thể chọn một hoặc nhiều ảnh minh họa món ăn bên trên
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all bg-gray-50 ${
                      item.isPrimary
                        ? 'border-orange-500 ring-2 ring-orange-200 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 shadow-xs'
                    }`}
                  >
                    {/* Hình ảnh */}
                    <div className="h-36 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveMediaUrl(item.previewUrl)}
                        alt={item.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (
                            item.previewUrl &&
                            item.previewUrl.startsWith('/culinary-blog/') &&
                            !target.src.includes(':9000')
                          ) {
                            target.src = `http://localhost:9000${item.previewUrl}`;
                          }
                        }}
                      />
                    </div>

                    {/* Huy hiệu ⭐ Ảnh chính */}
                    {item.isPrimary ? (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Ảnh chính</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(item.id)}
                        className="absolute top-2 left-2 bg-black/60 hover:bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex items-center gap-1 shadow-sm"
                        title="Đặt làm ảnh đại diện chính của món ăn"
                      >
                        <Star className="w-3 h-3" />
                        <span>Đặt làm ảnh chính</span>
                      </button>
                    )}

                    {/* Nút xóa ảnh */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(item.id)}
                      className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-red-500 transition-colors shadow-sm"
                      title="Xóa ảnh này"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {/* Thông tin tên file và dung lượng */}
                    <div className="p-2.5 bg-white border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-800 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mt-0.5">
                        <span>
                          {item.size ? `${(item.size / 1024).toFixed(0)} KB` : 'Ảnh trực tuyến'}
                        </span>
                        {item.isPrimary && (
                          <span className="text-orange-600 font-bold">Đại diện</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: NGUYÊN LIỆU CHUẨN BỊ
          ========================================================================= */}
      {activeTab === 'ingredients' && (
        <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Utensils className="h-5 w-5 text-orange-500" />
              <h3 className="text-base sm:text-lg">Danh sách nguyên liệu chuẩn bị</h3>
            </div>
            <button
              type="button"
              onClick={() => appendIngredient({ name: '', quantity: null, unit: '', notes: '' })}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3.5 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors self-start sm:self-center"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm nguyên liệu mới</span>
            </button>
          </div>

          <div className="space-y-3">
            {ingredientFields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50/60 transition-all hover:bg-gray-50"
              >
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    {...register(`ingredients.${index}.name` as const)}
                    placeholder={`Tên nguyên liệu ${index + 1} (vd: Thịt bò, Hành tây...) *`}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white"
                  />
                </div>

                <div className="w-full sm:w-28">
                  <input
                    type="number"
                    step="any"
                    {...register(`ingredients.${index}.quantity` as const)}
                    placeholder="Số lượng"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white"
                  />
                </div>

                <div className="w-full sm:w-28">
                  <input
                    type="text"
                    {...register(`ingredients.${index}.unit` as const)}
                    placeholder="Đơn vị (g, ml...)"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white"
                  />
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    {...register(`ingredients.${index}.notes` as const)}
                    placeholder="Ghi chú (tùy chọn)"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white"
                  />
                </div>

                {ingredientFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors self-end sm:self-center"
                    title="Xóa nguyên liệu này"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: QUY TRÌNH CÁC BƯỚC NẤU
          ========================================================================= */}
      {activeTab === 'steps' && (
        <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <CheckCircle2 className="h-5 w-5 text-orange-500" />
              <h3 className="text-base sm:text-lg">Quy trình các bước thực hiện</h3>
            </div>
            <button
              type="button"
              onClick={() =>
                appendStep({
                  title: `Bước ${stepFields.length + 1}`,
                  description: '',
                  timerMinutes: null,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3.5 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors self-start sm:self-center"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm bước thực hiện</span>
            </button>
          </div>

          <div className="space-y-4">
            {stepFields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-3 rounded-2xl border border-orange-100 bg-orange-50/30 p-4.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      {...register(`steps.${index}.title` as const)}
                      placeholder={`Tiêu đề bước ${index + 1} (vd: Sơ chế thịt, Xào chín...)`}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold outline-none focus:border-orange-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>Hẹn giờ (phút):</span>
                      <input
                        type="number"
                        min={0}
                        {...register(`steps.${index}.timerMinutes` as const)}
                        placeholder="vd: 10"
                        className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    {stepFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Xóa bước này"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    {...register(`steps.${index}.description` as const)}
                    placeholder={`Hướng dẫn chi tiết bước ${index + 1}... *`}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: XEM TRƯỚC BÀI VIẾT & QUYẾT ĐỊNH XUẤT BẢN / LƯU NHÁP (FR-RCP-005)
          ========================================================================= */}
      {activeTab === 'preview' && (
        <div className="space-y-6 animate-fade-in">
          {/* 1. Header Banner & Checklist Kiểm Tra Điều Kiện Xuất Bản (SRS FR-RCP-005) */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                    5
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    Xem trước bài viết & Quyết định đăng tải
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    <Sparkles className="w-3 h-3" />
                    <span>Mô phỏng thực tế</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Kiểm tra toàn diện bố cục và nội dung bài viết trước khi quyết định lưu trữ bản nháp hoặc công khai trên Culinary Blog.
                </p>
              </div>

              {/* Nút thao tác nhanh chuyển đến từng bước để sửa nếu muốn */}
              <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
                <span className="text-[11px] font-semibold text-gray-400 mr-1">Chỉnh sửa nhanh:</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('general')}
                  className="px-2.5 py-1 text-[11px] font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                >
                  1. Thông tin
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className="px-2.5 py-1 text-[11px] font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                >
                  2. Ảnh ({galleryItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ingredients')}
                  className="px-2.5 py-1 text-[11px] font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                >
                  3. Nguyên liệu ({validIngredients.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('steps')}
                  className="px-2.5 py-1 text-[11px] font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                >
                  4. Các bước ({validSteps.length})
                </button>
              </div>
            </div>

            {/* Checklist 4 tiêu chuẩn chất lượng theo SRS */}
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
                  <span className="text-xs font-bold">2. Hình ảnh món</span>
                  {hasHeroImage ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <p className="text-[11px] mt-1 text-gray-600">
                  {hasHeroImage ? `${galleryItems.length} ảnh trong thư viện` : 'Chưa có ảnh món ăn'}
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
                  {hasValidIngredients ? `${validIngredients.length} nguyên liệu đã nhập` : 'Bắt buộc có ≥ 1 nguyên liệu'}
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
                  {hasValidSteps ? `${validSteps.length} bước thực hiện` : 'Bắt buộc có ≥ 1 bước làm'}
                </p>
              </div>
            </div>

            {/* Thông báo tình trạng sẵn sàng xuất bản */}
            {canPublish ? (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <span className="font-bold">Đủ điều kiện xuất bản công khai (SRS §FR-RCP-005): </span>
                  <span>
                    Bạn có thể chọn <strong>"Xuất bản công khai ngay"</strong> để người dùng đọc được ngay trên trang chủ, hoặc chọn <strong>"Lưu bản nháp"</strong> để tiếp tục hoàn thiện sau.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <span className="font-bold">Chưa đủ điều kiện xuất bản công khai: </span>
                  <span>
                    Theo quy định SRS §FR-RCP-005, bài viết cần có tối thiểu 1 nguyên liệu và 1 bước nấu. Bạn vẫn có thể nhấn <strong>"Lưu bản nháp"</strong> để bảo toàn toàn bộ dữ liệu.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. MÔ PHỎNG CHI TIẾT BÀI VIẾT CÔNG KHAI (HIGH-FIDELITY ARTICLE PREVIEW) */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
            {/* Thanh tag danh mục & độ khó */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                  <Tag className="h-3.5 w-3.5" />
                  {categoryDisplayName}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    difficultyLabels[watchedDifficulty || 2]?.color || 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  Độ khó: {difficultyLabels[watchedDifficulty || 2]?.label || 'Trung bình'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-700">
                  <Eye className="w-3.5 h-3.5" />
                  Chế độ xem trước
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                {watchedTitle?.trim() || 'Tiêu đề công thức món ăn (Chưa nhập)'}
              </h1>

              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                {watchedDescription?.trim() || 'Chưa có phần giới thiệu, tóm tắt hương vị và điểm đặc sắc của món ăn...'}
              </p>

              {/* Tác giả & Ngày đăng mô phỏng */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-500 border-t border-gray-100">
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <User className="h-4 w-4 text-orange-500" />
                  <span>Tác giả: Bạn (Đang tạo công thức)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Ngày đăng: Hôm nay (Sau khi xuất bản)</span>
                </div>
              </div>
            </div>

            {/* Khung ảnh chính & Thumbnail Gallery */}
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
                    <span className="text-xs text-orange-400 font-medium">Chưa có ảnh đại diện món ăn</span>
                  </div>
                )}
              </div>

              {/* Dải ảnh Thumbnail (nếu có nhiều ảnh) */}
              {galleryItems.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  <span className="text-[11px] font-bold text-gray-400 mr-1 shrink-0">
                    Thư viện ({galleryItems.length}):
                  </span>
                  {galleryItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPreviewImage(item.previewUrl)}
                      className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        effectiveHeroImage === item.previewUrl
                          ? 'border-orange-500 scale-95 shadow-sm ring-2 ring-orange-200'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={item.name}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveMediaUrl(item.previewUrl)}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
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

            {/* Thông tin dinh dưỡng (nếu có nhập) */}
            {Boolean(
              (watchedCalories && watchedCalories > 0) ||
              (watchedProtein && watchedProtein > 0) ||
              (watchedCarbs && watchedCarbs > 0) ||
              (watchedFat && watchedFat > 0)
            ) && (
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
                    <p className="text-base font-black text-red-950 mt-1">{watchedCalories || 0} kcal</p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span>Chất đạm</span>
                    </div>
                    <p className="text-base font-black text-blue-950 mt-1">{watchedProtein || 0} g</p>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                      <Wheat className="w-3.5 h-3.5" />
                      <span>Tinh bột</span>
                    </div>
                    <p className="text-base font-black text-amber-950 mt-1">{watchedCarbs || 0} g</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Chất béo</span>
                    </div>
                    <p className="text-base font-black text-emerald-950 mt-1">{watchedFat || 0} g</p>
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
                  <span className="rounded-full bg-orange-100/70 px-2.5 py-0.5 text-[11px] font-bold text-orange-800">
                    {validIngredients.length} món
                  </span>
                </div>

                {validIngredients.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-4 text-center">
                    Chưa có nguyên liệu nào.
                  </p>
                ) : (
                  <ul className="space-y-2.5 text-xs">
                    {validIngredients.map((item, idx) => (
                      <li
                        key={idx}
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
                    <span className="rounded-full bg-orange-100/70 px-2.5 py-0.5 text-[11px] font-bold text-orange-800">
                      {validSteps.length} bước
                    </span>
                  </div>

                  {validSteps.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-4 text-center">
                      Chưa có bước thực hiện nào.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {validSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-gray-100 bg-gray-50/30"
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

                {/* Bí quyết & Lưu ý của tác giả (nếu có) */}
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
        </div>
      )}

      {/* =========================================================================
          FOOTER ĐIỀU HƯỚNG TỪNG BƯỚC VÀ NÚT SUBMIT / XUẤT BẢN / LƯU NHÁP
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-gray-100 mt-6">
        <div>
          {activeTab !== 'general' && (
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'gallery') setActiveTab('general');
                if (activeTab === 'ingredients') setActiveTab('gallery');
                if (activeTab === 'steps') setActiveTab('ingredients');
                if (activeTab === 'preview') setActiveTab('steps');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại bước trước</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Nút Tiếp tục cho các bước 1, 2, 3, 4 */}
          {activeTab !== 'preview' && (
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'general') setActiveTab('gallery');
                if (activeTab === 'gallery') setActiveTab('ingredients');
                if (activeTab === 'ingredients') setActiveTab('steps');
                if (activeTab === 'steps') setActiveTab('preview');
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-800 shadow-2xs hover:bg-gray-50 hover:border-gray-400 transition active:scale-95"
            >
              <span>
                {activeTab === 'general' && 'Tiếp tục: Chọn ảnh món ăn'}
                {activeTab === 'gallery' && 'Tiếp tục: Thêm nguyên liệu'}
                {activeTab === 'ingredients' && 'Tiếp tục: Thêm các bước'}
                {activeTab === 'steps' && 'Tiếp tục: Xem trước bài viết'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Khi ở Bước 5: Hai lựa chọn quyết định Lưu nháp hoặc Xuất bản */}
          {activeTab === 'preview' && (
            <>
              {/* Lựa chọn 1: Lưu bản nháp (Draft) */}
              <button
                type="button"
                disabled={isSubmitting || isUploadingPrimary}
                onClick={() => triggerSubmitWithTarget('draft')}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-900 active:scale-95 disabled:opacity-50 transition"
              >
                {isSubmitting && submitTarget === 'draft' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                    <span>Đang lưu bản nháp...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Lưu bản nháp</span>
                  </>
                )}
              </button>

              {/* Lựa chọn 2: Xuất bản công khai ngay (Publish) */}
              <button
                type="button"
                disabled={!canPublish || isSubmitting || isUploadingPrimary}
                onClick={() => triggerSubmitWithTarget('publish')}
                title={
                  !canPublish
                    ? 'Cần có tối thiểu 1 nguyên liệu và 1 bước làm để xuất bản công khai (FR-RCP-005)'
                    : 'Xuất bản bài viết công khai lên Culinary Blog ngay bây giờ'
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:from-orange-600 hover:to-amber-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting && submitTarget === 'publish' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xuất bản...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Xuất bản công khai ngay</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* Dành cho chế độ edit trực tiếp nếu muốn lưu nhanh mà không cần sang Bước 5 */}
          {isEdit && activeTab !== 'preview' && (
            <button
              type="button"
              disabled={isSubmitting || isUploadingPrimary}
              onClick={() => triggerSubmitWithTarget('draft')}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
