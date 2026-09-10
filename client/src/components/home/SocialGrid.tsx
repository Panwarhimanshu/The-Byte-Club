import { motion } from 'framer-motion';
import { Heart, Instagram } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import { socialPosts } from '@/data/social';
import { fadeUp, revealViewport, stagger } from '@/lib/motion';

export function SocialGrid() {
  return (
    <section className="section container">
      <SectionHeading
        eyebrow="@thebyteclub"
        title={<>Tag us. We’ll <span className="text-primary">repost</span> you.</>}
        description="Placeholder feed — swap for a live Instagram embed at launch."
        action={
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-pill border border-border px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide transition hover:border-primary hover:text-primary btn-focus"
          >
            <Instagram size={15} /> Follow
          </a>
        }
      />

      <motion.div
        variants={stagger(0.04)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
      >
        {socialPosts.map((post) => (
          <motion.a
            key={post.id}
            variants={fadeUp}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl border border-border"
          >
            <SmartImage
              src={post.image}
              alt={post.caption}
              width={480}
              wrapperClassName="absolute inset-0"
              className="transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-bg/90 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="text-xs font-medium">{post.caption}</p>
              <span className="mt-1 flex items-center gap-1 font-mono text-[10px] text-muted">
                <Heart size={10} className="fill-accent text-accent" /> {post.likes}
              </span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
