'use client';

import { create } from 'zustand';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  showBookmarkToast: (isSaved: boolean, recipeTitle?: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { ...toast, id };

    // Giữ tối đa 3 toast cùng lúc ở góc màn hình
    set((state) => ({
      toasts: [...state.toasts.slice(-2), newToast],
    }));

    const duration = toast.duration ?? 2500;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  showBookmarkToast: (isSaved, recipeTitle) => {
    if (isSaved) {
      get().addToast({
        type: 'success',
        title: 'Đã lưu vào Sổ tay ẩm thực 🔖',
        message: recipeTitle
          ? `Món "${recipeTitle}" đã được lưu để bạn xem lại bất cứ khi nào.`
          : 'Công thức đã được lưu vào sổ tay ẩm thực của bạn.',
        actionText: 'Xem sổ tay',
        actionHref: '/saved-recipes',
        duration: 3000,
      });
    } else {
      get().addToast({
        type: 'info',
        title: 'Đã bỏ lưu công thức',
        message: recipeTitle
          ? `Đã xóa "${recipeTitle}" khỏi sổ tay ẩm thực.`
          : 'Đã bỏ đánh dấu lưu món ăn khỏi sổ tay.',
        duration: 2500,
      });
    }
  },
}));
