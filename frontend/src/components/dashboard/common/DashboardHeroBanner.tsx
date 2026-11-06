'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
}

export interface DashboardHeroBannerProps {
  /** Đường dẫn ảnh nền chất lượng cao */
  backgroundImage: string;
  /** Icon chính đại diện cho view */
  icon: React.ReactNode;
  /** Tiêu đề chính của banner */
  title: string | React.ReactNode;
  /** Huy hiệu đi kèm tiêu đề (số lượng, trạng thái, vai trò) */
  badge?: React.ReactNode;
  /** Mô tả chi tiết phụ đề */
  description?: React.ReactNode;
  /** Danh sách breadcrumbs điều hướng */
  breadcrumbs?: BreadcrumbItem[];
  /** Cụm nút bấm hành động góc phải */
  actions?: React.ReactNode;
  /** Tùy chọn độ mờ ảnh nền (mặc định opacity-50) */
  backgroundOpacity?: string;
  /** Lớp CSS bổ sung */
  className?: string;
}

export default function DashboardHeroBanner({
  backgroundImage,
  icon,
  title,
  badge,
  description,
  breadcrumbs,
  actions,
  backgroundOpacity = 'opacity-50',
  className = '',
}: DashboardHeroBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 shadow-md ${className}`}
    >
      {/* 1. Ảnh nền với hiệu ứng phóng to nhẹ khi hover */}
      <div
        className={`absolute inset-0 bg-cover bg-center ${backgroundOpacity} scale-105 transition-transform duration-700 hover:scale-100 pointer-events-none`}
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />

      {/* 2. Lớp phủ Scrim Gradient 3 tầng chống chói, bảo đảm tương phản text WCAG AA */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/60 to-stone-900/20 pointer-events-none" />

      {/* 3. Nội dung chính của Hero Banner */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
        <div className="space-y-3 max-w-2xl">
          {/* Breadcrumb điều hướng nếu có */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-orange-200/80 font-medium flex-wrap">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1 || item.active;
                return (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    )}
                    {isLast ? (
                      <span className="text-white font-semibold">{item.label}</span>
                    ) : item.href ? (
                      <Link
                        href={item.href}
                        className="hover:text-white transition underline-offset-2 hover:underline"
                      >
                        {item.label}
                      </Link>
                    ) : item.onClick ? (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className="hover:text-white transition underline-offset-2 hover:underline"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Icon & Cụm Tiêu đề */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shrink-0">
              {icon}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  {title}
                </h1>
                {badge}
              </div>
              {description && (
                <div className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed">
                  {description}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cụm nút hành động góc phải nếu có */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
