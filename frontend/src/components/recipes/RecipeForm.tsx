'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { recipeFormSchema, type RecipeFormData } from '@/features/recipes/schemas';
import { categoryService } from '@/lib/services/category-service';
import { fileService } from '@/lib/services/file-service';
import { resolveMediaUrl } from '@/lib/utils';
import type { CategoryDto } from '@/lib/types/category';
import {
  Loader2,
  AlertCircle,
  Save,
  ArrowLeft,
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
} from 'lucide-react';

interface RecipeFormProps {
  initialValues?: Partial<RecipeFormData>;
  isEdit?: boolean;
  isSubmitting: boolean;
  serverError?: string | null;
  onSubmit: (data: RecipeFormData) => Promise<void>;
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
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Kích thước ảnh vượt quá giới hạn cho phép (5MB).');
      return;
    }

    setUploadError(null);
    // Tạo preview blob URL tức thì để người dùng xem trước ngay lập tức
    const blobUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(blobUrl);

    setIsUploadingImage(true);

    try {
      const res = await fileService.uploadFile(file, 'recipes');
      if (res && res.url) {
        setValue('primaryImageUrl', res.url);
      }
    } catch (err: unknown) {
      console.error('Lỗi khi tải ảnh lên MinIO:', err);
      setUploadError(
        err instanceof Error
          ? err.message
          : 'Không thể tải ảnh lên hệ thống lưu trữ. Vui lòng kiểm tra quyền đăng nhập hoặc chọn ảnh hợp lệ.'
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

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
      ingredients: initialValues?.ingredients && initialValues.ingredients.length > 0
        ? initialValues.ingredients
        : [
            { name: '', quantity: null, unit: '', notes: '' },
          ],
      steps: initialValues?.steps && initialValues.steps.length > 0
        ? initialValues.steps
        : [
            { title: 'Bước 1: Chuẩn bị', description: '', timerMinutes: null },
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
  } = useFieldArray({ control, name: 'steps' });

  const watchedImageUrl = watch('primaryImageUrl');

  // Fetch danh sách danh mục để điền vào dropdown
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

  // Điền dữ liệu mẫu nhanh cho người dùng tiện thử nghiệm
  const handleFillSampleStepsAndIngredients = () => {
    setValue('ingredients', [
      { name: 'Thịt bò tươi', quantity: 300, unit: 'gram', notes: 'Thái lát mỏng' },
      { name: 'Hành tây', quantity: 1, unit: 'củ', notes: 'Bổ múi cau' },
      { name: 'Tỏi băm', quantity: 3, unit: 'tép', notes: 'Băm nhuyễn' },
      { name: 'Dầu hào & Nước mắm', quantity: 2, unit: 'thìa canh', notes: 'Gia vị nêm nếm' },
    ]);
    setValue('steps', [
      {
        title: 'Bước 1: Sơ chế và ướp nguyên liệu',
        description: 'Thịt bò rửa sạch, thấm khô và thái lát mỏng. Ướp cùng 1 thìa tỏi băm, dầu hào, tiêu xay trong 15 phút.',
        timerMinutes: 15,
      },
      {
        title: 'Bước 2: Tiến hành xào chín',
        description: 'Phi thơm tỏi trên chảo lửa lớn, cho thịt bò vào đảo nhanh tay trong 2 phút rồi trút ra đĩa. Tiếp tục xào hành tây chín tới.',
        timerMinutes: 5,
      },
      {
        title: 'Bước 3: Hoàn thành và trình bày',
        description: 'Trộn đều thịt bò với hành tây trên chảo, rắc hành lá cắt khúc và tiêu xay. Bày ra đĩa dùng nóng với cơm.',
        timerMinutes: 2,
      },
    ]);
    if (!watchedImageUrl) {
      setValue('primaryImageUrl', sampleImages[0].url);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Thông báo lỗi server (nếu có) */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-red-900">Không thể {isEdit ? 'cập nhật' : 'tạo'} công thức</h4>
            <p className="mt-0.5 leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* Nút hỗ trợ nạp dữ liệu mẫu nhanh */}
      {!isEdit && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Muốn thử nghiệm nhanh? Bạn có thể tự động điền danh sách nguyên liệu và các bước chuẩn:</span>
          </div>
          <button
            type="button"
            onClick={handleFillSampleStepsAndIngredients}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-colors"
          >
            Điền nguyên liệu & các bước mẫu
          </button>
        </div>
      )}

      {/* Khối 1: Thông tin cơ bản */}
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
          <Utensils className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">1. Thông tin cơ bản</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Tiêu đề công thức */}
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
              placeholder="Giới thiệu đôi nét về hương vị, nguồn gốc hoặc điểm đặc sắc của món ăn..."
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

          {/* Ảnh đại diện món ăn (Hỗ trợ cả tải file từ máy và nhập link URL) */}
          <div className="sm:col-span-2 space-y-3 pt-3 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label className="block text-xs font-bold text-gray-800">
                Ảnh đại diện món ăn
              </label>

              {/* Chuyển đổi cách chọn ảnh */}
              <div className="inline-flex rounded-xl bg-gray-100 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 transition-all ${
                    imageInputMode === 'upload'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Chọn ảnh từ máy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 transition-all ${
                    imageInputMode === 'url'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>Nhập URL / Ảnh mẫu</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 w-full space-y-2">
                {imageInputMode === 'upload' ? (
                  <div>
                    <label
                      htmlFor="file-upload"
                      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all text-center ${
                        isUploadingImage
                          ? 'border-orange-400 bg-orange-50/50 cursor-wait'
                          : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50/30'
                      }`}
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="h-8 w-8 text-orange-500 animate-spin mb-2" />
                          <span className="text-sm font-semibold text-orange-700">
                            Đang tải ảnh lên hệ thống MinIO S3...
                          </span>
                          <span className="text-xs text-orange-500 mt-1">
                            Hệ thống sẽ tự động cắt ảnh thumbnail và tối ưu kích thước
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-orange-500 mb-2" />
                          <span className="text-sm font-semibold text-gray-700">
                            Bấm để chọn ảnh từ máy tính hoặc điện thoại
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            Hỗ trợ PNG, JPG, JPEG, WebP (Tối đa 5MB)
                          </span>
                        </>
                      )}
                      <input
                        id="file-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isSubmitting || isUploadingImage}
                        className="hidden"
                      />
                    </label>

                    {uploadError && (
                      <p className="mt-2 text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        {uploadError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      {...register('primaryImageUrl')}
                      disabled={isSubmitting}
                      placeholder="Dán đường dẫn ảnh: https://example.com/anh-mon-an.jpg"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
                    />
                    {/* Gợi ý ảnh nhanh */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-400">Chọn nhanh ảnh mẫu:</span>
                      {sampleImages.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setLocalPreviewUrl(null);
                            setValue('primaryImageUrl', s.url);
                          }}
                          className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 hover:bg-orange-100 transition-colors"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Preview ảnh nhỏ kèm nút Xóa */}
              <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center shadow-sm">
                {localPreviewUrl || watchedImageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={localPreviewUrl || resolveMediaUrl(watchedImageUrl)}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (watchedImageUrl && watchedImageUrl.startsWith('/culinary-blog/') && !target.src.includes(':9000')) {
                          target.src = `http://localhost:9000${watchedImageUrl}`;
                        } else if (!localPreviewUrl) {
                          target.style.display = 'none';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLocalPreviewUrl(null);
                        setValue('primaryImageUrl', '');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-black transition-colors"
                      title="Xóa ảnh này"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-[10px] mt-1">Chưa có ảnh</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Khối 2: Thời gian & Khẩu phần */}
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
          <Clock className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">2. Thời gian & Khẩu phần</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Thời gian chuẩn bị */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Thời gian chuẩn bị (phút) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register('prepTimeMinutes')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            />
            {errors.prepTimeMinutes && (
              <p className="text-xs text-red-500 font-medium">{errors.prepTimeMinutes.message}</p>
            )}
          </div>

          {/* Thời gian nấu */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Thời gian nấu (phút) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register('cookTimeMinutes')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            />
            {errors.cookTimeMinutes && (
              <p className="text-xs text-red-500 font-medium">{errors.cookTimeMinutes.message}</p>
            )}
          </div>

          {/* Số khẩu phần */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Số khẩu phần (người) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register('servings')}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            />
            {errors.servings && (
              <p className="text-xs text-red-500 font-medium">{errors.servings.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Khối 3: Nguyên liệu chuẩn bị (Ingredients - Động) */}
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Users className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg">3. Nguyên liệu chuẩn bị</h3>
          </div>
          <button
            type="button"
            onClick={() => appendIngredient({ name: '', quantity: null, unit: '', notes: '' })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm nguyên liệu</span>
          </button>
        </div>

        <div className="space-y-3">
          {ingredientFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50/50"
            >
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  {...register(`ingredients.${index}.name` as const)}
                  placeholder={`Tên nguyên liệu ${index + 1} (vd: Thịt heo, Đường...) *`}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white"
                />
              </div>

              <div className="w-24">
                <input
                  type="number"
                  step="any"
                  {...register(`ingredients.${index}.quantity` as const)}
                  placeholder="Số lượng"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white"
                />
              </div>

              <div className="w-28">
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

      {/* Khối 4: Các bước thực hiện chi tiết (Steps - Động) */}
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <CheckCircle2 className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg">4. Các bước thực hiện chi tiết</h3>
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
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm bước thực hiện</span>
          </button>
        </div>

        <div className="space-y-5">
          {stepFields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-3 rounded-2xl border border-orange-100 bg-orange-50/30 p-4.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    {...register(`steps.${index}.title` as const)}
                    placeholder={`Tiêu đề bước ${index + 1} (vd: Sơ chế, Xào chín...)`}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold outline-none focus:border-orange-500 bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
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

      {/* Khối 5: Hướng dẫn chung & Mẹo vặt */}
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
          <Utensils className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">5. Hướng dẫn chung & Lưu ý của tác giả</h3>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700">
            Ghi chú tổng quan hoặc mẹo nhỏ <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            {...register('instructions')}
            disabled={isSubmitting}
            placeholder="Ghi chú tổng quan về cách bảo quản, lưu ý nhiệt độ hoặc mẹo nhỏ giúp món ăn ngon hơn..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
          />
          {errors.instructions && (
            <p className="text-xs text-red-500 font-medium">{errors.instructions.message}</p>
          )}
        </div>
      </div>

      {/* Khối 6: Dinh dưỡng ước tính */}
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-bold text-gray-900">
          <Flame className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">6. Dinh dưỡng ước tính (Mỗi khẩu phần)</h3>
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
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Footer Nút bấm */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Hủy bỏ</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang lưu dữ liệu...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{isEdit ? 'Lưu thay đổi' : 'Tạo công thức ngay'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
