import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { overlay, scaleIn } from '@/lib/motion';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cn } from '@/lib/cn';

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-end sm:place-items-center p-0 sm:p-6"
          variants={overlay}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <div
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            variants={scaleIn}
            className={cn(
              'relative z-10 w-full max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border bg-surface shadow-lift sm:max-w-lg',
              className,
            )}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-pill border border-border bg-bg/60 text-muted transition hover:text-fg btn-focus"
            >
              <X size={16} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
