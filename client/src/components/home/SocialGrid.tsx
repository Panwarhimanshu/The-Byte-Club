import { Instagram, Play } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import { socialGrid } from '@/data/social';
import { reels } from '@/data/reels';

const IG_PROFILE = 'https://www.instagram.com/the_byte.club';

export function SocialGrid() {
  return (
    <section id="social" className="section container scroll-mt-24">
      <SectionHeading
        eyebrow="@the_byte.club"
        title={<>Reels & <span className="text-primary">posts</span> from the grill.</>}
        description="Straight from our Instagram — tap any reel to watch it on Instagram."
        action={
          <a
            href={IG_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-pill border border-border px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide transition hover:border-primary hover:text-primary btn-focus"
          >
            <Instagram size={15} /> Follow
          </a>
        }
      />

      <h3 className="mt-10 font-mono text-xs uppercase tracking-widest text-muted">Reels</h3>
      {reels.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {reels.map((reel, i) => (
            <a
              key={reel.url}
              href={reel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-border bg-[#0b0d07] shadow-[6px_6px_0_#2f3a1c]"
            >
              {reel.thumbnail && (
                <SmartImage
                  src={reel.thumbnail}
                  alt={reel.caption ?? 'Byte Club reel'}
                  width={480}
                  wrapperClassName="absolute inset-0"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#0b0d07] shadow-lg transition group-hover:scale-110">
                  <Play size={22} className="translate-x-0.5 fill-current" />
                </span>
              </span>
              {reel.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3 text-xs text-white">
                  {reel.caption}
                </span>
              )}
            </a>
          ))}
        </div>
      ) : (
        <a
          href={IG_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="card-byte mt-4 flex flex-col items-center justify-center gap-3 p-10 text-center"
        >
          <Instagram size={28} className="text-primary" />
          <p className="font-display text-lg font-bold uppercase">Watch our reels on Instagram</p>
          <p className="text-sm text-muted">@the_byte.club</p>
        </a>
      )}

      <h3 className="mt-12 font-mono text-xs uppercase tracking-widest text-muted">Posts</h3>
      <div className="mx-auto mt-4 grid max-w-3xl grid-cols-3 gap-1 sm:gap-1.5">
        {socialGrid.map((post) => (
          <a
            key={post.id}
            href={IG_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open on Instagram"
            className="group relative aspect-[3/4] overflow-hidden bg-border/40"
          >
            <SmartImage
              src={post.image}
              alt="Byte Club on Instagram"
              width={480}
              wrapperClassName="absolute inset-0"
              className="transition-transform duration-500 group-hover:scale-105"
            />
            {post.reel && <Play size={16} className="absolute right-2 top-2 fill-white text-white drop-shadow" />}
          </a>
        ))}
      </div>
        </section>
  );
}
