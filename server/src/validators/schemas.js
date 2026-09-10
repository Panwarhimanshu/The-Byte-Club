import { z } from 'zod';

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
};

const choice = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  priceDelta: z.coerce.number().default(0),
  isDefault: z.boolean().optional(),
});

const optionGroup = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  required: z.boolean().default(false),
  multiple: z.boolean().default(false),
  choices: z.array(choice).default([]),
});

const addOn = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  price: z.coerce.number().default(0),
});

const productShape = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(2),
  longDescription: z.string().optional().or(z.literal('')),
  price: z.coerce.number().min(0),
  category: z.string().min(1),
  image: z.string().min(1),
  gallery: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isVeg: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  spiceLevel: z.coerce.number().min(0).max(3).optional(),
  kcal: z.coerce.number().optional(),
  prepTimeMins: z.coerce.number().min(1).optional(),
  optionGroups: z.array(optionGroup).optional(),
  addOns: z.array(addOn).optional(),
  seo: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
});

export const createProductSchema = { body: productShape };
export const updateProductSchema = { body: productShape.partial() };

const categoryShape = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  tagline: z.string().optional().or(z.literal('')),
  image: z.string().optional().or(z.literal('')),
  order: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});
export const createCategorySchema = { body: categoryShape };
export const updateCategorySchema = { body: categoryShape.partial() };

export const reorderSchema = {
  body: z.object({ ids: z.array(z.string()).min(1) }),
};

const offerShape = z.object({
  title: z.string().min(2),
  description: z.string().optional().or(z.literal('')),
  code: z.string().optional().or(z.literal('')),
  type: z.enum(['bogo', 'combo', 'percent', 'flat', 'freebie']),
  value: z.coerce.number().min(0),
  minOrder: z.coerce.number().min(0).optional(),
  image: z.string().optional().or(z.literal('')),
  accent: z.enum(['primary', 'secondary', 'accent']).optional(),
  badge: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  endsAt: z.string().optional().or(z.literal('')),
});
export const createOfferSchema = { body: offerShape };
export const updateOfferSchema = { body: offerShape.partial() };

const reviewShape = z.object({
  name: z.string().min(2),
  handle: z.string().optional().or(z.literal('')),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().min(4).max(800),
  productName: z.string().optional().or(z.literal('')),
  avatarColor: z.string().optional(),
  isApproved: z.boolean().optional(),
});
export const createReviewSchema = { body: reviewShape };
export const updateReviewSchema = { body: reviewShape.partial() };

export const settingsSchema = {
  body: z.object({
    brandName: z.string().optional(),
    tagline: z.string().optional(),
    logo: z.string().optional(),
    currency: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    mapsUrl: z.string().optional().or(z.literal('')),
    deliveryApps: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
    hours: z.array(z.object({ day: z.string(), open: z.string(), close: z.string() })).optional(),
    socials: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
  }),
};
