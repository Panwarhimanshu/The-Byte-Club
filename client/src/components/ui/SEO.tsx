import { Helmet } from 'react-helmet-async';
import { brand } from '@/data/brand';
import { siteUrl } from '@/lib/seo';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const DEFAULT_DESC =
  'The Byte Club is a digital-first fast-food brand. Burgers, pizzas, wraps and shakes built for cravings. Order delivery or pickup in a few taps.';

export function SEO({
  title,
  description = DEFAULT_DESC,
  path = '/',
  image = '/og-cover.svg',
  type = 'website',
  noindex = false,
  jsonLd,
}: SEOProps) {
  const fullTitle = title ? `${title} · ${brand.name}` : `${brand.name} — ${brand.tagline}`;
  const url = siteUrl(path);
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={brand.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
