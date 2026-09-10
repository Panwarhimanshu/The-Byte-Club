import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Flame } from 'lucide-react';
import type { Product } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { VegBadge } from '@/components/ui/VegBadge';
import { Rating } from '@/components/ui/Rating';
import { SmartImage } from '@/components/ui/SmartImage';
import { CustomiseInfo } from '@/components/product/Configurator';
import { formatMoney } from '@/lib/format';

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  return (
    <Modal open={Boolean(product)} onClose={onClose} labelledBy="quickview-title" className="sm:max-w-xl">
      {product && (
        <div>
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <SmartImage src={product.image} alt={product.name} width={800} eager />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface to-transparent p-4">
              <h2 id="quickview-title" className="flex items-center gap-2 font-display text-2xl font-bold">
                <VegBadge isVeg={product.isVeg} /> {product.name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <Rating value={product.rating} count={product.ratingCount} />
                <span className="flex items-center gap-1 font-mono text-xs text-muted">
                  <Clock size={12} /> {product.prepTimeMins} min
                </span>
                {product.kcal && (
                  <span className="flex items-center gap-1 font-mono text-xs text-muted">
                    <Flame size={12} /> {product.kcal} kcal
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-[46vh] overflow-y-auto p-5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-lg font-semibold">{formatMoney(product.price)}</span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {product.category}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">{product.longDescription ?? product.description}</p>
            <div className="mt-5">
              <CustomiseInfo product={product} />
            </div>
          </div>

          <Link
            to={`/menu/p/${product.slug}`}
            onClick={onClose}
            className="flex items-center justify-center gap-1 border-t border-border py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-primary hover:brightness-110 btn-focus"
          >
            Full details <ArrowUpRight size={14} />
          </Link>
        </div>
      )}
    </Modal>
  );
}
