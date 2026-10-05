import { useEffect, useRef, useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { ProductCard } from '@/components/menu/ProductCard';
import { QuickViewModal } from '@/components/menu/QuickViewModal';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useProducts } from '@/hooks/queries';
import type { Product } from '@/types';

export function FeaturedRail() {
  const { data: products, isLoading } = useProducts({ featured: true });
  const [quickView, setQuickView] = useState<Product | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // Auto-advance one card every few seconds; loops back to the start.
  // Pauses on hover/touch/focus and when the user prefers reduced motion.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !products?.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      const card = rail.firstElementChild as HTMLElement | null;
      const step = (card?.offsetWidth ?? 300) + 16; // card width + gap-4
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
      rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + step, behavior: 'smooth' });
    }, 3500);

    return () => window.clearInterval(id);
  }, [products]);

  return (
    <section className="section overflow-hidden">
      <div className="container">
        <SectionHeading
          eyebrow="Chef’s commits"
          title={<>This week’s <span className="text-primary">featured</span></>}
          description="Hand-picked by the pass. Swipe through."
          action={
            <ButtonLink as="link" to="/menu" variant="outline" size="sm">
              Full menu
            </ButtonLink>
          }
        />
      </div>

      <div
        ref={railRef}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onTouchStart={() => (pausedRef.current = true)}
        onTouchEnd={() => (pausedRef.current = false)}
        onFocus={() => (pausedRef.current = true)}
        onBlur={() => (pausedRef.current = false)}
        className="no-scrollbar mt-10 flex gap-4 overflow-x-auto scroll-smooth px-5 pb-2 md:px-[max(1.25rem,calc((100vw-1360px)/2+1.25rem))]"
      >
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[280px] shrink-0">
              <ProductCardSkeleton />
            </div>
          ))}
        {products?.map((product) => (
          <div key={product.id} className="w-[280px] shrink-0 sm:w-[320px]">
            <ProductCard product={product} onQuickView={setQuickView} />
          </div>
        ))}
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
