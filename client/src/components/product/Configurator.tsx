import type { Product } from '@/types';
import { formatMoney } from '@/lib/format';

/**
 * Read-only view of how a product can be built at the counter / on the app.
 * This is a showcase site — nothing here is interactive or added to a cart.
 */
export function CustomiseInfo({ product }: { product: Product }) {
  const hasAny = product.optionGroups.length > 0 || product.addOns.length > 0;
  if (!hasAny) return null;

  return (
    <div className="space-y-6">
      <p className="eyebrow">
        <span className="h-1.5 w-1.5 bg-primary" /> Make it yours
      </p>

      {product.optionGroups.map((group) => (
        <div key={group.id}>
          <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wide">
            {group.name}
            <span className="ml-2 font-mono text-[10px] font-normal text-muted">
              {group.required ? 'pick one' : 'optional'}
            </span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {group.choices.map((choice) => (
              <span
                key={choice.id}
                className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-bg px-3 py-1.5 text-xs text-fg/85"
              >
                {choice.label}
                {choice.priceDelta !== 0 && (
                  <span className="font-mono text-[11px] text-muted">
                    {choice.priceDelta > 0 ? '+' : '−'}
                    {formatMoney(Math.abs(choice.priceDelta))}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}

      {product.addOns.length > 0 && (
        <div>
          <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wide">Add-ons</h3>
          <div className="flex flex-wrap gap-1.5">
            {product.addOns.map((addOn) => (
              <span
                key={addOn.id}
                className="inline-flex items-center gap-1.5 rounded-pill border border-secondary/40 bg-secondary/5 px-3 py-1.5 text-xs text-fg/85"
              >
                {addOn.label}
                <span className="font-mono text-[11px] text-muted">+{formatMoney(addOn.price)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
