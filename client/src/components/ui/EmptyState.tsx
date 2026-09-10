import { ByteMark } from './Logo';
import { cn } from '@/lib/cn';

/**
 * Branded empty state — the bitten-B mark in a soft blue disc, gently wobbling.
 */
export function EmptyState({
  title,
  hint,
  action,
  className,
}: {
  title: string;
  hint?: string;
  /** kept for API compatibility; no longer rendered */
  command?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto max-w-md text-center', className)}>
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-primary/10">
        <ByteMark className="h-10 w-10 animate-wobble text-primary motion-reduce:animate-none" />
      </div>
      <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
