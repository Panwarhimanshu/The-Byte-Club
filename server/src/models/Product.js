import mongoose from 'mongoose';

const choiceSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    priceDelta: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
);

const optionGroupSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    required: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    choices: [choiceSchema],
  },
  { _id: false },
);

const addOnSchema = new mongoose.Schema(
  { id: String, label: String, price: { type: Number, default: 0 } },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    image: { type: String, required: true },
    gallery: [String],
    ingredients: [String],
    tags: { type: [String], index: true },
    isVeg: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    spiceLevel: { type: Number, min: 0, max: 3, default: 0 },
    kcal: Number,
    prepTimeMins: { type: Number, default: 8 },
    rating: { type: Number, default: 4.5 },
    ratingCount: { type: Number, default: 0 },
    optionGroups: [optionGroupSchema],
    addOns: [addOnSchema],
    seo: {
      title: String,
      description: String,
    },
  },
  { timestamps: true },
);

productSchema.index({ isFeatured: 1, isBestseller: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

productSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Product = mongoose.model('Product', productSchema);
