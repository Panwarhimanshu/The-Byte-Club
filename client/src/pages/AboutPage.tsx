import { Instagram, Grid3x3, Play, UserSquare2 } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { ByteMark } from '@/components/ui/Logo';
import { SmartImage } from '@/components/ui/SmartImage';
import { socialGrid } from '@/data/social';

const IG_PROFILE = 'https://www.instagram.com/the_byte.club';

/** Public Instagram profile stats, as shown on @the_byte.club. */
const STATS = [
  { value: '13', label: 'posts' },
  { value: '62', label: 'followers' },
  { value: '1', label: 'following' },
];

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About"
        path="/about"
        description="The Byte Club — a cloud kitchen in Vasna & Manjalpur, Vadodara. Burgers, wraps, fries and more."
      />

      <div className="container section">
        {/* Profile header — mirrors the Instagram profile layout */}
        <header className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-14">
          <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-card md:h-36 md:w-36">
            <ByteMark className="h-20 w-20 md:h-24 md:w-24" />
          </div>

          <div className="w-full text-center md:text-left">
            <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
              <h1 className="font-display text-2xl font-bold md:text-3xl">the_byte.club</h1>
              <a
                href={IG_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-fg transition hover:opacity-90 btn-focus"
              >
                <Instagram size={15} /> Follow
              </a>
            </div>

            <ul className="mt-5 flex justify-center gap-8 text-sm md:justify-start">
              {STATS.map((s) => (
                <li key={s.label}>
                  <span className="font-semibold">{s.value}</span> <span className="text-muted">{s.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-1 text-sm">
              <p className="font-semibold">The Byte Club</p>
              <p className="text-muted">Cloud kitchen · Vadodara</p>
              <p>Good food. Bigger cravings.</p>
              <p>The first rule? Come hungry.</p>
              <a href={IG_PROFILE} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                instagram.com/the_byte.club
              </a>
            </div>
          </div>
        </header>

        {/* Tabs — same three-tab bar as Instagram */}
        <nav className="mt-12 flex justify-center gap-16 border-t border-border text-muted" aria-label="Profile sections">
          <span className="-mt-px flex items-center gap-2 border-t-2 border-fg py-3 text-xs font-semibold uppercase tracking-widest text-fg">
            <Grid3x3 size={14} /> Posts
          </span>
          <span className="flex items-center gap-2 py-3 text-xs font-semibold uppercase tracking-widest">
            <Play size={14} /> Reels
          </span>
          <span className="flex items-center gap-2 py-3 text-xs font-semibold uppercase tracking-widest">
            <UserSquare2 size={14} /> Tagged
          </span>
        </nav>

        {/* Post grid — 3 columns, like the Instagram profile */}
        <div className="mx-auto mt-2 grid max-w-3xl grid-cols-3 gap-1 sm:gap-1.5">
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
      </div>
    </>
  );
}
