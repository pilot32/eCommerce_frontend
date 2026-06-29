import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/format';
import { CATEGORIES, SUBCATEGORY_LOOKUP, PRICE_RANGE } from '../../constants/shop';

/** A single removable filter pill. */
function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-cream py-1 pl-3 pr-1.5 font-accent text-sm text-ink-soft">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="flex h-6 w-6 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-gold-glow hover:text-gold-dark"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </span>
  );
}

/**
 * Removable chips summarising every active filter, plus a "Clear all".
 * Renders nothing when no filters are applied.
 *
 * @param {object} props
 * @param {object} props.filters
 * @param {(patch: object) => void} props.onChange
 * @param {() => void} props.onClearAll
 */
export default function ActiveFilters({ filters, onChange, onClearAll, className }) {
  const chips = [];

  if (filters.category) {
    const cat = CATEGORIES.find((c) => c.slug === filters.category);
    chips.push({
      key: `cat-${filters.category}`,
      label: cat ? cat.name : filters.category,
      // Removing the category also drops its subcategories.
      onRemove: () => onChange({ category: undefined, subcategories: [] }),
    });
  }

  filters.subcategories.forEach((slug) => {
    const sub = SUBCATEGORY_LOOKUP[slug];
    chips.push({
      key: `sub-${slug}`,
      label: sub ? sub.name : slug,
      onRemove: () =>
        onChange({ subcategories: filters.subcategories.filter((s) => s !== slug) }),
    });
  });

  filters.sizes.forEach((size) => {
    chips.push({
      key: `size-${size}`,
      label: `Size ${size}`,
      onRemove: () => onChange({ sizes: filters.sizes.filter((s) => s !== size) }),
    });
  });

  const hasMin = filters.minPrice != null && filters.minPrice > PRICE_RANGE.min;
  const hasMax = filters.maxPrice != null && filters.maxPrice < PRICE_RANGE.max;
  if (hasMin || hasMax) {
    const min = filters.minPrice != null ? filters.minPrice : PRICE_RANGE.min;
    const max = filters.maxPrice != null ? filters.maxPrice : PRICE_RANGE.max;
    chips.push({
      key: 'price',
      label: `${formatCurrency(min)} – ${formatCurrency(max)}`,
      onRemove: () => onChange({ minPrice: undefined, maxPrice: undefined }),
    });
  }

  if (filters.inStockOnly) {
    chips.push({
      key: 'stock',
      label: 'In stock',
      onRemove: () => onChange({ inStockOnly: false }),
    });
  }

  if (filters.search) {
    chips.push({
      key: 'search',
      label: `“${filters.search}”`,
      onRemove: () => onChange({ search: '' }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {chips.map((chip) => (
        <Chip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 font-accent text-sm font-medium text-gold-dark underline-offset-2 transition-colors hover:text-ink hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
