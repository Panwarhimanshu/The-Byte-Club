import { Suspense, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  Tag,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { ByteMark } from '@/components/ui/Logo';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/cn';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: UtensilsCrossed },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/offers', label: 'Offers', icon: Tag },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[#0f1012] text-white lg:grid lg:grid-cols-[240px_1fr]">
      <Helmet>
        <title>Admin · The Byte Club</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/10 bg-[#16181d] transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <ByteMark className="h-6 w-6" />
            <span className="text-sm font-bold uppercase tracking-wide text-white">Byte Admin</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-lg text-white/50 lg:hidden"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-white/55 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/55 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink size={16} /> View storefront
          </a>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/55 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#16181d] px-5 py-3 lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-white/55 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden text-white/40 sm:inline">Signed in as</span>
            <span className="rounded-full bg-white/5 px-3 py-1 font-medium">{user?.email}</span>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">
          <Suspense
            fallback={<div className="flex h-64 items-center justify-center text-sm text-white/40">Loading…</div>}
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
