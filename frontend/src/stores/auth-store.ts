import { create } from 'zustand';
import type { UserProfile } from '@/types/auth';
import { setAccessToken as setInMemoryToken } from '@/features/auth/token-store';

export interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: UserProfile | null, accessToken: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  setAuth: (user, accessToken) => {
    setInMemoryToken(accessToken);
    set({
      user,
      accessToken,
      isAuthenticated: !!accessToken || !!user,
      isLoading: false,
    });
  },

  setUser: (user) => {
    set((state) => ({
      user,
      isAuthenticated: !!state.accessToken || !!user,
    }));
  },

  setAccessToken: (accessToken) => {
    setInMemoryToken(accessToken);
    set((state) => ({
      accessToken,
      isAuthenticated: !!accessToken || !!state.user,
    }));
  },

  setLoading: (isLoading) => set({ isLoading }),

  clearAuth: () => {
    setInMemoryToken(null);
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
