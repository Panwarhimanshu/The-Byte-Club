import { cn } from '@/lib/cn';

/** Standard Indian veg / non-veg square indicator. */
export function VegBadge({ isVeg, className }: { isVeg: boolean; className?: string }) {
  return (
    <span
      role="img"
      aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      className={cn(
        'grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border',
        isVeg ? 'border-veg' : 'border-nonveg',
        className,
      )}
    >
      <span
        className={cn('h-2 w-2 rounded-full', isVeg ? 'bg-veg' : 'bg-nonveg')}
      />
    </span>
  );
}
