import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Rating } from '@/components/ui/Rating';
import { useReviews } from '@/hooks/queries';
import { initials, formatDate } from '@/lib/format';
import { fadeUp, revealViewport, stagger } from '@/lib/motion';

export function ReviewsWall() {
  const { data: reviews } = useReviews();

  return (
    <section className="section container">
      <SectionHeading
        eyebrow="Word of mouth"
        title={<>What the <span className="text-primary">club</span> says</>}
        description="Demo reviews — seed data for this build, not real customers."
      />

      <motion.div
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3"
      >
        {reviews?.map((review) => (
          <motion.figure
            key={review.id}
            variants={fadeUp}
            className="mb-4 break-inside-avoid rounded-2xl border border-border bg-card p-5"
          >
            <Rating value={review.rating} />
            <blockquote className="mt-3 text-sm leading-relaxed text-fg/90">
              “{review.body}”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span
                className="grid h-9 w-9 place-items-center rounded-full font-display text-xs font-bold text-bg"
                style={{ background: review.avatarColor }}
              >
                {initials(review.name)}
              </span>
              <span className="text-xs">
                <span className="block font-semibold">{review.name}</span>
                <span className="block text-muted">
                  {review.product ? `${review.product} · ` : ''}
                  {formatDate(review.date)}
                </span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
