import type { StoreSettings } from '@/types';

export const brand = {
  name: 'The Byte Club',
  short: 'BYTE CLUB',
  tagline: 'Big flavour. Zero buffering.',
  domain: 'thebyteclub.example',
} as const;

/** Small branded label swaps — tasteful, never confusing. */
export const microcopy = {
  findUs: 'FIND US',
  exploreMenu: 'EXPLORE MENU',
  loading: 'Cooking something good…',
  noResults: 'Nothing on the menu matched that',
  searchPlaceholder: 'Search the menu — “paneer”, “spicy”, “combo”…',
} as const;

export const storeSettings: StoreSettings = {
  brandName: 'The Byte Club',
  tagline: 'Big flavour. Zero buffering.',
  currency: '₹',
  phone: '+91 98765 43210',
  email: 'hello@thebyteclub.example',
  address: '12 Server Street, Alkapuri, Vadodara 390007',
  mapsUrl: '',
  deliveryApps: [
    { label: 'Swiggy', href: 'https://swiggy.com' },
    { label: 'Zomato', href: 'https://zomato.com' },
  ],
  hours: [
    { day: 'Mon–Thu', open: '11:00', close: '23:00' },
    { day: 'Fri–Sat', open: '11:00', close: '01:00' },
    { day: 'Sunday', open: '12:00', close: '23:00' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'TikTok', href: 'https://tiktok.com' },
    { label: 'X', href: 'https://x.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
};

export const primaryNav = [
  { label: 'Menu', to: '/menu' },
  { label: 'The Burger', to: '/experience' },
  { label: 'Offers', to: '/offers' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const heroLines = [
  ['GOOD FOOD.', 'GOOD VIBES.', 'NO BUFFERING.'],
  ['YOUR HUNGER JUST GOT', 'A SOFTWARE', 'UPDATE.'],
  ['CRAVE MODE:', 'ON.', ''],
];

export const whyPoints = [
  {
    title: 'Cooked to order',
    body: 'Nothing sits under a lamp. Your byte hits the grill the second you order.',
    stat: '8 min',
    statLabel: 'avg. cook time',
  },
  {
    title: 'Real ingredients',
    body: 'Whole cuts, fresh buns baked daily, sauces made in-house. No mystery powder.',
    stat: '100%',
    statLabel: 'in-house sauces',
  },
  {
    title: 'A tight menu',
    body: 'Sixteen items, no filler. Every one earns its place on the board.',
    stat: '16',
    statLabel: 'things we make',
  },
  {
    title: 'Built for your phone',
    body: 'A site that loads fast, reads clean and gets out of your way.',
    stat: '<1s',
    statLabel: 'to first paint',
  },
];
