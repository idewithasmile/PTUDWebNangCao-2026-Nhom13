'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipeFormSchema, type RecipeFormData } from '@/features/recipes/schemas';
import { categoryService } from '@/lib/services/category-service';
import { fileService } from '@/lib/services/file-service';
import { resolveMediaUrl } from '@/lib/utils';
import type { CategoryDto } from '@/lib/types/category';
import type {
  RecipeImageDto,
  RecipeIngredientDto,
  RecipeStepDto,
  RecipeNutritionDto,
  RecipeDifficulty,
} from '@/lib/types/recipe';
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
  X,
  Star,
  FileText,
  Eye,
  ChefHat,
  Send,
  MoveUp,
  MoveDown,
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
  UtensilsCrossed,
  Info,
  Edit3,
  GripVertical,
  Check,
} from 'lucide-react';
import RecipeGalleryViewer from '@/components/recipes/RecipeGalleryViewer';
import RecipeIngredientsList from '@/components/recipes/RecipeIngredientsList';
import RecipeStepsList from '@/components/recipes/RecipeStepsList';
import RecipeNutritionCard from '@/components/recipes/RecipeNutritionCard';

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
  onSwitchToStudio?: () => void;
}

// Danh sách ảnh mẫu chất lượng cao
const sampleImages = [
  { label: 'Phở bò Hà Nội', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80' },
  { label: 'Bò xào súp lơ', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Bánh mì chảo xíu mại', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80' },
  { label: 'Canh chua cá lóc', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80' },
];

export default function RecipeForm({
  initialValues,
  isEdit = false,
  isSubmitting,
  serverError,
  onSubmit,
  onSwitchToStudio,
}: RecipeFormProps) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Stepper 4 bước chuẩn mockup: 1. Thông tin cơ bản -> 2. Nguyên liệu -> 3. Công thức -> 4. Hoàn tất
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Sub-tabs trong cột trái: 'steps' (Quy trình chế biến) | 'ingredients' (Nguyên liệu chi tiết) | 'notes' (Ghi chú & Mẹo) | 'gallery' (Hình ảnh bổ sung)
  const [subTab, setSubTab] = useState<'steps' | 'ingredients' | 'notes' | 'gallery'>('steps');

  // Modal xem trước toàn màn hình
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [submitTarget, setSubmitTarget] = useState<'draft' | 'publish' | 'archive'>('draft');

  // Thư viện hình ảnh
  const [galleryItems, setGalleryItems] = useState<GalleryFileItem[]>(() => {
    if (initialValues?.primaryImageUrl) {
      return [
        {
          id: 'initial-primary',
          previewUrl: initialValues.primaryImageUrl,
          isPrimary: true,
          name: 'Ảnh đại diện chính',
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

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
      cookTimeMinutes: initialValues?.cookTimeMinutes ?? 20,
      servings: initialValues?.servings ?? 2,
      difficulty: initialValues?.difficulty ?? 1,
      calories: initialValues?.calories ?? 0,
      protein: initialValues?.protein ?? 0,
      carbs: initialValues?.carbs ?? 0,
      fat: initialValues?.fat ?? 0,
      ingredients:
        initialValues?.ingredients && initialValues.ingredients.length > 0
          ? initialValues.ingredients
          : [
              { name: 'Thịt bò tươi', quantity: 300, unit: 'g', notes: 'Thái lát mỏng' },
              { name: 'Bông cải xanh (Súp lơ)', quantity: 200, unit: 'g', notes: 'Cắt miếng vừa ăn' },
              { name: 'Cà rốt', quantity: 1, unit: 'củ', notes: 'Gọt vỏ tỉa hoa' },
            ],
      steps:
        initialValues?.steps && initialValues.steps.length > 0
          ? initialValues.steps
          : [
              {
                title: 'Sơ chế nguyên liệu',
                description: 'Thịt bò rửa sạch, thái lát mỏng vừa ăn. Bông cải xanh chẻ nhỏ ngâm nước muối loãng. Cà rốt tỉa hoa.',
                timerMinutes: 10,
              },
              {
                title: 'Xào rau củ thanh ngọt',
                description: 'Phi thơm tỏi băm, cho cà rốt và bông cải xanh vào xào chín tới cùng 1 thìa hạt nêm.',
                timerMinutes: 5,
              },
              {
                title: 'Xào thịt bò và hoàn thiện',
                description: 'Xào thịt bò lửa lớn trong 3 phút cho chín mềm, đảo đều cùng rau củ, rắc tiêu đen và dọn ra đĩa.',
                timerMinutes: 5,
              },
            ],
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
          if (!watchedCategoryId && data.length > 0) {
            setValue('categoryId', data[0].id);
          }
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingCategories(false);
      });
    return () => {
      isMounted = false;
    };
  }, [setValue, watchedCategoryId]);

  // Xử lý chọn nhiều tệp ảnh
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
        setUploadError(`Định dạng tệp "${file.name}" không hợp lệ. Hỗ trợ JPEG, PNG, WebP hoặc AVIF.`);
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

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (secondaryFileInputRef.current) secondaryFileInputRef.current.value = '';
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
  const handleAddFromUrl = (url: string, label = 'Ảnh món ăn') => {
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

  // Điền mẫu hoàn chỉnh (Ẩm thực Việt Nam: Bò xào bông cải xanh sốt tỏi & Bánh mì chảo)
  const handleFillSample = () => {
    setValue('title', 'Bò Xào Bông Cải Xanh Giòn Ngọt');
    setValue(
      'description',
      'Món bò xào bông cải xanh thanh đạm nhưng đậm đà, thịt bò mềm ngọt tự nhiên hòa quyện cùng bông cải xanh giòn sần sật và nước sốt tỏi tiêu thơm lừng.'
    );
    setValue(
      'instructions',
      'Mẹo xào thịt bò mềm không dai: Ướp thịt với một thìa dầu ăn và bột bắp trong 15 phút. Xào trên chảo gang thật nóng với lửa lớn, chỉ đảo nhanh trong 2-3 phút rồi tắt bếp ngay.'
    );
    setValue('prepTimeMinutes', 15);
    setValue('cookTimeMinutes', 20);
    setValue('servings', 3);
    setValue('difficulty', 1);
    setValue('calories', 420);
    setValue('protein', 35);
    setValue('carbs', 18);
    setValue('fat', 14);

    if (categories.length > 0) {
      setValue('categoryId', categories[0].id);
    }

    setValue('ingredients', [
      { name: 'Thịt bò thăn', quantity: 300, unit: 'g', notes: 'Thái mỏng ngang thớ' },
      { name: 'Bông cải xanh (Súp lơ)', quantity: 200, unit: 'g', notes: 'Chẻ vừa ăn, ngâm muối' },
      { name: 'Cà rốt tươi', quantity: 1, unit: 'củ', notes: 'Tỉa hoa thái mỏng' },
      { name: 'Tỏi băm & Hành tím', quantity: 30, unit: 'g', notes: 'Phi thơm vàng' },
      { name: 'Dầu hào & Nước tương', quantity: 2, unit: 'muỗng canh', notes: 'Gia vị xào đậm đà' },
      { name: 'Tiêu đen & Dầu mè', quantity: 1, unit: 'thìa cà phê', notes: 'Tạo mùi thơm cuối cùng' },
    ]);

    setValue('steps', [
      {
        title: 'Sơ chế & Ướp thịt bò',
        description: 'Thịt bò rửa sạch thấm khô, thái lát mỏng. Ướp cùng 1 thìa tỏi băm, 1 thìa dầu hào, 1 thìa dầu ăn để thịt mềm.',
        timerMinutes: 10,
      },
      {
        title: 'Chần sơ bông cải xanh và cà rốt',
        description: 'Đun sôi nồi nước có chút muối, thả bông cải và cà rốt vào chần nhanh trong 1 phút rồi vớt ra ngâm nước đá để giữ màu xanh tươi giòn.',
        timerMinutes: 3,
      },
      {
        title: 'Xào rau củ cùng sốt tỏi',
        description: 'Đun nóng chảo với chút dầu, phi thơm tỏi rồi trút rau củ vào đảo nhanh tay cùng 1 muỗng hạt nêm.',
        timerMinutes: 4,
      },
      {
        title: 'Xào thịt bò & Trình bày đĩa',
        description: 'Bật lửa lớn, cho thịt bò vào xào nhanh 2 phút vừa chín tới, đổ rau củ vào đảo đều 30 giây, rưới chút dầu mè, rắc tiêu và bày ra đĩa thưởng thức.',
        timerMinutes: 3,
      },
    ]);

    if (galleryItems.length === 0) {
      handleAddFromUrl(
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        'Bò xào súp lơ cà rốt'
      );
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
      setActiveStep(1);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  // Gửi form
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

    if (primaryItem && primaryItem.file instanceof File) {
      setIsUploadingPrimary(true);
      try {
        const uploadRes = await fileService.uploadFile(primaryItem.file, 'recipes');
        if (uploadRes?.url) {
          primaryUrl = uploadRes.url;
          formData.primaryImageUrl = uploadRes.url;
        }
      } catch (err: unknown) {
        setUploadError(
          err instanceof Error ? err.message : 'Không thể tải ảnh chính lên hệ thống lưu trữ.'
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

  // Tính toán dữ liệu hiển thị realtime cho Thẻ xem trước
  const selectedCategory = categories.find((c) => c.id === watchedCategoryId);
  const categoryDisplayName = selectedCategory?.name || 'Món Việt Nam';

  const primaryGalleryItem = galleryItems.find((item) => item.isPrimary) || galleryItems[0];
  const effectiveHeroImage =
    selectedPreviewImage ||
    primaryGalleryItem?.previewUrl ||
    watchedImageUrl ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

  const validIngredients = watchedIngredients?.filter((i) => i.name && i.name.trim().length > 0) || [];
  const validSteps = watchedSteps?.filter((s) => s.description && s.description.trim().length > 0) || [];

  const totalTimeMinutes =
    (Number(watchedPrepTime) || 0) + (Number(watchedCookTime) || 0) || 35;

  // Dữ liệu cho modal xem trước toàn màn hình
  const previewImages: RecipeImageDto[] = galleryItems.map((item, idx) => ({
    id: item.id || `preview-img-${idx}`,
    originalUrl: item.previewUrl,
    mediumUrl: item.previewUrl,
    thumbnailUrl: item.previewUrl,
    altText: item.name || watchedTitle || 'Ảnh món ăn',
    isPrimary: item.isPrimary,
    orderIndex: idx,
  }));

  if (previewImages.length === 0 && effectiveHeroImage) {
    previewImages.push({
      id: 'preview-img-primary',
      originalUrl: effectiveHeroImage,
      mediumUrl: effectiveHeroImage,
      thumbnailUrl: effectiveHeroImage,
      altText: watchedTitle || 'Ảnh món ăn',
      isPrimary: true,
      orderIndex: 0,
    });
  }

  const previewIngredients: RecipeIngredientDto[] = validIngredients.map((ing, idx) => ({
    id: `preview-ing-${idx}`,
    name: ing.name,
    quantity: ing.quantity ?? null,
    unit: ing.unit || null,
    notes: ing.notes || null,
    orderIndex: idx + 1,
  }));

  const previewSteps: RecipeStepDto[] = validSteps.map((step, idx) => ({
    id: `preview-step-${idx}`,
    stepNumber: idx + 1,
    title: step.title || `Bước ${idx + 1}`,
    description: step.description,
    timerMinutes: step.timerMinutes ?? null,
    imageUrl: step.imageUrl || null,
  }));

  const previewNutrition: RecipeNutritionDto = {
    calories: watchedCalories ?? null,
    protein: watchedProtein ?? null,
    carbohydrates: watchedCarbs ?? null,
    fat: watchedFat ?? null,
  };

  const hasNutrition = Boolean(
    (watchedCalories && watchedCalories > 0) ||
      (watchedProtein && watchedProtein > 0) ||
      (watchedCarbs && watchedCarbs > 0) ||
      (watchedFat && watchedFat > 0)
  );

  // Mở xem trước ở một trang riêng biệt độc lập (/recipes/preview)
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
        images: previewImages,
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
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* 1. THÔNG BÁO LỖI SERVER HOẶC UPLOAD (NẾU CÓ) */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 shadow-xs animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-red-900">Không thể lưu công thức</h4>
            <p className="mt-0.5 leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 shadow-xs animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-amber-900">Lưu ý kiểm tra thông tin</h4>
            <p className="mt-0.5 leading-relaxed">{uploadError}</p>
          </div>
        </div>
      )}

      {/* 2. THANH TIẾN TRÌNH STEPPER (4 BƯỚC CHUẨN MOCKUP) */}
      <div className="bg-white rounded-2xl border border-stone-200/70 p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {/* Bước 1: Thông tin cơ bản */}
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-3 text-left transition relative group pb-1 ${
              activeStep === 1 ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs transition-colors ${
                activeStep === 1
                  ? 'bg-orange-500 text-white'
                  : 'bg-stone-100 text-stone-600 border border-stone-300'
              }`}
            >
              1
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs sm:text-sm font-bold truncate ${
                  activeStep === 1 ? 'text-orange-600' : 'text-stone-800'
                }`}
              >
                Thông tin cơ bản
              </p>
              <p className="text-[11px] text-stone-400 truncate">(Tên món, mô tả...)</p>
            </div>
            {/* Thanh cam gạch dưới chỉ báo active */}
            {activeStep === 1 && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>

          {/* Bước 2: Nguyên liệu */}
          <button
            type="button"
            onClick={() => {
              setActiveStep(2);
              setSubTab('ingredients');
            }}
            className={`flex items-center gap-3 text-left transition relative group pb-1 ${
              activeStep === 2 ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs transition-colors ${
                activeStep === 2
                  ? 'bg-orange-500 text-white'
                  : 'bg-stone-100 text-stone-600 border border-stone-300'
              }`}
            >
              2
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs sm:text-sm font-bold truncate ${
                  activeStep === 2 ? 'text-orange-600' : 'text-stone-800'
                }`}
              >
                Nguyên liệu
              </p>
              <p className="text-[11px] text-stone-400 truncate">(Danh sách nguyên liệu)</p>
            </div>
            {activeStep === 2 && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>

          {/* Bước 3: Công thức */}
          <button
            type="button"
            onClick={() => {
              setActiveStep(3);
              setSubTab('steps');
            }}
            className={`flex items-center gap-3 text-left transition relative group pb-1 ${
              activeStep === 3 ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs transition-colors ${
                activeStep === 3
                  ? 'bg-orange-500 text-white'
                  : 'bg-stone-100 text-stone-600 border border-stone-300'
              }`}
            >
              3
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs sm:text-sm font-bold truncate ${
                  activeStep === 3 ? 'text-orange-600' : 'text-stone-800'
                }`}
              >
                Công thức
              </p>
              <p className="text-[11px] text-stone-400 truncate">(Các bước chế biến)</p>
            </div>
            {activeStep === 3 && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>

          {/* Bước 4: Hoàn tất */}
          <button
            type="button"
            onClick={() => {
              setActiveStep(4);
              handleOpenNewPagePreview();
            }}
            className={`flex items-center gap-3 text-left transition relative group pb-1 ${
              activeStep === 4 ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs transition-colors ${
                activeStep === 4
                  ? 'bg-orange-500 text-white'
                  : 'bg-stone-100 text-stone-600 border border-stone-300'
              }`}
            >
              4
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs sm:text-sm font-bold truncate ${
                  activeStep === 4 ? 'text-orange-600' : 'text-stone-800'
                }`}
              >
                Hoàn tất
              </p>
              <p className="text-[11px] text-stone-400 truncate">(Xem trước & Lưu)</p>
            </div>
            {activeStep === 4 && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* 3. BỐ CỤC CHÍNH 2 CỘT: CỘT TRÁI FORM (65%) + CỘT PHẢI LIVE PREVIEW CARD (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            CỘT TRÁI (FORM NHẬP LIỆU CHÍNH TÍCH HỢP SUB-TABS)
            ========================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* KHỐI 1: THÔNG TIN CƠ BẢN & DINH DƯỠNG */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-6">
            {/* Header Khối 1 */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-600">
                  <Info className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-stone-900">Thông tin cơ bản</h3>
              </div>

              {/* Nút điền nhanh mẫu nếu chưa có dữ liệu */}
              <button
                type="button"
                onClick={handleFillSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold border border-orange-200 transition active:scale-95"
                title="Tự động điền dữ liệu thực tế chuẩn vị"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Điền mẫu nhanh</span>
              </button>
            </div>

            {/* Nội dung bên trong: Cột upload ảnh + Cột Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* CỘT UPLOAD ẢNH ĐẠI DIỆN VÀ THUMBNAIL (md:col-span-4) */}
              <div className="md:col-span-4 space-y-3">
                {/* 1. Ô vuông upload đại diện lớn */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-square rounded-2xl border-2 border-dashed border-stone-300 hover:border-orange-500 bg-stone-50/70 p-4 flex flex-col items-center justify-center text-center cursor-pointer group transition-all overflow-hidden"
                >
                  {effectiveHeroImage ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveMediaUrl(effectiveHeroImage)}
                        alt={watchedTitle || 'Ảnh đại diện'}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <span className="px-3 py-1.5 rounded-xl bg-white text-stone-900 text-xs font-bold shadow-xs">
                          Đổi ảnh
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2 text-orange-500 group-hover:scale-105 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-stone-800">Tải ảnh đại diện</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">Kéo thả ảnh hoặc chọn file</p>
                      <button
                        type="button"
                        className="mt-3 px-4 py-1.5 rounded-xl bg-orange-500 group-hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition"
                      >
                        Chọn ảnh
                      </button>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    onChange={handleMultipleFilesChange}
                    className="hidden"
                  />
                </div>

                {/* 2. Dải thumbnail 3 ảnh nhỏ + nút [+] thêm ảnh */}
                <div className="flex items-center gap-2 pt-1">
                  {galleryItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSetPrimary(item.id)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border cursor-pointer group transition ${
                        item.isPrimary
                          ? 'border-orange-500 ring-2 ring-orange-200'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveMediaUrl(item.previewUrl)}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                      {item.isPrimary && (
                        <span className="absolute top-1 left-1 w-3.5 h-3.5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[8px]">
                          ★
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.id);
                        }}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] hover:bg-red-600 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Nút thêm ảnh phụ [+] */}
                  <button
                    type="button"
                    onClick={() => secondaryFileInputRef.current?.click()}
                    className="w-14 h-14 rounded-xl border-2 border-dashed border-stone-300 hover:border-orange-500 bg-stone-50 hover:bg-orange-50/50 flex items-center justify-center text-stone-400 hover:text-orange-600 transition"
                    title="Thêm ảnh phụ vào thư viện"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <input
                    ref={secondaryFileInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    onChange={handleMultipleFilesChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* CỘT FORM FIELDS CƠ BẢN (md:col-span-8) */}
              <div className="md:col-span-8 space-y-4">
                {/* Hàng 1: Tên công thức & Danh mục */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                  <div className="sm:col-span-7 space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Tên công thức <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('title')}
                      disabled={isSubmitting}
                      placeholder="Nhập tên công thức..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs sm:text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                    {errors.title && (
                      <p className="text-[11px] font-semibold text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-5 space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('categoryId')}
                        disabled={isSubmitting || isLoadingCategories}
                        className="w-full rounded-xl border border-stone-300 p-2.5 text-xs font-medium outline-none transition focus:border-orange-500 bg-white pr-8"
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <UtensilsCrossed className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Hàng 2: 4 ô thông số Thời gian chuẩn bị, Thời gian nấu, Khẩu phần, Độ khó */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-stone-600">
                      Thời gian chuẩn bị
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        {...register('prepTimeMinutes', { valueAsNumber: true })}
                        disabled={isSubmitting}
                        min="0"
                        placeholder="0"
                        className="w-full rounded-xl border border-stone-300 py-2 pl-7 pr-2 text-xs font-medium outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-stone-600">
                      Thời gian nấu
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-orange-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        {...register('cookTimeMinutes', { valueAsNumber: true })}
                        disabled={isSubmitting}
                        min="0"
                        placeholder="0"
                        className="w-full rounded-xl border border-stone-300 py-2 pl-7 pr-2 text-xs font-medium outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-stone-600">
                      Khẩu phần
                    </label>
                    <div className="relative">
                      <Users className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        {...register('servings', { valueAsNumber: true })}
                        disabled={isSubmitting}
                        min="1"
                        placeholder="1"
                        className="w-full rounded-xl border border-stone-300 py-2 pl-7 pr-2 text-xs font-medium outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-stone-600">
                      Độ khó
                    </label>
                    <select
                      {...register('difficulty', { valueAsNumber: true })}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-stone-300 py-2 px-2 text-xs font-medium outline-none focus:border-orange-500 bg-white"
                    >
                      <option value={1}>Dễ</option>
                      <option value={2}>Trung bình</option>
                      <option value={3}>Khó</option>
                      <option value={4}>Chuyên gia</option>
                    </select>
                  </div>
                </div>

                {/* Hàng 3: Mô tả ngắn */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-700">
                      Mô tả ngắn <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-stone-400">
                      {watchedDescription?.length || 0}/200
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={200}
                    {...register('description')}
                    disabled={isSubmitting}
                    placeholder="Nhập mô tả ngắn về món ăn..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 leading-relaxed"
                  />
                  {errors.description && (
                    <p className="text-[11px] font-semibold text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dưới cùng Khối 1: Giá trị dinh dưỡng (4 ô nằm ngang chuẩn mockup) */}
            <div className="pt-3 border-t border-stone-100 space-y-2.5">
              <label className="block text-xs font-bold text-stone-700">
                Giá trị dinh dưỡng <span className="text-stone-400 font-normal">(tùy chọn)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2.5 p-2 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-stone-500 font-medium">Calo</p>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        {...register('calories', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        className="w-full text-xs font-bold text-stone-800 bg-transparent outline-none p-0"
                      />
                      <span className="text-[10px] text-stone-400 shrink-0">kcal</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-stone-500 font-medium">Protein</p>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        {...register('protein', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        className="w-full text-xs font-bold text-stone-800 bg-transparent outline-none p-0"
                      />
                      <span className="text-[10px] text-stone-400 shrink-0">g</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-stone-500 font-medium">Carbs</p>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        {...register('carbs', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        className="w-full text-xs font-bold text-stone-800 bg-transparent outline-none p-0"
                      />
                      <span className="text-[10px] text-stone-400 shrink-0">g</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl border border-stone-200 bg-stone-50/50">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-stone-500 font-medium">Chất béo</p>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        {...register('fat', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        className="w-full text-xs font-bold text-stone-800 bg-transparent outline-none p-0"
                      />
                      <span className="text-[10px] text-stone-400 shrink-0">g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KHỐI 2: SUB-TABS CHỨC NĂNG CHI TIẾT (QUY TRÌNH / NGUYÊN LIỆU / MẸO / ẢNH) */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            {/* Header Tabs Navigation */}
            <div className="border-b border-stone-200 bg-stone-50/60 px-4 pt-2 flex items-center gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSubTab('steps')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition rounded-t-xl shrink-0 ${
                  subTab === 'steps'
                    ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>Quy trình chế biến</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-700">
                  {stepFields.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab('ingredients')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition rounded-t-xl shrink-0 ${
                  subTab === 'ingredients'
                    ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Nguyên liệu chi tiết</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
                  {ingredientFields.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab('notes')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition rounded-t-xl shrink-0 ${
                  subTab === 'notes'
                    ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Ghi chú & Mẹo nhỏ</span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab('gallery')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition rounded-t-xl shrink-0 ${
                  subTab === 'gallery'
                    ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-500 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Hình ảnh bổ sung</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
                  {galleryItems.length}
                </span>
              </button>
            </div>

            {/* TAB CONTENT 1: QUY TRÌNH CHẾ BIẾN (CÁC BƯỚC NẤU) */}
            {subTab === 'steps' && (
              <div className="p-5 sm:p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Các bước chế biến</h4>
                    <p className="text-[11px] text-stone-400">
                      Hướng dẫn từng bước thực hiện rõ ràng kèm hình ảnh và số phút đếm ngược
                    </p>
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-500 text-orange-600 hover:bg-orange-50 text-xs font-bold transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm bước</span>
                  </button>
                </div>

                {/* Danh sách các bước */}
                <div className="space-y-3">
                  {stepFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="rounded-2xl border border-stone-200 bg-white p-3.5 sm:p-4 space-y-2.5 relative group hover:border-orange-300 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {/* Số bước hình tròn cam */}
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            {...register(`steps.${idx}.title`)}
                            placeholder={`Tiêu đề bước ${idx + 1} (VD: Sơ chế nguyên liệu...)`}
                            className="font-bold text-xs sm:text-sm text-stone-900 bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-stone-400 placeholder:font-normal w-full"
                          />
                        </div>

                        {/* Thời gian và Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="inline-flex items-center gap-1 text-[11px] text-stone-500 bg-stone-50 px-2 py-1 rounded-lg border border-stone-200">
                            <Clock className="w-3 h-3 text-orange-500" />
                            <input
                              type="number"
                              {...register(`steps.${idx}.timerMinutes`, { valueAsNumber: true })}
                              placeholder="0"
                              min="0"
                              className="w-8 text-center font-bold text-stone-800 bg-transparent outline-none p-0"
                            />
                            <span>phút</span>
                          </div>

                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => moveStep(idx, idx - 1)}
                              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                              title="Chuyển lên"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {idx < stepFields.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveStep(idx, idx + 1)}
                              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                              title="Chuyển xuống"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {stepFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStep(idx)}
                              className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
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
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 text-xs outline-none transition focus:bg-white focus:border-orange-500 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: NGUYÊN LIỆU CHI TIẾT */}
            {subTab === 'ingredients' && (
              <div className="p-5 sm:p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Danh sách nguyên liệu</h4>
                    <p className="text-[11px] text-stone-400">
                      Khai báo tên và định lượng rõ ràng giúp người nấu chuẩn bị đầy đủ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendIngredient({ name: '', quantity: null, unit: '', notes: '' })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-500 text-orange-600 hover:bg-orange-50 text-xs font-bold transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm nguyên liệu</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {ingredientFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-200 transition"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-5 text-center text-xs font-bold text-stone-400">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          {...register(`ingredients.${idx}.name`)}
                          placeholder="Tên nguyên liệu (VD: Thịt bò, Nước mắm...)"
                          className="flex-1 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="any"
                          {...register(`ingredients.${idx}.quantity`, {
                            setValueAs: (v) => (v === '' ? null : Number(v)),
                          })}
                          placeholder="Số lượng"
                          className="w-20 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs outline-none focus:border-orange-500 text-right"
                        />
                        <input
                          type="text"
                          {...register(`ingredients.${idx}.unit`)}
                          placeholder="Đơn vị (g, ml, quả)"
                          className="w-24 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs outline-none focus:border-orange-500"
                        />
                        <input
                          type="text"
                          {...register(`ingredients.${idx}.notes`)}
                          placeholder="Ghi chú (tùy chọn)"
                          className="w-28 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs outline-none focus:border-orange-500 hidden sm:block"
                        />
                        {ingredientFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIngredient(idx)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Xóa nguyên liệu này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: GHI CHÚ & MẸO NHỎ */}
            {subTab === 'notes' && (
              <div className="p-5 sm:p-6 space-y-4 animate-fade-in">
                <div className="pb-2 border-b border-stone-100">
                  <h4 className="text-sm font-bold text-stone-900">Bí quyết & Mẹo nấu ăn gia truyền</h4>
                  <p className="text-[11px] text-stone-400">
                    Chia sẻ các lưu ý khi chọn nguyên liệu tươi ngon hoặc bí quyết nêm nếm
                  </p>
                </div>
                <textarea
                  rows={6}
                  {...register('instructions')}
                  disabled={isSubmitting}
                  placeholder="Ghi lại các bí quyết, lưu ý khi nêm nếm gia vị hoặc cách bảo quản món ăn để hương vị luôn thơm ngon nhất..."
                  className="w-full rounded-xl border border-stone-300 p-3.5 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 leading-relaxed"
                />
              </div>
            )}

            {/* TAB CONTENT 4: HÌNH ẢNH BỔ SUNG */}
            {subTab === 'gallery' && (
              <div className="p-5 sm:p-6 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Thư viện ảnh món ăn ({galleryItems.length})</h4>
                    <p className="text-[11px] text-stone-400">
                      Tải lên nhiều góc chụp hoặc ảnh thành phẩm hấp dẫn
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => secondaryFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tải ảnh mới</span>
                    </button>
                  </div>
                </div>

                {/* Form dán URL ảnh trực tiếp */}
                <div className="flex items-center gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Dán đường dẫn ảnh: https://images.unsplash.com/photo-..."
                    className="flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-xs outline-none focus:border-orange-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFromUrl(urlInput)}
                    className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-black transition shrink-0"
                  >
                    Thêm link
                  </button>
                </div>

                {/* Lưới các ảnh trong thư viện */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {galleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-4/3 rounded-xl overflow-hidden border border-stone-200 group bg-stone-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveMediaUrl(item.previewUrl)}
                        alt="Gallery"
                        className="w-full h-full object-cover"
                      />
                      {item.isPrimary && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-orange-600 text-white text-[9px] font-bold shadow-xs">
                          Ảnh đại diện
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        {!item.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(item.id)}
                            className="px-2 py-1 rounded bg-white text-stone-900 text-[10px] font-bold hover:bg-orange-50 hover:text-orange-600 transition"
                          >
                            Đặt làm chính
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 rounded bg-red-600 text-white text-[10px] hover:bg-red-700 transition"
                          title="Xóa ảnh"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Banner thông báo mẹo kéo thả (màu xanh nhạt chuẩn mockup) */}
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-700 font-medium">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Bạn có thể thêm nhiều bước chế biến và sắp xếp thứ tự dễ dàng.</span>
          </div>
        </div>

        {/* =========================================================================
            CỘT PHẢI (WIDGET XEM TRƯỚC CÔNG THỨC - LIVE PREVIEW CARD DÍNH NỔI STICKY)
            ========================================================================= */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          {/* Card Live Preview Container */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            {/* Header Thẻ Xem trước */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-orange-500 font-bold">🍳</span>
                <h4 className="text-sm font-bold text-stone-900">Xem trước công thức</h4>
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                Live Preview
              </span>
            </div>

            {/* 1. Ảnh món ăn lớn có Badge danh mục nổi trên ảnh */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMediaUrl(effectiveHeroImage)}
                alt={watchedTitle || 'Preview'}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {/* Badge danh mục góc trái trên ảnh */}
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-stone-800 text-[11px] font-bold shadow-xs">
                <span>🥗</span>
                <span>{categoryDisplayName}</span>
              </div>
            </div>

            {/* 2. Thân card thông tin chi tiết */}
            <div className="p-4 sm:p-5 space-y-3.5">
              {/* Tiêu đề công thức cập nhật realtime */}
              <h3 className="text-base font-bold text-stone-900 line-clamp-2 leading-snug">
                {watchedTitle?.trim() || 'Tên công thức sẽ hiển thị ở đây'}
              </h3>

              {/* Mô tả ngắn cập nhật realtime */}
              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                {watchedDescription?.trim() || 'Mô tả ngắn về món ăn sẽ xuất hiện tại đây...'}
              </p>

              {/* Hàng 3 thông số nhanh: Thời gian | Độ khó | Khẩu phần */}
              <div className="flex items-center justify-between py-2 border-y border-stone-100 text-xs text-stone-600 font-medium">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{totalTimeMinutes} phút</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5 text-stone-400" />
                  <span>{difficultyLabels[watchedDifficulty || 1]?.label || 'Dễ'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>{watchedServings || 2} người</span>
                </div>
              </div>

              {/* Mục Nguyên liệu chính thu nhỏ */}
              <div className="space-y-2 pt-1">
                <h5 className="text-xs font-bold text-stone-800">Nguyên liệu chính</h5>
                <div className="space-y-2">
                  {validIngredients.slice(0, 3).map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {ing.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-stone-800 truncate">{ing.name}</span>
                      </div>
                      <span className="text-stone-400 font-medium text-[11px] shrink-0">
                        {ing.quantity ? `${ing.quantity} ${ing.unit || ''}` : ing.unit || ''}
                      </span>
                    </div>
                  ))}
                  {validIngredients.length === 0 && (
                    <p className="text-xs text-stone-400 italic">Chưa nhập nguyên liệu...</p>
                  )}
                </div>
              </div>

              {/* Link Xem chi tiết -> mở trang riêng biệt */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleOpenNewPagePreview}
                  className="text-orange-600 hover:text-orange-700 font-bold text-xs inline-flex items-center gap-1 transition"
                  title="Mở xem trước ở trang riêng biệt (/recipes/preview)"
                >
                  <span>Xem chi tiết trang riêng</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Banner chuyển sang Recipe Studio (nếu có callback) */}
          {onSwitchToStudio && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-blue-950">Recipe Studio</h5>
                  <p className="text-[10px] text-blue-700/80">Biên tập nâng cao 5 tab</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onSwitchToStudio}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs shrink-0 active:scale-95"
              >
                Mở Studio 🎛️
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. THANH HÀNH ĐỘNG DƯỚI CÙNG (FOOTER ACTIONS BAR CHUẨN MOCKUP) */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            {isEdit ? 'Đang cập nhật công thức' : 'Bản nháp tự động lưu trên trình duyệt của bạn'}
          </span>
        </div>

        {/* 3 Nút chuẩn mockup: [Xem trước] [Lưu nháp] [Đăng bài] */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Nút 1: Xem trước ở trang riêng */}
          <button
            type="button"
            onClick={handleOpenNewPagePreview}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 hover:border-orange-300 bg-white hover:bg-orange-50/50 text-stone-700 hover:text-orange-600 text-xs font-bold transition active:scale-95 shadow-xs"
            title="Mở xem trước ở trang riêng biệt (/recipes/preview)"
          >
            <Eye className="w-3.5 h-3.5 text-orange-600" />
            <span>Xem trước (Trang riêng ↗)</span>
          </button>

          {/* Nút 2: Lưu nháp */}
          <button
            type="button"
            onClick={() => triggerSubmitWithTarget('draft')}
            disabled={isSubmitting || isUploadingPrimary}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-orange-300 hover:border-orange-500 bg-white hover:bg-orange-50 text-orange-600 text-xs font-bold transition active:scale-95 disabled:opacity-50"
          >
            {isSubmitting && submitTarget === 'draft' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Lưu nháp</span>
          </button>

          {/* Nút 3: Đăng bài (Gradient cam nổi bật) */}
          <button
            type="button"
            onClick={() => triggerSubmitWithTarget('publish')}
            disabled={isSubmitting || isUploadingPrimary}
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition active:scale-95 disabled:opacity-50"
          >
            {isSubmitting && submitTarget === 'publish' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Đăng bài</span>
          </button>
        </div>
      </div>

      {/* 5. MODAL XEM TRƯỚC TOÀN CẢNH BÀI VIẾT (FULL PREVIEW MODAL) */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Xem trước toàn cảnh công thức</h3>
                  <p className="text-xs text-stone-400">Hiển thị chuẩn như trang chi tiết công khai</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center text-xs font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Tiêu đề & Danh mục */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                    {categoryDisplayName}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
                    Độ khó: {difficultyLabels[watchedDifficulty || 1]?.label || 'Dễ'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {watchedTitle || 'Tiêu đề công thức'}
                </h1>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {watchedDescription || 'Chưa có mô tả ngắn...'}
                </p>
              </div>

              {/* Gallery ảnh */}
              <RecipeGalleryViewer
                images={previewImages}
                recipeTitle={watchedTitle || 'Công thức'}
              />

              {/* 4 Chỉ số nhanh */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-[11px] text-stone-400">Chuẩn bị</p>
                    <p className="text-xs font-bold text-stone-900">{watchedPrepTime || 0} phút</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-[11px] text-stone-400">Thời gian nấu</p>
                    <p className="text-xs font-bold text-stone-900">{watchedCookTime || 0} phút</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-[11px] text-stone-400">Tổng thời gian</p>
                    <p className="text-xs font-bold text-stone-900">{totalTimeMinutes} phút</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-[11px] text-stone-400">Khẩu phần</p>
                    <p className="text-xs font-bold text-stone-900">{watchedServings || 1} người</p>
                  </div>
                </div>
              </div>

              {/* Dinh dưỡng */}
              {hasNutrition && <RecipeNutritionCard nutrition={previewNutrition} />}

              {/* Bố cục 2 cột: Nguyên liệu & Các bước làm */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="md:col-span-1">
                  <RecipeIngredientsList
                    ingredients={previewIngredients}
                    servings={watchedServings || 1}
                  />
                </div>
                <div className="md:col-span-2">
                  <RecipeStepsList
                    steps={previewSteps}
                    instructions={watchedInstructions}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-stone-100 flex items-center justify-between bg-stone-50/70 shrink-0">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
              >
                Quay lại chỉnh sửa
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPreviewModal(false);
                    triggerSubmitWithTarget('draft');
                  }}
                  className="px-4 py-2 rounded-xl border border-orange-300 text-orange-600 text-xs font-bold hover:bg-orange-50 transition"
                >
                  Lưu nháp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPreviewModal(false);
                    triggerSubmitWithTarget('publish');
                  }}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition"
                >
                  Đăng bài ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
