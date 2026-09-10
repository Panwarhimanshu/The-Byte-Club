import { apiClient, tokenStore } from '@/lib/apiClient';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export const authService = {
  async login(email: string, password: string): Promise<AdminUser> {
    const { data } = await apiClient.post('/auth/login', { email, password });
    tokenStore.set(data.data.token);
    return data.data.user;
  },

  async me(): Promise<AdminUser | null> {
    if (!tokenStore.get()) return null;
    try {
      const { data } = await apiClient.get('/auth/me');
      return data.data;
    } catch {
      tokenStore.clear();
      return null;
    }
  },

  logout() {
    tokenStore.clear();
    void apiClient.post('/auth/logout').catch(() => undefined);
  },
};
