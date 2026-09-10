import { SEO } from '@/components/ui/SEO';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/ui/Marquee';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedRail } from '@/components/home/FeaturedRail';
import { BestSellers } from '@/components/home/BestSellers';
import { WhyByteClub } from '@/components/home/WhyByteClub';
import { SpecialOffer } from '@/components/home/SpecialOffer';
import { ShowcaseScroller } from '@/components/home/ShowcaseScroller';
import { ReviewsWall } from '@/components/home/ReviewsWall';
import { SocialGrid } from '@/components/home/SocialGrid';
import { LocationSection } from '@/components/home/LocationSection';
import { CtaBanner } from '@/components/home/CtaBanner';
import { restaurantJsonLd } from '@/lib/seo';

const MARQUEE = [
  'SMASHED TO ORDER',
  'BUNS BAKED DAILY',
  'IN-HOUSE SAUCES',
  'ONE LOUD KITCHEN',
  'HSR LAYOUT, BENGALURU',
  'DINE-IN · PICKUP · DELIVERY',
];

export default function HomePage() {
  return (
    <>
      <SEO
        path="/"
        jsonLd={restaurantJsonLd}
        description="The Byte Club — a digital-first fast-food brand. Smash burgers, sourdough pizza, wraps and thick shakes. Order delivery or pickup in a few taps."
      />
      <Hero />
      <Marquee items={MARQUEE} />
      <FeaturedRail />
      <CategoryGrid />
      <BestSellers />
      <WhyByteClub />
      <SpecialOffer />
      <ShowcaseScroller />
      <ReviewsWall />
      <SocialGrid />
      <LocationSection />
      <CtaBanner />
    </>
  );
}
