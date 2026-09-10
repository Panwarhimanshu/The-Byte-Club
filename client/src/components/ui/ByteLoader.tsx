import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { microcopy } from '@/data/brand';
import { cn } from '@/lib/cn';

/**
 * Signature "byte" loader — a 5×5 pixel grid compiles into the B mark,
 * with a scanline sweeping through it. Used for route + data loading.
 */

// 1 = lit pixel forming a blocky "B"
const MASK = [
  [1, 1, 1, 1, 0],
  [1, 0, 0, 1, 0],
  [1, 1, 1, 0, 0],
  [1, 0, 0, 1, 0],
  [1, 1, 1, 1, 0],
];

export function ByteLoader({
  label = microcopy.loading,
  className,
  compact = false,
}: {
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const cell = compact ? 10 : 16;
  const gap = compact ? 2 : 3;

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4', className)}
      role="status"
      aria-live="polite"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-card"
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(5, ${cell}px)`,
            gap,
          }}
        >
          {MASK.flat().map((lit, i) => (
            <motion.span
              key={i}
              initial={reduced ? { opacity: lit ? 1 : 0.12 } : { opacity: 0, scale: 0.3 }}
              animate={
                reduced
                  ? { opacity: lit ? 1 : 0.12 }
                  : {
                      opacity: lit ? [0, 1, 0.85, 1] : [0, 0.15, 0.05, 0.12],
                      scale: 1,
                    }
              }
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 1.1,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: (i % 5) * 0.06 + Math.floor(i / 5) * 0.05,
                    }
              }
              style={{ width: cell, height: cell }}
              className={cn('rounded-[3px]', lit ? 'bg-primary' : 'bg-border/70')}
            />
          ))}
        </div>
        {!reduced && (
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-primary/25 to-transparent" />
        )}
      </div>
      {label && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {label}
          <span className="ml-0.5 inline-block animate-blink">_</span>
        </p>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <ByteLoader />
    </div>
  );
}
