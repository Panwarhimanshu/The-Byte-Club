import { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/menu/ProductCard';
import { QuickViewModal } from '@/components/menu/QuickViewModal';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { useProducts } from '@/hooks/queries';
import type { Product } from '@/types';

export function BestSellers() {
  const { data: products, isLoading } = useProducts({ bestseller: true });
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <section className="section container">
      <SectionHeading
        eyebrow="The receipts don’t lie"
        title={<>Most <span className="text-primary">ordered</span>, all week</>}
        description="If everyone else is ordering it, there’s probably a reason."
      />
      <div className="mt-10">
        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products?.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
            ))}
          </div>
        )}
      </div>
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
