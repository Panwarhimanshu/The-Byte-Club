import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { adminService, type ProductInput } from '@/services/admin.service';
import { AdminHeader, Panel, Toggle, adminBtn, adminBtnGhost, adminInput, adminInputBase } from '@/components/admin/kit';
import { useUIStore } from '@/store/uiStore';
import { slugify } from '@/lib/slug';
import type { AddOn, OptionGroup, Product } from '@/types';

const BLANK: ProductInput = {
  name: '',
  slug: '',
  description: '',
  longDescription: '',
  price: 199,
  category: '',
  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=75&auto=format&fit=crop',
  gallery: [],
  ingredients: [],
  tags: [],
  isVeg: false,
  isBestseller: false,
  isFeatured: false,
  isAvailable: true,
  spiceLevel: 0,
  prepTimeMins: 8,
  optionGroups: [],
  addOns: [],
  seo: {},
};

const rid = () => Math.random().toString(36).slice(2, 8);

export default function ProductFormPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useUIStore((s) => s.toast);

  const { data: products = [] } = useQuery({ queryKey: ['admin', 'products'], queryFn: adminService.listProducts });
  const { data: categories = [] } = useQuery({ queryKey: ['admin', 'categories'], queryFn: adminService.listCategories });

  const existing = useMemo(() => products.find((p) => p.id === id), [products, id]);
  const [form, setForm] = useState<ProductInput>(BLANK);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      const { id: _i, rating: _r, ratingCount: _rc, ...rest } = existing as Product;
      setForm({ ...BLANK, ...rest });
    } else if (isNew && categories[0] && !form.category) {
      setForm((f) => ({ ...f, category: categories[0].slug }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing, categories]);

  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const csv = (v: string) => v.split(',').map((s) => s.trim()).filter(Boolean);

  /* option groups */
  const setGroup = (gi: number, patch: Partial<OptionGroup>) =>
    set('optionGroups', form.optionGroups!.map((g, i) => (i === gi ? { ...g, ...patch } : g)));
  const addGroup = () =>
    set('optionGroups', [
      ...form.optionGroups!,
      { id: `grp_${rid()}`, name: 'New group', required: true, multiple: false, choices: [] },
    ]);
  const setChoice = (gi: number, ci: number, patch: Partial<OptionGroup['choices'][number]>) =>
    setGroup(gi, { choices: form.optionGroups![gi].choices.map((c, i) => (i === ci ? { ...c, ...patch } : c)) });
  const addChoice = (gi: number) =>
    setGroup(gi, {
      choices: [...form.optionGroups![gi].choices, { id: `ch_${rid()}`, label: 'Option', priceDelta: 0 }],
    });

  /* add-ons */
  const setAddOn = (ai: number, patch: Partial<AddOn>) =>
    set('addOns', form.addOns!.map((a, i) => (i === ai ? { ...a, ...patch } : a)));
  const addAddOn = () => set('addOns', [...form.addOns!, { id: `add_${rid()}`, label: 'Add-on', price: 20 }]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.category) {
      toast({ variant: 'error', title: 'Name, description and category are required' });
      return;
    }
    setSaving(true);
    try {
      const payload: ProductInput = { ...form, slug: form.slug || slugify(form.name) };
      if (isNew) await adminService.createProduct(payload);
      else await adminService.updateProduct(id!, payload);
      qc.invalidateQueries({ queryKey: ['admin'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['product'] });
      toast({ variant: 'success', title: isNew ? 'Product created' : 'Saved' });
      navigate('/admin/products');
    } catch (err) {
      toast({ variant: 'error', title: 'Save failed', description: err instanceof Error ? err.message : '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => navigate('/admin/products')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft size={14} /> Products
      </button>
      <AdminHeader title={isNew ? 'New product' : `Edit · ${form.name || '…'}`} />

      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* main column */}
        <div className="space-y-4">
          <Panel className="space-y-4 p-5">
            <L label="Name">
              <input
                className={adminInput}
                value={form.name}
                onChange={(e) => {
                  set('name', e.target.value);
                  if (isNew) set('slug', slugify(e.target.value));
                }}
              />
            </L>
            <L label="Slug (URL)">
              <input className={adminInput} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
            </L>
            <L label="Short description">
              <textarea
                className={`${adminInput} min-h-[64px]`}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </L>
            <L label="Long description">
              <textarea
                className={`${adminInput} min-h-[96px]`}
                value={form.longDescription ?? ''}
                onChange={(e) => set('longDescription', e.target.value)}
              />
            </L>
            <div className="grid grid-cols-3 gap-3">
              <L label="Price (₹)">
                <input type="number" className={adminInput} value={form.price} onChange={(e) => set('price', Number(e.target.value))} />
              </L>
              <L label="Prep (min)">
                <input type="number" className={adminInput} value={form.prepTimeMins} onChange={(e) => set('prepTimeMins', Number(e.target.value))} />
              </L>
              <L label="kcal">
                <input type="number" className={adminInput} value={form.kcal ?? ''} onChange={(e) => set('kcal', e.target.value ? Number(e.target.value) : undefined)} />
              </L>
            </div>
            <L label="Ingredients (comma-separated)">
              <input className={adminInput} value={(form.ingredients ?? []).join(', ')} onChange={(e) => set('ingredients', csv(e.target.value))} />
            </L>
            <L label="Tags (comma-separated)">
              <input className={adminInput} value={(form.tags ?? []).join(', ')} onChange={(e) => set('tags', csv(e.target.value))} />
            </L>
          </Panel>

          {/* option groups */}
          <Panel className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Option groups</h2>
              <button type="button" onClick={addGroup} className={adminBtnGhost}>
                <Plus size={14} /> Group
              </button>
            </div>
            {form.optionGroups!.length === 0 && <p className="text-xs text-white/35">None. Shown on the product page as “make it yours”.</p>}
            {form.optionGroups!.map((g, gi) => (
              <div key={g.id} className="rounded-lg border border-white/10 bg-[#0f1012] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className={`${adminInputBase} flex-1`}
                    value={g.name}
                    onChange={(e) => setGroup(gi, { name: e.target.value })}
                  />
                  <label className="flex items-center gap-1.5 text-xs text-white/60">
                    <input type="checkbox" checked={g.required} onChange={(e) => setGroup(gi, { required: e.target.checked })} /> required
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-white/60">
                    <input type="checkbox" checked={g.multiple} onChange={(e) => setGroup(gi, { multiple: e.target.checked })} /> multi
                  </label>
                  <button
                    type="button"
                    onClick={() => set('optionGroups', form.optionGroups!.filter((_, i) => i !== gi))}
                    className="grid h-7 w-7 place-items-center rounded text-white/40 hover:text-rose-300"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="mt-2 space-y-1.5">
                  {g.choices.map((c, ci) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <input
                        className={`${adminInputBase} flex-1`}
                        value={c.label}
                        onChange={(e) => setChoice(gi, ci, { label: e.target.value })}
                      />
                      <input
                        type="number"
                        className={`${adminInputBase} w-24`}
                        value={c.priceDelta}
                        onChange={(e) => setChoice(gi, ci, { priceDelta: Number(e.target.value) })}
                        title="Price delta ₹"
                      />
                      <label className="flex items-center gap-1 text-[11px] text-white/50">
                        <input type="checkbox" checked={!!c.isDefault} onChange={(e) => setChoice(gi, ci, { isDefault: e.target.checked })} /> def
                      </label>
                      <button
                        type="button"
                        onClick={() => setGroup(gi, { choices: g.choices.filter((_, i) => i !== ci) })}
                        className="text-white/30 hover:text-rose-300"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addChoice(gi)} className="text-xs text-indigo-400 hover:underline">
                    + choice
                  </button>
                </div>
              </div>
            ))}
          </Panel>

          {/* add-ons */}
          <Panel className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Add-ons</h2>
              <button type="button" onClick={addAddOn} className={adminBtnGhost}>
                <Plus size={14} /> Add-on
              </button>
            </div>
            {form.addOns!.map((a, ai) => (
              <div key={a.id} className="flex items-center gap-2">
                <input className={`${adminInputBase} flex-1`} value={a.label} onChange={(e) => setAddOn(ai, { label: e.target.value })} />
                <input
                  type="number"
                  className={`${adminInputBase} w-24`}
                  value={a.price}
                  onChange={(e) => setAddOn(ai, { price: Number(e.target.value) })}
                />
                <button type="button" onClick={() => set('addOns', form.addOns!.filter((_, i) => i !== ai))} className="text-white/30 hover:text-rose-300">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </Panel>
        </div>

        {/* side column */}
        <div className="space-y-4">
          <Panel className="space-y-4 p-5">
            <L label="Category">
              <select className={adminInput} value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="" disabled>
                  Choose…
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </L>
            <L label="Main image URL">
              <input className={adminInput} value={form.image} onChange={(e) => set('image', e.target.value)} />
            </L>
            {form.image && <img src={form.image} alt="" className="h-32 w-full rounded-lg object-cover" />}
            <L label="Gallery URLs (one per line)">
              <textarea
                className={`${adminInput} min-h-[64px]`}
                value={(form.gallery ?? []).join('\n')}
                onChange={(e) => set('gallery', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
              />
            </L>
            <L label="Spice level (0–3)">
              <input
                type="number"
                min={0}
                max={3}
                className={adminInput}
                value={form.spiceLevel ?? 0}
                onChange={(e) => set('spiceLevel', Math.max(0, Math.min(3, Number(e.target.value))) as 0 | 1 | 2 | 3)}
              />
            </L>
          </Panel>

          <Panel className="space-y-3 p-5">
            {(
              [
                ['isVeg', 'Vegetarian'],
                ['isBestseller', 'Bestseller'],
                ['isFeatured', 'Featured on home'],
                ['isAvailable', 'Available (visible)'],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between text-sm text-white/70">
                {label}
                <Toggle checked={Boolean(form[key])} onChange={(v) => set(key, v as never)} label={label} />
              </div>
            ))}
          </Panel>

          <Panel className="space-y-3 p-5">
            <h2 className="text-sm font-semibold text-white">SEO</h2>
            <L label="SEO title">
              <input
                className={adminInput}
                value={form.seo?.title ?? ''}
                onChange={(e) => set('seo', { ...form.seo, title: e.target.value })}
              />
            </L>
            <L label="SEO description">
              <textarea
                className={`${adminInput} min-h-[56px]`}
                value={form.seo?.description ?? ''}
                onChange={(e) => set('seo', { ...form.seo, description: e.target.value })}
              />
            </L>
          </Panel>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={`${adminBtn} flex-1`}>
              {saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className={adminBtnGhost}>
              Cancel
            </button>
          </div>
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
