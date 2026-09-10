import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { whyPoints } from '@/data/brand';
import { fadeUp, revealViewport, stagger } from '@/lib/motion';

export function WhyByteClub() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Why us"
          title={<>Fast food that <span className="text-primary">respects you</span></>}
          description="Speed is the easy part. This is the rest of it."
        />

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {whyPoints.map((point, i) => (
            <motion.div
              key={point.title}
              variants={fadeUp}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              <span className="absolute right-4 top-3 font-mono text-5xl font-bold text-border">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-display text-4xl font-bold text-primary">{point.stat}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {point.statLabel}
                </p>
              </div>
              <div className="mt-8">
                <h3 className="font-display text-lg font-bold">{point.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{point.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
