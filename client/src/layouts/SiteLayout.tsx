import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { MobileNavSheet } from '@/components/layout/MobileNavSheet';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { FullPageLoader } from '@/components/ui/ByteLoader';
import { pageTransition } from '@/lib/motion';

export function SiteLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1 pb-20 lg:pb-0">
        <Suspense fallback={<FullPageLoader />}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
      <MobileTabBar />

      <SearchOverlay />
      <MobileNavSheet />
    </div>
  );
}
