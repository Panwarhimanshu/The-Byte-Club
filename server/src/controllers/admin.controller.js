import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Offer } from '../models/Offer.js';
import { Review } from '../models/Review.js';
import { asyncHandler, ok } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (_req, res) => {
  const [products, unavailable, featured, bestsellers, categories, hiddenCategories, offers, activeOffers, reviews, pendingReviews] =
    await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isAvailable: false }),
      Product.countDocuments({ isFeatured: true }),
      Product.countDocuments({ isBestseller: true }),
      Category.countDocuments(),
      Category.countDocuments({ isActive: false }),
      Offer.countDocuments(),
      Offer.countDocuments({ isActive: true }),
      Review.countDocuments(),
      Review.countDocuments({ isApproved: false }),
    ]);

  const byCategory = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const recentReviews = await Review.find().sort({ createdAt: -1 }).limit(5);
  const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5).select('name slug category price isAvailable');

  ok(res, {
    products,
    unavailable,
    featured,
    bestsellers,
    categories,
    hiddenCategories,
    offers,
    activeOffers,
    reviews,
    pendingReviews,
    byCategory: byCategory.map((c) => ({ category: c._id, count: c.count })),
    recentReviews: recentReviews.map((r) => r.toJSON()),
    recentProducts: recentProducts.map((p) => p.toJSON()),
  });
});
