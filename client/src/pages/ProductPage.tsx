import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Flame, Leaf, MapPin } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { ButtonLink } from '@/components/ui/Button';
import { VegBadge } from '@/components/ui/VegBadge';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { SmartImage } from '@/components/ui/SmartImage';
import { FullPageLoader } from '@/components/ui/ByteLoader';
import { ErrorState } from '@/components/ui/ErrorState';
import { CustomiseInfo } from '@/components/product/Configurator';
import { ProductCard } from '@/components/menu/ProductCard';
import { useProduct, useRelatedProducts, useReviews, useSettings } from '@/hooks/queries';
import { formatMoney, formatDate, initials } from '@/lib/format';
import { productJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { track } from '@/lib/analytics';
import { storeSettings } from '@/data/brand';

export default function ProductPage() {
  const { slug } = useParams();
  const { data: product, isLoading, isError, refetch } = useProduct(slug);

  if (isLoading) return <FullPageLoader />;
  if (isError || !product) {
    return (
      <div className="container section">
        <ErrorState
          title="Item not found"
          message="That item isn’t on the menu — it may have been renamed or retired."
          onRetry={() => refetch()}
        />
        <div className="mt-6 text-center">
          <ButtonLink as="link" to="/menu">Back to menu</ButtonLink>
        </div>
      </div>
    );
  }

  return <ProductView key={product.id} slug={product.slug} />;
}

function ProductView({ slug }: { slug: string }) {
  const { data: product } = useProduct(slug);
  const { data: related } = useRelatedProducts(product ?? undefined);
  const { data: reviews } = useReviews(product?.name);
  const { data: settings = storeSettings } = useSettings();
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return <FullPageLoader />;

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  track('view_product', { slug: product.slug });

  return (
    <>
      <SEO
        title={product.seo?.title ?? product.name}
        description={product.seo?.description ?? product.description}
        path={`/menu/${product.category}/${product.slug}`}
        type="product"
        image={product.image}
        jsonLd={[
          productJsonLd(product),
          breadcrumbJsonLd([
            { name: 'Menu', path: '/menu' },
            { name: product.category, path: `/menu/${product.category}` },
            { name: product.name, path: `/menu/${product.category}/${product.slug}` },
          ]),
        ]}
      />

      <div className="container pt-6">
        <nav className="flex flex-wrap items-center gap-1 font-mono text-xs text-muted" aria-label="Breadcrumb">
          <Link to="/menu" className="hover:text-fg">Menu</Link>
          <ChevronRight size={12} />
          <Link to={`/menu/${product.category}`} className="capitalize hover:text-fg">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-fg">{product.name}</span>
        </nav>
      </div>

      <div className="container grid gap-10 py-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border">
            <SmartImage key={activeImg} src={gallery[activeImg]} alt={product.name} eager width={900} />
            <div className="absolute left-3 top-3 flex gap-1.5">
              {product.isBestseller && <Badge tone="primary">★ Bestseller</Badge>}
              {!product.isAvailable && <Badge tone="accent">Off the board</Badge>}
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {gallery.map((g, i) => (
                <button
                  key={g}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                    i === activeImg ? 'border-primary' : 'border-border opacity-60'
                  }`}
                >
                  <SmartImage src={g} alt="" width={128} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="flex items-start gap-2.5 font-display text-display-lg font-bold leading-[0.95]">
            <VegBadge isVeg={product.isVeg} className="mt-2 h-5 w-5" />
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Rating value={product.rating} count={product.ratingCount} />
            <span className="flex items-center gap-1 font-mono text-xs text-muted">
              <Clock size={13} /> {product.prepTimeMins} min
            </span>
            {product.kcal && (
              <span className="flex items-center gap-1 font-mono text-xs text-muted">
                <Flame size={13} /> {product.kcal} kcal
              </span>
            )}
            {product.isVeg && (
              <span className="flex items-center gap-1 font-mono text-xs text-veg">
                <Leaf size={13} /> Veg
              </span>
            )}
          </div>

          <p className="mt-5 text-muted">{product.longDescription ?? product.description}</p>

          {product.ingredients.length > 0 && (
            <div className="mt-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Ingredients</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.ingredients.map((ing) => (
                  <span key={ing} className="rounded-pill border border-border px-2.5 py-1 text-xs text-fg/80">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="my-7 byte-rule" />

          <CustomiseInfo product={product} />

          {/* Order CTA — this is a showcase site, ordering happens off-site or in person */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-5">
            <p className="flex items-baseline justify-between">
              <span className="font-display text-sm font-bold uppercase tracking-wide">From</span>
              <span className="font-display text-2xl font-bold">{formatMoney(product.price)}</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {product.isAvailable
                ? 'Order at the counter, on pickup, or through a delivery app.'
                : 'Not on the board right now — check back soon.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink as="link" to="/contact" size="md">
                <MapPin size={14} /> Find us
              </ButtonLink>
              {settings.deliveryApps?.map((app) => (
                <a
                  key={app.label}
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('delivery_app_click', { app: app.label })}
                  className="inline-flex h-11 items-center rounded-pill border border-border px-5 font-display text-sm font-semibold uppercase tracking-wide transition hover:border-primary hover:text-primary btn-focus"
                >
                  {app.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="container section border-t border-border">
          <h2 className="font-display text-2xl font-bold">Reviews</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <motion.figure
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <Rating value={r.rating} />
                <blockquote className="mt-2 text-sm text-fg/90">“{r.body}”</blockquote>
                <figcaption className="mt-3 flex items-center gap-2 text-xs text-muted">
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full font-display text-[10px] font-bold text-bg"
                    style={{ background: r.avatarColor }}
                  >
                    {initials(r.name)}
                  </span>
                  {r.name} · {formatDate(r.date)}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {related && related.length > 0 && (
        <section className="container section border-t border-border">
          <h2 className="font-display text-2xl font-bold">Goes well with</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
