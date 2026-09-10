import mongoose from 'mongoose';
import slugify from 'slugify';
import { pathToFileURL } from 'node:url';

import { env } from '../config/env.js';
import { connectDb, disconnectDb } from '../config/db.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Offer } from '../models/Offer.js';
import { Review } from '../models/Review.js';
import { StoreSettings } from '../models/StoreSettings.js';
import { User } from '../models/User.js';
import * as data from './data.js';

/** Ensure exactly one admin exists, matching the env credentials. Idempotent. */
export async function ensureAdmin() {
  let admin = await User.findOne({ email: env.admin.email });
  if (!admin) {
    admin = new User({ name: env.admin.name, email: env.admin.email, role: 'admin' });
    await admin.setPassword(env.admin.password);
    await admin.save();
    console.log(`▸ Admin created: ${env.admin.email}`);
  }
  return admin;
}

const DEFAULT_HOURS = [
  { day: 'Mon–Thu', open: '11:00', close: '23:00' },
  { day: 'Fri–Sat', open: '11:00', close: '01:00' },
  { day: 'Sunday', open: '12:00', close: '23:00' },
];
const DEFAULT_SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
  { label: 'X', href: 'https://x.com' },
];

export async function runSeed({ fresh = true } = {}) {
  if (fresh) {
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Offer.deleteMany({}),
      Review.deleteMany({}),
    ]);
  }

  await Category.insertMany(data.categories);

  const products = await Product.insertMany(
    data.products.map((p) => ({
      ...p,
      slug: p.slug || slugify(p.name, { lower: true, strict: true }),
      isAvailable: p.isAvailable ?? true,
    })),
  );

  await Offer.insertMany(data.offers);

  await Review.insertMany(
    data.reviews.map((r) => {
      const productDoc = products.find((p) => p.name === r.productName);
      return { ...r, product: productDoc?._id, isApproved: true };
    }),
  );

  const settings = await StoreSettings.getSingleton();
  if (!settings.hours?.length) settings.hours = DEFAULT_HOURS;
  if (!settings.socials?.length) settings.socials = DEFAULT_SOCIALS;
  await settings.save();

  await ensureAdmin();

  return {
    admin: env.admin.email,
    categories: await Category.countDocuments(),
    products: await Product.countDocuments(),
    offers: await Offer.countDocuments(),
    reviews: await Review.countDocuments(),
  };
}

/** Used on dev server boot: seed content if empty, always ensure an admin exists. */
export async function ensureSeeded() {
  const count = await Product.estimatedDocumentCount();
  if (count > 0) {
    await ensureAdmin();
    return { skipped: true };
  }
  console.log('▸ Empty database — seeding menu content…');
  const result = await runSeed({ fresh: false });
  console.log('▸ Seeded:', result);
  return result;
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  (async () => {
    if (!env.mongoUri || env.useMemoryDb) {
      console.log(
        '\n⚠  No persistent MONGO_URI configured.\n' +
          '   In memory-DB mode the dev server seeds itself automatically on `npm run dev`.\n' +
          '   Set MONGO_URI in .env (local Mongo or Atlas) to use `npm run seed` against a real database.\n',
      );
      process.exit(0);
    }
    await connectDb();
    const result = await runSeed({ fresh: true });
    console.log('\n✔ Seed complete\n', result);
    await disconnectDb();
    await mongoose.connection.close();
    process.exit(0);
  })().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
