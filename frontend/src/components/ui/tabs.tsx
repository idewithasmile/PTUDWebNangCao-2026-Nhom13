'use client';

import * as React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  isCompleted?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: 'pills' | 'underline' | 'stepper';
  className?: string;
  ariaLabel?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'pills',
  className,
  ariaLabel = 'Các mục chuyển đổi',
}: TabsProps) {
  const containerRef = React.useRef<HTMLElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const targetTab = tabs[nextIndex];
    if (targetTab && !targetTab.disabled) {
      onTabChange(targetTab.id);
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[nextIndex]?.focus();
    }
  };

  if (variant === 'stepper') {
    return (
      <nav
        aria-label={ariaLabel}
        className={cn('w-full', className)}
      >
        <ol
          ref={(el) => {
            containerRef.current = el;
          }}
          role="tablist"
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2 bg-white rounded-2xl border border-gray-100 shadow-2xs"
        >
          {tabs.map((tab, idx) => {
            const isActive = tab.id === activeTab;
            const isCompleted = tab.isCompleted;

            return (
              <li
                key={tab.id}
                role="presentation"
                className="flex-1 flex items-center min-w-0"
              >
                <button
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  disabled={tab.disabled}
                  onClick={() => onTabChange(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-semibold transition-all text-left group focus:outline-none focus:ring-2 focus:ring-orange-500',
                    isActive
                      ? 'bg-orange-500 text-white shadow-xs font-bold ring-2 ring-orange-200/80'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100/70'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent',
                    tab.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span
                    className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors',
                      isActive
                        ? 'bg-white/20 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      idx + 1
                    )}
                  </span>

                  <span className="whitespace-normal sm:whitespace-nowrap font-medium text-xs leading-tight flex-1">
                    {tab.label}
                  </span>

                  {tab.badge && (
                    <span className="ml-1 sm:ml-auto shrink-0">{tab.badge}</span>
                  )}
                </button>

                {idx < tabs.length - 1 && (
                  <ChevronRight className="hidden md:block w-4 h-4 text-gray-300 mx-0.5 shrink-0" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
      }}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'flex flex-wrap items-center gap-1.5 p-1.5 bg-gray-100/80 rounded-2xl',
        className
      )}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-orange-500',
              isActive
                ? 'bg-white text-gray-900 shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon && <span className="w-4 h-4 shrink-0">{tab.icon}</span>}
            <span className="truncate">{tab.label}</span>
            {tab.badge && <span className="ml-1">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  id,
  activeTab,
  children,
  className,
}: {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (id !== activeTab) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={cn('focus:outline-none animate-fade-in', className)}
    >
      {children}
    </div>
  );
}
