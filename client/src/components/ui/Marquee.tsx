import { cn } from '@/lib/cn';

export function Marquee({
  items,
  className,
  separator = '✦',
}: {
  items: string[];
  className?: string;
  separator?: string;
}) {
  const row = (
    <div className="flex shrink-0 items-center gap-6 pr-6" aria-hidden>
      {items.map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-6 font-display text-sm font-semibold uppercase tracking-[0.18em]"
        >
          {item}
          <span className="text-primary-fg/50">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn('flex overflow-hidden bg-primary py-3.5 text-primary-fg', className)}
    >
      <div className="flex animate-marquee motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  );
}
