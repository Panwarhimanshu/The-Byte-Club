import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { ArrowRight, X } from 'lucide-react';
import { primaryNav } from '@/data/brand';
import { useUIStore } from '@/store/uiStore';
import { useScrollLock } from '@/hooks/useScrollLock';
import { Logo } from '@/components/ui/Logo';
import { ButtonLink } from '@/components/ui/Button';

export function MobileNavSheet() {
  const { mobileNavOpen, closeMobileNav } = useUIStore();
  useScrollLock(mobileNavOpen);

  return createPortal(
    <AnimatePresence>
      {mobileNavOpen && (
        <motion.div
          className="fixed inset-0 z-[90] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-bg" />
          <motion.div
            className="relative flex h-full flex-col"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
          >
            <div className="container flex h-16 items-center justify-between">
              <Logo />
              <button
                onClick={closeMobileNav}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-pill border border-border btn-focus"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="container flex flex-1 flex-col justify-center gap-2" aria-label="Mobile">
              {primaryNav.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    to={item.to}
                    onClick={closeMobileNav}
                    className="flex items-center justify-between border-b border-border py-5 font-display text-4xl font-bold uppercase tracking-tight"
                  >
                    {item.label}
                    <ArrowRight className="text-primary" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="container grid gap-3 pb-10">
              <ButtonLink as="link" to="/menu" size="lg" fullWidth onClick={closeMobileNav}>
                See the menu
              </ButtonLink>
              <ButtonLink
                as="link"
                to="/contact"
                variant="outline"
                size="md"
                fullWidth
                onClick={closeMobileNav}
              >
                Find us
              </ButtonLink>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
