import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { revealViewport } from '@/lib/motion';

export function CtaBanner() {
  return (
    <section className="container pb-20 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary px-8 py-14 text-center text-primary-fg md:py-20"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid-byte bg-grid-16 opacity-10" />
        <p className="relative font-mono text-xs uppercase tracking-[0.3em]">Crave mode: on</p>
        <h2 className="relative mx-auto mt-4 max-w-2xl font-display text-display-lg font-bold leading-[0.95]">
          Your hunger just got a software update.
        </h2>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink as="link" to="/menu" size="lg" variant="dark">
            See the menu <ArrowRight size={17} />
          </ButtonLink>
          <ButtonLink as="link" to="/contact" size="lg" variant="outline" className="border-primary-fg/30 text-primary-fg">
            Find us
          </ButtonLink>
        </div>
      </motion.div>
    </section>
  );
}
