import { NavLink } from 'react-router-dom';
import { Home, UtensilsCrossed, Tag, MapPin } from 'lucide-react';
import { cn } from '@/lib/cn';

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/offers', label: 'Offers', icon: Tag },
  { to: '/contact', label: 'Find us', icon: MapPin },
];

/** Bottom navigation — mobile only. One-thumb reach for the core pages. */
export function MobileTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Mobile navigation"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wide transition-colors btn-focus',
                isActive ? 'text-primary' : 'text-muted',
              )
            }
          >
            <t.icon size={19} />
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
