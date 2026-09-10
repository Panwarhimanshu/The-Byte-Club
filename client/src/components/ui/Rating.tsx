import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Rating({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', className)}>
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              i < Math.round(value) ? 'fill-primary text-primary' : 'text-border',
            )}
          />
        ))}
      </span>
      <span className="font-mono text-xs text-muted">
        {value.toFixed(1)}
        {count != null && ` (${count.toLocaleString('en-IN')})`}
      </span>
    </span>
  );
}
