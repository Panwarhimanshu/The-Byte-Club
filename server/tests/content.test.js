import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.NODE_ENV = 'test';

const { createApp } = await import('../src/app.js');
const { runSeed } = await import('../src/seed/seed.js');

// mongodb-memory-server needs a one-time binary download. Skip (don't fail) when
// the network is restricted — probe quickly so CI doesn't retry for minutes.
async function reachable() {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 3000);
    await fetch('https://fastdl.mongodb.org/', { method: 'HEAD', signal: c.signal });
    clearTimeout(t);
    return true;
  } catch {
    return false;
  }
}

let mongo;
let dbAvailable = true;
try {
  if (!(await reachable())) throw new Error('fastdl.mongodb.org unreachable');
  mongo = await MongoMemoryServer.create();
} catch (err) {
  dbAvailable = false;

  console.warn(`\n⚠  Skipping API tests — MongoMemoryServer unavailable: ${err.message}\n`);
}

const suite = dbAvailable ? describe : describe.skip;
let app;

beforeAll(async () => {
  if (!dbAvailable) return;
  await mongoose.connect(mongo.getUri('byteclub_test'));
  await runSeed({ fresh: true });
  app = createApp();
}, 60_000);

afterAll(async () => {
  if (!dbAvailable) return;
  await mongoose.disconnect();
  await mongo.stop();
});

suite('content API', () => {
  it('health responds ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
  });

  it('lists the seeded catalog', async () => {
    const products = await request(app).get('/api/products');
    expect(products.status).toBe(200);
    expect(products.body.data.length).toBeGreaterThan(10);

    const categories = await request(app).get('/api/categories');
    expect(categories.body.data.length).toBe(8);

    const offers = await request(app).get('/api/offers');
    expect(offers.body.data.length).toBeGreaterThan(0);
  });

  it('filters products by category and searches full-text', async () => {
    const burgers = await request(app).get('/api/products?category=burgers');
    expect(burgers.body.data.every((p) => p.category === 'burgers')).toBe(true);

    const bestsellers = await request(app).get('/api/products?bestseller=true');
    expect(bestsellers.body.data.every((p) => p.isBestseller)).toBe(true);

    const search = await request(app).get('/api/products?search=paneer');
    expect(search.body.data.some((p) => /paneer/i.test(p.name))).toBe(true);
  });

  it('gets a product by slug + its related items and reviews', async () => {
    const res = await request(app).get('/api/products/classic-byte');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('The Classic Byte');
    expect(Array.isArray(res.body.data.optionGroups)).toBe(true);

    const related = await request(app).get('/api/products/classic-byte/related');
    expect(related.body.data.length).toBeGreaterThan(0);

    const reviews = await request(app).get('/api/products/double-stack-overflow/reviews');
    expect(reviews.status).toBe(200);
  });

  it('404s for an unknown product', async () => {
    const res = await request(app).get('/api/products/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });

  it('exposes store settings', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.status).toBe(200);
    expect(res.body.data.brandName).toContain('Byte');
    expect(res.body.data.hours.length).toBeGreaterThan(0);
  });

  it('rejects unauthenticated writes', async () => {
    expect((await request(app).post('/api/admin/products').send({ name: 'x' })).status).toBe(401);
    expect((await request(app).put('/api/admin/settings').send({})).status).toBe(401);
    expect((await request(app).get('/api/admin/stats')).status).toBe(401);
  });
});

suite('admin panel', () => {
  let token;

  it('signs in with the seeded admin account', async () => {
    const bad = await request(app)
      .post('/api/auth/login')
      .send({ email: process.env.ADMIN_EMAIL || 'admin@thebyteclub.com', password: 'wrong' });
    expect(bad.status).toBe(401);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL || 'admin@thebyteclub.com',
        password: process.env.ADMIN_PASSWORD || 'byteclub',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('admin');
    token = res.body.data.token;

    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(me.body.data.email).toBe((process.env.ADMIN_EMAIL || 'admin@thebyteclub.com').toLowerCase());
  });

  it('returns content stats', async () => {
    const res = await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.products).toBeGreaterThan(10);
    expect(Array.isArray(res.body.data.byCategory)).toBe(true);
  });

  it('creates, updates, toggles and deletes a product', async () => {
    const auth = { Authorization: `Bearer ${token}` };

    const created = await request(app)
      .post('/api/admin/products')
      .set(auth)
      .send({
        name: 'Test Byte',
        description: 'a test item',
        price: 111,
        category: 'burgers',
        image: 'https://example.com/x.jpg',
      });
    expect(created.status).toBe(201);
    const id = created.body.data.id;
    expect(created.body.data.slug).toBe('test-byte');

    // storefront sees it
    const pub = await request(app).get('/api/products/test-byte');
    expect(pub.body.data.price).toBe(111);

    const updated = await request(app).put(`/api/admin/products/${id}`).set(auth).send({ price: 222 });
    expect(updated.body.data.price).toBe(222);

    const hidden = await request(app)
      .patch(`/api/admin/products/${id}/availability`)
      .set(auth)
      .send({ isAvailable: false });
    expect(hidden.body.data.isAvailable).toBe(false);

    const del = await request(app).delete(`/api/admin/products/${id}`).set(auth);
    expect(del.status).toBe(200);
    expect((await request(app).get('/api/products/test-byte')).status).toBe(404);
  });

  it('validates product input', async () => {
    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.error.details.length).toBeGreaterThan(0);
  });

  it('approves / hides reviews and updates settings', async () => {
    const auth = { Authorization: `Bearer ${token}` };

    const review = await request(app)
      .post('/api/admin/reviews')
      .set(auth)
      .send({ name: 'CI Bot', rating: 5, body: 'automated review', isApproved: false });
    expect(review.status).toBe(201);
    // not visible until approved
    expect((await request(app).get('/api/reviews')).body.data.some((r) => r.name === 'CI Bot')).toBe(false);
    await request(app).put(`/api/admin/reviews/${review.body.data.id}`).set(auth).send({ isApproved: true });
    expect((await request(app).get('/api/reviews')).body.data.some((r) => r.name === 'CI Bot')).toBe(true);

    const s = await request(app).put('/api/admin/settings').set(auth).send({ tagline: 'Changed by CI' });
    expect(s.body.data.tagline).toBe('Changed by CI');
    expect((await request(app).get('/api/settings')).body.data.tagline).toBe('Changed by CI');
  });
});
