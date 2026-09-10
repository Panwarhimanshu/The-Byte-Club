import { motion } from 'framer-motion';
import { SEO } from '@/components/ui/SEO';
import { SmartImage } from '@/components/ui/SmartImage';
import { ButtonLink } from '@/components/ui/Button';
import { Marquee } from '@/components/ui/Marquee';
import { fadeUp, revealViewport, stagger } from '@/lib/motion';

const principles = [
  {
    k: '01',
    t: 'One seasoning philosophy',
    d: 'Every fry, patty and wing gets the same house blend. Consistency is a feature, not a limitation.',
  },
  {
    k: '02',
    t: 'Cook it when they order it',
    d: 'No heat lamps, no holding trays. If it can’t be made fresh in under 12 minutes, it isn’t on the menu.',
  },
  {
    k: '03',
    t: 'A short menu, on purpose',
    d: 'Sixteen items. No 40-page laminated thing. Every dish has to earn its spot back each season.',
  },
  {
    k: '04',
    t: 'Loud flavour, quiet ego',
    d: 'We’ll experiment hard on the food and keep the room humble. The burger does the talking.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About"
        path="/about"
        description="The Byte Club started as a weekend pop-up between a cook and a designer — a tight menu cooked properly, with an identity as loud as the food."
      />

      <section className="container section">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow mb-6"
        >
          <span className="h-1.5 w-1.5 bg-primary" /> Our story
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="max-w-4xl font-display text-display-xl font-bold leading-[0.95]"
        >
          Two friends. One griddle.<br />
          A shared hatred of <span className="text-primary">soggy fries.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-6 max-w-2xl text-lg text-muted"
        >
          The Byte Club started in 2024 as a weekend pop-up run by a line cook and a designer
          who kept arguing about the same thing: why does great fast food so rarely feel like a
          brand you'd wear on a t-shirt? So they built one. A tight menu cooked properly, and an
          identity as loud as the food.
        </motion.p>
      </section>

      <div className="container">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=75&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&q=75&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=75&auto=format&fit=crop',
          ].map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={{ delay: i * 0.08 }}
              className={`overflow-hidden rounded-2xl border border-border ${
                i === 1 ? 'md:mt-8' : ''
              }`}
            >
              <SmartImage src={src} alt="" width={800} wrapperClassName="aspect-[4/5]" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <Marquee items={['NO SOGGY FRIES', 'NO HEAT LAMPS', 'NO DARK PATTERNS', 'NO MYSTERY MEAT', 'NO BUFFERING']} />
      </div>

      <section className="container section">
        <h2 className="font-display text-display-lg font-bold">
          What we <span className="text-primary">believe</span>
        </h2>
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2"
        >
          {principles.map((p) => (
            <motion.div key={p.k} variants={fadeUp} className="bg-card p-8">
              <span className="font-mono text-sm text-primary">{p.k}</span>
              <h3 className="mt-3 font-display text-xl font-bold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted">{p.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container pb-24">
        <div className="rounded-3xl border border-primary/30 bg-primary p-10 text-center text-primary-fg">
          <h2 className="font-display text-3xl font-bold">Come hungry.</h2>
          <p className="mt-2 opacity-80">The menu is short on purpose. Every item earns its place.</p>
          <ButtonLink as="link" to="/menu" variant="dark" className="mt-6">
            See the menu
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
