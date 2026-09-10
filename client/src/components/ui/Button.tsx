import { forwardRef } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-display font-semibold uppercase tracking-wide rounded-pill transition-all duration-200 ease-byte btn-focus disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.97]';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-fg hover:shadow-glow hover:-translate-y-0.5',
  secondary:
    'bg-secondary text-secondary-fg hover:brightness-110 hover:-translate-y-0.5',
  outline:
    'border border-border text-fg hover:border-primary hover:text-primary bg-transparent',
  ghost: 'text-fg hover:bg-card',
  /* for use on a primary/blue background */
  dark: 'bg-primary-fg text-primary hover:brightness-95',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-4 h-9',
  md: 'text-sm px-6 h-11 tap-target',
  lg: 'text-base px-8 h-14 tap-target',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & { as?: 'button' };
type AnchorButtonProps = CommonProps & Omit<LinkProps, 'className'> & { as: 'link' };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className, children, as: _as, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = 'Button';

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  as: _as,
  ...props
}: AnchorButtonProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </Link>
  );
}
