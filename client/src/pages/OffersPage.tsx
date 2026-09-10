import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Badge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ButtonLink } from '@/components/ui/Button';
import { useOffers } from '@/hooks/queries';
import { useUIStore } from '@/store/uiStore';
import { fadeUp, revealViewport, stagger } from '@/lib/motion';
import { formatMoney } from '@/lib/format';
import type { Offer } from '@/types';

export default function OffersPage() {
  const { data: offers, isLoading } = useOffers();

  return (
    <>
      <SEO
        title="Offers & deals"
        path="/offers"
        description="Live offers at The Byte Club — BOGO burgers, student rates, weekend combo drops and first-order discounts."
      />
      <div className="border-b border-border bg-surface">
        <div className="container py-12 md:py-16">
          <p className="eyebrow mb-3">
            <Sparkles size={12} className="text-primary" /> Deals
          </p>
          <h1 className="font-display text-display-lg font-bold">
            Save a few <span className="text-primary">bytes</span>
          </h1>
          <p className="mt-2 max-w-lg text-muted md:text-lg">
            Show the code at the counter or drop it in the app. One per order unless it says otherwise.
          </p>
        </div>
      </div>

      <section className="container section">
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : offers && offers.length > 0 ? (
          <motion.div
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </motion.div>
        ) : (
          <EmptyState title="No live offers" hint="Check back — drops land most Fridays." command="byte offers --active" />
        )}

        <div className="mt-14 rounded-3xl border border-border bg-card p-8 text-center">
          <h2 className="font-display text-2xl font-bold">Hungry now?</h2>
          <p className="mt-1 text-muted">Go look at the menu. Then come find us.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <ButtonLink as="link" to="/menu">See the menu</ButtonLink>
            <ButtonLink as="link" to="/contact" variant="outline">Find us</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const [copied, setCopied] = useState(false);
  const toast = useUIStore((s) => s.toast);

  const copy = async () => {
    if (!offer.code) return;
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      toast({ variant: 'success', title: 'Code copied', description: offer.code });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ variant: 'error', title: 'Couldn’t copy', description: `Use code ${offer.code}` });
    }
  };

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage
          src={offer.image}
          alt={offer.title}
          width={640}
          className="transition-transform duration-500 group-hover:scale-105"
          wrapperClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <Badge tone={offer.accent} className="absolute left-3 top-3">
          {offer.badge}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-tight">{offer.title}</h3>
        <p className="mt-1.5 flex-1 text-sm text-muted">{offer.description}</p>

        {offer.minOrder ? (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-muted">
            Min order {formatMoney(offer.minOrder)}
          </p>
        ) : null}

        {offer.code ? (
          <button
            onClick={copy}
            className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-primary/60 px-4 py-2.5 font-mono text-sm uppercase tracking-widest text-primary transition hover:bg-primary/10 btn-focus"
          >
            {offer.code}
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        ) : (
          <p className="mt-4 rounded-xl bg-bg px-4 py-2.5 text-center font-mono text-xs uppercase tracking-widest text-muted">
            Ask at the counter
          </p>
        )}
      </div>
    </motion.article>
  );
}
