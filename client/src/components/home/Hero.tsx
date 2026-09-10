import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Timer, Star, Flame, Play } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { easeByte } from '@/lib/motion';

const HEADLINE = ['GOOD FOOD.', 'GOOD VIBES.', 'NO BUFFERING.'];

const floaters = [
  { icon: Timer, label: '8 min', sub: 'avg cook', className: 'left-[-6%] top-[16%]', delay: 0.2 },
  { icon: Star, label: '4.8★', sub: '12k ratings', className: 'right-[-4%] top-[8%]', delay: 0.35 },
  { icon: Flame, label: 'Daily', sub: 'buns baked fresh', className: 'right-[2%] bottom-[10%]', delay: 0.5 },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-0 bg-grid-byte bg-grid-32 opacity-[0.15] [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)]" />

      <div className="container relative grid items-center gap-10 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-[1.05fr_1fr]">
        <motion.div style={{ y }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-5"
          >
            <span className="h-1.5 w-1.5 animate-byte-flicker bg-primary" />
            Now serving · Bengaluru
          </motion.span>

          <h1 className="font-display text-display-2xl font-bold text-primary">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: easeByte }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 max-w-md text-lg text-muted"
          >
            Burgers, pizza, wraps and shakes engineered for cravings. Cooked to order
            in one loud little kitchen in HSR Layout, Bengaluru.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <ButtonLink as="link" to="/menu" size="lg">
              See the menu <ArrowRight size={17} />
            </ButtonLink>
            <ButtonLink as="link" to="/contact" size="lg" variant="outline">
              Find us
            </ButtonLink>
            <Link
              to="/experience"
              className="group inline-flex items-center gap-2 px-2 py-2 font-display text-sm font-semibold uppercase tracking-wide text-primary btn-focus"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-primary transition group-hover:bg-primary group-hover:text-primary-fg">
                <Play size={13} className="translate-x-px fill-current" />
              </span>
              Bite into the future
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-muted"
          >
            <span>Dine-in</span>
            <span className="h-3 w-px bg-border" />
            <span>Pickup</span>
            <span className="h-3 w-px bg-border" />
            <span>On Swiggy &amp; Zomato</span>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: imgY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: easeByte }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border shadow-lift">
            <SmartImage
              src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=900&q=80&auto=format&fit=crop"
              alt="A stacked Byte Club burger with melted cheese"
              eager
              width={900}
              className="h-full w-full"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>

          {floaters.map((f) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: f.delay + 0.6, type: 'spring', stiffness: 200, damping: 16 }}
              className={`absolute ${f.className} hidden sm:block`}
            >
              <motion.div
                animate={reduced ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: f.delay }}
                className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface/90 px-3.5 py-2.5 shadow-lift backdrop-blur"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-fg">
                  <f.icon size={15} />
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-sm font-bold">{f.label}</span>
                  <span className="block font-mono text-[10px] uppercase tracking-wide text-muted">
                    {f.sub}
                  </span>
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
