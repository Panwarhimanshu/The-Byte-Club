import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Leaf, SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/types';
import { SEO } from '@/components/ui/SEO';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { ProductCard } from '@/components/menu/ProductCard';
import { QuickViewModal } from '@/components/menu/QuickViewModal';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Select } from '@/components/ui/Field';
import { useCategories, useProducts } from '@/hooks/queries';
import type { ProductQuery } from '@/services/catalog.service';
import { breadcrumbJsonLd } from '@/lib/seo';
import { cn } from '@/lib/cn';

export default function MenuPage() {
  const { category = 'all' } = useParams();
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState<NonNullable<ProductQuery['sort']>>('popular');
  const [quickView, setQuickView] = useState<Product | null>(null);

  const activeCat = categories.find((c) => c.slug === category);
  const { data: products, isLoading, isError, refetch } = useProducts({
    category,
    veg: vegOnly || undefined,
    sort,
  });

  const title = activeCat ? activeCat.name : 'Full Menu';

  const trail = useMemo(
    () => [
      { name: 'Menu', path: '/menu' },
      ...(activeCat ? [{ name: activeCat.name, path: `/menu/${activeCat.slug}` }] : []),
    ],
    [activeCat],
  );

  return (
    <>
      <SEO
        title={activeCat ? `${activeCat.name} — Menu` : 'Menu'}
        path={activeCat ? `/menu/${activeCat.slug}` : '/menu'}
        description={
          activeCat
            ? `${activeCat.name} at The Byte Club — ${activeCat.tagline}`
            : 'The full Byte Club menu — burgers, pizza, fries, wraps, sandwiches, shakes, desserts and combos.'
        }
        jsonLd={breadcrumbJsonLd(trail)}
      />

      <div className="border-b border-border bg-surface">
        <div className="container py-10 md:py-14">
          <p className="eyebrow mb-3">
            <span className="h-1.5 w-1.5 bg-primary" /> The menu
          </p>
          <h1 className="font-display text-display-lg font-bold">
            {activeCat ? (
              <>
                {activeCat.name.split(' ')[0]}{' '}
                <span className="text-primary">{activeCat.name.split(' ').slice(1).join(' ')}</span>
              </>
            ) : (
              <>Everything we <span className="text-primary">make</span></>
            )}
          </h1>
          {activeCat?.tagline && <p className="mt-2 text-muted md:text-lg">{activeCat.tagline}</p>}
        </div>
      </div>

      <div className="sticky top-16 z-30 border-b border-border bg-bg/90 backdrop-blur-xl md:top-20">
        <div className="container flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <CategoryTabs
            categories={categories}
            active={category}
            onChange={(slug) => navigate(slug === 'all' ? '/menu' : `/menu/${slug}`)}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVegOnly((v) => !v)}
              aria-pressed={vegOnly}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-pill border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition btn-focus',
                vegOnly ? 'border-veg bg-veg/15 text-veg' : 'border-border text-muted hover:text-fg',
              )}
            >
              <Leaf size={13} /> Veg only
            </button>
            <div className="relative">
              <SlidersHorizontal
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                aria-label="Sort products"
                className="h-9 py-0 pl-8 pr-8 text-xs uppercase tracking-wide"
              >
                <option value="popular">Popular</option>
                <option value="rating">Top rated</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <section className="container section">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          <ProductGridSkeleton count={9} />
        ) : products && products.length > 0 ? (
          <>
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted">
              {products.length} {products.length === 1 ? 'item' : 'items'}
              {vegOnly && ' · veg'}
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="Nothing here yet"
            hint={`No ${vegOnly ? 'veg ' : ''}items in ${title}. Try another category.`}
            command={`byte menu --cat ${category}`}
          />
        )}
      </section>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
