import { SEO } from '@/components/ui/SEO';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="404 — page not found" path="/404" noindex />
      <div className="container grid min-h-[60vh] place-items-center section">
        <div className="text-center">
          <p className="font-display text-[7rem] font-bold leading-none text-primary">404</p>
          <EmptyState
            title="This page didn’t compile"
            hint="The link is broken or the page moved. The menu still works."
            command="byte route --resolve"
            action={<ButtonLink as="link" to="/">Back to home</ButtonLink>}
          />
        </div>
      </div>
    </>
  );
}
