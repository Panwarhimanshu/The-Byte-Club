import { cn } from '@/lib/cn';

type Tone = 'primary' | 'secondary' | 'accent' | 'neutral' | 'outline';

const tones: Record<Tone, string> = {
  primary: 'bg-primary text-primary-fg',
  secondary: 'bg-secondary text-secondary-fg',
  accent: 'bg-accent text-accent-fg',
  neutral: 'bg-card text-muted border border-border',
  outline: 'border border-primary/60 text-primary',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.15em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
