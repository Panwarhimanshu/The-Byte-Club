import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X, TriangleAlert } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/cn';

const icons = {
  default: Info,
  success: Check,
  error: TriangleAlert,
};

export function Toaster() {
  const { toasts, dismissToast } = useUIStore();

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.variant];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-surface p-3.5 pr-10 shadow-lift',
                t.variant === 'success' && 'border-veg/40',
                t.variant === 'error' && 'border-accent/40',
                t.variant === 'default' && 'border-border',
              )}
              role="status"
            >
              <span
                className={cn(
                  'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full',
                  t.variant === 'success' && 'bg-veg/15 text-veg',
                  t.variant === 'error' && 'bg-accent/15 text-accent',
                  t.variant === 'default' && 'bg-primary/15 text-primary',
                )}
              >
                <Icon size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-muted">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss"
                className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full text-muted hover:text-fg btn-focus"
              >
                <X size={13} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
