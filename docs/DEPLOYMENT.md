# Deploying The Byte Club

Two independent pieces. The API is **optional** — the client is a complete static site
on its own.

```
┌────────────┐    (optional)    ┌────────────┐   mongodb+srv   ┌──────────────┐
│  Client    │ ───────────────▶ │ Content    │ ──────────────▶ │ MongoDB Atlas│
│ (Vercel…)  │   GET /api/*     │ API        │                 └──────────────┘
└────────────┘                  └────────────┘
```

---

## Option A — static site only (simplest)

The client runs fully from bundled data. No server, no database.

| Setting | Value |
|---|---|
| Root directory | `client` |
| Build command | `npm run build` |
| Output directory | `client/dist` |
| SPA fallback | rewrite all paths → `/index.html` |
| Env | `VITE_API_MODE=mock`, `VITE_SITE_URL=https://your-domain`, `VITE_MAPS_EMBED_URL=` (optional) |

Works on Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3+CloudFront, anything.

`vercel.json` at repo root:
```json
{
  "buildCommand": "npm run build --workspace client",
  "outputDirectory": "client/dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

After deploy, regenerate the sitemap with your real domain:
```
VITE_SITE_URL=https://your-domain node client/scripts/generate-sitemap.mjs
```
(or wire it as a prebuild step) and commit `client/public/sitemap.xml`.

---

## Option B — with the content API

Use this if non-developers should be able to change the menu/offers/hours without a
redeploy.

### Database — MongoDB Atlas
1. Free M0 cluster, add a DB user, allowlist the API host's IPs.
2. Connection string → `MONGO_URI`.
3. Seed once: `MONGO_URI=… npm run seed --workspace server`.

### API — Render / Railway / Fly / VPS
| Setting | Value |
|---|---|
| Install | `npm install` |
| Start | `npm run start --workspace server` |
| Node | 20+ |
| Health check | `/api/health` |

Env:
```
NODE_ENV=production
PORT=5050                    # or the platform's port
CLIENT_URL=https://your-frontend-domain     # CORS allowlist
MONGO_URI=mongodb+srv://…
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=600
```
`NODE_ENV=production` disables the dev auto-seed — run `npm run seed` yourself.
Add extra CORS origins in `server/src/app.js` if you use preview URLs.

### Client
Same as Option A but:
```
VITE_API_MODE=live
VITE_API_URL=https://your-api-domain/api
```

---

## Images — Cloudinary (or any CDN)

The demo uses Unsplash URLs. To switch:
1. Upload your photography.
2. Replace each `image` / `gallery` URL in `client/src/data/*` (mock) or
   `server/src/seed/data.js` (live) with the CDN delivery URL, e.g.
   `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_900/byteclub/classic-byte.jpg`.
3. `SmartImage` already lazy-loads and rewrites `w=` for `images.unsplash.com`; add a
   similar transform for your CDN if you want responsive widths.

---

## Post-deploy checklist

- [ ] Home, Menu, a product page, Offers, About, Contact all render
- [ ] Menu filters, search overlay and quick-look modal work
- [ ] `robots.txt` and `sitemap.xml` resolve with the real domain
- [ ] Lighthouse pass on the homepage (mobile)
- [ ] (Option B) `GET https://api/api/health` → `{ data: { status: "ok" } }`
- [ ] (Option B) `/menu` populates from the live API with `VITE_API_MODE=live`
- [ ] Contact page: real address, hours, phone, and Swiggy/Zomato links
