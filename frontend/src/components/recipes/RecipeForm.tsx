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
  Maximize2,
  Minimize2,
} from 'lucide-react';
import RecipeGalleryViewer from '@/components/recipes/RecipeGalleryViewer';
import RecipeIngredientsList from '@/components/recipes/RecipeIngredientsList';
import RecipeStepsList from '@/components/recipes/RecipeStepsList';
import RecipeNutritionCard from '@/components/recipes/RecipeNutritionCard';
import RecipeLivePreviewWidget from '@/components/recipes/RecipeLivePreviewWidget';
import ServingsAdjustmentModal from '@/components/recipes/ServingsAdjustmentModal';

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
  currentStatus?: 'Draft' | 'Published' | 'Archived' | number | string;
  isSubmitting: boolean;
  serverError?: string | null;
  onSubmit: (
    data: RecipeFormData,
    secondaryFiles?: File[],
    targetStatus?: 'draft' | 'publish' | 'archive'
  ) => Promise<void>;
}

// Danh sách công thức mẫu Việt Nam phong phú cho chức năng Điền mẫu nhanh
const sampleRecipes = [
  {
    title: 'Bò Xào Bông Cải Xanh Giòn Ngọt',
    description:
      'Món bò xào bông cải xanh thanh đạm nhưng đậm đà, thịt bò mềm ngọt tự nhiên hòa quyện cùng bông cải xanh giòn sần sật và nước sốt tỏi tiêu thơm lừng.',
    instructions:
      'Mẹo xào thịt bò mềm không dai: Ướp thịt với một thìa dầu ăn và bột bắp trong 15 phút. Xào trên chảo gang thật nóng với lửa lớn, chỉ đảo nhanh trong 2-3 phút rồi tắt bếp ngay.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 3,
    difficulty: 1,
    calories: 420,
    protein: 35,
    carbs: 18,
    fat: 14,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Bò xào súp lơ cà rốt',
    ingredients: [
      { name: 'Thịt bò thăn', quantity: 300, unit: 'g', notes: 'Thái mỏng ngang thớ' },
      { name: 'Bông cải xanh (Súp lơ)', quantity: 200, unit: 'g', notes: 'Chẻ vừa ăn, ngâm muối' },
      { name: 'Cà rốt tươi', quantity: 1, unit: 'củ', notes: 'Tỉa hoa thái mỏng' },
      { name: 'Tỏi băm & Hành tím', quantity: 30, unit: 'g', notes: 'Phi thơm vàng' },
      { name: 'Dầu hào & Nước tương', quantity: 2, unit: 'muỗng canh', notes: 'Gia vị xào đậm đà' },
      { name: 'Tiêu đen & Dầu mè', quantity: 1, unit: 'thìa cà phê', notes: 'Tạo mùi thơm cuối cùng' },
    ],
    steps: [
      {
        title: 'Sơ chế & Ướp thịt bò',
        description: 'Thịt bò rửa sạch thấm khô, thái lát mỏng. Ướp cùng 1 thìa tỏi băm, 1 thìa dầu hào, 1 thìa dầu ăn để thịt mềm.',
        timerMinutes: 10,
        imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Chần sơ bông cải xanh và cà rốt',
        description: 'Đun sôi nồi nước có chút muối, thả bông cải và cà rốt vào chần nhanh trong 1 phút rồi vớt ra ngâm nước đá để giữ màu xanh tươi giòn.',
        timerMinutes: 3,
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Xào rau củ cùng sốt tỏi',
        description: 'Đun nóng chảo với chút dầu, phi thơm tỏi rồi trút rau củ vào đảo nhanh tay cùng 1 muỗng hạt nêm.',
        timerMinutes: 4,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Xào thịt bò & Trình bày đĩa',
        description: 'Bật lửa lớn, cho thịt bò vào xào nhanh 2 phút vừa chín tới, đổ rau củ vào đảo đều 30 giây, rưới chút dầu mè, rắc tiêu và bày ra đĩa thưởng thức.',
        timerMinutes: 3,
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    title: 'Canh Chua Cá Hồi Kiểu Nam Bộ',
    description:
      'Món canh chua cá hồi béo ngậy thơm ngon, nước canh chua dịu thanh mát từ me và cà chua, thơm mùi ngò ôm, ngò gai ăn kèm bún hoặc cơm nóng cực cuốn.',
    instructions:
      'Bí quyết nấu cá hồi không tanh: Rửa cá qua rượu trắng và gừng đập dập. Thả cá vào nồi khi nước sôi bùng và không đậy nắp trong lúc nấu.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servings: 4,
    difficulty: 2,
    calories: 380,
    protein: 32,
    carbs: 14,
    fat: 16,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Canh chua cá hồi Nam Bộ',
    ingredients: [
      { name: 'Đầu hoặc phi lê cá hồi', quantity: 400, unit: 'g', notes: 'Rửa sạch thấm khô' },
      { name: 'Cốt me chua', quantity: 50, unit: 'g', notes: 'Ngâm nước ấm lấy nước cốt' },
      { name: 'Dọc mùng (Bạc hà)', quantity: 150, unit: 'g', notes: 'Tước vỏ, bóp muối' },
      { name: 'Đậu bắp & Cà chua', quantity: 200, unit: 'g', notes: 'Cắt lát chéo vừa ăn' },
      { name: 'Giá đỗ & Thơm (Dứa)', quantity: 150, unit: 'g', notes: 'Rửa sạch để ráo' },
      { name: 'Ngò ôm, ngò gai, ớt tươi', quantity: 30, unit: 'g', notes: 'Cắt nhỏ rắc lên mặt canh' },
    ],
    steps: [
      {
        title: 'Sơ chế nguyên liệu & Nấu nước dùng chua',
        description: 'Đun sôi 1.2 lít nước, cho nước cốt me và thơm vào nấu sôi lăn tăn để tạo vị chua ngọt tự nhiên.',
        timerMinutes: 8,
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Thả cá hồi & Vớt bọt',
        description: 'Khi nước sôi bùng, thả cá hồi vào nấu chín trong 5-7 phút, chú ý hớt bọt kỹ để nước canh trong vắt.',
        timerMinutes: 6,
        imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Cho rau quả & Nêm gia vị',
        description: 'Cho cà chua, đậu bắp, bạc hà vào nấu 2 phút, thêm nước mắm ngon, đường phèn cho vừa khẩu vị đậm đà.',
        timerMinutes: 4,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Hoàn tất & Thưởng thức',
        description: 'Tắt bếp, cho giá đỗ, rắc ngò ôm, ngò gai và vài lát ớt chỉ thiên lên trên, múc ra tô lớn thưởng thức khi còn nóng.',
        timerMinutes: 2,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    title: 'Bánh Mì Chảo Thập Cẩm Sài Gòn',
    description:
      'Chảo bánh mì nóng hổi xèo xèo với trứng ốp la lòng đào, pate béo ngậy, xúc xích rán giòn và xíu mại thơm lừng chấm cùng sốt cà chua sánh mịn.',
    instructions:
      'Bí quyết nước sốt sánh ngon: Phi thơm tỏi tây và hành tím, dùng cà chua tươi băm nhuyễn xào nhừ rồi nêm chút dầu hào và bơ lạt.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 2,
    difficulty: 1,
    calories: 520,
    protein: 26,
    carbs: 45,
    fat: 22,
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80',
    imageAlt: 'Bánh mì chảo thập cẩm Sài Gòn',
    ingredients: [
      { name: 'Trứng gà tươi', quantity: 2, unit: 'quả', notes: 'Ốp la lòng đào' },
      { name: 'Pate gan heo béo', quantity: 80, unit: 'g', notes: 'Áp chảo cho thơm' },
      { name: 'Xúc xích Đức hoặc phô mai', quantity: 2, unit: 'cây', notes: 'Khía chéo nhẹ' },
      { name: 'Xíu mại sốt cà chua', quantity: 2, unit: 'viên', notes: 'Thịt băm nấm mèo' },
      { name: 'Bánh mì giòn', quantity: 2, unit: 'ổ', notes: 'Nướng nóng giòn rụm' },
      { name: 'Dưa leo, ngò rí, tiêu đen', quantity: 50, unit: 'g', notes: 'Ăn kèm chống ngấy' },
    ],
    steps: [
      {
        title: 'Làm nóng chảo gang & Chiên xúc xích, pate',
        description: 'Làm nóng chảo gang nhỏ với 1 thìa bơ lạt, cho xúc xích và miếng pate vào áp chảo vàng xém thơm phức.',
        timerMinutes: 4,
        imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Ốp la trứng & Nấu sốt cà chua',
        description: 'Đập trứng gà vào góc chảo giữ lòng đào, múc 2 muỗng nước sốt xíu mại cà chua nóng hổi rưới quanh chảo.',
        timerMinutes: 3,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Trình bày & Dùng kèm bánh mì',
        description: 'Rắc tiêu xay, trang trí cọng ngò rí và vài lát ớt, dọn kèm đĩa dưa leo thái lát và bánh mì nóng giòn rụm.',
        timerMinutes: 2,
        imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
      },
    ],
  },
];

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
  currentStatus,
  isSubmitting,
  serverError,
  onSubmit,
}: RecipeFormProps) {
  const isStatusPublished = currentStatus === 'Published' || String(currentStatus) === '1';
  const isStatusArchived = currentStatus === 'Archived' || String(currentStatus) === '2';
  const isStatusDraft = currentStatus === 'Draft' || String(currentStatus) === '0' || (!isStatusPublished && !isStatusArchived);

  const [sampleRecipeIndex, setSampleRecipeIndex] = useState(0);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Stepper 4 bước chuẩn mockup: 1. Thông tin cơ bản -> 2. Nguyên liệu -> 3. Công thức -> 4. Hoàn tất
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Chế độ xem: 'edit' (Soạn thảo) | 'preview' (Xem trước toàn cảnh ngay trong Dashboard)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
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
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const instructionsTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingStepIndex, setUploadingStepIndex] = useState<number | null>(null);
  const stepFileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleStepImageUpload = async (stepIndex: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`Tệp ảnh của bước ${stepIndex + 1} vượt quá kích thước 5MB.`);
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setUploadError('Định dạng ảnh không hợp lệ. Vui lòng chọn ảnh JPEG, PNG, WebP hoặc AVIF.');
      return;
    }

    setUploadingStepIndex(stepIndex);
    setUploadError(null);
    try {
      const res = await fileService.uploadFile(file, 'steps');
      if (res?.url) {
        setValue(`steps.${stepIndex}.imageUrl`, res.url);
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Tải ảnh minh họa cho bước thất bại.');
    } finally {
      setUploadingStepIndex(null);
    }
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      instructions: initialValues?.instructions ?? '',
      primaryImageUrl: initialValues?.primaryImageUrl ?? '',
      categoryId: initialValues?.categoryId ?? '',
      prepTimeMinutes: initialValues?.prepTimeMinutes ?? ('' as unknown as number),
      cookTimeMinutes: initialValues?.cookTimeMinutes ?? ('' as unknown as number),
      servings: initialValues?.servings ?? ('' as unknown as number),
      difficulty: initialValues?.difficulty ?? 1,
      calories: initialValues?.calories ?? ('' as unknown as number),
      protein: initialValues?.protein ?? ('' as unknown as number),
      carbs: initialValues?.carbs ?? ('' as unknown as number),
      fat: initialValues?.fat ?? ('' as unknown as number),
      ingredients:
        initialValues?.ingredients && initialValues.ingredients.length > 0
          ? initialValues.ingredients
          : [],
      steps:
        initialValues?.steps && initialValues.steps.length > 0
          ? initialValues.steps
          : [],
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

  // Tự động điều chỉnh chiều cao của khung soạn thảo Bí quyết & Mẹo
  const adjustInstructionsHeight = () => {
    const el = instructionsTextareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const minH = isInstructionsExpanded ? 240 : 100;
    el.style.height = `${Math.max(minH, el.scrollHeight)}px`;
  };

  useEffect(() => {
    if (activeStep === 3) {
      adjustInstructionsHeight();
    }
  }, [activeStep, isInstructionsExpanded, watchedInstructions]);

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

  // Điền mẫu hoàn chỉnh (Luân phiên các món ăn Việt Nam phong phú)
  const handleFillSample = () => {
    const sample = sampleRecipes[sampleRecipeIndex % sampleRecipes.length];
    setSampleRecipeIndex((prev) => prev + 1);

    setValue('title', sample.title);
    setValue('description', sample.description);
    setValue('instructions', sample.instructions);
    setValue('prepTimeMinutes', sample.prepTimeMinutes);
    setValue('cookTimeMinutes', sample.cookTimeMinutes);
    setValue('servings', sample.servings);
    setValue('difficulty', sample.difficulty as 1 | 2 | 3);
    setValue('calories', sample.calories);
    setValue('protein', sample.protein);
    setValue('carbs', sample.carbs);
    setValue('fat', sample.fat);

    if (categories.length > 0) {
      setValue('categoryId', categories[0].id);
    }

    setValue('ingredients', sample.ingredients);
    setValue('steps', sample.steps);

    setGalleryItems([
      {
        id: `sample-${Date.now()}`,
        previewUrl: sample.imageUrl,
        isPrimary: true,
        name: sample.imageAlt,
      },
    ]);
    setValue('primaryImageUrl', sample.imageUrl);
  };

  const onValidationError = (formErrors: FieldErrors<RecipeFormData>) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const errorMap: Record<string, string> = {
        title: 'Vui lòng nhập tên công thức (tối thiểu 5 ký tự).',
        description: 'Vui lòng nhập mô tả ngắn (tối thiểu 10 ký tự).',
        instructions: 'Vui lòng nhập hướng dẫn thực hiện chung (tối thiểu 5 ký tự).',
        categoryId: 'Vui lòng chọn danh mục cho món ăn.',
        prepTimeMinutes: 'Thời gian chuẩn bị tối thiểu 1 phút.',
        cookTimeMinutes: 'Thời gian nấu tối thiểu 1 phút.',
        servings: 'Số khẩu phần tối thiểu 1 người.',
        ingredients: 'Vui lòng kiểm tra lại danh sách nguyên liệu (tên không được để trống).',
        steps: 'Vui lòng kiểm tra lại các bước nấu (mô tả bước không được để trống).',
      };

      const firstKey = errorKeys[0];
      const firstError = formErrors[firstKey as keyof RecipeFormData];
      const rawMsg = firstError?.message ? String(firstError.message) : '';
      const friendlyMessage =
        rawMsg && !rawMsg.includes('Expected') && !rawMsg.includes('received nan')
          ? rawMsg
          : (errorMap[firstKey] || 'Vui lòng kiểm tra lại các trường thông tin bắt buộc còn thiếu.');

      setUploadError(friendlyMessage);
      setViewMode('edit');
      if (errorKeys.includes('ingredients')) {
        setActiveStep(2);
      } else if (errorKeys.includes('steps') || errorKeys.includes('instructions')) {
        setActiveStep(3);
      } else {
        setActiveStep(1);
      }
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
    '';

  const validIngredients = watchedIngredients?.filter((i) => i.name && i.name.trim().length > 0) || [];
  const validSteps = watchedSteps?.filter((s) => s.description && s.description.trim().length > 0) || [];

  const totalTimeMinutes =
    (Number(watchedPrepTime) || 0) + (Number(watchedCookTime) || 0);

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

  // Quản lý Modal điều chỉnh khẩu phần công thức
  const [servingsModalState, setServingsModalState] = useState<{
    isOpen: boolean;
    targetServings: number;
    multiplier: number;
  }>({
    isOpen: false,
    targetServings: 2,
    multiplier: 1,
  });

  const [adjustmentNotice, setAdjustmentNotice] = useState<string | null>(null);

  const handleOpenServingsModal = (targetServings: number, multiplier: number) => {
    setServingsModalState({
      isOpen: true,
      targetServings,
      multiplier,
    });
  };

  const handleConfirmServingsAdjustment = (options: {
    targetServings: number;
    multiplier: number;
    updateIngredients: boolean;
    updateNutrition: boolean;
    updateSteps: boolean;
    modifiedSteps?: Array<{
      title?: string;
      description: string;
      timerMinutes?: number | null;
      imageUrl?: string | null;
    }>;
  }) => {
    // 1. Cập nhật số khẩu phần chính trên form
    setValue('servings', options.targetServings, { shouldDirty: true, shouldValidate: true });

    // 2. Cập nhật Bảng nguyên liệu
    if (options.updateIngredients) {
      const currentIngs = getValues('ingredients') || [];
      const scaled = currentIngs.map((ing) => {
        if (ing.quantity !== null && ing.quantity !== undefined && !isNaN(Number(ing.quantity))) {
          const raw = Number(ing.quantity) * options.multiplier;
          const rounded = raw % 1 === 0 ? raw : Number(raw.toFixed(1));
          return { ...ing, quantity: rounded };
        }
        return ing;
      });
      setValue('ingredients', scaled, { shouldDirty: true, shouldValidate: true });
    }

    // 3. Cập nhật Dinh dưỡng
    if (options.updateNutrition) {
      const currentCal = getValues('calories');
      if (currentCal) setValue('calories', Math.round(Number(currentCal) * options.multiplier), { shouldDirty: true });
      const currentPro = getValues('protein');
      if (currentPro) setValue('protein', Math.round(Number(currentPro) * options.multiplier), { shouldDirty: true });
      const currentCarbs = getValues('carbs');
      if (currentCarbs) setValue('carbs', Math.round(Number(currentCarbs) * options.multiplier), { shouldDirty: true });
      const currentFat = getValues('fat');
      if (currentFat) setValue('fat', Math.round(Number(currentFat) * options.multiplier), { shouldDirty: true });
    }

    // 4. Cập nhật Các bước chế biến (nếu người dùng chọn đồng bộ câu chữ)
    if (options.updateSteps && options.modifiedSteps) {
      setValue('steps', options.modifiedSteps, { shouldDirty: true, shouldValidate: true });
    }

    setAdjustmentNotice(
      `Đã cập nhật công thức theo khẩu phần ${options.targetServings} người (hệ số x${options.multiplier.toFixed(1)}) thành công!`
    );
    setTimeout(() => setAdjustmentNotice(null), 6000);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Thông báo điều chỉnh khẩu phần thành công */}
      {adjustmentNotice && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 shadow-xs animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <div className="flex-1">
            <h4 className="font-bold text-emerald-950">Khẩu phần đã được điều chỉnh</h4>
            <p className="mt-0.5 leading-relaxed">{adjustmentNotice}</p>
          </div>
          <button
            type="button"
            onClick={() => setAdjustmentNotice(null)}
            className="text-emerald-500 hover:text-emerald-700 font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}
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

      {/* 2. THANH TIẾN TRÌNH STEPPER (4 BƯỚC ĐỒNG NHẤT WIZARD) */}
      <div className="bg-white rounded-2xl border border-stone-200/70 p-3 sm:p-4 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 relative">
          {/* Bước 1: Thông tin cơ bản */}
          <button
            type="button"
            onClick={() => {
              setActiveStep(1);
              setViewMode('edit');
            }}
            className={`flex items-center gap-3 text-left transition relative p-2.5 rounded-xl cursor-pointer ${
              activeStep === 1 && viewMode === 'edit'
                ? 'bg-orange-50/80 border border-orange-200 shadow-2xs'
                : 'hover:bg-stone-50 border border-transparent'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs transition-colors ${
                activeStep === 1 && viewMode === 'edit'
                  ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                  : 'bg-stone-100 text-stone-600 border border-stone-300'
              }`}
            >
              1
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs sm:text-sm font-bold truncate ${
                  activeStep === 1 && viewMode === 'edit' ? 'text-orange-600' : 'text-stone-800'
                }`}
              >
                Thông tin cơ bản
              </p>
              <p className="text-[11px] text-stone-400 truncate">Tên món, ảnh, dinh dưỡng</p>
            </div>
          </button>

          {/* Bước 2: Nguyên liệu */}
          <button
            type="button"
            onClick={() => {
              setActiveStep(2);
              setViewMode('edit');
            }}
            className={`flex items-center gap-3 text-left transition relative p-2.5 rounded-xl cursor-pointer ${
              activeStep === 2 && viewMode === 'edit'
                ? 'bg-orange-50/80 border border-orange-200 shadow-2xs'
                : 'hover:bg-stone-50 border border-transparent'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs transition-colors ${
                activeStep === 2 && viewMode === 'edit'
                  ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                  : 'bg-stone-100 text-stone-600 border border-stone-300'
              }`}
            >
              2
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs sm:text-sm font-bold truncate ${
                  activeStep === 2 && viewMode === 'edit' ? 'text-orange-600' : 'text-stone-800'
                }`}
              >
                Nguyên liệu
              </p>
              <p className="text-[11px] text-stone-400 truncate">
                {ingredientFields.length > 0 ? `${ingredientFields.length} nguyên liệu` : 'Định lượng & Khẩu phần'}
              </p>
            </div>
          </button>

          {/* Bước 3: Công thức */}
          <button
            type="button"
            onClick={() => {
              setActiveStep(3);
              setViewMode('edit');
            }}
            className={`flex items-center gap-3 text-left transition relative p-2.5 rounded-xl cursor-pointer ${
              activeStep === 3 && viewMode === 'edit'
                ? 'bg-orange-50/80 border border-orange-200 shadow-2xs'
                : 'hover:bg-stone-50 border border-transparent'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs transition-colors ${
                activeStep === 3 && viewMode === 'edit'
                  ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                  : 'bg-stone-100 text-stone-600 border border-stone-300'
              }`}
            >
              3
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs sm:text-sm font-bold truncate ${
                  activeStep === 3 && viewMode === 'edit' ? 'text-orange-600' : 'text-stone-800'
                }`}
              >
                Quy trình nấu
              </p>
              <p className="text-[11px] text-stone-400 truncate">
                {stepFields.length > 0 ? `${stepFields.length} bước kèm ảnh` : 'Các bước & Bí quyết'}
              </p>
            </div>
          </button>

          {/* Bước 4: Hoàn tất */}
          <button
            type="button"
            onClick={() => {
              setActiveStep(4);
              setViewMode('edit');
            }}
            className={`flex items-center gap-3 text-left transition relative p-2.5 rounded-xl cursor-pointer ${
              activeStep === 4 && viewMode === 'edit'
                ? 'bg-orange-50/80 border border-orange-200 shadow-2xs'
                : 'hover:bg-stone-50 border border-transparent'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs transition-colors ${
                activeStep === 4 && viewMode === 'edit'
                  ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                  : 'bg-stone-100 text-stone-600 border border-stone-300'
              }`}
            >
              4
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs sm:text-sm font-bold truncate ${
                  activeStep === 4 && viewMode === 'edit' ? 'text-orange-600' : 'text-stone-800'
                }`}
              >
                Hoàn tất
              </p>
              <p className="text-[11px] text-stone-400 truncate">Kiểm tra & Xuất bản</p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. BỐ CỤC CHÍNH: XEM TRƯỚC TOÀN CẢNH TRONG DASHBOARD HOẶC FORM CHỈNH SỬA */}
      {viewMode === 'preview' ? (
        <div className="space-y-6 animate-fade-in">
          {/* Thanh công cụ xem trước cố định (Sticky Action Header) */}
          <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setViewMode('edit');
                  setActiveStep(1);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition active:scale-95 shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại chỉnh sửa</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                  <Eye className="w-3.5 h-3.5 text-orange-600" />
                  <span>Xem trước trong Dashboard</span>
                </span>
                <span className="hidden sm:inline text-xs text-stone-400">
                  (Hiển thị trực quan theo giao diện thực tế)
                </span>
              </div>
            </div>

            {/* Cụm nút hành động trạng thái */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button
                type="button"
                onClick={handleOpenNewPagePreview}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 text-xs font-medium transition"
                title="Mở xem trước ở tab trình duyệt mới (/recipes/preview)"
              >
                <span>Tab mới</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              {/* Nút Lưu nháp */}
              <button
                type="button"
                onClick={() => triggerSubmitWithTarget('draft')}
                disabled={isSubmitting || isUploadingPrimary}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting && submitTarget === 'draft' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{isStatusPublished ? 'Gỡ về nháp' : 'Lưu nháp'}</span>
              </button>

              {/* Nút Lưu trữ */}
              <button
                type="button"
                onClick={() => triggerSubmitWithTarget('archive')}
                disabled={isSubmitting || isUploadingPrimary}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 hover:border-amber-400 bg-amber-50 hover:bg-amber-100/70 text-amber-800 text-xs font-bold transition active:scale-95 disabled:opacity-50"
                title="Chuyển vào kho lưu trữ (Ẩn khỏi công khai)"
              >
                {isSubmitting && submitTarget === 'archive' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Archive className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>{isStatusArchived ? 'Cập nhật kho' : 'Lưu trữ'}</span>
              </button>

              {/* Nút Đăng bài */}
              <button
                type="button"
                onClick={() => triggerSubmitWithTarget('publish')}
                disabled={isSubmitting || isUploadingPrimary}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting && submitTarget === 'publish' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isStatusPublished ? 'Cập nhật xuất bản' : 'Đăng bài ngay'}</span>
              </button>
            </div>
          </div>

          {/* Khung nội dung bài viết chi tiết toàn cảnh (Full Recipe Details Preview) */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-sm space-y-8">
            {/* 1. Header: Danh mục, Độ khó, Tiêu đề, Mô tả */}
            <div className="space-y-4 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                  <Tag className="w-3 h-3" />
                  {categoryDisplayName}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${
                    difficultyLabels[watchedDifficulty || 1]?.color || 'bg-stone-100 text-stone-700'
                  }`}
                >
                  <ChefHat className="w-3 h-3" />
                  Độ khó: {difficultyLabels[watchedDifficulty || 1]?.label || 'Dễ'}
                </span>
                {isEdit ? (
                  isStatusPublished ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Đã xuất bản
                    </span>
                  ) : isStatusArchived ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[11px] font-bold border border-stone-300">
                      <Archive className="w-3 h-3 text-stone-500" />
                      Đã lưu trữ
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      Bản nháp
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-medium">
                    Bản nháp mới
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                {watchedTitle?.trim() || 'Tiêu đề công thức món ăn'}
              </h1>

              {watchedDescription && (
                <p className="text-base text-stone-600 leading-relaxed font-normal">
                  {watchedDescription}
                </p>
              )}
            </div>

            {/* 2. Gallery ảnh */}
            <div className="rounded-2xl overflow-hidden">
              <RecipeGalleryViewer
                images={previewImages}
                recipeTitle={watchedTitle || 'Công thức'}
              />
            </div>

            {/* 3. Bốn thẻ thông số nhanh */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-stone-400 font-medium">Chuẩn bị</p>
                  <p className="text-sm font-bold text-stone-900">{watchedPrepTime ? `${watchedPrepTime} phút` : '--'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-stone-400 font-medium">Nấu nướng</p>
                  <p className="text-sm font-bold text-stone-900">{watchedCookTime ? `${watchedCookTime} phút` : '--'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-stone-400 font-medium">Tổng thời gian</p>
                  <p className="text-sm font-bold text-stone-900">{totalTimeMinutes > 0 ? `${totalTimeMinutes} phút` : '--'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-stone-400 font-medium">Khẩu phần</p>
                  <p className="text-sm font-bold text-stone-900">{watchedServings ? `${watchedServings} người` : '--'}</p>
                </div>
              </div>
            </div>

            {/* 4. Thẻ dinh dưỡng (nếu có) */}
            {hasNutrition && (
              <div className="pt-2">
                <RecipeNutritionCard nutrition={previewNutrition} />
              </div>
            )}

            {/* 5. Bố cục 2 cột: Nguyên liệu & Các bước làm */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-start">
              {/* Cột trái: Nguyên liệu */}
              <div className="lg:col-span-4">
                <RecipeIngredientsList
                  ingredients={previewIngredients}
                  servings={watchedServings || 1}
                />
              </div>

              {/* Cột phải: Quy trình chế biến */}
              <div className="lg:col-span-8 space-y-6">
                <RecipeStepsList
                  steps={previewSteps}
                  instructions={watchedInstructions}
                />

                {/* Bí quyết đầu bếp */}
                {watchedInstructions && (
                  <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-stone-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                      <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>Bí quyết nấu ăn & Ghi chú từ đầu bếp</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line pl-7">
                      {watchedInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thông báo lỗi nếu việc kiểm tra form thất bại khi đang xem trước */}
          {uploadError && (
            <div className="sticky bottom-24 z-30 flex items-start justify-between gap-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-xs text-red-800 shadow-xl animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900">Chưa thể xuất bản công thức</h4>
                  <p className="mt-0.5 leading-relaxed">{uploadError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Sticky Footer trong Chế độ xem trước */}
          <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Đang xem trước bài viết hoàn chỉnh. Hãy chọn trạng thái mong muốn:</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setViewMode('edit');
                  setActiveStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại sửa</span>
              </button>

              <button
                type="button"
                onClick={() => triggerSubmitWithTarget('draft')}
                disabled={isSubmitting || isUploadingPrimary}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting && submitTarget === 'draft' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Lưu nháp</span>
              </button>

              <button
                type="button"
                onClick={() => triggerSubmitWithTarget('archive')}
                disabled={isSubmitting || isUploadingPrimary}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 hover:border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting && submitTarget === 'archive' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Archive className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>Lưu trữ</span>
              </button>

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
                <span>Đăng bài ngay</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 3. BỐ CỤC CHÍNH 2 CỘT: CỘT TRÁI FORM (65%) + CỘT PHẢI LIVE PREVIEW CARD (35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            CỘT TRÁI (FORM SOẠN THẢO TỪNG BƯỚC WIZARD ĐỒNG NHẤT 4 BƯỚC)
            ========================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* =====================================================================
              BƯỚC 1: THÔNG TIN CƠ BẢN & HÌNH ẢNH & DINH DƯỠNG
              ===================================================================== */}
          {activeStep === 1 && (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-6 animate-fade-in">
              {/* Header Bước 1 */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold text-xs">
                    1
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Thông tin cơ bản & Hình ảnh</h3>
                    <p className="text-[11px] text-stone-400">Tên món, danh mục, thời gian, khẩu phần và ảnh bìa hấp dẫn</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFillSample}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold border border-orange-200 transition active:scale-95 cursor-pointer"
                  title="Tự động điền dữ liệu thực tế chuẩn vị"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Điền mẫu nhanh</span>
                </button>
              </div>

              {/* Nội dung bên trong: Cột upload ảnh + Cột Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* CỘT UPLOAD ẢNH ĐẠI DIỆN VÀ THUMBNAIL (md:col-span-5) */}
                <div className="md:col-span-5 space-y-3">
                  {/* Ô vuông upload đại diện lớn */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative aspect-4/3 sm:aspect-square rounded-2xl border-2 border-dashed border-stone-300 hover:border-orange-500 bg-stone-50/70 p-4 flex flex-col items-center justify-center text-center cursor-pointer group transition-all overflow-hidden"
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

                  {/* Thông báo lỗi upload ảnh trực tiếp ngay dưới ô kéo thả */}
                  {uploadError && (
                    <div className="flex items-start justify-between gap-2.5 p-3 rounded-xl border border-red-200 bg-red-50 text-xs text-red-800 shadow-xs animate-fade-in">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-red-900">Lưu ý tải ảnh</p>
                          <p className="mt-0.5 text-stone-700">{uploadError}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadError(null)}
                        className="text-stone-400 hover:text-stone-700 text-xs font-bold px-1.5 py-0.5"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Ô dán URL ảnh trực tiếp */}
                  <div className="flex items-center gap-1.5 bg-stone-50 p-2 rounded-xl border border-stone-200">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Dán link ảnh online..."
                      className="flex-1 rounded-lg border border-stone-200 px-2 py-1 text-[11px] outline-none focus:border-orange-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddFromUrl(urlInput)}
                      className="px-2.5 py-1 rounded-lg bg-stone-800 text-white text-[10px] font-bold hover:bg-black transition shrink-0 cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>

                  {/* Dải ảnh mẫu nhanh 1-click */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Ảnh mẫu gợi ý nhanh:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {sampleImages.map((sample, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleAddFromUrl(sample.url, sample.label)}
                          className="text-left p-1.5 rounded-lg border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50/50 text-[10px] text-stone-700 font-medium truncate transition flex items-center gap-1 cursor-pointer"
                          title={sample.label}
                        >
                          <Sparkles className="w-2.5 h-2.5 text-orange-500 shrink-0" />
                          <span className="truncate">{sample.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dải thumbnail gallery */}
                  {galleryItems.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-bold">
                        <span>Thư viện ảnh ({galleryItems.length})</span>
                        <button
                          type="button"
                          onClick={() => secondaryFileInputRef.current?.click()}
                          className="text-orange-600 hover:text-orange-700 font-semibold text-[10px] flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Thêm ảnh</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {galleryItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleSetPrimary(item.id)}
                            className={`relative w-14 h-14 rounded-xl overflow-hidden border cursor-pointer group transition shrink-0 ${
                              item.isPrimary
                                ? 'border-orange-500 ring-2 ring-orange-200'
                                : 'border-stone-200 hover:border-stone-400'
                            }`}
                            title={item.isPrimary ? 'Ảnh đại diện chính' : 'Nhấp để đặt làm ảnh đại diện'}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={resolveMediaUrl(item.previewUrl)}
                              alt="Thumbnail"
                              className="w-full h-full object-cover"
                            />
                            {item.isPrimary && (
                              <span className="absolute top-1 left-1 w-3.5 h-3.5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[8px] font-bold">
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
                        <button
                          type="button"
                          onClick={() => secondaryFileInputRef.current?.click()}
                          className="w-14 h-14 rounded-xl border-2 border-dashed border-stone-300 hover:border-orange-500 bg-stone-50 hover:bg-orange-50/50 flex items-center justify-center text-stone-400 hover:text-orange-600 transition shrink-0 cursor-pointer"
                          title="Tải thêm ảnh vào thư viện"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    ref={secondaryFileInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    onChange={handleMultipleFilesChange}
                    className="hidden"
                  />
                </div>

                {/* CỘT FORM FIELDS CƠ BẢN (md:col-span-7) */}
                <div className="md:col-span-7 space-y-4">
                  {/* Tên công thức */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Tên công thức <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('title')}
                      disabled={isSubmitting}
                      placeholder="VD: Bò xào bông cải xanh giòn ngọt..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs sm:text-sm font-semibold outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                    {errors.title && (
                      <p className="text-[11px] font-semibold text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Danh mục & Độ khó */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
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
                      {errors.categoryId && (
                        <p className="text-[11px] font-semibold text-red-600">{errors.categoryId.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Độ khó
                      </label>
                      <select
                        {...register('difficulty', { valueAsNumber: true })}
                        disabled={isSubmitting}
                        className="w-full rounded-xl border border-stone-300 p-2.5 text-xs font-medium outline-none focus:border-orange-500 bg-white"
                      >
                        <option value={1}>Dễ</option>
                        <option value={2}>Trung bình</option>
                        <option value={3}>Khó</option>
                        <option value={4}>Chuyên gia</option>
                      </select>
                    </div>
                  </div>

                  {/* Hàng 3 thông số: Thời gian chuẩn bị, Thời gian nấu, Khẩu phần */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-stone-600">
                        Chuẩn bị (phút) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          {...register('prepTimeMinutes', { valueAsNumber: true })}
                          disabled={isSubmitting}
                          min="0"
                          placeholder="15"
                          className="w-full rounded-xl border border-stone-300 py-2 pl-7 pr-2 text-xs font-medium outline-none focus:border-orange-500"
                        />
                      </div>
                      {errors.prepTimeMinutes && (
                        <p className="text-[10px] font-semibold text-red-600">{errors.prepTimeMinutes.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-stone-600">
                        Nấu (phút) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 text-orange-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          {...register('cookTimeMinutes', { valueAsNumber: true })}
                          disabled={isSubmitting}
                          min="0"
                          placeholder="20"
                          className="w-full rounded-xl border border-stone-300 py-2 pl-7 pr-2 text-xs font-medium outline-none focus:border-orange-500"
                        />
                      </div>
                      {errors.cookTimeMinutes && (
                        <p className="text-[10px] font-semibold text-red-600">{errors.cookTimeMinutes.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-stone-600">
                        Khẩu phần (người) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          {...register('servings', { valueAsNumber: true })}
                          disabled={isSubmitting}
                          min="1"
                          placeholder="2"
                          className="w-full rounded-xl border border-stone-300 py-2 pl-7 pr-2 text-xs font-medium outline-none focus:border-orange-500"
                        />
                      </div>
                      {errors.servings && (
                        <p className="text-[10px] font-semibold text-red-600">{errors.servings.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Mô tả ngắn */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-stone-700">
                        Mô tả ngắn <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-stone-400">
                        {watchedDescription?.length || 0}/500
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      maxLength={500}
                      {...register('description')}
                      disabled={isSubmitting}
                      placeholder="Nhập mô tả ngắn gợi cảm hứng về món ăn..."
                      className="w-full min-h-[105px] rounded-xl border border-stone-300 p-3 text-xs outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 leading-relaxed resize-y"
                    />
                    {errors.description && (
                      <p className="text-[11px] font-semibold text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dinh dưỡng (Macros) */}
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
                          {...register('calories', {
                            setValueAs: (v) =>
                              v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? 0 : Number(v),
                          })}
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
                          {...register('protein', {
                            setValueAs: (v) =>
                              v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? 0 : Number(v),
                          })}
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
                          {...register('carbs', {
                            setValueAs: (v) =>
                              v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? 0 : Number(v),
                          })}
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
                          {...register('fat', {
                            setValueAs: (v) =>
                              v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? 0 : Number(v),
                          })}
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

              {/* Thanh điều hướng chân Bước 1 */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold border border-orange-200 transition active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Điền mẫu nhanh</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const isValid = await trigger(['title', 'categoryId', 'description', 'prepTimeMinutes', 'cookTimeMinutes', 'servings']);
                    if (isValid) {
                      setActiveStep(2);
                      window.scrollTo({ top: 100, behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Tiếp tục: Nguyên liệu</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* =====================================================================
              BƯỚC 2: NGUYÊN LIỆU & ĐỊNH LƯỢNG
              ===================================================================== */}
          {activeStep === 2 && (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-6 animate-fade-in">
              {/* Header Bước 2 */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold text-xs">
                    2
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900">Danh sách nguyên liệu</h3>
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold border border-stone-200">
                        {ingredientFields.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Khai báo tên và định lượng rõ ràng giúp người nấu chuẩn bị đầy đủ thực phẩm
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => appendIngredient({ name: '', quantity: null, unit: '', notes: '' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-500 text-orange-600 hover:bg-orange-50 text-xs font-bold transition active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm nguyên liệu</span>
                </button>
              </div>

              {/* Banner tiện ích khẩu phần */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Khẩu phần hiện tại: <strong>{watchedServings || 2} người</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenServingsModal(watchedServings || 2, 1)}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 transition shrink-0 active:scale-95 cursor-pointer"
                >
                  Điều chỉnh khẩu phần
                </button>
              </div>

              {/* Danh sách nguyên liệu */}
              {ingredientFields.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50">
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-2.5">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-stone-700">Chưa có nguyên liệu nào</p>
                  <p className="text-[11px] text-stone-400 mt-1 max-w-sm mx-auto mb-4">
                    Hãy khai báo các nguyên liệu và gia vị cần thiết để món ăn chuẩn vị thơm ngon.
                  </p>
                  <button
                    type="button"
                    onClick={() => appendIngredient({ name: '', quantity: null, unit: '', notes: '' })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm nguyên liệu đầu tiên</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {ingredientFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-200 transition"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-6 text-center text-xs font-bold text-stone-400">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          {...register(`ingredients.${idx}.name`)}
                          placeholder="Tên nguyên liệu (VD: Thịt bò, Bông cải xanh, Nước mắm...)"
                          className="flex-1 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="any"
                          {...register(`ingredients.${idx}.quantity`, {
                            setValueAs: (v) =>
                              v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v),
                          })}
                          placeholder="Số lượng"
                          className="w-20 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs outline-none focus:border-orange-500 text-right"
                        />
                        <input
                          type="text"
                          {...register(`ingredients.${idx}.unit`)}
                          placeholder="Đơn vị (g, ml, củ)"
                          className="w-24 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs outline-none focus:border-orange-500"
                        />
                        <input
                          type="text"
                          {...register(`ingredients.${idx}.notes`)}
                          placeholder="Ghi chú sơ chế (tùy chọn)"
                          className="w-32 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs outline-none focus:border-orange-500 hidden sm:block"
                        />
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Xóa nguyên liệu này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => appendIngredient({ name: '', quantity: null, unit: '', notes: '' })}
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-stone-200 hover:border-orange-400 hover:bg-orange-50/40 text-stone-500 hover:text-orange-600 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm nguyên liệu tiếp theo</span>
                  </button>
                </div>
              )}

              {/* Thanh điều hướng chân Bước 2 */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep(1);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition active:scale-95 cursor-pointer"
                >
                  <span>⟵</span>
                  <span>Quay lại: Thông tin cơ bản</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStep(3);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Tiếp tục: Quy trình nấu</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* =====================================================================
              BƯỚC 3: QUY TRÌNH CHẾ BIẾN & BÍ QUYẾT
              ===================================================================== */}
          {activeStep === 3 && (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-6 animate-fade-in">
              {/* Header Bước 3 */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold text-xs">
                    3
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900">Quy trình chế biến & Bí quyết</h3>
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold">
                        {stepFields.length} bước
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Hướng dẫn từng bước thực hiện kèm hình ảnh minh họa và số phút đếm ngược
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
                      imageUrl: '',
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-500 text-orange-600 hover:bg-orange-50 text-xs font-bold transition active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm bước nấu</span>
                </button>
              </div>

              {/* Danh sách các bước */}
              {stepFields.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50">
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-2.5">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-stone-700">Chưa có bước chế biến nào</p>
                  <p className="text-[11px] text-stone-400 mt-1 max-w-sm mx-auto mb-4">
                    Hãy chia nhỏ quy trình nấu thành các bước rõ ràng kèm thời gian để người đọc dễ dàng làm theo.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      appendStep({
                        title: 'Bước 1: Sơ chế nguyên liệu',
                        description: '',
                        timerMinutes: 5,
                        imageUrl: '',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm bước đầu tiên</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {stepFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3 relative group hover:border-orange-300 transition shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
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
                          <div className="inline-flex items-center gap-1 text-[11px] text-stone-500 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                            <Clock className="w-3 h-3 text-orange-500" />
                            <input
                              type="number"
                              {...register(`steps.${idx}.timerMinutes`, {
                                setValueAs: (v) =>
                                  v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v),
                              })}
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
                              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                              title="Chuyển lên"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {idx < stepFields.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveStep(idx, idx + 1)}
                              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                              title="Chuyển xuống"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeStep(idx)}
                            className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Xóa bước này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Nội dung chi tiết bước */}
                      <textarea
                        rows={3}
                        {...register(`steps.${idx}.description`)}
                        placeholder="Mô tả chi tiết những gì cần làm trong bước này..."
                        className="w-full min-h-[76px] rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-xs outline-none transition focus:bg-white focus:border-orange-500 leading-relaxed resize-y"
                      />

                      {/* Ảnh minh họa của bước */}
                      <div className="pt-2.5 border-t border-stone-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        {watchedSteps?.[idx]?.imageUrl ? (
                          <div className="flex items-center gap-3">
                            <div className="relative group/stepimg w-16 h-16 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shrink-0 shadow-2xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={resolveMediaUrl(watchedSteps[idx].imageUrl!)}
                                alt={`Ảnh minh họa bước ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setValue(`steps.${idx}.imageUrl`, '')}
                                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition cursor-pointer"
                                title="Xóa ảnh bước này"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <p className="text-[11px] font-bold text-stone-700 truncate">
                                Ảnh minh họa bước {idx + 1}
                              </p>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => stepFileInputRefs.current[idx]?.click()}
                                  disabled={uploadingStepIndex === idx}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-600 hover:text-orange-700 underline cursor-pointer"
                                >
                                  {uploadingStepIndex === idx ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <UploadCloud className="w-3 h-3" />
                                  )}
                                  <span>Đổi ảnh</span>
                                </button>
                                <span className="text-[10px] text-stone-300">•</span>
                                <button
                                  type="button"
                                  onClick={() => setValue(`steps.${idx}.imageUrl`, '')}
                                  className="text-[11px] font-medium text-stone-400 hover:text-red-500 transition cursor-pointer"
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                            <button
                              type="button"
                              onClick={() => stepFileInputRefs.current[idx]?.click()}
                              disabled={uploadingStepIndex === idx}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-orange-50 hover:border-orange-300 text-[11px] font-bold text-stone-700 transition active:scale-95 shrink-0 cursor-pointer"
                            >
                              {uploadingStepIndex === idx ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                              ) : (
                                <UploadCloud className="w-3.5 h-3.5 text-orange-500" />
                              )}
                              <span>Tải ảnh bước {idx + 1}</span>
                            </button>

                            <div className="relative flex-1">
                              <input
                                type="text"
                                {...register(`steps.${idx}.imageUrl`)}
                                placeholder="hoặc dán liên kết URL ảnh minh họa..."
                                className="w-full text-[11px] px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50/50 placeholder:text-stone-400 outline-none focus:bg-white focus:border-orange-400 transition"
                              />
                            </div>
                          </div>
                        )}

                        <input
                          ref={(el) => {
                            stepFileInputRefs.current[idx] = el;
                          }}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleStepImageUpload(idx, f);
                            e.target.value = '';
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      appendStep({
                        title: `Bước ${stepFields.length + 1}: `,
                        description: '',
                        timerMinutes: null,
                        imageUrl: '',
                      })
                    }
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-stone-200 hover:border-orange-400 hover:bg-orange-50/40 text-stone-500 hover:text-orange-600 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm bước tiếp theo</span>
                  </button>
                </div>
              )}

              {/* Khung Bí quyết & Mẹo nấu ăn gia truyền */}
              <div className="pt-4 border-t border-stone-100 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <h4 className="text-xs font-bold text-stone-900">Bí quyết & Mẹo nấu ăn từ đầu bếp</h4>
                    <span className="text-[10px] text-stone-400 font-normal">(tùy chọn)</span>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {watchedInstructions && watchedInstructions.trim().length > 0 && (
                      <span className="text-[10px] text-stone-400 font-medium">
                        {watchedInstructions.length} ký tự
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsInstructionsExpanded((prev) => {
                          const next = !prev;
                          if (!next && instructionsTextareaRef.current) {
                            instructionsTextareaRef.current.style.height = '110px';
                          }
                          return next;
                        });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 transition cursor-pointer active:scale-95"
                      title={isInstructionsExpanded ? 'Thu gọn khung nhập' : 'Mở rộng khung nhập'}
                    >
                      {isInstructionsExpanded ? (
                        <>
                          <Minimize2 className="w-3 h-3" />
                          <span>Thu gọn</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3 h-3" />
                          <span>Mở rộng để xem</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInstructionsModalOpen(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-stone-600 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 transition cursor-pointer active:scale-95"
                      title="Mở trình soạn thảo rộng toàn cảnh"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span className="hidden sm:inline">Soạn thảo rộng</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={isInstructionsExpanded ? 8 : 4}
                    {...register('instructions')}
                    ref={(el) => {
                      register('instructions').ref(el);
                      instructionsTextareaRef.current = el;
                    }}
                    onFocus={() => {
                      if (!isInstructionsExpanded) {
                        setIsInstructionsExpanded(true);
                      }
                    }}
                    onInput={() => {
                      adjustInstructionsHeight();
                    }}
                    disabled={isSubmitting}
                    placeholder="Chia sẻ bí quyết chọn nguyên liệu tươi, cách ướp gia vị đậm đà hoặc mẹo điều chỉnh nhiệt độ lửa..."
                    className={`w-full rounded-xl border border-stone-300 p-3 text-xs outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 leading-relaxed resize-y ${
                      isInstructionsExpanded ? 'min-h-[220px] bg-amber-50/20' : 'min-h-[110px]'
                    }`}
                  />
                  {isInstructionsExpanded && (
                    <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
                      <span>💡 Khung nhập đã tự động mở rộng để bạn dễ dàng quan sát toàn bộ nội dung.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsInstructionsExpanded(false);
                          if (instructionsTextareaRef.current) {
                            instructionsTextareaRef.current.style.height = '110px';
                          }
                        }}
                        className="text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer ml-2 shrink-0"
                      >
                        Thu gọn lại
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Thanh điều hướng chân Bước 3 */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep(2);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition active:scale-95 cursor-pointer"
                >
                  <span>⟵</span>
                  <span>Quay lại: Nguyên liệu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStep(4);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Tiếp tục: Hoàn tất & Xuất bản</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* =====================================================================
              BƯỚC 4: KIỂM TRA ĐỘ HOÀN THIỆN & XUẤT BẢN
              ===================================================================== */}
          {activeStep === 4 && (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-6 animate-fade-in">
              {/* Header Bước 4 */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 font-bold text-xs">
                    4
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Kiểm tra độ hoàn thiện & Xuất bản</h3>
                    <p className="text-[11px] text-stone-400">
                      Xem lại danh sách kiểm tra và lựa chọn trạng thái lưu trữ hoặc đăng bài
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode('preview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold transition active:scale-95 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem toàn màn hình</span>
                </button>
              </div>

              {/* 1. Checklist tính sẵn sàng */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bảng kiểm tra tính sẵn sàng xuất bản</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200/80">
                    {watchedTitle && watchedTitle.trim().length >= 5 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-stone-800">Tiêu đề:</span>
                      <span className="ml-1 text-stone-500 truncate">
                        {watchedTitle?.trim() ? `"${watchedTitle}"` : 'Tối thiểu 5 ký tự'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200/80">
                    {watchedCategoryId ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-stone-800">Danh mục:</span>
                      <span className="ml-1 text-stone-500 truncate">
                        {categoryDisplayName || 'Chưa chọn'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200/80">
                    {effectiveHeroImage ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-stone-800">Ảnh bìa:</span>
                      <span className="ml-1 text-stone-500">
                        {effectiveHeroImage ? 'Đã có ảnh chính' : 'Chưa có ảnh bìa'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200/80">
                    {validIngredients.length > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-stone-800">Nguyên liệu:</span>
                      <span className="ml-1 text-stone-500">
                        {validIngredients.length > 0 ? `${validIngredients.length} nguyên liệu` : 'Chưa có'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200/80">
                    {validSteps.length > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-stone-800">Các bước nấu:</span>
                      <span className="ml-1 text-stone-500">
                        {validSteps.length > 0 ? `${validSteps.length} bước thực hiện` : 'Chưa có'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200/80">
                    {watchedInstructions && watchedInstructions.trim().length >= 5 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-stone-800">Bí quyết đầu bếp:</span>
                      <span className="ml-1 text-stone-500 truncate">
                        {watchedInstructions?.trim() ? 'Đã bổ sung mẹo' : 'Tùy chọn'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Thẻ Tóm tắt công thức trực quan */}
              <div className="rounded-2xl border border-stone-200 bg-white p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  {effectiveHeroImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={resolveMediaUrl(effectiveHeroImage)}
                      alt={watchedTitle || 'Preview'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
                    {categoryDisplayName}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-stone-900 truncate">
                    {watchedTitle || 'Tên món ăn'}
                  </h4>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-stone-500">
                    <span>⏱️ {totalTimeMinutes} phút</span>
                    <span>👥 {watchedServings || 2} người</span>
                    <span>👨‍🍳 {difficultyLabels[watchedDifficulty || 1]?.label || 'Dễ'}</span>
                    <span>🥗 {validIngredients.length} nguyên liệu</span>
                    <span>🍳 {validSteps.length} bước</span>
                  </div>
                </div>
              </div>

              {/* 3. Lựa chọn hành động xuất bản */}
              <div className="rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50/50 to-amber-50/50 p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Lựa chọn trạng thái & Lưu công thức</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Chọn hành động bạn muốn thực hiện với công thức này:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Nút 1: Lưu nháp */}
                  <button
                    type="button"
                    onClick={() => triggerSubmitWithTarget('draft')}
                    disabled={isSubmitting || isUploadingPrimary}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition active:scale-95 disabled:opacity-50 space-y-1.5 shadow-2xs group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center text-stone-600 transition">
                      {isSubmitting && submitTarget === 'draft' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </div>
                    <span>{isStatusPublished ? 'Gỡ về bản nháp' : 'Lưu bản nháp'}</span>
                    <span className="text-[10px] text-stone-400 font-normal">
                      {isStatusPublished ? 'Ẩn khỏi công khai về nháp' : 'Chỉ bạn mới xem được'}
                    </span>
                  </button>

                  {/* Nút 2: Lưu trữ */}
                  <button
                    type="button"
                    onClick={() => triggerSubmitWithTarget('archive')}
                    disabled={isSubmitting || isUploadingPrimary}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100/70 text-amber-900 font-bold text-xs transition active:scale-95 disabled:opacity-50 space-y-1.5 shadow-2xs group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center text-amber-700 transition">
                      {isSubmitting && submitTarget === 'archive' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Archive className="w-4 h-4" />
                      )}
                    </div>
                    <span>{isStatusArchived ? 'Cập nhật kho lưu trữ' : 'Lưu vào kho'}</span>
                    <span className="text-[10px] text-amber-600 font-normal">Tạm ẩn khỏi công khai</span>
                  </button>

                  {/* Nút 3: Đăng bài */}
                  <button
                    type="button"
                    onClick={() => triggerSubmitWithTarget('publish')}
                    disabled={isSubmitting || isUploadingPrimary}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs transition active:scale-95 disabled:opacity-50 space-y-1.5 shadow-md shadow-orange-500/25 group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-white transition">
                      {isSubmitting && submitTarget === 'publish' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </div>
                    <span>{isStatusPublished ? 'Cập nhật bài viết' : 'Đăng bài ngay'}</span>
                    <span className="text-[10px] text-orange-100 font-normal">
                      {isStatusPublished ? 'Đang hiển thị công khai' : 'Công khai cho cộng đồng'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Thanh điều hướng chân Bước 4 */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep(3);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition active:scale-95 cursor-pointer"
                >
                  <span>⟵</span>
                  <span>Quay lại: Quy trình nấu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode('preview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-orange-200 hover:border-orange-300 bg-orange-50/50 hover:bg-orange-100/50 text-orange-700 text-xs font-bold transition active:scale-95 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem trước toàn cảnh (Dashboard)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            CỘT PHẢI (WIDGET XEM TRƯỚC CÔNG THỨC - LIVE PREVIEW CARD DÍNH NỔI STICKY)
            ========================================================================= */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <RecipeLivePreviewWidget
            title={watchedTitle}
            description={watchedDescription}
            categoryName={categoryDisplayName}
            difficulty={watchedDifficulty}
            prepTimeMinutes={watchedPrepTime}
            cookTimeMinutes={watchedCookTime}
            servings={watchedServings}
            heroImageUrl={effectiveHeroImage}
            ingredients={watchedIngredients}
            steps={watchedSteps}
            nutrition={{
              calories: watchedCalories,
              protein: watchedProtein,
              carbohydrates: watchedCarbs,
              fat: watchedFat,
            }}
            activePreviewTab={activeStep === 3 ? 'cooking' : 'card'}
            onOpenFullDashboardPreview={() => {
              setViewMode('preview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenNewPagePreview={handleOpenNewPagePreview}
            onRequestApplyServings={handleOpenServingsModal}
          />
        </div>
      </div>

      {/* Thông báo lỗi nổi bật ở chân trang nếu việc kiểm tra form thất bại */}
      {uploadError && (
        <div className="sticky bottom-24 z-20 flex items-start justify-between gap-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-xs text-red-800 shadow-xl animate-fade-in mb-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-900">Chưa thể xuất bản công thức</h4>
              <p className="mt-0.5 leading-relaxed">{uploadError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4. THANH HÀNH ĐỘNG DƯỚI CÙNG (FOOTER ACTIONS BAR CHUẨN MOCKUP) */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            {isEdit ? 'Đang cập nhật công thức' : 'Bản nháp tự động lưu trên trình duyệt của bạn'}
          </span>
        </div>

        {/* 4 Nút: [Xem trước Dashboard] [Lưu nháp] [Lưu trữ] [Đăng bài] */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          {/* Nút 1: Xem trước trong Dashboard */}
          <button
            type="button"
            onClick={() => {
              setViewMode('preview');
              setActiveStep(4);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 hover:border-orange-300 bg-white hover:bg-orange-50/50 text-stone-700 hover:text-orange-600 text-xs font-bold transition active:scale-95 shadow-xs"
            title="Xem trước giao diện hoàn chỉnh ngay trong Dashboard"
          >
            <Eye className="w-3.5 h-3.5 text-orange-600" />
            <span>Xem trước</span>
          </button>

          {/* Nút 2: Lưu nháp */}
          <button
            type="button"
            onClick={() => triggerSubmitWithTarget('draft')}
            disabled={isSubmitting || isUploadingPrimary}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition active:scale-95 disabled:opacity-50"
          >
            {isSubmitting && submitTarget === 'draft' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Lưu nháp</span>
          </button>

          {/* Nút 3: Lưu trữ (Archive) */}
          <button
            type="button"
            onClick={() => triggerSubmitWithTarget('archive')}
            disabled={isSubmitting || isUploadingPrimary}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 hover:border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition active:scale-95 disabled:opacity-50"
            title="Chuyển vào kho lưu trữ (Ẩn khỏi công khai)"
          >
            {isSubmitting && submitTarget === 'archive' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Archive className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>Lưu trữ</span>
          </button>

          {/* Nút 4: Đăng bài (Publish - Gradient cam nổi bật) */}
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
    </>
  )}

      {/* 5. MODAL XÁC NHẬN ĐIỀU CHỈNH KHẨU PHẦN CÔNG THỨC */}
      <ServingsAdjustmentModal
        isOpen={servingsModalState.isOpen}
        onClose={() => setServingsModalState((prev) => ({ ...prev, isOpen: false }))}
        baseServings={watchedServings || 2}
        targetServings={servingsModalState.targetServings}
        multiplier={servingsModalState.multiplier}
        ingredients={watchedIngredients || []}
        steps={watchedSteps || []}
        nutrition={{
          calories: watchedCalories,
          protein: watchedProtein,
          carbohydrates: watchedCarbs,
          fat: watchedFat,
        }}
        onConfirm={handleConfirmServingsAdjustment}
      />

      {/* 6. MODAL SOẠN THẢO RỘNG BÍ QUYẾT & MẸO NẤU ĂN */}
      {isInstructionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-stone-200 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Soạn thảo Bí quyết & Mẹo nấu ăn</h3>
                  <p className="text-[11px] text-stone-400">Không gian viết rộng rãi, nhìn tổng quan toàn bộ nội dung</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInstructionsModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick chips / templates */}
            <div className="px-6 py-2.5 border-b border-stone-100 bg-amber-50/40 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-amber-900">Gợi ý nhanh:</span>
              <button
                type="button"
                onClick={() => {
                  const current = getValues('instructions') || '';
                  const addition = (current.length > 0 ? '\n' : '') + '💡 *Mẹo chọn nguyên liệu:* ';
                  setValue('instructions', current + addition, { shouldDirty: true });
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-amber-200 text-amber-800 hover:bg-amber-100/60 font-medium transition cursor-pointer"
              >
                + Mẹo chọn nguyên liệu
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = getValues('instructions') || '';
                  const addition = (current.length > 0 ? '\n' : '') + '🔥 *Lưu ý nhiệt độ:* ';
                  setValue('instructions', current + addition, { shouldDirty: true });
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-amber-200 text-amber-800 hover:bg-amber-100/60 font-medium transition cursor-pointer"
              >
                + Lưu ý nhiệt độ
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = getValues('instructions') || '';
                  const addition = (current.length > 0 ? '\n' : '') + '🧂 *Bí quyết nêm nếm:* ';
                  setValue('instructions', current + addition, { shouldDirty: true });
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-amber-200 text-amber-800 hover:bg-amber-100/60 font-medium transition cursor-pointer"
              >
                + Bí quyết nêm nếm
              </button>
            </div>

            {/* Modal Body: Large Textarea */}
            <div className="p-6 flex-1 overflow-y-auto">
              <textarea
                rows={12}
                value={watchedInstructions || ''}
                onChange={(e) => setValue('instructions', e.target.value, { shouldDirty: true })}
                placeholder="Chia sẻ bí quyết chọn nguyên liệu tươi ngon, cách ướp gia vị đậm đà, mẹo điều chỉnh nhiệt độ lửa hoặc các lưu ý đặc biệt giúp món ăn đạt chuẩn vị..."
                className="w-full h-full min-h-[300px] rounded-2xl border border-stone-200 p-4 text-xs sm:text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 leading-relaxed font-sans"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50/70">
              <span className="text-xs text-stone-500 font-medium">
                {watchedInstructions?.length || 0} ký tự | {watchedInstructions ? watchedInstructions.trim().split(/\s+/).filter(Boolean).length : 0} từ
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsInstructionsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  Xác nhận & Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING TOAST NOTIFICATION - Luôn nổi ở góc màn hình dù người dùng ở bất kỳ vị trí cuộn nào */}
      {uploadError && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md border border-red-200 rounded-2xl shadow-2xl p-4 flex items-start gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-red-900">Thông báo từ hệ thống</h4>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed break-words">{uploadError}</p>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold p-1 rounded-lg hover:bg-stone-100 transition cursor-pointer"
            title="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      )}
    </form>
  );
}
