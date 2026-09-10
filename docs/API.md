# The Byte Club — API

Express + Mongoose. **Public** endpoints are read-only and feed the storefront. The
**admin** endpoints (`/api/admin/*`) are JWT-authed (role `admin`) and power the admin
panel — full content CRUD + stats. The client also runs with no backend at all
(`VITE_API_MODE=mock`, bundled data).

Base URL: `http://localhost:5050/api`

**Envelopes**
- Success: `{ "data": <payload> }`
- Error: `{ "error": { "message": string, "code": string } }`

---

## Public endpoints (no auth)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | `{ data: { status: "ok", uptime, env } }` |
| GET | `/products` | query: `category`, `search` (full-text), `featured`, `bestseller`, `veg`, `sort` (`popular` \| `price-asc` \| `price-desc` \| `rating` \| `newest`) |
| GET | `/products/:idOrSlug` | one product (24-hex id or slug) |
| GET | `/products/:idOrSlug/related` | up to 4 related items |
| GET | `/products/:idOrSlug/reviews` | approved reviews for that product |
| GET | `/categories` | active categories, ordered (`?all=1` needs admin) |
| GET | `/offers` | active offers (`?all=1` needs admin) |
| GET | `/reviews` | approved reviews; `?product=<name>` to filter (`?all=1` needs admin) |
| GET | `/settings` | brand, contact, address, hours, socials, delivery-app links |

## Auth

| Method | Path | Body / Notes |
|--------|------|--------------|
| POST | `/auth/login` | `{ email, password }` → `{ user, token }`; also sets an httpOnly `token` cookie |
| GET | `/auth/me` | current admin (bearer token or cookie) |
| POST | `/auth/logout` | clears the cookie |

The admin account is seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD` and re-synced on every
boot. There is no public registration.

## Admin endpoints (`Authorization: Bearer <token>`, role `admin`)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/admin/stats` | counts by type, products-per-category, recent reviews & products |
| GET | `/admin/products` | every product, newest first |
| POST | `/admin/products` | create (auto-slug if omitted) |
| PUT | `/admin/products/:id` | partial update |
| PATCH | `/admin/products/:id/availability` | `{ isAvailable }` |
| DELETE | `/admin/products/:id` | |
| POST / PUT / DELETE | `/admin/categories[/:id]` | CRUD |
| PATCH | `/admin/categories/reorder` | `{ ids: [...] }` — sets `order` from array position |
| POST / PUT / DELETE | `/admin/offers[/:id]` | CRUD |
| POST / PUT / DELETE | `/admin/reviews[/:id]` | CRUD; `PUT { isApproved }` shows/hides on the storefront |
| PUT | `/admin/settings` | partial update of the singleton |

Writes are validated with Zod — a bad body → `400 { error: { code: "bad_request", details: [{ path, message }] } }`.
Missing / invalid token → `401`; wrong role → `403`.

## Product shape

```jsonc
{
  "id": "…", "name": "The Classic Byte", "slug": "classic-byte",
  "description": "…", "longDescription": "…",
  "price": 229, "category": "burgers",
  "image": "https://…", "gallery": ["https://…"],
  "ingredients": ["Beef patty", "Brioche bun", …],
  "tags": ["beef", "classic", "bestseller"],
  "isVeg": false, "isBestseller": true, "isFeatured": true, "isAvailable": true,
  "spiceLevel": 1, "kcal": 640, "prepTimeMins": 8,
  "rating": 4.8, "ratingCount": 512,
  "optionGroups": [
    { "id": "grp_size", "name": "Size", "required": true, "multiple": false,
      "choices": [ { "id": "size_reg", "label": "Regular", "priceDelta": 0, "isDefault": true }, … ] }
  ],
  "addOns": [ { "id": "add_cheese", "label": "Extra cheese slice", "price": 30 } ],
  "seo": { "title": "…", "description": "…" }
}
```
`optionGroups` / `addOns` are shown on the product page as an informational
"make it yours" panel — the site never builds an order.

## Collections (Mongoose)

| Collection | Key fields | Indexes |
|---|---|---|
| `products` | as above | `slug`, `category`, `{isFeatured,isBestseller}`, text(`name`,`description`,`tags`) |
| `categories` | name, slug (unique), tagline, image, order, isActive | `slug` |
| `offers` | title, description, code, type, value, minOrder, image, accent, badge, isActive, endsAt | — |
| `reviews` | product→ref, productName, name, rating, body, isApproved | `product` |
| `storesettings` | singleton: brand, currency, phone, email, address, mapsUrl, deliveryApps[], hours[], socials[] | — |

## Security baseline

`helmet`, CORS allowlist (`CLIENT_URL` + localhost dev origins) with credentials,
`express-rate-limit`, `express-mongo-sanitize`, Zod validation on every write, JWT
(HS256) + bcrypt password hashing, `admin`-only role check, httpOnly + `SameSite`
cookie, secrets only in server env, centralized `{ error }` envelope (stack hidden in
production).
