# THE BYTE CLUB

A brand showcase website for a fictional digital-first fast-food joint — bold type,
a "byte" pixel motif, big food photography, smooth motion. It shows off the menu and
the vibe; it is **not** an ordering platform. Ordering happens where real food brands
send you: the counter, pickup, or a delivery app.

> **Demo project.** The Byte Club isn't a real business. Prices, offers, reviews and the
> address are sample data.

![react](https://img.shields.io/badge/React-18-149ECA) ![vite](https://img.shields.io/badge/Vite-6-646CFF) ![node](https://img.shields.io/badge/Node-20+-3C873A) ![mongo](https://img.shields.io/badge/MongoDB-content%20API-47A248)

---

## What it is

- **8 pages** — Home, Menu (+ per-category), Product detail, **/experience**, Offers, About,
  Contact, Legal.
- **`/experience` — a cinematic scroll-scrubbed burger.** A pinned scene where the page
  scroll *is* the timeline: the burger reveals, explodes into eight layers, tells each
  ingredient's story with connector callouts while it turntables, reassembles, pushes into a
  dramatic close-up, then hands off to a menu preview + Find Us — all reversible, all
  driven by one `useSpring(scrollYProgress)` value. CSS-3D layered burger (each ingredient
  is its own component, so a real 3D model can drop in later). Respects
  `prefers-reduced-motion` and has an error-boundary fallback; the rest of the site is
  untouched and works even if the scene fails. Isolated ~17 KB lazy chunk.
- **Interactive menu** — category filter, veg toggle, sort, quick-look modal, pointer-tracked
  tilt cards, animated category rail, full-text search overlay.
- **Admin panel** (`/admin`) — a JWT-protected, SaaS-style console (visually separate from
  the storefront) to manage everything the site shows: products (with option-group & add-on
  editors), categories (CRUD + reorder), offers, reviews (approve / hide / delete), and store
  settings (brand, contact, hours, delivery-app links, socials). Content stats on the
  dashboard. Every change writes to MongoDB and shows on the storefront immediately.
- **Product pages** — gallery, ingredients, and a read-only "make it yours" panel showing
  sizes / sauces / add-ons and their prices, plus **Find us / Swiggy / Zomato** CTAs.
- **Brand system** — built around the logo: bold cobalt blue (`#1A3BD4`) on warm cream,
  rounded chunky **Fredoka** display type, a bitten-"B" mark. Every color, radius and font
  is a token in `client/src/styles/tokens.css`; re-skin the whole site there.
- **Signature motion** — hero parallax + floating badges, a pixel "byte" loader that
  compiles into the logo, a scroll-driven "how a burger gets built" section, branded
  console-style empty states, toast system.
- **API + admin** — Express + MongoDB. Public endpoints are read-only; `/api/admin/*` is
  JWT-authed and powers the admin panel (full content CRUD + stats). The storefront also
  runs with **zero backend** from bundled data (`VITE_API_MODE=mock`).
- **SEO + a11y + perf** — per-route meta + `Restaurant` / `Product` / `BreadcrumbList`
  JSON-LD, `robots.txt` + generated `sitemap.xml`, lazy routes, responsive lazy images,
  skeletons, keyboard-navigable overlays, `prefers-reduced-motion` honored globally.
  No horizontal overflow down to 320px.

## Tech

| Layer | Choices |
|---|---|
| Frontend | React 18, Vite 6, TypeScript, Tailwind CSS 3, Framer Motion 11, lucide-react |
| Data (FE) | TanStack Query (server cache), Zustand (search/nav/toast UI state) |
| Forms | React Hook Form + Zod (contact form) |
| API | Node + Express 4 (JS ESM), Mongoose 8 — public reads + JWT admin writes |
| Auth | JWT (bearer + httpOnly cookie), bcrypt, admin-only role |
| Security | helmet, CORS allowlist, rate-limit, express-mongo-sanitize, Zod validation |
| Tests | Vitest (client menu-filter logic; API endpoint suite w/ Supertest + mongodb-memory-server) |

## Structure

```
the-byte-club/
├─ client/                  # the website
│  └─ src/
│     ├─ app/               router, query client
│     ├─ layouts/           SiteLayout
│     ├─ pages/             Home, Menu, Product, Offers, About, Contact, Legal, 404
│     ├─ components/        ui/ · layout/ · home/ · menu/ · product/
│     ├─ data/              brand + demo catalog (mock-mode source of truth)
│     ├─ services/          catalog / content  (mock bundled data OR live API)
│     ├─ hooks/             queries, media query, debounce, scroll lock
│     ├─ lib/               seo, motion, format, analytics shim, cn
│     └─ styles/            tokens.css + index.css
├─ server/                  # read-only content API
│  └─ src/
│     ├─ config/            env, db (in-memory fallback)
│     ├─ models/            Product · Category · Offer · Review · StoreSettings
│     ├─ controllers/       product · category · misc
│     ├─ routes/index.js    GET /api/*
│     └─ seed/              seed.js + data.js
├─ docs/                    ARCHITECTURE.md · API.md · DEPLOYMENT.md · screenshots/
└─ package.json             npm workspaces + concurrently
```

## Quick start

```bash
cp .env.example .env
cp client/.env.example client/.env
npm install
npm run dev            # web on :5173, content API on :5050
```

Open **http://localhost:5173**. The site runs on **bundled data** by default
(`VITE_API_MODE=mock`) — no database needed. To read content from the live API instead,
set `VITE_API_MODE=live` in `client/.env`.

### Admin access

`/admin` — sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`
(local default: **`admin@thebyteclub.com` / `byteclub123`**). The account is created /
kept in sync automatically on `npm run dev` and `npm run seed`. Change the env values
and restart to rotate it.

### Database

The repo is currently wired to a **MongoDB Atlas** cluster (`MONGO_URI` in `.env`,
database `byteclub`, `client/.env` set to `VITE_API_MODE=live`). It has been seeded — run
`npm run dev` and the whole site reads from Atlas.

- **Re-seed / reset:** `npm run seed` (wipes catalog + reloads from `server/src/seed/data.js`).
- **Run client-only, no DB:** set `VITE_API_MODE=mock` in `client/.env` — the site renders
  from bundled data.
- **In-memory instead of Atlas:** blank `MONGO_URI` (or `USE_MEMORY_DB=true`) → the API boots
  a local in-memory MongoDB and self-seeds (first run downloads a ~50 MB binary, then caches).

## API

Full detail in [`docs/API.md`](docs/API.md). Envelope: `{ data }` / `{ error: { message, code, details? } }`.

```
Public (read-only)
  GET  /api/health
  GET  /api/products            ?category= &search= &featured= &bestseller= &veg= &sort=
  GET  /api/products/:idOrSlug        · /related · /reviews
  GET  /api/categories   /offers   /reviews?product=   /settings

Auth
  POST /api/auth/login          → { user, token }   (also httpOnly cookie)
  GET  /api/auth/me             POST /api/auth/logout

Admin  (Authorization: Bearer <token>, role: admin)
  GET    /api/admin/stats
  GET    /api/admin/products
  POST   /api/admin/products         PUT /api/admin/products/:id
  PATCH  /api/admin/products/:id/availability      DELETE /api/admin/products/:id
  POST/PUT/DELETE  /api/admin/categories[/:id]     PATCH /api/admin/categories/reorder
  POST/PUT/DELETE  /api/admin/offers[/:id]
  POST/PUT/DELETE  /api/admin/reviews[/:id]
  PUT    /api/admin/settings
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | web + API together |
| `npm run dev:web` / `dev:api` | one side |
| `npm run build` | production build → `client/dist` |
| `npm run start` | run the content API in production mode |
| `npm run seed` | seed a persistent MongoDB |
| `npm test` | API test suite |
| `npm run test --workspace client` | menu-filter unit tests |
| `npm run sitemap --workspace client` | regenerate `client/public/sitemap.xml` |

## Deployment

Full guide in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

- **Client → Vercel / Netlify / Cloudflare Pages / GitHub Pages.** Build `client`, output
  `client/dist`, SPA rewrite → `index.html`. If you don't want the API at all, ship the
  client alone with `VITE_API_MODE=mock` — it's a fully static site.
- **API (optional) → Render / Railway / Fly / a VPS.** `npm run start --workspace server`,
  set `MONGO_URI` (Atlas), `NODE_ENV=production`, run `npm run seed` once.
- **Images → Cloudinary** or similar — swap the Unsplash URLs in the catalog / seed data;
  components take a plain URL.

## Making it yours (no code changes)

| Change | Where |
|---|---|
| Colors / radius / fonts | `client/src/styles/tokens.css`, `client/tailwind.config.js` |
| Logo / favicon / OG image | `client/src/components/ui/Logo.tsx`, `client/public/` |
| Brand name, tagline, address, hours, socials, delivery-app links | `client/src/data/brand.ts` (mock) / `server/src/seed/data.js` (live) |
| Menu / categories / offers / reviews | `client/src/data/*` (mock) or the seeded DB (live) |
| Homepage copy & marquee | `client/src/data/brand.ts`, `client/src/pages/HomePage.tsx` |
| Maps embed | `VITE_MAPS_EMBED_URL` in `client/.env` |

## Troubleshooting

| Symptom | Fix |
|---|---|
| `npm run dev` API hangs on first run | `mongodb-memory-server` is downloading MongoDB. Wait once; it caches. Or run client-only: `npm run dev:web`. |
| Offline / firewalled | Run `npm run dev:web` — the site works fully in `mock` mode with no API. |
| Port 5050 / 5173 in use | Change `PORT` in `.env`; Vite auto-picks the next free port. |
| Images not loading | Unsplash rate-limited your IP or you're offline. Swap for your own CDN URLs. |
| `EBADENGINE` on install | Use Node 20+. |

## License

MIT — sample/reference code. Replace all brand assets and legal copy before real use.
