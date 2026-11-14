'use client';

import { useState, useMemo } from 'react';
import type { DailyActivityDto } from '@/lib/types/dashboard';
import { ChefHat, TrendingUp } from 'lucide-react';

interface ActivityTrendChartProps {
  activity7Days?: DailyActivityDto[];
  isSystemScope?: boolean;
}

export default function ActivityTrendChart({
  activity7Days,
  isSystemScope = false,
}: ActivityTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chuẩn bị dữ liệu 7 ngày thực tế từ API (hoặc tạo 7 ngày gần nhất với 0 công thức nếu chưa có)
  const data = useMemo(() => {
    if (activity7Days && activity7Days.length > 0) {
      return activity7Days;
    }
    const days: DailyActivityDto[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      days.push({ date: dateStr, recipeCount: 0 });
    }
    return days;
  }, [activity7Days]);

  const total7Days = useMemo(
    () => data.reduce((sum, item) => sum + item.recipeCount, 0),
    [data]
  );

  const rawMax = Math.max(...data.map((d) => d.recipeCount), 0);
  // Đảm bảo trục tung có ít nhất 4 đơn vị để vẽ lưới đẹp
  const maxVal = Math.max(rawMax, 4);

  const width = 600;
  const height = 220;
  const paddingX = 45;
  const paddingY = 25;

  const points = data.map((d, index) => {
    const x = paddingX + (index * (width - 2 * paddingX)) / (data.length - 1);
    const y = height - paddingY - (d.recipeCount / maxVal) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  const pathLine = points.reduce((acc, curr, index) => {
    return index === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaLine = `${pathLine} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Các vạch ngang trục tung
  const yTicks = [0, Math.ceil(maxVal / 2), maxVal];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      {/* Header Biểu Đồ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">
              Hoạt động đăng bài (7 ngày qua)
            </h3>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {total7Days} công thức
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {isSystemScope
              ? 'Số công thức mới đăng tải trên toàn hệ thống'
              : 'Số công thức bạn đã soạn thảo và đăng tải'}
          </p>
        </div>

        {/* Legend thực tế (1 chỉ số thật duy nhất) */}
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span>Công thức mới</span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden select-none my-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((val, idx) => {
            const y = height - paddingY - (val / maxVal) * (height - 2 * paddingY);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontWeight="600"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Vùng đổ bóng màu */}
          <path d={areaLine} fill="url(#activityGradient)" />

          {/* Đường đồ thị thực */}
          <path
            d={pathLine}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Điểm nút và nhãn trục X */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Cột bắt sự kiện chuột rộng hơn */}
                <rect
                  x={p.x - 20}
                  y={0}
                  width="40"
                  height={height}
                  fill="transparent"
                />

                {/* Điểm tròn */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* Nhãn ngày trục X */}
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isHovered ? '#1e293b' : '#64748b'}
                  fontWeight={isHovered ? 'bold' : '500'}
                  className="transition-colors"
                >
                  {p.date}
                </text>

                {/* Tooltip khi di chuột */}
                {isHovered && (
                  <g>
                    <rect
                      x={p.x - 45}
                      y={p.y - 32}
                      width="90"
                      height="24"
                      rx="8"
                      fill="#0f172a"
                      className="shadow-md"
                    />
                    <text
                      x={p.x}
                      y={p.y - 16}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#ffffff"
                      fontWeight="bold"
                    >
                      {p.recipeCount} công thức
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer ghi chú */}
      <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
        <span>Cập nhật tự động từ CSDL</span>
        <span>7 ngày gần nhất</span>
      </div>
    </div>
  );
}
