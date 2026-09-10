import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';
import { useCategories } from '@/hooks/queries';
import { fadeUp, revealViewport, stagger } from '@/lib/motion';
import { Skeleton } from '@/components/ui/Skeleton';

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="section container">
      <SectionHeading
        eyebrow="Pick your poison"
        title={<>Browse by <span className="text-primary">category</span></>}
        description="Eight categories, one seasoning philosophy."
      />

      <motion.div
        variants={stagger(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={revealViewport}
        className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
      >
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
          ))}

        {categories?.map((cat) => (
          <motion.div key={cat.id} variants={fadeUp}>
            <Link
              to={`/menu/${cat.slug}`}
              className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-lift btn-focus"
            >
              <div className="relative flex-1 overflow-hidden">
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  width={480}
                  className="scale-105 transition-transform duration-500 ease-byte group-hover:scale-110"
                />
                <span className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-bg/85 text-primary opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <div className="bg-primary px-3.5 py-3 text-primary-fg">
                <h3 className="font-display text-base font-bold leading-tight">{cat.name}</h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-primary-fg/75">{cat.tagline}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
