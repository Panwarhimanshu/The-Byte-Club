import type { Product } from '@/types';
import { brand } from '@/data/brand';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://thebyteclub.example';

export const siteUrl = (path = '/') =>
  `${SITE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    brand: { '@type': 'Brand', name: brand.name },
    category: product.category,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.ratingCount,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: product.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: siteUrl(`/menu/${product.category}/${product.slug}`),
    },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: siteUrl(t.path),
    })),
  };
}

export const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: brand.name,
  servesCuisine: ['Burgers', 'Pizza', 'Fast Food'],
  priceRange: '$$',
  url: SITE_URL,
  acceptsReservations: false,
};
