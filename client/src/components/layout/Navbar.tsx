import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Menu, Search } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { primaryNav, microcopy } from '@/data/brand';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/cn';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openSearch, openMobileNav } = useUIStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-border bg-bg/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4 md:h-20">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {primaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-pill px-3.5 py-2 font-display text-sm font-semibold uppercase tracking-wide transition-colors btn-focus',
                    isActive ? 'text-primary' : 'text-fg/80 hover:text-fg',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-primary"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={openSearch}
            aria-label="Search the menu"
            className="grid h-10 w-10 place-items-center rounded-pill text-fg/80 transition hover:bg-card hover:text-fg btn-focus"
          >
            <Search size={18} />
          </button>

          <ButtonLink as="link" to="/contact" size="sm" className="hidden sm:inline-flex">
            <MapPin size={14} /> {microcopy.findUs}
          </ButtonLink>

          <button
            onClick={openMobileNav}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-pill text-fg/80 transition hover:bg-card lg:hidden btn-focus"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
