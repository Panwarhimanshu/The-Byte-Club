import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Eye, Flame } from 'lucide-react';
import type { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { VegBadge } from '@/components/ui/VegBadge';
import { Rating } from '@/components/ui/Rating';
import { SmartImage } from '@/components/ui/SmartImage';
import { formatMoney } from '@/lib/format';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';

export function ProductCard({
  product,
  onQuickView,
  className,
}: {
  product: Product;
  onQuickView?: (p: Product) => void;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const transform = useMotionTemplate`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transform: reduced ? undefined : transform }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-lift',
        !product.isAvailable && 'opacity-70',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/menu/p/${product.slug}`} aria-label={product.name}>
          <SmartImage
            src={product.image}
            alt={product.name}
            width={640}
            className="scale-100 transition-transform duration-500 ease-byte group-hover:scale-105"
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isBestseller && <Badge tone="primary">★ Bestseller</Badge>}
          {product.spiceLevel === 3 && (
            <Badge tone="accent">
              <Flame size={10} /> Hot
            </Badge>
          )}
          {!product.isAvailable && <Badge tone="neutral">Off the board</Badge>}
        </div>

        <span className="absolute right-3 top-3 rounded-md bg-bg/80 p-1 backdrop-blur">
          <VegBadge isVeg={product.isVeg} />
        </span>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            aria-label={`Quick look at ${product.name}`}
            className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full border border-border bg-bg/80 text-fg opacity-0 backdrop-blur transition-all duration-300 hover:text-primary group-hover:translate-y-0 group-hover:opacity-100 btn-focus"
          >
            <Eye size={15} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-bold leading-tight">
            <Link to={`/menu/p/${product.slug}`} className="btn-focus hover:text-primary">
              {product.name}
            </Link>
          </h3>
          <span className="shrink-0 font-mono text-sm font-semibold">{formatMoney(product.price)}</span>
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <Rating value={product.rating} count={product.ratingCount} />
          <span className="font-mono text-[11px] text-muted">{product.prepTimeMins} min</span>
        </div>

        <Link
          to={`/menu/p/${product.slug}`}
          className="mt-4 flex h-11 items-center justify-center gap-2 rounded-pill border border-border font-display text-sm font-semibold uppercase tracking-wide transition-all duration-200 ease-byte hover:border-primary hover:text-primary btn-focus"
        >
          Take a look <ArrowUpRight size={15} />
        </Link>
      </div>
    </motion.article>
  );
}
