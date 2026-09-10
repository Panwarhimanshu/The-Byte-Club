import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

/**
 * The bitten "B" mark. `currentColor` fills the letter, so set text colour on the parent.
 * A circular bite is masked out of the top-left.
 */
export function ByteMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 46 48" className={cn('h-8 w-8', className)} aria-hidden focusable="false">
      <defs>
        <mask id="byte-bite">
          <rect width="46" height="48" fill="#fff" />
          <circle cx="10.5" cy="9" r="8.2" fill="#000" />
        </mask>
      </defs>
      <path
        mask="url(#byte-bite)"
        fillRule="evenodd"
        fill="currentColor"
        d="M6 3.5 L26.5 3.5 C34.6 3.5 40.5 8.6 40.5 15.8 C40.5 19.9 38.5 23 35.2 24.8 C39.3 26.7 42 30.8 42 35.6 C42 42.8 35.8 44.5 26.8 44.5 L6 44.5 C4.6 44.5 3.5 43.4 3.5 42 L3.5 6 C3.5 4.6 4.6 3.5 6 3.5 Z M16.5 12.5 L25 12.5 C28.2 12.5 30.2 14 30.2 16.7 C30.2 19.4 28.2 21 25 21 L16.5 21 Z M16.5 28.5 L27 28.5 C30.2 28.5 32 30 32 32.9 C32 35.8 30.2 37.3 27 37.3 L16.5 37.3 Z"
      />
    </svg>
  );
}

/** Three little "pop" lines, like the sparkle accents on the brand logo. */
export function BytePop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-4 w-4 text-primary', className)} aria-hidden>
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="12" y1="3" x2="12" y2="9" />
        <line x1="20" y1="6" x2="16" y2="10.5" />
        <line x1="4" y1="6" x2="8" y2="10.5" />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link
      to="/"
      className={cn('group inline-flex items-center gap-2 text-primary btn-focus', className)}
      aria-label="The Byte Club — home"
    >
      <span className="relative">
        <ByteMark className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6" />
        <BytePop className="absolute -right-1.5 -top-1.5 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </span>
      {showText && (
        <span className="font-display text-lg font-bold uppercase leading-[0.9] tracking-tight">
          Byte
          <br />
          Club
        </span>
      )}
    </Link>
  );
}
