import { MapPin, Clock, Phone } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useSettings } from '@/hooks/queries';

export function LocationSection() {
  const { data: settings } = useSettings();
  if (!settings) return null;

  return (
    <section className="section container">
      <SectionHeading
        eyebrow="Find us"
        title={<>One kitchen. <span className="text-primary">For now.</span></>}
        description="Dine-in, pickup or delivery across South Bengaluru."
      />

      <div className="mt-10 grid gap-4 overflow-hidden rounded-3xl border border-border lg:grid-cols-2">
        <div className="relative min-h-[280px] bg-grid-byte bg-grid-16">
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-fg">
                <MapPin size={20} />
              </span>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                Map embed placeholder
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-8">
          <div className="flex gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="font-display text-sm font-bold uppercase">Address</p>
              <p className="text-sm text-muted">{settings.address}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="font-display text-sm font-bold uppercase">Hours</p>
              <ul className="mt-1 space-y-0.5 font-mono text-sm text-muted">
                {settings.hours.map((h) => (
                  <li key={h.day}>
                    {h.day} · {h.open}–{h.close}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <Phone size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="font-display text-sm font-bold uppercase">Contact</p>
              <p className="text-sm text-muted">{settings.phone}</p>
              <p className="text-sm text-muted">{settings.email}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
