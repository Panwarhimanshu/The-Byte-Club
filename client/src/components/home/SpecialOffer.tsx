import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/Badge';
import { useOffers } from '@/hooks/queries';
import { revealViewport } from '@/lib/motion';

export function SpecialOffer() {
  const { data: offers } = useOffers();
  const offer = offers?.[0];
  if (!offer) return null;

  return (
    <section className="section container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-border"
      >
        <SmartImage
          src={offer.image}
          alt=""
          width={1200}
          wrapperClassName="absolute inset-0"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/30" />

        <div className="relative grid gap-6 p-8 md:p-14 lg:w-3/5">
          <Badge tone="primary" className="w-fit">{offer.badge}</Badge>
          <h2 className="font-display text-display-lg font-bold leading-[0.95]">{offer.title}</h2>
          <p className="max-w-md text-muted md:text-lg">{offer.description}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/offers"
              className="inline-flex h-12 items-center gap-2 rounded-pill bg-primary px-6 font-display text-sm font-semibold uppercase tracking-wide text-primary-fg transition hover:shadow-glow btn-focus"
            >
              See all offers <ArrowRight size={16} />
            </Link>
            {offer.code && (
              <span className="rounded-pill border border-dashed border-primary/60 px-4 py-2 font-mono text-sm uppercase tracking-widest text-primary">
                {offer.code}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
