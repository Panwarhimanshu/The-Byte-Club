import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { AdminHeader, Panel, Badge, adminBtn, adminBtnGhost, adminInput } from '@/components/admin/kit';
import { useUIStore } from '@/store/uiStore';
import { formatMoney } from '@/lib/format';
import type { Offer } from '@/types';

type Draft = Partial<Offer> & { _new?: boolean };

const EMPTY: Draft = {
  _new: true,
  title: '',
  description: '',
  code: '',
  type: 'percent',
  value: 10,
  minOrder: 0,
  image: '',
  accent: 'primary',
  badge: 'DEAL',
  isActive: true,
};

export default function AdminOffersPage() {
  const qc = useQueryClient();
  const toast = useUIStore((s) => s.toast);
  const [draft, setDraft] = useState<Draft | null>(null);

  const { data: offers = [], isLoading } = useQuery({ queryKey: ['admin', 'offers'], queryFn: adminService.listOffers });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'offers'] });
    qc.invalidateQueries({ queryKey: ['offers'] });
  };
  const onErr = (e: Error) => toast({ variant: 'error', title: 'Failed', description: e.message });

  const save = useMutation({
    mutationFn: (d: Draft) => {
      const body = {
        title: d.title,
        description: d.description,
        code: d.code || undefined,
        type: d.type,
        value: Number(d.value),
        minOrder: Number(d.minOrder) || 0,
        image: d.image,
        accent: d.accent,
        badge: d.badge,
        isActive: d.isActive,
      };
      return d._new ? adminService.createOffer(body) : adminService.updateOffer(d.id!, body);
    },
    onSuccess: () => {
      invalidate();
      setDraft(null);
      toast({ variant: 'success', title: 'Saved' });
    },
    onError: onErr,
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminService.deleteOffer(id),
    onSuccess: () => {
      invalidate();
      toast({ variant: 'success', title: 'Offer deleted' });
    },
    onError: onErr,
  });

  return (
    <>
      <AdminHeader
        title="Offers"
        subtitle={`${offers.length} · shown on /offers and the home banner`}
        action={
          <button onClick={() => setDraft({ ...EMPTY })} className={adminBtn}>
            <Plus size={15} /> New offer
          </button>
        }
      />

      {draft && (
        <Panel className="mb-4 space-y-3 p-5">
          <h2 className="text-sm font-semibold text-white">{draft._new ? 'New offer' : `Edit · ${draft.title}`}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <L label="Title">
              <input className={adminInput} value={draft.title ?? ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </L>
            <L label="Badge">
              <input className={adminInput} value={draft.badge ?? ''} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} />
            </L>
            <L label="Description" className="sm:col-span-2">
              <textarea className={`${adminInput} min-h-[56px]`} value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </L>
            <L label="Code (optional)">
              <input className={adminInput} value={draft.code ?? ''} onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })} />
            </L>
            <L label="Type">
              <select className={adminInput} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as Offer['type'] })}>
                {['percent', 'flat', 'bogo', 'combo', 'freebie'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </L>
            <L label="Value (% or ₹)">
              <input type="number" className={adminInput} value={draft.value ?? 0} onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })} />
            </L>
            <L label="Min order (₹)">
              <input type="number" className={adminInput} value={draft.minOrder ?? 0} onChange={(e) => setDraft({ ...draft, minOrder: Number(e.target.value) })} />
            </L>
            <L label="Image URL" className="sm:col-span-2">
              <input className={adminInput} value={draft.image ?? ''} onChange={(e) => setDraft({ ...draft, image: e.target.value })} />
            </L>
            <L label="Accent">
              <select className={adminInput} value={draft.accent} onChange={(e) => setDraft({ ...draft, accent: e.target.value as Offer['accent'] })}>
                {['primary', 'secondary', 'accent'].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </L>
            <label className="flex items-end gap-2 pb-2 text-sm text-white/70">
              <input type="checkbox" checked={!!draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} /> Active
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={() => save.mutate(draft)} disabled={save.isPending} className={adminBtn}>
              {save.isPending ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setDraft(null)} className={adminBtnGhost}>
              Cancel
            </button>
          </div>
        </Panel>
      )}

      {isLoading ? (
        <Panel className="p-5 text-sm text-white/40">Loading…</Panel>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o) => (
            <Panel key={o.id} className="overflow-hidden">
              {o.image ? <img src={o.image} alt="" className="h-24 w-full object-cover" /> : <div className="h-24 bg-white/5" />}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-semibold text-indigo-300">{o.badge}</span>
                  {o.isActive ? <Badge tone="ok">active</Badge> : <Badge tone="off">off</Badge>}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-white">{o.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/45">{o.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-white/40">
                  <span className="font-mono">{o.code || 'no code'}</span>
                  <span>
                    {o.type === 'percent' ? `${o.value}%` : o.type === 'flat' ? formatMoney(o.value) : o.type}
                  </span>
                </div>
                <div className="mt-3 flex gap-1">
                  <button onClick={() => setDraft({ ...o })} className={`${adminBtnGhost} flex-1 py-1.5`}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => confirm(`Delete “${o.title}”?`) && remove.mutate(o.id)}
                    className="grid w-9 place-items-center rounded-lg border border-white/10 text-white/50 hover:text-rose-300"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}

function L({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/40">{label}</span>
      {children}
    </label>
  );
}
