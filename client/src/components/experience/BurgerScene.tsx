import { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { BurgerLayer } from './BurgerLayer';
import { IngredientCallout } from './IngredientCallout';
import { LAYERS, STORIES } from './burger.config';

const CRUMBS = Array.from({ length: 16 }, (_, i) => ({
  x: (((i * 53) % 100) - 50) * 1.6,
  delay: (i % 7) / 7,
  size: 4 + (i % 4) * 3,
  drift: (i % 2 ? 1 : -1) * (40 + (i % 5) * 30),
  rot: (i % 3) * 120,
}));

/**
 * The cinematic burger stage. Everything here is driven by one MotionValue
 * (`progress`, 0 → 1). No React state changes on scroll.
 */
export function BurgerScene({
  progress,
  isDesktop,
}: {
  progress: MotionValue<number>;
  isDesktop: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  // pointer parallax (desktop only)
  const pxRaw = useMotionValue(0);
  const pyRaw = useMotionValue(0);
  const px = useSpring(pxRaw, { stiffness: 90, damping: 18 });
  const py = useSpring(pyRaw, { stiffness: 90, damping: 18 });
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDesktop) return;
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    pxRaw.set((e.clientX - r.left) / r.width - 0.5);
    pyRaw.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetPointer = () => {
    pxRaw.set(0);
    pyRaw.set(0);
  };

  /* ── camera / turntable ─────────────────────────── */
  const explodeAmt = useTransform(progress, [0.1, 0.3, 0.7, 0.84], [0, 1, 1, 0]);
  const spinBase = useTransform(
    progress,
    [0, 0.1, 0.3, 0.7, 0.84, 0.93, 1],
    [0, 16, 40, 400, 392, 380, 366],
  );
  const tiltBase = useTransform(progress, [0, 0.3, 0.5, 0.7, 0.88, 1], [55, 52, 44, 46, 37, 35]);
  const k = isDesktop ? 1 : 0.66; // burger fits a phone without a redesign of the layers
  const sceneScale = useTransform(
    progress,
    [0, 0.08, 0.3, 0.7, 0.84, 0.9, 1],
    [0.98 * k, 1.18 * k, 1.12 * k, 1.18 * k, 1.48 * k, 1.92 * k, isDesktop ? 0.72 : 0.6],
  );
  const sceneYvh = useTransform(progress, [0, 0.3, 0.88], [0, -2, -5]);
  const sceneXvw = useTransform(progress, [0.92, 1], [0, isDesktop ? -26 : 0]);

  const spin = useTransform([spinBase, px], ([s, p]) => (s as number) + (p as number) * 10);
  const rotX = useTransform([tiltBase, py], ([t, p]) => (t as number) + (p as number) * 6);
  const rotY = useTransform(px, (p) => p * 8);

  const turntable = useMotionTemplate`translate(-50%, -50%) translateX(${sceneXvw}vw) translateY(${sceneYvh}vh) scale(${sceneScale}) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${spin}deg)`;

  const storyByTarget = new Map(STORIES.map((s) => [s.target, s]));

  /* ── overlays ───────────────────────────────────── */
  const introOpacity = useTransform(progress, [0, 0.05, 0.1], [1, 1, 0]);
  const introY = useTransform(progress, [0, 0.1], [0, -40]);
  const hintOpacity = useTransform(progress, [0, 0.04], [1, 0]);

  const builtOpacity = useTransform(progress, [0.7, 0.755, 0.83, 0.865], [0, 1, 1, 0]);
  const builtY = useTransform(progress, [0.7, 0.755], [30, 0]);

  const readyOpacity = useTransform(progress, [0.915, 0.96, 1], [0, 1, 1]);
  const readyX = useTransform(progress, [0.915, 0.965], [80, 0]);

  const vignette = useTransform(progress, [0.8, 0.9, 0.97, 1], [0, 0.82, 0.5, 0.12]);
  const warmGlow = useTransform(progress, [0.68, 0.87, 1], [0, 0.92, 0.4]);
  const mood = useTransform(progress, [0.78, 0.9, 0.97, 1], [0, 0.64, 0.4, 0.1]);
  const crumbsP = useTransform(progress, [0.8, 0.93, 1], [0, 1, 0.6]);
  const gridOpacity = useTransform(progress, [0, 0.7, 0.9], [0.5, 0.5, 0.12]);
  const glowOpacity = useTransform(progress, [0, 0.5, 1], [0.75, 1, 0.55]);
  const watermarkRotate = useTransform(spinBase, (s) => s * 0.05);

  return (
    <div
      ref={stageRef}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
      className="absolute inset-0 overflow-hidden"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-bg" />
      <motion.div className="absolute inset-0 bg-radial-fade" style={{ opacity: glowOpacity }} />
      <motion.div
        className="absolute inset-0 bg-grid-byte bg-grid-32 [mask-image:radial-gradient(70%_60%_at_50%_45%,black,transparent)]"
        style={{ opacity: gridOpacity }}
      />
      <motion.p
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[38vw] font-bold leading-none text-primary/[0.05]"
        style={{ rotate: watermarkRotate }}
      >
        BYTE
      </motion.p>

      {/* moody wash for the close-up — pulls the room down around the burger */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: mood,
          background: 'radial-gradient(58% 55% at 50% 48%, transparent 30%, rgb(10 14 38 / 0.85))',
        }}
      />
      {/* warm key light for the reassembly / close-up */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: warmGlow,
          background:
            'radial-gradient(34% 32% at 47% 42%, rgb(255 236 200 / 0.5), transparent 72%), radial-gradient(52% 48% at 52% 52%, rgb(var(--primary) / 0.22), transparent 74%)',
        }}
      />

      {/* the burger */}
      <div className="absolute inset-0" style={{ perspective: isDesktop ? 1600 : 1100 }}>
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ transformStyle: 'preserve-3d', transform: turntable, willChange: 'transform' }}
        >
          {LAYERS.map((def) => (
            <BurgerLayer
              key={def.id}
              def={def}
              explodeAmt={explodeAmt}
              progress={progress}
              story={storyByTarget.get(def.id)}
            />
          ))}
        </motion.div>
      </div>

      {/* crumbs */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: crumbsP }}>
        {CRUMBS.map((c, i) => (
          <Crumb key={i} c={c} progress={progress} />
        ))}
      </motion.div>

      {/* vignette */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: vignette,
          background: 'radial-gradient(closest-side, transparent 52%, rgb(12 16 40 / 0.72))',
        }}
      />

      {/* ── text overlays ── */}
      <motion.div
        style={{ opacity: introOpacity, y: introY }}
        className="pointer-events-none absolute inset-x-0 top-[14vh] px-6 text-center"
      >
        <p className="eyebrow justify-center">The Byte Club</p>
        <h2 className="mt-3 font-display text-display-xl font-bold text-primary">Bite into the future.</h2>
      </motion.div>

      <motion.p
        style={{ opacity: hintOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-[7vh] text-center font-mono text-xs uppercase tracking-[0.3em] text-muted"
      >
        Scroll to build ↓
      </motion.p>

      {STORIES.map((story) => (
        <IngredientCallout key={story.target} story={story} progress={progress} isDesktop={isDesktop} />
      ))}

      <motion.div
        style={{ opacity: builtOpacity, y: builtY }}
        className="pointer-events-none absolute inset-x-0 top-[11vh] px-6 text-center"
      >
        <h2 className="font-display text-display-lg font-bold leading-[0.95] text-fg drop-shadow-[0_2px_16px_rgba(255,255,255,0.55)]">
          Built different.
          <br />
          <span className="text-primary">Made to hit different.</span>
        </h2>
      </motion.div>

      <motion.div
        style={{ opacity: readyOpacity, x: readyX }}
        className={
          isDesktop
            ? 'pointer-events-none absolute right-[6vw] top-1/2 -translate-y-1/2 text-right'
            : 'pointer-events-none absolute inset-x-6 top-[12vh] text-center'
        }
      >
        <p className="eyebrow md:justify-end">Your move</p>
        <h2 className="mt-2 font-display text-display-lg font-bold leading-[0.95] text-primary">
          Ready for
          <br />
          your byte?
        </h2>
      </motion.div>
    </div>
  );
}

function Crumb({
  c,
  progress,
}: {
  c: (typeof CRUMBS)[number];
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0.8, 1], [40, -c.drift]);
  const x = useTransform(progress, [0.8, 1], [0, c.x * 0.4]);
  const rotate = useTransform(progress, [0.8, 1], [0, c.rot + 90]);
  const opacity = useTransform(progress, [0.8, 0.84 + c.delay * 0.06, 0.96, 1], [0, 0.9, 0.7, 0]);
  return (
    <motion.span
      className="absolute left-1/2 top-1/2 rounded-[2px] bg-[#C98B45]"
      style={{ width: c.size, height: c.size, x, y, rotate, opacity }}
    />
  );
}
