'use client';

import type { RecipeNutritionDto } from '@/lib/types/recipe';
import { Flame, Dumbbell, Wheat, Droplets } from 'lucide-react';

interface RecipeNutritionCardProps {
  nutrition: RecipeNutritionDto;
}

export default function RecipeNutritionCard({ nutrition }: RecipeNutritionCardProps) {
  if (
    !nutrition ||
    (nutrition.calories == null &&
      nutrition.protein == null &&
      nutrition.carbohydrates == null &&
      nutrition.fat == null)
  ) {
    return null;
  }

  const items = [
    {
      label: 'Năng lượng',
      value: nutrition.calories ? `${nutrition.calories} kcal` : null,
      icon: Flame,
      color: 'bg-red-50 text-red-600 border-red-100',
    },
    {
      label: 'Đạm (Protein)',
      value: nutrition.protein ? `${nutrition.protein} g` : null,
      icon: Dumbbell,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      label: 'Tinh bột (Carbs)',
      value: nutrition.carbohydrates ? `${nutrition.carbohydrates} g` : null,
      icon: Wheat,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      label: 'Chất béo (Fat)',
      value: nutrition.fat ? `${nutrition.fat} g` : null,
      icon: Droplets,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
  ].filter((item) => item.value !== null);

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-base font-bold text-gray-900">Giá trị Dinh dưỡng (mỗi khẩu phần)</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center ${item.color}`}
            >
              <Icon className="h-5 w-5 mb-1 opacity-80" />
              <span className="text-xs text-gray-500 font-medium">{item.label}</span>
              <span className="mt-0.5 text-sm font-bold text-gray-900">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
