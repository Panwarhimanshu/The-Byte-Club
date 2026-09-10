# THE BYTE CLUB — Architecture

A brand **showcase** site for a fictional fast-food joint. It presents the menu and the
identity; it does not take orders. Ordering is directed off-site (counter / pickup /
delivery apps).

## Monorepo

```
the-byte-club/
├─ client/          # React 18 + Vite + TS + Tailwind + Framer Motion   ← the website
├─ server/          # Node + Express + Mongoose (JS ESM)                 ← read-only content API
├─ docs/
└─ package.json     # npm workspaces + concurrently
```

## Frontend

```
client/src/
├─ app/             router (lazy routes), query client
├─ layouts/         SiteLayout (navbar / outlet / footer / mobile tab bar / overlays)
├─ pages/           HomePage, MenuPage, ProductPage, OffersPage, AboutPage,
│                   ContactPage, LegalPage, NotFoundPage
├─ components/
│  ├─ ui/           Button, Badge, VegBadge, Rating, Skeleton, ByteLoader, Modal,
│  │                EmptyState, ErrorState, Toaster, SEO, SectionHeading, Field,
│  │                Marquee, SmartImage, Logo
│  ├─ layout/       Navbar, MobileTabBar, MobileNavSheet, Footer, SearchOverlay, ScrollToTop
│  ├─ home/         Hero, CategoryGrid, FeaturedRail, BestSellers, WhyByteClub,
│  │                SpecialOffer, ShowcaseScroller, ReviewsWall, SocialGrid,
│  │                LocationSection, CtaBanner
│  ├─ menu/         ProductCard (tilt), CategoryTabs, QuickViewModal
│  └─ product/      CustomiseInfo (read-only options/add-ons display)
├─ store/           uiStore (search overlay, mobile nav, toasts)  — Zustand
├─ services/        catalog / content — each: bundled `mock` data OR live REST
├─ hooks/           queries (TanStack), useMediaQuery, useDebounce, useScrollLock
├─ lib/             seo, motion (variants), format, analytics (shim), cn
├─ data/            brand config + demo catalog (categories, products, offers, reviews, social)
├─ styles/          tokens.css (all design tokens) + index.css
└─ types/           shared TS types
```

### Data layer

`VITE_API_MODE=mock` (default) — the whole site renders from `src/data/*`. Zero backend.
`VITE_API_MODE=live` — the same `services/*` functions call the Express content API.
Components never call `fetch`; they use `useCategories` / `useProducts` / `useOffers` /
`useReviews` / `useSettings` from `hooks/queries.ts` (TanStack Query — caching, loading
and error states feed the skeletons / error components).

### State

- **Server/content state** — TanStack Query.
- **UI state** (search overlay, mobile nav sheet, toasts) — a single Zustand `uiStore`.
- No cart, no auth, no client persistence.

## Backend (read-only content API)

```
server/src/
├─ config/          env, db (mongoose + in-memory fallback)
├─ models/          Product, Category, Offer, Review, StoreSettings
├─ controllers/     product (list / get / related), category (list), misc (offers / reviews / settings)
├─ routes/index.js  GET /api/* only
├─ middleware/       error (notFound + centralized handler)
├─ seed/            seed.js + data.js
├─ app.js           helmet · cors · compression · rate-limit · mongo-sanitize
└─ server.js        connect → auto-seed (dev, empty db) → listen
```

Endpoints and collection shapes: see `docs/API.md`. There is **no** auth, orders,
payments, coupons or admin — the API's only job is serving menu content.

## Order workflow

There isn't one. The Product page and Contact page point at:
`Find us` (contact / directions) · `Swiggy` · `Zomato` — all configurable in
`data/brand.ts` (`deliveryApps`, address, hours) or the seeded `StoreSettings`.

## SEO & performance

- Per-route `<SEO>` — title, description, canonical, OG/Twitter, JSON-LD.
- JSON-LD: `Restaurant` (site), `Product` + `BreadcrumbList` (product pages).
- `robots.txt` (allow all) + generated `sitemap.xml` (static routes + categories).
- Lazy route chunks + `manualChunks` (react / motion / query split out).
- `SmartImage`: `loading="lazy"`, `decoding="async"`, fade-in, skeleton + graceful
  failure state, width param rewrite for Unsplash/CDN.
- `AnimatePresence initial={false}` so first paint is never gated on animation.
- Global `prefers-reduced-motion` reset in `index.css`; `ShowcaseScroller` and `ByteLoader`
  have explicit reduced-motion branches.
- Verified no horizontal overflow at 375px on every page.

## Signature interactions

1. **Byte loader** — a 5×5 pixel grid "compiles" into the B mark with a scanline.
2. **Tilt product cards** — pointer-tracked 3D tilt + image parallax.
3. **Category rail** — shared-layout animated pill selector.
4. **Scroll showcase** — pinned section; a hero item rotates through its build stages.
5. **Console empty states** — a mini terminal window with a blinking cursor.
6. **Hero** — text reveal, floating info badges, scroll parallax.
7. **Quick-look modal** — peek at a product without leaving the grid.
