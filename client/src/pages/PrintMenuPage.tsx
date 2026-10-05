import { useMemo } from 'react';
import { SEO } from '@/components/ui/SEO';
import { SmartImage } from '@/components/ui/SmartImage';
import { useCategories, useProducts } from '@/hooks/queries';
import { formatMoney } from '@/lib/format';
import type { Product } from '@/types';

/** Poster-style printable menu, built from the same catalog as the site. */
export default function PrintMenuPage() {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();

  const sections = useMemo(
    () =>
      categories
        .map((c) => ({
          ...c,
          items: products.filter((p: Product) => p.category === c.slug && p.isAvailable !== false),
        }))
        .filter((s) => s.items.length > 0),
    [categories, products],
  );

  return (
    <>
      <SEO
        title="Menu poster"
        path="/poster-menu"
        description="The full Byte Club menu in one printable page."
      />

      <div className="min-h-screen bg-[#1200a6] px-4 py-10 text-white sm:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
            The Byte Club
          </h1>
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.3em] sm:text-base">
            The first rule? Come hungry.
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-3xl space-y-12">
          {sections.map((section) => (
            <section key={section.slug} aria-labelledby={`menu-${section.slug}`}>
              <h2
                id={`menu-${section.slug}`}
                className="mb-5 text-center font-display text-3xl font-bold uppercase sm:text-5xl"
              >
                {section.name} menu
              </h2>

              <div className="space-y-4">
                {section.items.map((item) => (
                  <article
                    key={item.id}
                    className="flex items-center gap-4 rounded-[2rem] bg-white p-4 text-[#13151d] sm:gap-6 sm:p-6"
                  >
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl sm:h-36 sm:w-36">
                      <SmartImage src={item.image} alt={item.name} width={300} className="h-full w-full object-contain" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-bold uppercase sm:text-2xl">
                        {item.name}
                        {(item.spiceLevel ?? 0) >= 2 &&<span className="ml-2" aria-label="spicy">🌶️</span>}
                      </h3>
                      <p className="mt-1 text-sm leading-snug text-[#3b3e4d] sm:text-base">{item.description}</p>
                      <p className="mt-2 font-display text-2xl font-bold tracking-wide sm:text-3xl">
                        {formatMoney(item.price)}/-
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mx-auto mt-14 max-w-3xl text-center font-mono text-xs uppercase tracking-widest text-white/80">
          Pickup · Porter · Rapido — Vasna &amp; Manjalpur, Vadodara
        </footer>
      </div>
    </>
  );
}
