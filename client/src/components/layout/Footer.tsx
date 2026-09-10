import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { categories } from '@/data/categories';
import { storeSettings, brand } from '@/data/brand';
import { useUIStore } from '@/store/uiStore';

const columns = [
  {
    heading: 'Menu',
    links: categories.slice(0, 6).map((c) => ({ label: c.name, to: `/menu/${c.slug}` })),
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Offers', to: '/offers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/legal/privacy' },
      { label: 'Terms of Service', to: '/legal/terms' },
      { label: 'Refund Policy', to: '/legal/refunds' },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const toast = useUIStore((s) => s.toast);

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 font-display text-lg font-semibold leading-tight">
              {brand.tagline}
            </p>
            <p className="mt-3 text-sm text-muted">{storeSettings.address}</p>
            <div className="mt-4 space-y-1 font-mono text-xs text-muted">
              {storeSettings.hours.map((h) => (
                <p key={h.day}>
                  <span className="text-fg">{h.day}</span> — {h.open}–{h.close}
                </p>
              ))}
            </div>
            <form
              className="mt-6 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes('@')) {
                  toast({ variant: 'error', title: 'Enter a valid email' });
                  return;
                }
                toast({ variant: 'success', title: 'You’re on the list', description: 'Offers, drops and nonsense — occasionally.' });
                setEmail('');
              }}
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@inbox.com"
                aria-label="Email for newsletter"
                className="h-11"
              />
              <Button type="submit" size="md" aria-label="Subscribe">
                <ArrowRight size={16} />
              </Button>
            </form>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-fg/80 transition-colors hover:text-primary btn-focus"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.name}. Demo project — not a real restaurant.</p>
          <div className="flex gap-4">
            {storeSettings.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-semibold uppercase tracking-wide transition-colors hover:text-primary btn-focus"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
