'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-gray-200 dark:border-zinc-800 bg-transparent flex items-center justify-center opacity-0">
        <Sun className="h-4 w-4" />
      </div>
    );
  }

  const currentIcon =
    theme === 'system' ? (
      <Laptop className="h-4 w-4 text-orange-500" />
    ) : resolvedTheme === 'dark' ? (
      <Moon className="h-4 w-4 text-orange-400" />
    ) : (
      <Sun className="h-4 w-4 text-amber-500" />
    );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 text-xs font-medium text-gray-700 dark:text-zinc-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        title="Chuyển đổi giao diện (Sáng / Tối / Hệ thống)"
        aria-label="Chuyển đổi giao diện"
      >
        {currentIcon}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-lg shadow-black/5 ring-1 ring-black/5 z-50">
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              setIsOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition ${
              theme === 'light'
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Giao diện sáng</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition ${
              theme === 'dark'
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Moon className="h-4 w-4 text-orange-400" />
            <span>Giao diện tối</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme('system');
              setIsOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition ${
              theme === 'system'
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Laptop className="h-4 w-4 text-orange-500" />
            <span>Theo hệ thống</span>
          </button>
        </div>
      )}
    </div>
  );
}
