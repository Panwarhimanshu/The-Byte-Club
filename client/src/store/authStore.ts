import { create } from 'zustand';
import { authService, type AdminUser } from '@/services/auth.service';
import { tokenStore } from '@/lib/apiClient';

interface AuthState {
  user: AdminUser | null;
  status: 'idle' | 'loading' | 'ready';
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  hydrate: async () => {
    if (!tokenStore.get()) {
      set({ status: 'ready' });
      return;
    }
    set({ status: 'loading' });
    const user = await authService.me();
    set({ user, status: 'ready' });
  },

  login: async (email, password) => {
    const user = await authService.login(email, password);
    set({ user, status: 'ready' });
    return user;
  },

  logout: () => {
    authService.logout();
    set({ user: null });
  },
}));
