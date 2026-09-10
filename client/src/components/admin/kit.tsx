import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

/* A deliberately plain, SaaS-style palette — nothing to do with the storefront brand. */

export function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-white/45">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn('rounded-xl border border-white/10 bg-[#16181d]', className)}>{children}</div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Panel className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </Panel>
  );
}

export const adminInputBase =
  'block rounded-lg border border-white/10 bg-[#0f1012] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-indigo-400/70';
export const adminInput = `${adminInputBase} w-full`;

export const adminBtn =
  'inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50';

export const adminBtnGhost =
  'inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white disabled:opacity-50';

export const Field = forwardRef<
  HTMLInputElement,
  { label: string; error?: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, error, hint, className, ...props }, ref) => (
  <label className="block">
    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/40">{label}</span>
    <input ref={ref} className={cn(adminInput, className)} {...props} />
    {error ? (
      <span className="mt-1 block text-xs text-rose-400">{error}</span>
    ) : hint ? (
      <span className="mt-1 block text-xs text-white/35">{hint}</span>
    ) : null}
  </label>
));
Field.displayName = 'Field';

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full transition',
        checked ? 'bg-indigo-500' : 'bg-white/15',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white transition',
          checked ? 'left-4' : 'left-0.5',
        )}
      />
    </button>
  );
}

export function Badge({ tone, children }: { tone: 'ok' | 'warn' | 'off'; children: React.ReactNode }) {
  const tones = {
    ok: 'bg-emerald-500/15 text-emerald-300',
    warn: 'bg-amber-500/15 text-amber-300',
    off: 'bg-white/10 text-white/50',
  };
  return <span className={cn('rounded-full px-2 py-0.5 text-xs', tones[tone])}>{children}</span>;
}
