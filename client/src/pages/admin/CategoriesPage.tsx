import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { AdminHeader, Panel, Badge, adminBtn, adminBtnGhost, adminInput } from '@/components/admin/kit';
import { useUIStore } from '@/store/uiStore';
import type { Category } from '@/types';

type Draft = Partial<Category> & { _new?: boolean };

export default function CategoriesPage() {
  const qc = useQueryClient();
  const toast = useUIStore((s) => s.toast);
  const [draft, setDraft] = useState<Draft | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminService.listCategories,
  });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
    qc.invalidateQueries({ queryKey: ['categories'] });
  };
  const onErr = (e: Error) => toast({ variant: 'error', title: 'Failed', description: e.message });

  const save = useMutation({
    mutationFn: (d: Draft) =>
      d._new
        ? adminService.createCategory(d)
        : adminService.updateCategory(d.id!, { name: d.name, tagline: d.tagline, image: d.image, isActive: d.isActive }),
    onSuccess: () => {
      invalidate();
      setDraft(null);
      toast({ variant: 'success', title: 'Saved' });
    },
    onError: onErr,
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      invalidate();
      toast({ variant: 'success', title: 'Category deleted' });
    },
    onError: onErr,
  });
  const reorder = useMutation({
    mutationFn: (ids: string[]) => adminService.reorderCategories(ids),
    onSuccess: invalidate,
    onError: onErr,
  });

  const move = (i: number, dir: -1 | 1) => {
    const next = [...categories];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    reorder.mutate(next.map((c) => c.id));
  };

  const toggleActive = (c: Category) =>
    save.mutate({ id: c.id, name: c.name, tagline: c.tagline, image: c.image, isActive: !c.isActive });

  return (
    <>
      <AdminHeader
        title="Categories"
        subtitle={`${categories.length} · order controls the storefront menu tabs`}
        action={
          <button onClick={() => setDraft({ _new: true, name: '', tagline: '', image: '', isActive: true })} className={adminBtn}>
            <Plus size={15} /> New category
          </button>
        }
      />

      {draft && (
        <Panel className="mb-4 space-y-3 p-5">
          <h2 className="text-sm font-semibold text-white">{draft._new ? 'New category' : `Edit · ${draft.name}`}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <L label="Name">
              <input className={adminInput} value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </L>
            <L label="Tagline">
              <input className={adminInput} value={draft.tagline ?? ''} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} />
            </L>
            <L label="Image URL" className="sm:col-span-2">
              <input className={adminInput} value={draft.image ?? ''} onChange={(e) => setDraft({ ...draft, image: e.target.value })} />
            </L>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => save.mutate(draft)} disabled={save.isPending} className={adminBtn}>
              {save.isPending ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setDraft(null)} className={adminBtnGhost}>
              Cancel
            </button>
          </div>
        </Panel>
      )}

      <Panel>
        {isLoading ? (
          <p className="p-5 text-sm text-white/40">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {categories.map((c, i) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0">
                  <td className="w-10 px-3 py-3">
                    <div className="flex flex-col text-white/30">
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="hover:text-white disabled:opacity-20">
                        <ArrowUp size={13} />
                      </button>
                      <button onClick={() => move(i, 1)} disabled={i === categories.length - 1} className="hover:text-white disabled:opacity-20">
                        <ArrowDown size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      {c.image ? (
                        <img src={c.image} alt="" className="h-9 w-9 rounded-md object-cover" />
                      ) : (
                        <span className="h-9 w-9 rounded-md bg-white/10" />
                      )}
                      <div>
                        <p className="font-medium text-white">{c.name}</p>
                        <p className="text-xs text-white/40">/{c.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3 text-white/50 md:table-cell">{c.tagline}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleActive(c)}>
                      {c.isActive ? <Badge tone="ok">visible</Badge> : <Badge tone="off">hidden</Badge>}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setDraft({ ...c })}
                        className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete “${c.name}”? Products in it won't be deleted but will have no category page.`))
                            remove.mutate(c.id);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/5 hover:text-rose-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
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
