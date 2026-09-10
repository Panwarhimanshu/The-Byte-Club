import { forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';

const control =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-muted/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50';

interface FieldWrapProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (id: string) => React.ReactNode;
  className?: string;
}

export function Field({ label, error, hint, required, children, className }: FieldWrapProps) {
  const id = useId();
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="font-display text-xs font-semibold uppercase tracking-wide text-muted">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children(id)}
      {error ? (
        <p className="text-xs text-accent" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(control, className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(control, 'min-h-[96px] resize-y', className)} {...props} />
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(control, 'appearance-none', className)} {...props}>
    {children}
  </select>
));
Select.displayName = 'Select';
