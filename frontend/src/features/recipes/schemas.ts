import { z } from 'zod';
import type { RecipeDifficulty } from '@/lib/types/category';

export const stepItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().min(1, 'Mô tả bước không được để trống.'),
  timerMinutes: z.coerce.number().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

export const ingredientItemSchema = z.object({
  name: z.string().min(1, 'Tên nguyên liệu không được để trống.'),
  quantity: z.coerce.number().optional().nullable(),
  unit: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const recipeFormSchema = z.object({
  title: z
    .string()
    .min(5, 'Tiêu đề công thức tối thiểu 5 ký tự.')
    .max(200, 'Tiêu đề công thức tối đa 200 ký tự.'),
  description: z
    .string()
    .min(10, 'Mô tả ngắn tối thiểu 10 ký tự.')
    .max(2000, 'Mô tả ngắn tối đa 2000 ký tự.'),
  instructions: z
    .string()
    .min(5, 'Hướng dẫn chung tối thiểu 5 ký tự.'),
  primaryImageUrl: z
    .string()
    .optional(),
  categoryId: z
    .string()
    .min(1, 'Vui lòng chọn danh mục cho công thức.'),
  prepTimeMinutes: z.coerce
    .number()
    .min(1, 'Thời gian chuẩn bị tối thiểu 1 phút.'),
  cookTimeMinutes: z.coerce
    .number()
    .min(1, 'Thời gian nấu tối thiểu 1 phút.'),
  servings: z.coerce
    .number()
    .min(1, 'Số khẩu phần tối thiểu 1 người.'),
  difficulty: z.coerce
    .number()
    .min(1)
    .max(4),
  calories: z.coerce
    .number()
    .min(0, 'Số Calo không được âm.'),
  protein: z.coerce
    .number()
    .min(0, 'Lượng Protein không được âm.'),
  carbs: z.coerce
    .number()
    .min(0, 'Lượng Tinh bột không được âm.'),
  fat: z.coerce
    .number()
    .min(0, 'Lượng Chất béo không được âm.'),
  steps: z.array(stepItemSchema).optional(),
  ingredients: z.array(ingredientItemSchema).optional(),
});

export type RecipeFormData = z.infer<typeof recipeFormSchema>;
export type StepItemData = z.infer<typeof stepItemSchema>;
export type IngredientItemData = z.infer<typeof ingredientItemSchema>;
