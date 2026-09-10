import { apiClient } from '@/lib/apiClient';
import type { Category, Offer, Product, Review, StoreSettings } from '@/types';

/** Writes a `{ data }` envelope response, returns the payload. */
async function get<T>(url: string): Promise<T> {
  const { data } = await apiClient.get(url);
  return data.data as T;
}
async function post<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.post(url, body);
  return data.data as T;
}
async function put<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.put(url, body);
  return data.data as T;
}
async function patch<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.patch(url, body);
  return data.data as T;
}
async function del(url: string): Promise<void> {
  await apiClient.delete(url);
}

export interface AdminStats {
  products: number;
  unavailable: number;
  featured: number;
  bestsellers: number;
  categories: number;
  hiddenCategories: number;
  offers: number;
  activeOffers: number;
  reviews: number;
  pendingReviews: number;
  byCategory: { category: string; count: number }[];
  recentReviews: Review[];
  recentProducts: Product[];
}

export type ProductInput = Omit<Product, 'id' | 'rating' | 'ratingCount'>;

export const adminService = {
  stats: () => get<AdminStats>('/admin/stats'),

  // Products
  listProducts: () => get<Product[]>('/admin/products'),
  createProduct: (body: ProductInput) => post<Product>('/admin/products', body),
  updateProduct: (id: string, body: Partial<ProductInput>) => put<Product>(`/admin/products/${id}`, body),
  deleteProduct: (id: string) => del(`/admin/products/${id}`),
  setAvailability: (id: string, isAvailable: boolean) =>
    patch<Product>(`/admin/products/${id}/availability`, { isAvailable }),

  // Categories
  listCategories: () => get<Category[]>('/categories?all=1'),
  createCategory: (body: Partial<Category>) => post<Category>('/admin/categories', body),
  updateCategory: (id: string, body: Partial<Category>) => put<Category>(`/admin/categories/${id}`, body),
  deleteCategory: (id: string) => del(`/admin/categories/${id}`),
  reorderCategories: (ids: string[]) => patch<Category[]>('/admin/categories/reorder', { ids }),

  // Offers
  listOffers: () => get<Offer[]>('/offers?all=1'),
  createOffer: (body: Partial<Offer>) => post<Offer>('/admin/offers', body),
  updateOffer: (id: string, body: Partial<Offer>) => put<Offer>(`/admin/offers/${id}`, body),
  deleteOffer: (id: string) => del(`/admin/offers/${id}`),

  // Reviews
  listReviews: () => get<Review[]>('/reviews?all=1'),
  createReview: (body: Partial<Review>) => post<Review>('/admin/reviews', body),
  updateReview: (id: string, body: Partial<Review>) => put<Review>(`/admin/reviews/${id}`, body),
  deleteReview: (id: string) => del(`/admin/reviews/${id}`),

  // Settings
  getSettings: () => get<StoreSettings>('/settings'),
  updateSettings: (body: Partial<StoreSettings>) => put<StoreSettings>('/admin/settings', body),
};
