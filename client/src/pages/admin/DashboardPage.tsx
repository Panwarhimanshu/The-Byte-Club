import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminService } from '@/services/admin.service';
import { AdminHeader, Panel, StatCard, Badge } from '@/components/admin/kit';
import { formatMoney } from '@/lib/format';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'stats'], queryFn: adminService.stats });

  if (isLoading || !data) {
    return (
      <>
        <AdminHeader title="Dashboard" subtitle="Loading…" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Panel key={i} className="h-24 animate-pulse" />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Everything the storefront shows, at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={data.products} hint={`${data.unavailable} hidden · ${data.featured} featured`} />
        <StatCard label="Categories" value={data.categories} hint={`${data.hiddenCategories} hidden`} />
        <StatCard label="Offers" value={data.offers} hint={`${data.activeOffers} active`} />
        <StatCard label="Reviews" value={data.reviews} hint={`${data.pendingReviews} pending approval`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Panel className="p-5">
          <h2 className="text-sm font-semibold text-white">Products by category</h2>
          <ul className="mt-3 space-y-2">
            {data.byCategory.map((c) => (
              <li key={c.category} className="flex items-center justify-between text-sm">
                <span className="capitalize text-white/70">{c.category}</span>
                <span className="font-mono text-white">{c.count}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Latest reviews</h2>
            <Link to="/admin/reviews" className="text-xs text-indigo-400 hover:underline">
              Manage
            </Link>
          </div>
          {data.recentReviews.length === 0 ? (
            <p className="mt-3 text-sm text-white/40">No reviews yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {data.recentReviews.map((r) => (
                <li key={r.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{r.name}</span>
                    <span className="text-amber-300">{'★'.repeat(r.rating)}</span>
                    {!r.isApproved && <Badge tone="warn">pending</Badge>}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-white/50">{r.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel className="mt-4">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <h2 className="text-sm font-semibold text-white">Recently added products</h2>
          <Link to="/admin/products" className="text-xs text-indigo-400 hover:underline">
            All products
          </Link>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {data.recentProducts.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3">
                  <Link to={`/admin/products/${p.id}`} className="font-medium text-white hover:text-indigo-300">
                    {p.name}
                  </Link>
                </td>
                <td className="px-5 py-3 capitalize text-white/50">{p.category}</td>
                <td className="px-5 py-3 font-mono text-white/70">{formatMoney(p.price)}</td>
                <td className="px-5 py-3">
                  {p.isAvailable ? <Badge tone="ok">live</Badge> : <Badge tone="off">hidden</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
