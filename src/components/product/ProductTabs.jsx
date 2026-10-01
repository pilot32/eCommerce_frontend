import { useState } from 'react';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/format';
import { isInStock } from '../../utils/product';
import { FREE_DELIVERY_THRESHOLD } from '../../constants/sampleData';

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'returns', label: 'Returns' },
];

/** A labelled spec row inside the Description panel. */
function Spec({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-sand/60 py-2.5 last:border-0">
      <dt className="font-accent text-sm text-ink-mute">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

/** A simple bulleted point used in Delivery & Returns panels. */
function Point({ children }) {
  return (
    <li className="flex gap-2.5">
      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
      <span className="text-ink-soft">{children}</span>
    </li>
  );
}

/**
 * Tabbed detail panel beneath the product columns — Description (with a small
 * spec list), Delivery and Returns. Accessible tab pattern: each tab button
 * exposes aria-selected and controls its panel.
 */
export default function ProductTabs({ product, className }) {
  const [active, setActive] = useState('description');

  const inStock = isInStock(product);

  return (
    <div className={cn('rounded-card border border-sand/60 bg-cream', className)}>
      {/* Tab list */}
      <div role="tablist" aria-label="Product details" className="flex border-b border-sand/60">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={cn(
                'relative h-12 px-5 font-accent text-sm font-semibold transition-colors sm:px-7',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-inset',
                isActive ? 'text-ink' : 'text-ink-mute hover:text-ink'
              )}
            >
              {tab.label}
              {isActive && (
                <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-0.5 bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div className="p-6 sm:p-8">
        {active === 'description' && (
          <div
            role="tabpanel"
            id="panel-description"
            aria-labelledby="tab-description"
            className="animate-fade-in"
          >
            <p className="max-w-prose leading-relaxed text-ink-soft">
              {product.description ||
                'A thoughtfully crafted piece from the Wornora collection, made to celebrate timeless Indian elegance.'}
            </p>
            <dl className="mt-6 max-w-md">
              {product.material && <Spec label="Material" value={product.material} />}
              <Spec label="Category" value={product.categoryName} />
              {product.subcategoryName && <Spec label="Subcategory" value={product.subcategoryName} />}
              {product.style && <Spec label="Style" value={product.style} />}
              {product.colors?.length > 0 && (
                <Spec label="Colors" value={product.colors.map((color) => color.name).join(', ')} />
              )}
              {product.sizes?.length > 0 && <Spec label="Sizes" value={product.sizes.join(', ')} />}
              {product.tags?.length > 0 && <Spec label="Tags" value={product.tags.join(', ')} />}
              <Spec label="Availability" value={inStock ? 'In stock' : 'Out of stock'} />
            </dl>
            {product.careInstructions && (
              <div className="mt-6 max-w-prose rounded-card border border-sand/60 bg-ivory p-4">
                <p className="font-accent text-sm font-semibold text-ink">Care Instructions</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{product.careInstructions}</p>
              </div>
            )}
          </div>
        )}

        {active === 'delivery' && (
          <div
            role="tabpanel"
            id="panel-delivery"
            aria-labelledby="tab-delivery"
            className="animate-fade-in"
          >
            <ul className="max-w-prose space-y-3">
              <Point>
                Free delivery on orders above {formatCurrency(FREE_DELIVERY_THRESHOLD)}.
              </Point>
              <Point>Dispatched within 1–2 business days of placing your order.</Point>
              <Point>Estimated delivery in 3–5 business days across India.</Point>
              <Point>Cash on delivery available on eligible pin codes.</Point>
            </ul>
          </div>
        )}

        {active === 'returns' && (
          <div
            role="tabpanel"
            id="panel-returns"
            aria-labelledby="tab-returns"
            className="animate-fade-in"
          >
            <ul className="max-w-prose space-y-3">
              <Point>7-day easy returns &amp; exchange from the date of delivery.</Point>
              <Point>
                Items must be unworn, unwashed and returned with original tags and packaging.
              </Point>
              <Point>
                Refunds are processed to the original payment method within 5–7 business days.
              </Point>
              <Point>For hygiene reasons, jewellery returns are accepted only if unopened.</Point>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
