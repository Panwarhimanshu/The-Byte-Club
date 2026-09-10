import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Phone, Mail, Clock, Instagram, Bike, Store, UtensilsCrossed } from 'lucide-react';
import { track } from '@/lib/analytics';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { useSettings } from '@/hooks/queries';
import { useUIStore } from '@/store/uiStore';
import { contactSchema, type ContactForm } from '@/lib/validation';
import { storeSettings } from '@/data/brand';

export default function ContactPage() {
  const { data: settings = storeSettings } = useSettings();
  const toast = useUIStore((s) => s.toast);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = handleSubmit(async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    void data;
    toast({ variant: 'success', title: 'Message sent', description: 'We reply within a day, usually faster.' });
    reset();
  });

  const mapsUrl = import.meta.env.VITE_MAPS_EMBED_URL;

  return (
    <>
      <SEO
        title="Contact & location"
        path="/contact"
        description={`Reach The Byte Club — ${settings.address}. Phone ${settings.phone}, email ${settings.email}.`}
      />

      <div className="container section">
        <h1 className="font-display text-display-lg font-bold">
          Say <span className="text-primary">hi</span>
        </h1>
        <p className="mt-2 max-w-lg text-muted md:text-lg">
          Feedback, catering, a burger that changed your week — we want to hear it.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Store, title: 'Dine in', body: 'Walk in, grab a stool, watch the grill.' },
            { icon: UtensilsCrossed, title: 'Pickup', body: 'Call ahead, skip the wait, collect at the counter.' },
            { icon: Bike, title: 'Delivery', body: 'Find us on Swiggy & Zomato across South Bengaluru.' },
          ].map((w) => (
            <div key={w.title} className="rounded-2xl border border-border bg-card p-5">
              <w.icon size={18} className="text-primary" />
              <h2 className="mt-3 font-display text-base font-bold uppercase">{w.title}</h2>
              <p className="mt-1 text-sm text-muted">{w.body}</p>
            </div>
          ))}
        </div>

        {settings.deliveryApps?.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Order in:</span>
            {settings.deliveryApps.map((app) => (
              <a
                key={app.label}
                href={app.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('delivery_app_click', { app: app.label })}
                className="inline-flex h-9 items-center rounded-pill border border-border px-4 font-display text-xs font-semibold uppercase tracking-wide transition hover:border-primary hover:text-primary btn-focus"
              >
                {app.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            <InfoRow icon={MapPin} title="Kitchen">
              {settings.address}
            </InfoRow>
            <InfoRow icon={Phone} title="Phone">
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-primary">
                {settings.phone}
              </a>
            </InfoRow>
            <InfoRow icon={Mail} title="Email">
              <a href={`mailto:${settings.email}`} className="hover:text-primary">
                {settings.email}
              </a>
            </InfoRow>
            <InfoRow icon={Clock} title="Hours">
              <ul className="space-y-0.5 font-mono text-sm">
                {settings.hours.map((h) => (
                  <li key={h.day}>
                    {h.day} · {h.open}–{h.close}
                  </li>
                ))}
              </ul>
            </InfoRow>
            <InfoRow icon={Instagram} title="Social">
              <div className="flex flex-wrap gap-3">
                {settings.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-sm font-semibold uppercase tracking-wide hover:text-primary"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </InfoRow>

            <div className="overflow-hidden rounded-2xl border border-border">
              {mapsUrl ? (
                <iframe
                  title="Map to The Byte Club"
                  src={mapsUrl}
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="grid h-56 place-items-center bg-grid-byte bg-grid-16 text-center">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted">
                    Map embed placeholder<br />set VITE_MAPS_EMBED_URL
                  </span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={onSubmit} className="card-byte space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" required error={errors.name?.message}>
                {(id) => <Input id={id} {...register('name')} />}
              </Field>
              <Field label="Email" required error={errors.email?.message}>
                {(id) => <Input id={id} type="email" {...register('email')} />}
              </Field>
            </div>
            <Field label="Subject" required error={errors.subject?.message}>
              {(id) => <Input id={id} {...register('subject')} />}
            </Field>
            <Field label="Message" required error={errors.message?.message}>
              {(id) => <Textarea id={id} rows={5} {...register('message')} />}
            </Field>
            <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

function InfoRow({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-primary" />
      <div>
        <p className="font-display text-sm font-bold uppercase">{title}</p>
        <div className="mt-0.5 text-sm text-muted">{children}</div>
      </div>
    </div>
  );
}
