'use client';

import { useState } from 'react';
import type { RecipeIngredientDto } from '@/lib/types/recipe';
import { ShoppingBag, CheckSquare, Square, Minus, Plus, RotateCcw } from 'lucide-react';

interface RecipeIngredientsListProps {
  ingredients: RecipeIngredientDto[];
  servings: number;
  currentServings?: number;
  onServingsChange?: (nextServings: number) => void;
}

function formatScaledQuantity(quantity: number, ratio: number): string {
  const scaled = Math.round(quantity * ratio * 100) / 100;
  return Number.isInteger(scaled) ? String(scaled) : String(scaled);
}

export default function RecipeIngredientsList({
  ingredients,
  servings,
  currentServings,
  onServingsChange,
}: RecipeIngredientsListProps) {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [internalServings, setInternalServings] = useState<number>(servings > 0 ? servings : 1);

  const baseServings = servings > 0 ? servings : 1;
  const activeServings = currentServings ?? internalServings;
  const ratio = activeServings / baseServings;

  const updateServings = (next: number) => {
    const clamped = Math.min(100, Math.max(1, next));
    setInternalServings(clamped);
    onServingsChange?.(clamped);
  };

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-6 text-center text-sm text-gray-500 dark:text-zinc-400">
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
    <div className="space-y-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-zinc-100">
          <ShoppingBag className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg">Nguyên liệu chuẩn bị</h3>
        </div>
        <span className="rounded-full bg-orange-50 dark:bg-orange-950/60 px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
          {ingredients.length} nguyên liệu
        </span>
      </div>

      {/* Bộ điều chỉnh khẩu phần trực tiếp */}
      <div className="flex items-center justify-between rounded-xl bg-stone-50 dark:bg-zinc-800/70 px-3.5 py-2.5 text-xs print:hidden">
        <span className="font-semibold text-stone-700 dark:text-zinc-200">
          Điều chỉnh khẩu phần:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateServings(activeServings - 1)}
            disabled={activeServings <= 1}
            aria-label="Giảm khẩu phần"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-200 hover:bg-orange-50 disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[3.5rem] text-center font-bold text-stone-900 dark:text-zinc-100">
            {activeServings} phần
          </span>
          <button
            type="button"
            onClick={() => updateServings(activeServings + 1)}
            disabled={activeServings >= 100}
            aria-label="Tăng khẩu phần"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-200 hover:bg-orange-50 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          {activeServings !== baseServings && (
            <button
              type="button"
              onClick={() => updateServings(baseServings)}
              title="Khôi phục khẩu phần gốc"
              className="ml-1 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-orange-600 hover:bg-orange-100/70 dark:text-orange-400"
            >
              <RotateCcw className="h-3 w-3" />
              Gốc
            </button>
          )}
        </div>
      </div>

      <ul className="divide-y divide-gray-50 dark:divide-zinc-800 text-sm">
        {sortedIngredients.map((item) => {
          const isChecked = Boolean(checkedIds[item.id]);
          const displayQty =
            item.quantity !== null && item.quantity !== undefined
              ? formatScaledQuantity(item.quantity, ratio)
              : '';
          return (
            <li
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`flex cursor-pointer items-start gap-3 py-3 transition-colors hover:bg-orange-50/40 dark:hover:bg-zinc-800/40 rounded-lg px-2 ${
                isChecked ? 'line-through opacity-50' : ''
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-gray-400 focus:outline-none print:hidden"
                aria-label={`Đánh dấu nguyên liệu ${item.name}`}
              >
                {isChecked ? (
                  <CheckSquare className="h-5 w-5 text-orange-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-300 dark:text-zinc-600" />
                )}
              </button>

              <div className="flex-1">
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                  {displayQty}{' '}
                  {item.unit ? item.unit : ''}
                </span>{' '}
                <span className="text-gray-700 dark:text-zinc-300">{item.name}</span>
                {item.notes && (
                  <p className="text-xs text-gray-400 dark:text-zinc-500 italic mt-0.5">{item.notes}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
