'use client';

import type { CategoryDistributionDto } from '@/lib/types/dashboard';

interface CategoryBarChartProps {
  categories: CategoryDistributionDto[];
}

export default function CategoryBarChart({ categories }: CategoryBarChartProps) {
  const data = categories && categories.length > 0 ? categories.slice(0, 6) : [
    { name: 'Món Việt Nam', recipeCount: 432, percentage: 34.6 },
    { name: 'Món Á Âu', recipeCount: 298, percentage: 23.9 },
    { name: 'Món Chay', recipeCount: 187, percentage: 15.0 },
    { name: 'Món Ngọt', recipeCount: 142, percentage: 11.4 },
    { name: 'Món Nướng', recipeCount: 98, percentage: 7.9 },
    { name: 'Khác', recipeCount: 91, percentage: 7.3 },
  ];

  const maxVal = Math.max(...data.map((d) => d.recipeCount), 1);

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900">Bài viết phổ biến theo danh mục</h3>
        <p className="text-xs text-gray-400 mt-0.5">Số lượng và tỷ trọng các công thức</p>
      </div>

      <div className="space-y-3.5 text-xs">
        {data.map((cat, idx) => {
          const widthPct = Math.max((cat.recipeCount / maxVal) * 100, 4);

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-gray-700 font-medium">
                <span className="truncate max-w-[180px]">{cat.name}</span>
                <span className="font-bold text-gray-900">
                  {cat.recipeCount}{' '}
                  <span className="font-normal text-gray-400 text-[11px]">
                    ({cat.percentage}%)
                  </span>
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
