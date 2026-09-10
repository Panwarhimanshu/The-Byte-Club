import { useQuery } from '@tanstack/react-query';
import { catalogService, type ProductQuery } from '@/services/catalog.service';
import { contentService } from '@/services/content.service';
import type { Product } from '@/types';

export const queryKeys = {
  categories: ['categories'] as const,
  products: (q: ProductQuery) => ['products', q] as const,
  product: (slug: string) => ['product', slug] as const,
  related: (slug: string) => ['related', slug] as const,
  offers: ['offers'] as const,
  reviews: (product?: string) => ['reviews', product ?? 'all'] as const,
  settings: ['settings'] as const,
};

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories, queryFn: catalogService.listCategories, staleTime: 5 * 60_000 });
}

export function useProducts(query: ProductQuery = {}) {
  return useQuery({
    queryKey: queryKeys.products(query),
    queryFn: () => catalogService.listProducts(query),
    staleTime: 60_000,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.product(slug ?? ''),
    queryFn: () => catalogService.getProduct(slug!),
    enabled: Boolean(slug),
  });
}

export function useRelatedProducts(product: Product | undefined) {
  return useQuery({
    queryKey: queryKeys.related(product?.slug ?? ''),
    queryFn: () => catalogService.getRelated(product!),
    enabled: Boolean(product),
  });
}

export function useOffers() {
  return useQuery({ queryKey: queryKeys.offers, queryFn: contentService.listOffers, staleTime: 5 * 60_000 });
}

export function useReviews(product?: string) {
  return useQuery({ queryKey: queryKeys.reviews(product), queryFn: () => contentService.listReviews(product) });
}

export function useSettings() {
  return useQuery({ queryKey: queryKeys.settings, queryFn: contentService.getSettings, staleTime: 10 * 60_000 });
}
