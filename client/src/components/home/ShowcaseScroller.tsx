import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { SmartImage } from '@/components/ui/SmartImage';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';

const STAGES = [
  {
    title: 'The bun',
    body: 'Milk brioche baked daily, split and toasted on the flat-top in a little butter.',
    image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=1000&q=80&auto=format&fit=crop',
  },
  {
    title: 'The patty',
    body: 'Fresh chuck, smashed thin on a screaming griddle so the edges go lacy and crisp.',
    image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=1000&q=80&auto=format&fit=crop',
  },
  {
    title: 'The melt',
    body: 'Aged cheddar draped on straight away, lid on, a splash of water for a fast steam.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&q=80&auto=format&fit=crop',
  },
  {
    title: 'The close',
    body: 'House sauce, pickles, shaved onion. Wrapped, rested 60 seconds, then it’s yours.',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&q=80&auto=format&fit=crop',
  },
];

export function ShowcaseScroller() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(STAGES.length - 1, Math.floor(v * STAGES.length));
    setActive(idx);
  });

  if (reduced) {
    return (
      <section className="section container">
        <p className="eyebrow mb-6">
          <span className="h-1.5 w-1.5 bg-primary" /> How a Byte gets built
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {STAGES.map((s) => (
            <div key={s.title} className="card-byte overflow-hidden">
              <SmartImage src={s.image} alt={s.title} width={800} wrapperClassName="aspect-video" />
              <div className="p-5">
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: `${STAGES.length * 90}vh` }}>
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden">
        <div className="container grid w-full items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-5">
              <span className="h-1.5 w-1.5 animate-byte-flicker bg-primary" /> How a Byte gets built
            </p>
            <div className="space-y-1">
              {STAGES.map((stage, i) => (
                <button
                  key={stage.title}
                  onClick={() => {
                    const el = ref.current;
                    if (!el) return;
                    const start = el.offsetTop;
                    const seg = el.offsetHeight / STAGES.length;
                    window.scrollTo({ top: start + seg * i + seg / 2, behavior: 'smooth' });
                  }}
                  className="block w-full text-left"
                >
                  <span
                    className={cn(
                      'font-display text-3xl font-bold uppercase tracking-tight transition-colors md:text-5xl',
                      i === active ? 'text-fg' : 'text-border',
                    )}
                  >
                    {stage.title}
                  </span>
                </button>
              ))}
            </div>
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-sm text-muted"
            >
              {STAGES[active].body}
            </motion.p>
            <div className="mt-6 flex gap-1.5">
              {STAGES.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1 w-10 rounded-full transition-colors',
                    i <= active ? 'bg-primary' : 'bg-border',
                  )}
                />
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-border shadow-lift">
            {STAGES.map((stage, i) => (
              <motion.div
                key={stage.title}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.06 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <SmartImage src={stage.image} alt={stage.title} width={900} className="h-full w-full" />
              </motion.div>
            ))}
            <div className="absolute bottom-4 left-4 rounded-pill bg-bg/80 px-3 py-1.5 font-mono text-xs uppercase tracking-widest backdrop-blur">
              step {active + 1}/{STAGES.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
