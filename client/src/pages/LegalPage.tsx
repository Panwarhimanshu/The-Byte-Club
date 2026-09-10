import { useParams, Navigate } from 'react-router-dom';
import { SEO } from '@/components/ui/SEO';
import { brand } from '@/data/brand';

const CONTENT: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'This is a demo project. The Byte Club is not a real business and does not operate a real storefront.',
      'In this build, account details and orders you create are stored locally in your browser (localStorage) or in a local demo database. Nothing is transmitted to a third party.',
      'A production deployment would collect only what is needed to fulfil an order — name, contact details and delivery address — and would document retention, payment processing and your rights here.',
      'Questions about this sample: hello@thebyteclub.example',
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      'These terms cover use of this demo website. By browsing it you accept that it is a portfolio/reference build with sample data.',
      'Prices, offers, products and availability shown are illustrative and carry no commercial commitment.',
      'No real payment is processed. No real order is fulfilled.',
      'The code and design may be used as a starting point for a real project, at which point real terms must replace this text.',
    ],
  },
  refunds: {
    title: 'Refund Policy',
    body: [
      'As this is a demo, no payments are taken and therefore no refunds apply.',
      'For a live deployment, a typical fast-food refund policy would apply: full refund or remake for missing, incorrect or quality-issue items reported within a reasonable window, with support reachable by phone and email.',
    ],
  },
};

export default function LegalPage() {
  const { doc } = useParams();
  const entry = doc ? CONTENT[doc] : undefined;
  if (!entry) return <Navigate to="/" replace />;

  return (
    <>
      <SEO title={entry.title} path={`/legal/${doc}`} />
      <article className="container max-w-2xl section">
        <p className="eyebrow mb-3">
          <span className="h-1.5 w-1.5 bg-primary" /> {brand.name}
        </p>
        <h1 className="font-display text-display-lg font-bold">{entry.title}</h1>
        <p className="mt-2 font-mono text-xs text-muted">Last updated · sample document</p>
        <div className="mt-8 space-y-4 text-muted">
          {entry.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
    </>
  );
}
