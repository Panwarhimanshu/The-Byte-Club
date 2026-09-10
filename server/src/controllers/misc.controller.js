import { Offer } from '../models/Offer.js';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { StoreSettings } from '../models/StoreSettings.js';
import { asyncHandler, ok } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

/* ── Offers ─────────────────────────────── */
export const listOffers = asyncHandler(async (req, res) => {
  const filter = req.query.all === '1' ? {} : { isActive: true };
  const offers = await Offer.find(filter).sort({ createdAt: -1 });
  ok(res, offers.map((o) => o.toJSON()));
});

export const createOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.create(normaliseOffer(req.body));
  ok(res, offer.toJSON(), 201);
});

export const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(req.params.id, normaliseOffer(req.body), { new: true });
  if (!offer) throw ApiError.notFound('Offer not found.');
  ok(res, offer.toJSON());
});

export const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByIdAndDelete(req.params.id);
  if (!offer) throw ApiError.notFound('Offer not found.');
  ok(res, { ok: true });
});

function normaliseOffer(body) {
  const out = { ...body };
  if (out.endsAt === '') out.endsAt = undefined;
  if (out.code === '') out.code = undefined;
  return out;
}

/* ── Reviews ────────────────────────────── */
export const listReviews = asyncHandler(async (req, res) => {
  const filter = req.query.all === '1' ? {} : { isApproved: true };
  if (req.query.product) filter.productName = req.query.product;
  const reviews = await Review.find(filter).sort({ createdAt: -1 });
  ok(res, reviews.map((r) => r.toJSON()));
});

export const listProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.idOrSlug });
  if (!product) throw ApiError.notFound();
  const reviews = await Review.find({ product: product._id, isApproved: true }).sort({ createdAt: -1 });
  ok(res, reviews.map((r) => r.toJSON()));
});

export const createReview = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (body.productName) {
    const product = await Product.findOne({ name: body.productName });
    if (product) body.product = product._id;
  }
  const review = await Review.create(body);
  ok(res, review.toJSON(), 201);
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!review) throw ApiError.notFound('Review not found.');
  ok(res, review.toJSON());
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw ApiError.notFound('Review not found.');
  ok(res, { ok: true });
});

/* ── Settings ───────────────────────────── */
export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await StoreSettings.getSingleton();
  ok(res, settings.toJSON());
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getSingleton();
  Object.assign(settings, req.body);
  await settings.save();
  ok(res, settings.toJSON());
});
