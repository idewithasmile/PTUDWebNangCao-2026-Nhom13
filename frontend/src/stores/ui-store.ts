import { create } from 'zustand';

export interface UIState {
  isMobileMenuOpen: boolean;
  isSearchModalOpen: boolean;
  activeSearchQuery: string;

  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
  setSearchModalOpen: (isOpen: boolean) => void;
  toggleSearchModal: () => void;
  setActiveSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchModalOpen: false,
  activeSearchQuery: '',

  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),
  toggleSearchModal: () => set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),
  setActiveSearchQuery: (activeSearchQuery) => set({ activeSearchQuery }),
}));
