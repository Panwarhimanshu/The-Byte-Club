import { useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Lazy, fade-in image with a skeleton placeholder + graceful failure.
 * Accepts a base URL (e.g. Unsplash/Cloudinary) and can request a width.
 */
export function SmartImage({
  src,
  alt,
  className,
  wrapperClassName,
  eager = false,
  width,
}: {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  eager?: boolean;
  width?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const resolved =
    width && src.includes('images.unsplash.com')
      ? src.replace(/([?&])w=\d+/, `$1w=${width}`)
      : src;

  return (
    <div className={cn('relative block h-full w-full overflow-hidden bg-border/40', wrapperClassName)}>
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-border/50 to-border/20" />
      )}
      {failed ? (
        <div className="absolute inset-0 grid place-items-center bg-primary/[0.06] bg-grid-byte bg-grid-16 text-muted">
          <span className="font-mono text-[10px] uppercase tracking-widest">no image</span>
        </div>
      ) : (
        <img
          src={resolved}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-700',
            loaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
        />
      )}
    </div>
  );
}
