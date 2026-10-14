'use client';

import { useState } from 'react';
import type { RecipeIngredientDto } from '@/lib/types/recipe';
import { ShoppingBag, CheckSquare, Square } from 'lucide-react';

interface RecipeIngredientsListProps {
  ingredients: RecipeIngredientDto[];
  servings: number;
}

export default function RecipeIngredientsList({
  ingredients,
  servings,
}: RecipeIngredientsListProps) {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center text-sm text-gray-500">
        Chưa có danh sách nguyên liệu cho công thức này.
      </div>
    );
  }

  const sortedIngredients = [...ingredients].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <ShoppingBag className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">Nguyên liệu chuẩn bị</h3>
        </div>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          {ingredients.length} nguyên liệu ({servings} phần)
        </span>
      </div>

      <ul className="divide-y divide-gray-50 text-sm">
        {sortedIngredients.map((item) => {
          const isChecked = Boolean(checkedIds[item.id]);
          return (
            <li
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`flex cursor-pointer items-start gap-3 py-3 transition-colors hover:bg-orange-50/40 rounded-lg px-2 ${
                isChecked ? 'line-through opacity-50' : ''
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-gray-400 focus:outline-none"
                aria-label={`Đánh dấu nguyên liệu ${item.name}`}
              >
                {isChecked ? (
                  <CheckSquare className="h-5 w-5 text-orange-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-300" />
                )}
              </button>

              <div className="flex-1">
                <span className="font-semibold text-gray-900">
                  {item.quantity ? item.quantity : ''}{' '}
                  {item.unit ? item.unit : ''}
                </span>{' '}
                <span className="text-gray-700">{item.name}</span>
                {item.notes && (
                  <p className="text-xs text-gray-400 italic mt-0.5">{item.notes}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
