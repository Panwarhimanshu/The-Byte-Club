import { API_MODE, apiClient, delay } from '@/lib/apiClient';
import { offers as mockOffers } from '@/data/offers';
import { reviews as mockReviews } from '@/data/reviews';
import { storeSettings as mockSettings } from '@/data/brand';
import type { Offer, Review, StoreSettings } from '@/types';

export const contentService = {
  async listOffers(): Promise<Offer[]> {
    if (API_MODE === 'live') {
      const { data } = await apiClient.get('/offers');
      return data.data;
    }
    await delay(220);
    return mockOffers.filter((o) => o.isActive);
  },

  async listReviews(productName?: string): Promise<Review[]> {
    if (API_MODE === 'live') {
      const { data } = await apiClient.get('/reviews', { params: { product: productName } });
      return data.data;
    }
    await delay(200);
    return productName ? mockReviews.filter((r) => r.product === productName) : mockReviews;
  },

  async getSettings(): Promise<StoreSettings> {
    if (API_MODE === 'live') {
      const { data } = await apiClient.get('/settings');
      return data.data;
    }
    await delay(120);
    return mockSettings;
  },
};
