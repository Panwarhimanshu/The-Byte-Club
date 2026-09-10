import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { AdminHeader, Panel, adminBtn, adminBtnGhost, adminInput, adminInputBase } from '@/components/admin/kit';
import { useUIStore } from '@/store/uiStore';
import type { StoreSettings } from '@/types';

export default function SettingsPage() {
  const qc = useQueryClient();
  const toast = useUIStore((s) => s.toast);
  const { data } = useQuery({ queryKey: ['admin', 'settings'], queryFn: adminService.getSettings });
  const [form, setForm] = useState<StoreSettings | null>(null);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  const save = useMutation({
    mutationFn: (body: StoreSettings) => adminService.updateSettings(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'settings'] });
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast({ variant: 'success', title: 'Settings saved' });
    },
    onError: (e: Error) => toast({ variant: 'error', title: 'Save failed', description: e.message }),
  });

  if (!form) return <p className="text-sm text-white/40">Loading…</p>;
  const set = <K extends keyof StoreSettings>(k: K, v: StoreSettings[K]) => setForm({ ...form, [k]: v });

  const rows = <T,>(
    key: 'hours' | 'socials' | 'deliveryApps',
    list: T[],
    blank: T,
    render: (row: T, i: number, update: (patch: Partial<T>) => void) => React.ReactNode,
  ) => (
    <div className="space-y-2">
      {list.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          {render(row, i, (patch) => set(key, list.map((r, j) => (j === i ? { ...r, ...patch } : r)) as never))}
          <button
            type="button"
            onClick={() => set(key, list.filter((_, j) => j !== i) as never)}
            className="text-white/30 hover:text-rose-300"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => set(key, [...list, blank] as never)} className="text-xs text-indigo-400 hover:underline">
        <Plus size={11} className="mb-0.5 inline" /> add row
      </button>
    </div>
  );

  return (
    <>
      <AdminHeader title="Store settings" subtitle="Brand, contact, hours and links — used across the storefront." />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate(form);
        }}
        className="grid gap-4 lg:grid-cols-2"
      >
        <Panel className="space-y-3 p-5">
          <h2 className="text-sm font-semibold text-white">Brand</h2>
          <L label="Brand name">
            <input className={adminInput} value={form.brandName} onChange={(e) => set('brandName', e.target.value)} />
          </L>
          <L label="Tagline">
            <input className={adminInput} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
          </L>
          <L label="Currency symbol">
            <input className={adminInput} value={form.currency} onChange={(e) => set('currency', e.target.value)} />
          </L>
        </Panel>

        <Panel className="space-y-3 p-5">
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <L label="Phone">
            <input className={adminInput} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </L>
          <L label="Email">
            <input className={adminInput} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </L>
          <L label="Address">
            <input className={adminInput} value={form.address} onChange={(e) => set('address', e.target.value)} />
          </L>
          <L label="Google Maps embed URL (optional)">
            <input className={adminInput} value={form.mapsUrl ?? ''} onChange={(e) => set('mapsUrl', e.target.value)} />
          </L>
        </Panel>

        <Panel className="space-y-3 p-5">
          <h2 className="text-sm font-semibold text-white">Opening hours</h2>
          {rows('hours', form.hours, { day: '', open: '', close: '' }, (row, _i, update) => (
            <>
              <input className={`${adminInputBase} flex-1`} placeholder="Day" value={row.day} onChange={(e) => update({ day: e.target.value })} />
              <input className={`${adminInputBase} w-24`} placeholder="Open" value={row.open} onChange={(e) => update({ open: e.target.value })} />
              <input className={`${adminInputBase} w-24`} placeholder="Close" value={row.close} onChange={(e) => update({ close: e.target.value })} />
            </>
          ))}
        </Panel>

        <Panel className="space-y-4 p-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Delivery apps</h2>
            <div className="mt-2">
              {rows('deliveryApps', form.deliveryApps, { label: '', href: '' }, (row, _i, update) => (
                <>
                  <input className={`${adminInputBase} w-32`} placeholder="Label" value={row.label} onChange={(e) => update({ label: e.target.value })} />
                  <input className={`${adminInputBase} flex-1`} placeholder="https://…" value={row.href} onChange={(e) => update({ href: e.target.value })} />
                </>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Social links</h2>
            <div className="mt-2">
              {rows('socials', form.socials, { label: '', href: '' }, (row, _i, update) => (
                <>
                  <input className={`${adminInputBase} w-32`} placeholder="Label" value={row.label} onChange={(e) => update({ label: e.target.value })} />
                  <input className={`${adminInputBase} flex-1`} placeholder="https://…" value={row.href} onChange={(e) => update({ href: e.target.value })} />
                </>
              ))}
            </div>
          </div>
        </Panel>

        <div className="lg:col-span-2 flex gap-2">
          <button type="submit" disabled={save.isPending} className={adminBtn}>
            {save.isPending ? 'Saving…' : 'Save settings'}
          </button>
          <button type="button" onClick={() => data && setForm(data)} className={adminBtnGhost}>
            Reset
          </button>
        </div>
      </form>
    </>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/40">{label}</span>
      {children}
    </label>
  );
}
