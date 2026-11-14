'use client';

import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';
import { hasSession } from '@/features/auth/api';
import { useToastStore } from '@/features/toast/useToastStore';
import type { RecipeSummaryDto, PagedResult } from '@/lib/types/category';

const LOCAL_STORAGE_KEY = 'culinary_guest_bookmarks';

interface ToggleBookmarkApiResponse {
  isBookmarked: boolean;
  bookmarkCount: number;
}

interface BookmarkState {
  bookmarkedIds: string[];
  isInitialized: boolean;
  init: (force?: boolean) => void;
  reset: () => void;
  isBookmarked: (recipeId: string) => boolean;
  toggleBookmark: (recipeId: string, recipeTitle?: string) => Promise<{ isBookmarked: boolean; bookmarkCount?: number }>;
  syncWithServer: () => Promise<void>;
  count: () => number;
}

function getStoredGuestIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredGuestIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore quota errors
  }
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkedIds: [],
  isInitialized: false,

  reset: () => {
    set({ bookmarkedIds: [], isInitialized: false });
  },

  init: async (force = false) => {
    if (get().isInitialized && !force) return;

    if (hasSession()) {
      // Đã đăng nhập: lấy danh sách bookmarks từ server
      try {
        // Đồng bộ trước nếu có món lưu tạm lúc làm khách
        const localIds = getStoredGuestIds();
        if (localIds.length > 0) {
          await apiClient('/recipes/bookmarks/sync', {
            method: 'POST',
            body: JSON.stringify(localIds),
          });
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }

        const res = await apiClient<PagedResult<RecipeSummaryDto>>('/recipes/bookmarks/me?pageSize=100');
        const serverIds = (res?.items || []).map((r) => r.id);
        set({ bookmarkedIds: serverIds, isInitialized: true });
      } catch {
        // Fallback sang local nếu server lỗi mạng
        set({ bookmarkedIds: getStoredGuestIds(), isInitialized: true });
      }
    } else {
      // Khách vãng lai: đọc từ localStorage
      set({ bookmarkedIds: getStoredGuestIds(), isInitialized: true });
    }
  },

  isBookmarked: (recipeId: string) => {
    return get().bookmarkedIds.includes(recipeId);
  },

  toggleBookmark: async (recipeId: string, recipeTitle?: string) => {
    const { bookmarkedIds } = get();
    const currentlySaved = bookmarkedIds.includes(recipeId);
    const isLoggedIn = hasSession();

    if (isLoggedIn) {
      try {
        const res = await apiClient<ToggleBookmarkApiResponse>(`/recipes/${recipeId}/bookmark`, {
          method: 'POST',
        });

        const nextIds = res.isBookmarked
          ? Array.from(new Set([...bookmarkedIds, recipeId]))
          : bookmarkedIds.filter((id) => id !== recipeId);

        set({ bookmarkedIds: nextIds });
        useToastStore.getState().showBookmarkToast(res.isBookmarked, recipeTitle);
        return { isBookmarked: res.isBookmarked, bookmarkCount: res.bookmarkCount };
      } catch (err) {
        console.error('[Bookmarks] Toggle failed on server:', err);
        throw err;
      }
    } else {
      // Khách vãng lai: lưu vào localStorage
      const nextIds = currentlySaved
        ? bookmarkedIds.filter((id) => id !== recipeId)
        : [...bookmarkedIds, recipeId];

      setStoredGuestIds(nextIds);
      set({ bookmarkedIds: nextIds });
      useToastStore.getState().showBookmarkToast(!currentlySaved, recipeTitle);
      return { isBookmarked: !currentlySaved };
    }
  },

  syncWithServer: async () => {
    if (!hasSession()) return;
    const localIds = getStoredGuestIds();
    if (localIds.length === 0) return;

    try {
      await apiClient('/recipes/bookmarks/sync', {
        method: 'POST',
        body: JSON.stringify(localIds),
      });
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      const res = await apiClient<PagedResult<RecipeSummaryDto>>('/recipes/bookmarks/me?pageSize=100');
      const serverIds = (res?.items || []).map((r) => r.id);
      set({ bookmarkedIds: serverIds });
    } catch (e) {
      console.warn('[Bookmarks] Auto sync failed:', e);
    }
  },

  count: () => get().bookmarkedIds.length,
}));
