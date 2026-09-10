import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { BurgerLayerDef, IngredientStory } from './burger.config';

/**
 * One burger ingredient, positioned in CSS-3D space and driven entirely by
 * scroll MotionValues:
 *   • `explodeAmt` (0–1)  — assembled ⇄ exploded
 *   • `progress` + `story` — lifts / glows this layer while its caption shows
 *
 * This is the unit to swap for a mesh when a real 3D model is wired in — the
 * config (position, story, colour) stays the same.
 */
export function BurgerLayer({
  def,
  explodeAmt,
  progress,
  story,
}: {
  def: BurgerLayerDef;
  explodeAmt: MotionValue<number>;
  progress: MotionValue<number>;
  story?: IngredientStory;
}) {
  const z = useTransform(explodeAmt, [0, 1], [def.assembledZ, def.explodedZ]);
  const emphasis = useTransform(
    progress,
    story ? [story.window[0], story.window[1], story.window[2], story.window[3]] : [0, 1],
    story ? [0, 1, 1, 0] : [0, 0],
  );
  const scale = useTransform(emphasis, [0, 1], [1, 1.08]);
  const ringOpacity = useTransform(emphasis, [0, 1], [0, 0.9]);
  const height = Math.round(def.width * 0.92);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ x: '-50%', y: '-50%', translateZ: z, width: def.width, height }}
    >
      <motion.div className="relative h-full w-full" style={{ scale }}>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-full"
          style={{
            opacity: ringOpacity,
            boxShadow: '0 0 0 3px rgb(var(--primary) / 0.55), 0 0 44px 6px rgb(var(--primary) / 0.28)',
          }}
        />
        <Shape def={def} height={height} />
      </motion.div>
    </motion.div>
  );
}

function edgeShadow(def: BurgerLayerDef) {
  return `0 ${def.thickness}px 0 0 ${def.edge}, 0 ${def.thickness + 6}px 34px -6px rgba(30, 25, 20, 0.4)`;
}

function Shape({ def, height }: { def: BurgerLayerDef; height: number }) {
  const base: React.CSSProperties = { width: '100%', height: '100%', boxShadow: edgeShadow(def) };

  switch (def.id) {
    case 'topBun':
      return (
        <div
          style={{
            ...base,
            background: `radial-gradient(60% 65% at 38% 28%, ${def.highlight}, ${def.color} 62%, ${def.edge})`,
            borderRadius: '50% 50% 46% 46% / 66% 66% 34% 34%',
          }}
        >
          {SESAME.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${s[0]}%`,
                top: `${s[1]}%`,
                width: 13,
                height: 8,
                background: '#F6E8C6',
                transform: `rotate(${s[2]}deg)`,
                boxShadow: '0 1px 0 rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>
      );

    case 'bottomBun':
      return (
        <div
          style={{
            ...base,
            background: `radial-gradient(70% 90% at 50% 18%, ${def.highlight}, ${def.color} 70%, ${def.edge})`,
            borderRadius: '46% 46% 50% 50% / 34% 34% 66% 66%',
          }}
        />
      );

    case 'patty':
      return (
        <div
          style={{
            ...base,
            background: `radial-gradient(65% 65% at 40% 32%, ${def.highlight}, ${def.color} 68%, ${def.edge})`,
            borderRadius: '48%',
          }}
        >
          {SPECKLES.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{ left: `${p[0]}%`, top: `${p[1]}%`, width: p[2], height: p[2], background: 'rgba(122,80,56,0.7)' }}
            />
          ))}
        </div>
      );

    case 'cheese':
      return (
        <div className="relative h-full w-full">
          <div
            style={{
              ...base,
              background: `linear-gradient(150deg, ${def.color}, ${def.edge})`,
              borderRadius: '26% 26% 38% 38%',
            }}
          />
          {[18, 50, 82].map((left, i) => (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${left}%`,
                top: '78%',
                width: 26,
                height: 34,
                background: def.color,
                borderRadius: '0 0 60% 60%',
                boxShadow: `0 6px 0 0 ${def.edge}`,
                transform: 'translateX(-50%)',
              }}
            />
          ))}
        </div>
      );

    case 'tomato':
      return (
        <div
          style={{
            ...base,
            background: `radial-gradient(60% 60% at 42% 34%, ${def.highlight}, ${def.color} 65%, ${def.edge})`,
            borderRadius: '50%',
          }}
        >
          <span className="absolute inset-[16%] rounded-full" style={{ boxShadow: 'inset 0 0 0 6px rgba(255,255,255,0.14)' }} />
        </div>
      );

    case 'lettuce':
      return (
        <svg
          viewBox="0 0 240 220"
          style={{ width: '100%', height: '100%', filter: `drop-shadow(0 ${def.thickness}px 0 ${def.edge}) drop-shadow(0 ${def.thickness + 8}px 22px rgba(30,25,20,0.35))` }}
        >
          <path
            fill={def.color}
            d="M120 8c14 0 20 14 34 14s20-12 34-6 6 24 16 32 24 6 26 20-14 18-14 30 12 20 6 32-22 8-32 16-8 22-22 26-22-8-36-8-22 12-36 8-14-20-26-26-24 2-32-10 6-22 4-34-14-18-10-32 20-14 26-26 4-24 16-30 26 2 36 2 12-14 24-14z"
          />
          <path fill="rgba(255,255,255,0.14)" d="M120 40c40 0 66 26 66 62s-30 60-66 60-66-26-66-60 26-62 66-62z" />
        </svg>
      );

    case 'sauce':
      return (
        <svg
          viewBox="0 0 240 150"
          style={{ width: '100%', height: `${(height * 150) / 220}px`, filter: `drop-shadow(0 ${def.thickness}px 0 ${def.edge}) drop-shadow(0 ${def.thickness + 6}px 18px rgba(30,25,20,0.3))` }}
        >
          <path
            fill={def.color}
            d="M18 40C18 20 46 12 78 14s52 10 82 6 52-10 58 12-6 34-6 50-6 30-26 34-30-14-46-14-22 20-40 18-16-22-30-26-22 14-34 6-2-26-8-40-2-30-4-46z"
          />
          <path fill={def.highlight} opacity="0.6" d="M40 30c30-8 60 0 96-4s54-6 62 6-10 20-30 20-30-8-50-6-38 8-56 6-34-2-40-10 6-6 18-8z" />
        </svg>
      );

    case 'onions':
      return (
        <svg
          viewBox="0 0 300 300"
          style={{ width: '100%', height: '100%', filter: `drop-shadow(0 ${def.thickness}px 0 ${def.edge}) drop-shadow(0 ${def.thickness + 6}px 16px rgba(30,25,20,0.3))` }}
        >
          {/* broken onion rings */}
          <circle cx="150" cy="150" r="118" fill="none" stroke={def.color} strokeWidth="16" strokeLinecap="round" strokeDasharray="70 34" />
          <circle cx="150" cy="150" r="88" fill="none" stroke={def.edge} strokeWidth="13" strokeLinecap="round" strokeDasharray="52 40" transform="rotate(24 150 150)" />
          <circle cx="150" cy="150" r="58" fill="none" stroke={def.color} strokeWidth="12" strokeLinecap="round" strokeDasharray="40 30" transform="rotate(-18 150 150)" />
          {/* scattered bits */}
          {ONIONS.map((o, i) => (
            <rect
              key={i}
              x={o[0] * 3}
              y={o[1] * 3}
              width={o[2]}
              height={8}
              rx={3}
              fill={i % 2 ? def.color : def.edge}
              transform={`rotate(${o[3]} ${o[0] * 3} ${o[1] * 3})`}
            />
          ))}
        </svg>
      );

    default:
      return <div style={{ ...base, background: def.color, borderRadius: '50%' }} />;
  }
}

const SESAME: [number, number, number][] = [
  [30, 30, -18], [52, 20, 12], [68, 34, -8], [42, 44, 24], [58, 52, -30], [24, 48, 8],
];
const SPECKLES: [number, number, number][] = [
  [28, 34, 5], [46, 26, 4], [64, 40, 6], [38, 56, 4], [58, 62, 5], [72, 30, 3], [24, 62, 4],
];
const ONIONS: [number, number, number, number][] = [
  [12, 40, 26, 18], [30, 22, 20, -30], [48, 46, 30, 8], [66, 26, 22, 40], [78, 48, 18, -12],
  [22, 62, 24, 24], [52, 66, 20, -20], [40, 34, 16, 60], [70, 62, 22, 14], [16, 26, 18, -44],
];
