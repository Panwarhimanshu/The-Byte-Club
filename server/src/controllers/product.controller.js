import slugify from 'slugify';
import { Product } from '../models/Product.js';
import { asyncHandler, ok } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const sortMap = {
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1 },
  popular: { isBestseller: -1, ratingCount: -1 },
  newest: { createdAt: -1 },
};

export const listProducts = asyncHandler(async (req, res) => {
  const { category, search, featured, bestseller, veg, sort } = req.query;
  const filter = {};
  if (category && category !== 'all') filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (bestseller === 'true') filter.isBestseller = true;
  if (veg === 'true') filter.isVeg = true;
  if (search) filter.$text = { $search: String(search) };

  const products = await Product.find(filter).sort(sortMap[sort] || sortMap.popular);
  ok(res, products.map((p) => p.toJSON()));
});

/** Admin listing — everything, newest first, no filters. */
export const listAllProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  ok(res, products.map((p) => p.toJSON()));
});

export const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const product = await Product.findOne(
    idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug },
  );
  if (!product) throw ApiError.notFound('We couldn’t find that item on the menu.');
  ok(res, product.toJSON());
});

export const getRelated = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.idOrSlug });
  if (!product) throw ApiError.notFound();
  const related = await Product.find({
    _id: { $ne: product._id },
    isAvailable: true,
    $or: [{ category: product.category }, { tags: { $in: product.tags } }],
  }).limit(4);
  ok(res, related.map((p) => p.toJSON()));
});

/* ── writes (admin) ─────────────────────────────── */

export const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;
  const slug = (body.slug || slugify(body.name, { lower: true, strict: true })).trim();
  if (await Product.exists({ slug })) throw ApiError.conflict(`A product with slug “${slug}” already exists.`);
  const product = await Product.create({ ...body, slug });
  ok(res, product.toJSON(), 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const patch = { ...req.body };
  if (patch.slug) patch.slug = slugify(patch.slug, { lower: true, strict: true });
  const product = await Product.findByIdAndUpdate(req.params.id, patch, {
    new: true,
    runValidators: true,
  });
  if (!product) throw ApiError.notFound('Product not found.');
  ok(res, product.toJSON());
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw ApiError.notFound('Product not found.');
  ok(res, { ok: true });
});

export const setAvailability = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isAvailable: Boolean(req.body.isAvailable) },
    { new: true },
  );
  if (!product) throw ApiError.notFound('Product not found.');
  ok(res, product.toJSON());
});
