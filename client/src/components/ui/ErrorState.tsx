import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'That didn’t compile',
  message = 'We hit an error loading this. It’s on us, not you.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-accent/40 bg-accent/10 text-accent">
        <AlertTriangle size={22} />
      </div>
      <div>
        <h3 className="font-display text-xl font-bold">{title}</h3>
        <p className="mt-1 text-sm text-muted">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw size={14} /> Try again
        </Button>
      )}
    </div>
  );
}
