import { motion } from 'framer-motion';
import type { Category } from '@/types';
import { cn } from '@/lib/cn';

export function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: string;
  onChange: (slug: string) => void;
}) {
  const all = [{ id: 'all', name: 'All', slug: 'all' }, ...categories];

  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1 md:mx-0 md:px-0">
      {all.map((cat) => {
        const isActive = active === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.slug)}
            aria-pressed={isActive}
            className={cn(
              'relative shrink-0 rounded-pill border px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide transition-colors btn-focus',
              isActive ? 'border-primary text-primary-fg' : 'border-border text-fg/80 hover:text-fg',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 -z-10 rounded-pill bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
