import { motion } from 'framer-motion';
import { fadeUp, revealViewport, stagger } from '@/lib/motion';
import { cn } from '@/lib/cn';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        action && 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <motion.span variants={fadeUp} className="eyebrow mb-3">
            <span className="h-1.5 w-1.5 bg-primary" />
            {eyebrow}
          </motion.span>
        )}
        <motion.h2
          variants={fadeUp}
          className="font-display text-display-lg font-bold leading-[0.95]"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p variants={fadeUp} className="mt-3 text-muted md:text-lg">
            {description}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div variants={fadeUp} className="shrink-0">
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
