import slugify from 'slugify';
import { Category } from '../models/Category.js';
import { asyncHandler, ok } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const listCategories = asyncHandler(async (req, res) => {
  const filter = req.query.all === '1' ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({ order: 1 });
  ok(res, categories.map((c) => c.toJSON()));
});

export const createCategory = asyncHandler(async (req, res) => {
  const slug = (req.body.slug || slugify(req.body.name, { lower: true, strict: true })).trim();
  if (await Category.exists({ slug })) throw ApiError.conflict(`Category slug “${slug}” already exists.`);
  const count = await Category.countDocuments();
  const category = await Category.create({ order: count, ...req.body, slug });
  ok(res, category.toJSON(), 201);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const patch = { ...req.body };
  if (patch.slug) patch.slug = slugify(patch.slug, { lower: true, strict: true });
  const category = await Category.findByIdAndUpdate(req.params.id, patch, { new: true });
  if (!category) throw ApiError.notFound('Category not found.');
  ok(res, category.toJSON());
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw ApiError.notFound('Category not found.');
  ok(res, { ok: true });
});

export const reorderCategories = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  await Promise.all(ids.map((id, order) => Category.updateOne({ _id: id }, { order })));
  const categories = await Category.find().sort({ order: 1 });
  ok(res, categories.map((c) => c.toJSON()));
});
