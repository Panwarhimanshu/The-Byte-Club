import { describe, expect, it } from 'vitest';
import { applyQuery } from './catalog.service';
import { products } from '@/data/products';

describe('applyQuery — menu filtering & search', () => {
  it('returns everything for category "all"', () => {
    expect(applyQuery(products, { category: 'all' }).length).toBe(products.length);
  });

  it('filters by category', () => {
    const out = applyQuery(products, { category: 'burgers' });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((p) => p.category === 'burgers')).toBe(true);
  });

  it('filters bestsellers and veg', () => {
    expect(applyQuery(products, { bestseller: true }).every((p) => p.isBestseller)).toBe(true);
    expect(applyQuery(products, { veg: true }).every((p) => p.isVeg)).toBe(true);
  });

  it('searches name, description, tags and ingredients', () => {
    expect(applyQuery(products, { search: 'paneer' }).some((p) => /paneer/i.test(p.name))).toBe(true);
    expect(applyQuery(products, { search: 'spicy' }).length).toBeGreaterThan(0); // tag match
    expect(applyQuery(products, { search: 'brioche' }).length).toBeGreaterThan(0); // ingredient match
    expect(applyQuery(products, { search: 'zzzznope' }).length).toBe(0);
  });

  it('sorts by price ascending and descending', () => {
    const asc = applyQuery(products, { sort: 'price-asc' }).map((p) => p.price);
    const desc = applyQuery(products, { sort: 'price-desc' }).map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it('every product has a unique slug', () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
