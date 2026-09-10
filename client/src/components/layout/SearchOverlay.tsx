import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useProducts } from '@/hooks/queries';
import { useDebounce } from '@/hooks/useDebounce';
import { useScrollLock } from '@/hooks/useScrollLock';
import { SmartImage } from '@/components/ui/SmartImage';
import { VegBadge } from '@/components/ui/VegBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatMoney } from '@/lib/format';
import { track } from '@/lib/analytics';
import { microcopy } from '@/data/brand';

const QUICK = ['Burgers', 'Spicy', 'Paneer', 'Combo', 'Shake', 'Vegan'];

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);
  const navigate = useNavigate();
  useScrollLock(searchOpen);

  const { data: allProducts = [] } = useProducts({ category: 'all' });

  const results = useMemo(() => {
    const term = debounced.toLowerCase().trim();
    if (!term) return [];
    return allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.includes(term) ||
          p.tags.some((t) => t.includes(term)),
      )
      .slice(0, 8);
  }, [debounced, allProducts]);

  useEffect(() => {
    if (!searchOpen) setQuery('');
  }, [searchOpen]);

  useEffect(() => {
    if (debounced.trim().length > 2) track('search', { term: debounced });
  }, [debounced]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeSearch();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen, closeSearch]);

  const go = (slug: string) => {
    closeSearch();
    navigate(`/menu/p/${slug}`);
  };

  return createPortal(
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-[95] flex flex-col items-center px-4 pt-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-bg/85 backdrop-blur-lg" onClick={closeSearch} aria-hidden />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-lift"
            role="dialog"
            aria-modal="true"
            aria-label="Search the menu"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search size={18} className="text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={microcopy.searchPlaceholder}
                className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/70"
                aria-label="Search"
              />
              <button
                onClick={closeSearch}
                aria-label="Close search"
                className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-fg btn-focus"
              >
                <X size={15} />
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {!debounced.trim() && (
                <div className="p-3">
                  <p className="eyebrow mb-3">Try</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK.map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuery(q)}
                        className="rounded-pill border border-border px-3 py-1.5 text-xs font-semibold transition hover:border-primary hover:text-primary btn-focus"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {debounced.trim() && results.length === 0 && (
                <div className="py-8">
                  <EmptyState
                    title="Nothing matched that"
                    hint={`No menu items for “${debounced}”. Try a broader term.`}
                    command={`byte search "${debounced}"`}
                  />
                </div>
              )}

              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => go(p.slug)}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-card btn-focus"
                >
                  <div className="h-11 w-11 overflow-hidden rounded-lg">
                    <SmartImage src={p.image} alt={p.name} width={96} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      <VegBadge isVeg={p.isVeg} />
                      <span className="truncate">{p.name}</span>
                    </p>
                    <p className="truncate text-xs capitalize text-muted">{p.category}</p>
                  </div>
                  <span className="font-mono text-xs text-muted">{formatMoney(p.price)}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted">
              <span>Search across the menu</span>
              <span className="flex items-center gap-1">
                <CornerDownLeft size={12} /> to open
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
