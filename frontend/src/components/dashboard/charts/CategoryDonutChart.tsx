'use client';

import { useMemo } from 'react';
import type { CategoryDistributionDto } from '@/lib/types/dashboard';
import { FolderTree } from 'lucide-react';

interface CategoryDonutChartProps {
  categories: CategoryDistributionDto[];
  totalRecipes: number;
}

const PALETTE = [
  '#3b82f6', // blue
  '#f97316', // orange
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#64748b', // slate
];

export default function CategoryDonutChart({ categories, totalRecipes }: CategoryDonutChartProps) {
  // Chuẩn bị dữ liệu hiển thị (Lấy top 5 + gom còn lại vào "Khác")
  const chartData = useMemo(() => {
    if (!categories || categories.length === 0 || totalRecipes === 0) {
      return [];
    }

    const top5 = categories.slice(0, 5);
    const rest = categories.slice(5);
    const restCount = rest.reduce((sum, c) => sum + c.recipeCount, 0);
    const restPct = rest.reduce((sum, c) => sum + c.percentage, 0);

    const items = top5.map((c, i) => ({
      name: c.name,
      count: c.recipeCount,
      percentage: c.percentage,
      color: PALETTE[i % PALETTE.length],
    }));

    if (restCount > 0) {
      items.push({
        name: 'Khác',
        count: restCount,
        percentage: Math.round(restPct * 10) / 10,
        color: PALETTE[5],
      });
    }

    return items;
  }, [categories, totalRecipes]);

  // Vẽ Donut arcs
  const radius = 60;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900">Phân bố danh mục</h3>
        <p className="text-xs text-gray-400 mt-0.5">Tỷ lệ công thức theo danh mục món ăn</p>
      </div>

      {chartData.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400 my-auto">
          <FolderTree className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-xs font-semibold text-gray-600">Chưa có công thức theo danh mục</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Tạo công thức mới để theo dõi tỷ lệ phân bố thực tế</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto">
          {/* SVG Donut */}
          <div className="relative w-40 h-40 shrink-0">
            <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
              {chartData.map((item, idx) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += item.percentage;

                return (
                  <circle
                    key={idx}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                  />
                );
              })}
            </svg>

            {/* Tâm của Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl font-extrabold text-gray-900">
                {totalRecipes.toLocaleString('vi-VN')}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Bài viết
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2 w-full text-xs">
            {chartData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate font-medium text-gray-800">{item.name}</span>
                </div>
                <div className="text-right shrink-0 font-semibold text-gray-500 pl-2">
                  <span>{item.count}</span>
                  <span className="text-[11px] text-gray-400 ml-1">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
