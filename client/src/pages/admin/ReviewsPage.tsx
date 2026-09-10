import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Check, EyeOff } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { AdminHeader, Panel, Badge, adminBtn, adminBtnGhost, adminInput } from '@/components/admin/kit';
import { useUIStore } from '@/store/uiStore';
import { formatDate } from '@/lib/format';
import type { Review } from '@/types';

const COLORS = ['#5B7CFA', '#F0562D', '#2E9E4A', '#E0A652', '#B0781F'];

export default function ReviewsPage() {
  const qc = useQueryClient();
  const toast = useUIStore((s) => s.toast);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [draft, setDraft] = useState<Partial<Review> | null>(null);

  const { data: reviews = [], isLoading } = useQuery({ queryKey: ['admin', 'reviews'], queryFn: adminService.listReviews });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    qc.invalidateQueries({ queryKey: ['reviews'] });
  };
  const onErr = (e: Error) => toast({ variant: 'error', title: 'Failed', description: e.message });

  const patch = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Review> }) => adminService.updateReview(id, body),
    onSuccess: invalidate,
    onError: onErr,
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminService.deleteReview(id),
    onSuccess: () => {
      invalidate();
      toast({ variant: 'success', title: 'Review deleted' });
    },
    onError: onErr,
  });
  const create = useMutation({
    mutationFn: (d: Partial<Review>) =>
      adminService.createReview({
        ...d,
        avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        isApproved: true,
      }),
    onSuccess: () => {
      invalidate();
      setDraft(null);
      toast({ variant: 'success', title: 'Review added' });
    },
    onError: onErr,
  });

  const shown = reviews.filter((r) =>
    filter === 'all' ? true : filter === 'pending' ? !r.isApproved : r.isApproved,
  );

  return (
    <>
      <AdminHeader
        title="Reviews"
        subtitle={`${reviews.length} · only approved reviews show on the storefront`}
        action={
          <button onClick={() => setDraft({ name: '', rating: 5, body: '', productName: '' })} className={adminBtn}>
            <Plus size={15} /> Add review
          </button>
        }
      />

      <div className="mb-4 flex gap-2">
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
              filter === f ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/55 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {draft && (
        <Panel className="mb-4 space-y-3 p-5">
          <h2 className="text-sm font-semibold text-white">New review</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <L label="Name">
              <input className={adminInput} value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </L>
            <L label="Product (optional, exact name)">
              <input className={adminInput} value={draft.productName ?? ''} onChange={(e) => setDraft({ ...draft, productName: e.target.value })} />
            </L>
            <L label="Rating (1–5)">
              <input
                type="number"
                min={1}
                max={5}
                className={adminInput}
                value={draft.rating ?? 5}
                onChange={(e) => setDraft({ ...draft, rating: Math.max(1, Math.min(5, Number(e.target.value))) })}
              />
            </L>
            <L label="Handle (optional)">
              <input className={adminInput} value={draft.handle ?? ''} onChange={(e) => setDraft({ ...draft, handle: e.target.value })} />
            </L>
            <L label="Review" className="sm:col-span-2">
              <textarea className={`${adminInput} min-h-[72px]`} value={draft.body ?? ''} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
            </L>
          </div>
          <div className="flex gap-2">
            <button onClick={() => create.mutate(draft)} disabled={create.isPending} className={adminBtn}>
              {create.isPending ? 'Adding…' : 'Add review'}
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
        <div className="grid gap-3 md:grid-cols-2">
          {shown.map((r) => (
            <Panel key={r.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{r.name}</span>
                  <span className="text-amber-300">{'★'.repeat(r.rating)}</span>
                </div>
                {r.isApproved ? <Badge tone="ok">approved</Badge> : <Badge tone="warn">pending</Badge>}
              </div>
              {r.productName && <p className="mt-0.5 text-xs text-white/40">{r.productName}</p>}
              <p className="mt-2 text-sm text-white/70">“{r.body}”</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-white/35">{formatDate(r.createdAt || r.date)}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => patch.mutate({ id: r.id, body: { isApproved: !r.isApproved } })}
                    className={`${adminBtnGhost} py-1.5`}
                  >
                    {r.isApproved ? (
                      <>
                        <EyeOff size={13} /> Hide
                      </>
                    ) : (
                      <>
                        <Check size={13} /> Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => confirm('Delete this review?') && remove.mutate(r.id)}
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
