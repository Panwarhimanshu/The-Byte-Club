export type ID = string;

export interface Category {
  id: ID;
  name: string;
  slug: string;
  tagline?: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface OptionChoice {
  id: ID;
  label: string;
  priceDelta: number; // ₹
  isDefault?: boolean;
}

export interface OptionGroup {
  id: ID;
  name: string; // "Size", "Cheese"
  required: boolean;
  multiple: boolean;
  choices: OptionChoice[];
}

export interface AddOn {
  id: ID;
  label: string;
  price: number;
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number; // base price ₹
  category: string; // category slug
  image: string;
  gallery?: string[];
  ingredients: string[];
  tags: string[];
  isVeg: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  spiceLevel?: 0 | 1 | 2 | 3;
  kcal?: number;
  prepTimeMins: number;
  rating: number;
  ratingCount: number;
  optionGroups: OptionGroup[]; // shown as "ways to make it yours" — informational
  addOns: AddOn[];
  seo?: { title?: string; description?: string };
}

export interface Offer {
  id: ID;
  title: string;
  description: string;
  code?: string;
  type: 'bogo' | 'combo' | 'percent' | 'flat' | 'freebie';
  value: number;
  minOrder?: number;
  image: string;
  accent: 'primary' | 'secondary' | 'accent';
  badge: string;
  isActive: boolean;
  endsAt?: string;
}

export interface Review {
  id: ID;
  name: string;
  handle?: string;
  rating: number;
  body: string;
  product?: string;
  productName?: string;
  date: string;
  avatarColor: string;
  isApproved?: boolean;
  createdAt?: string;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  currency: string;
  phone: string;
  email: string;
  address: string;
  mapsUrl?: string;
  deliveryApps: { label: string; href: string }[];
  hours: { day: string; open: string; close: string }[];
  socials: { label: string; href: string }[];
}
