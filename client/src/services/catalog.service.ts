import { API_MODE, apiClient, ApiError, delay } from '@/lib/apiClient';
import { categories as mockCategories } from '@/data/categories';
import { products as mockProducts } from '@/data/products';
import type { Category, Product } from '@/types';

export interface ProductQuery {
  category?: string;
  search?: string;
  featured?: boolean;
  bestseller?: boolean;
  veg?: boolean;
  sort?: 'popular' | 'price-asc' | 'price-desc' | 'rating';
}

export function applyQuery(list: Product[], q: ProductQuery): Product[] {
  let out = [...list];
  if (q.category && q.category !== 'all') out = out.filter((p) => p.category === q.category);
  if (q.featured) out = out.filter((p) => p.isFeatured);
  if (q.bestseller) out = out.filter((p) => p.isBestseller);
  if (q.veg) out = out.filter((p) => p.isVeg);
  if (q.search) {
    const term = q.search.toLowerCase().trim();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tags.some((t) => t.includes(term)) ||
        p.ingredients.some((i) => i.toLowerCase().includes(term)),
    );
  }
  switch (q.sort) {
    case 'price-asc':
      out.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      out.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      out.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
    default:
      out.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.ratingCount - a.ratingCount);
  }
  return out;
}

export const catalogService = {
  async listCategories(): Promise<Category[]> {
    if (API_MODE === 'live') {
      const { data } = await apiClient.get('/categories');
      return data.data;
    }
    await delay(220);
    return mockCategories.filter((c) => c.isActive).sort((a, b) => a.order - b.order);
  },

  async listProducts(query: ProductQuery = {}): Promise<Product[]> {
    if (API_MODE === 'live') {
      const { data } = await apiClient.get('/products', { params: query });
      return data.data;
    }
    await delay(320);
    return applyQuery(
      mockProducts.filter((p) => p.isAvailable || query.category === 'all'),
      query,
    );
  },

  async getProduct(slug: string): Promise<Product> {
    if (API_MODE === 'live') {
      const { data } = await apiClient.get(`/products/${slug}`);
      return data.data;
    }
    await delay(260);
    const found = mockProducts.find((p) => p.slug === slug);
    if (!found) throw new ApiError('We couldn’t find that item on the menu.', 404, 'not_found');
    return found;
  },

  async getRelated(product: Product): Promise<Product[]> {
    if (API_MODE === 'live') {
      const { data } = await apiClient.get(`/products/${product.slug}/related`);
      return data.data;
    }
    await delay(200);
    return mockProducts
      .filter((p) => p.id !== product.id && p.isAvailable)
      .map((p) => ({
        p,
        score:
          (p.category === product.category ? 2 : 0) +
          p.tags.filter((t) => product.tags.includes(t)).length,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((x) => x.p);
  },
};
