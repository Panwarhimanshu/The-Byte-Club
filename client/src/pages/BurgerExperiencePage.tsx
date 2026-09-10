import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { ButtonLink } from '@/components/ui/Button';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ProductCard } from '@/components/menu/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { BurgerScene } from '@/components/experience/BurgerScene';
import { ExperienceFallback } from '@/components/experience/ExperienceFallback';
import { usePrefersReducedMotion, useIsDesktop } from '@/hooks/useMediaQuery';
import { useProducts, useSettings } from '@/hooks/queries';
import { track } from '@/lib/analytics';
import { storeSettings } from '@/data/brand';
import { restaurantJsonLd } from '@/lib/seo';

export default function BurgerExperiencePage() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();

  return (
    <>
      <SEO
        title="Bite into the future"
        path="/experience"
        description="A scroll-controlled look inside the Byte Burger — every layer, taken apart and put back together."
        jsonLd={restaurantJsonLd}
      />

      <ErrorBoundary fallback={<ExperienceFallback />}>
        {reduced ? <ExperienceFallback /> : <PinnedExperience isDesktop={isDesktop} />}
      </ErrorBoundary>

      <BurgerOutro />
    </>
  );
}

function PinnedExperience({ isDesktop }: { isDesktop: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  // light spring: smooths the scrub without noticeable lag — settles where you stop
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 34,
    mass: 0.28,
    restDelta: 0.0003,
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Interactive burger build"
      style={{ height: isDesktop ? '600vh' : '480vh' }}
      className="relative isolate"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <BurgerScene progress={progress} isDesktop={isDesktop} />

        {/* progress rail */}
        {isDesktop ? (
          <div className="absolute right-5 top-1/2 h-40 w-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-primary/15">
            <motion.div
              className="h-full w-full origin-top rounded-full bg-primary"
              style={{ scaleY: scrollYProgress }}
            />
          </div>
        ) : (
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-primary/15">
            <motion.div
              className="h-full w-full origin-left bg-primary"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function BurgerOutro() {
  const { data: burgers, isLoading } = useProducts({ category: 'burgers', sort: 'popular' });
  const { data: settings = storeSettings } = useSettings();

  return (
    <section className="relative border-t border-border bg-surface">
      <div className="container section">
        <div className="max-w-xl">
          <p className="eyebrow mb-3">
            <span className="h-1.5 w-1.5 bg-primary" /> Your move
          </p>
          <h2 className="font-display text-display-lg font-bold leading-[0.95]">
            Ready for <span className="text-primary">your byte?</span>
          </h2>
          <p className="mt-3 text-muted md:text-lg">
            The Byte Burger and its whole family. Come build one in person, or catch us on
            a delivery app.
          </p>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {burgers?.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <ButtonLink as="link" to="/menu" size="lg">
            See the full menu <ArrowRight size={17} />
          </ButtonLink>
          <ButtonLink as="link" to="/contact" size="lg" variant="outline">
            <MapPin size={15} /> Find us
          </ButtonLink>
          {settings.deliveryApps?.map((app) => (
            <a
              key={app.label}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('delivery_app_click', { app: app.label })}
              className="inline-flex h-12 items-center rounded-pill border border-border px-5 font-display text-sm font-semibold uppercase tracking-wide transition hover:border-primary hover:text-primary btn-focus"
            >
              {app.label}
            </a>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted">
          <Link to="/" className="hover:text-primary">
            ← Back to home
          </Link>
        </p>
      </div>
    </section>
  );
}
