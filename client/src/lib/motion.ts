import type { Variants } from 'framer-motion';

export const easeByte = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeByte } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: easeByte } },
};

export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: easeByte } },
};

export const drawerRight: Variants = {
  hidden: { x: '100%' },
  show: { x: 0, transition: { type: 'spring', stiffness: 320, damping: 34 } },
  exit: { x: '100%', transition: { duration: 0.25, ease: easeByte } },
};

export const overlay: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeByte } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

/** viewport prop used across scroll-reveal sections */
export const revealViewport = { once: true, margin: '-80px' } as const;
