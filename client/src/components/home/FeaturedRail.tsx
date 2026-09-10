import { useState } from 'react';
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

      <div className="no-scrollbar mt-10 flex gap-4 overflow-x-auto px-5 pb-2 md:px-[max(1.25rem,calc((100vw-1360px)/2+1.25rem))]">
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
