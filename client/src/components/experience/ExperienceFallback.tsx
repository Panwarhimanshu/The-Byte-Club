import { useMotionValue } from 'framer-motion';
import { BurgerLayer } from './BurgerLayer';
import { LAYERS, STORIES } from './burger.config';

/**
 * Shown when the visitor prefers reduced motion, or if the scene errors.
 * A calm, static version — the burger held at a nice angle, the ingredient
 * story told as a plain list. No scroll binding, no pinning.
 */
export function ExperienceFallback() {
  const zero = useMotionValue(0);

  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-4">The Byte Club</p>
          <h1 className="font-display text-display-lg font-bold text-primary">Bite into the future.</h1>
          <p className="mt-4 max-w-md text-muted">
            Eight layers, one seasoning philosophy. Here’s what goes into the Byte Burger.
          </p>
          <ul className="mt-8 space-y-5">
            {STORIES.map((s) => (
              <li key={s.target}>
                <p className="eyebrow">{s.label}</p>
                <p className="mt-1 font-display text-xl font-bold text-fg">{s.line}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto h-[420px] w-full max-w-md" style={{ perspective: 1400 }}>
          <div
            className="absolute left-1/2 top-1/2"
            style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%,-50%) scale(0.8) rotateX(58deg) rotateZ(18deg)' }}
          >
            {LAYERS.map((def) => (
              <BurgerLayer key={def.id} def={def} explodeAmt={zero} progress={zero} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
