/**
 * Generates client/public/sitemap.xml.
 * Usage:  VITE_SITE_URL=https://thebyteclub.example node client/scripts/generate-sitemap.mjs
 *
 * Product URLs change often, so the sitemap lists stable routes + category pages.
 * Keep CATEGORY_SLUGS in sync with src/data/categories.ts (or your live categories).
 */
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = (process.env.VITE_SITE_URL || 'https://thebyteclub.example').replace(/\/$/, '');

const STATIC_PATHS = [
  ['/', '1.0'],
  ['/menu', '0.9'],
  ['/offers', '0.8'],
  ['/about', '0.6'],
  ['/contact', '0.6'],
  ['/track', '0.4'],
  ['/legal/privacy', '0.3'],
  ['/legal/terms', '0.3'],
  ['/legal/refunds', '0.3'],
];

const CATEGORY_SLUGS = [
  'burgers',
  'pizza',
  'fries',
  'wraps',
  'sandwiches',
  'beverages',
  'desserts',
  'combos',
];

const today = new Date().toISOString().slice(0, 10);
const rows = [
  ...STATIC_PATHS.map(([loc, priority]) => ({ loc, priority })),
  ...CATEGORY_SLUGS.map((slug) => ({ loc: `/menu/${slug}`, priority: '0.8' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows
  .map(
    (u) =>
      `  <url><loc>${SITE}${u.loc}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`;

const out = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(out, xml);
console.log(`✔ Wrote ${rows.length} URLs to ${out} (base ${SITE})`);
