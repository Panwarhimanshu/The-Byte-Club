import { motion, useTransform, type MotionValue } from 'framer-motion';
import { LAYERS, type IngredientStory } from './burger.config';
import { cn } from '@/lib/cn';

/** Screen-Y (%) roughly matching where the target layer floats when exploded. */
function targetTop(target: IngredientStory['target']) {
  const z = LAYERS.find((l) => l.id === target)?.explodedZ ?? 0;
  return Math.min(76, Math.max(20, 47 - z * 0.062));
}

export function IngredientCallout({
  story,
  progress,
  isDesktop,
}: {
  story: IngredientStory;
  progress: MotionValue<number>;
  isDesktop: boolean;
}) {
  const [is, ie, os, oe] = story.window;
  const opacity = useTransform(progress, [is, ie, os, oe], [0, 1, 1, 0]);
  const shift = useTransform(progress, [is, ie, os, oe], [26, 0, 0, -18]);
  const shiftNeg = useTransform(shift, (v) => -v);
  const lineScale = useTransform(progress, [is, (is + ie) / 2, ie], [0, 0, 1]);

  if (!isDesktop) {
    return (
      <motion.div
        style={{ opacity, y: shift }}
        className="pointer-events-none absolute inset-x-4 bottom-[14vh] mx-auto max-w-sm text-center"
      >
        <p className="eyebrow justify-center !text-primary">— {story.label} —</p>
        <p className="mt-2 font-display text-2xl font-bold leading-tight text-fg">{story.line}</p>
      </motion.div>
    );
  }

  const side = story.side;
  return (
    <motion.div
      style={{ opacity, top: `${targetTop(story.target)}%` }}
      className={cn(
        'pointer-events-none absolute z-10 flex w-[min(34vw,420px)] items-center gap-3',
        side === 'left' ? 'left-[3vw] flex-row' : 'right-[3vw] flex-row-reverse',
      )}
    >
      <motion.div style={{ x: side === 'left' ? shift : shiftNeg }} className={cn('shrink-0', side === 'left' ? 'text-left' : 'text-right')}>
        <p className={cn('eyebrow !text-primary', side === 'right' && 'justify-end')}>{story.label}</p>
        <p className="mt-1.5 font-display text-[1.7rem] font-bold leading-[1.05] text-fg">{story.line}</p>
      </motion.div>

      {/* connector */}
      <div className={cn('relative h-px flex-1', side === 'left' ? 'origin-left' : 'origin-right')}>
        <motion.div
          style={{ scaleX: lineScale }}
          className={cn('absolute inset-0 h-[2px] bg-primary/70', side === 'left' ? 'origin-left' : 'origin-right')}
        />
        <span
          className={cn(
            'absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-primary',
            side === 'left' ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2',
          )}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/50" />
        </span>
      </div>
    </motion.div>
  );
}
