import { create } from 'zustand';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: 'default' | 'success' | 'error';
}

interface UIState {
  searchOpen: boolean;
  mobileNavOpen: boolean;
  toasts: Toast[];

  openSearch: () => void;
  closeSearch: () => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;

  toast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchOpen: false,
  mobileNavOpen: false,
  toasts: [],

  openSearch: () => set({ searchOpen: true, mobileNavOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  openMobileNav: () => set({ mobileNavOpen: true, searchOpen: false }),
  closeMobileNav: () => set({ mobileNavOpen: false }),

  toast: (t) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 3800);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));
