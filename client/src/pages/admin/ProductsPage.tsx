import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { AdminHeader, Panel, Toggle, Badge, adminBtn, adminInput, adminInputBase } from '@/components/admin/kit';
import { VegBadge } from '@/components/ui/VegBadge';
import { formatMoney } from '@/lib/format';
import { useUIStore } from '@/store/uiStore';

export default function ProductsPage() {
  const qc = useQueryClient();
  const toast = useUIStore((s) => s.toast);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: adminService.listProducts,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminService.listCategories,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin'] });
    qc.invalidateQueries({ queryKey: ['products'] });
  };

  const toggle = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      adminService.setAvailability(id, isAvailable),
    onSuccess: invalidate,
    onError: (e: Error) => toast({ variant: 'error', title: 'Update failed', description: e.message }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      invalidate();
      toast({ variant: 'success', title: 'Product deleted' });
    },
    onError: (e: Error) => toast({ variant: 'error', title: 'Delete failed', description: e.message }),
  });

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === 'all' || p.category === cat) &&
          p.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [products, q, cat],
  );

  return (
    <>
      <AdminHeader
        title="Products"
        subtitle={`${products.length} on the menu`}
        action={
          <Link to="/admin/products/new" className={adminBtn}>
            <Plus size={15} /> New product
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className={`${adminInputBase} w-56 pl-9`}
          />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${adminInputBase} w-44`}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <Panel>
        {isLoading ? (
          <p className="p-5 text-sm text-white/40">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-5 text-sm text-white/40">No products match.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/40">
                  <th className="px-5 py-2.5 font-medium">Product</th>
                  <th className="hidden px-5 py-2.5 font-medium md:table-cell">Category</th>
                  <th className="px-5 py-2.5 font-medium">Price</th>
                  <th className="hidden px-5 py-2.5 font-medium lg:table-cell">Flags</th>
                  <th className="px-5 py-2.5 font-medium">Live</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-9 w-9 rounded-md object-cover" />
                        <span className="flex items-center gap-1.5 font-medium text-white">
                          <VegBadge isVeg={p.isVeg} />
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3 capitalize text-white/55 md:table-cell">{p.category}</td>
                    <td className="px-5 py-3 font-mono text-white">{formatMoney(p.price)}</td>
                    <td className="hidden gap-1 px-5 py-3 lg:table-cell">
                      <span className="flex gap-1">
                        {p.isBestseller && <Badge tone="ok">bestseller</Badge>}
                        {p.isFeatured && <Badge tone="warn">featured</Badge>}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Toggle
                        checked={p.isAvailable}
                        onChange={(v) => toggle.mutate({ id: p.id, isAvailable: v })}
                        label={`${p.name} availability`}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete “${p.name}”? This can't be undone.`)) remove.mutate(p.id);
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
          </div>
        )}
      </Panel>
    </>
  );
}
