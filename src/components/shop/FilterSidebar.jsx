import { useId } from 'react';
import { cn } from '../../utils/cn';
import { CATEGORIES, SIZES, PRICE_RANGE } from '../../constants/shop';
import Input from '../ui/Input';

/**
 * Controlled filter panel for the shop. State lives in the Shop page; this
 * component only renders the current filters and calls back on every change.
 *
 * @param {object} props
 * @param {object} props.filters - { category, subcategories[], sizes[], minPrice, maxPrice, inStockOnly, search }
 * @param {(patch: object) => void} props.onChange - merges a partial filter patch
 * @param {() => void} props.onClearAll
 */
export default function FilterSidebar({ filters, onChange, onClearAll, className }) {
  const inStockId = useId();
  const minId = useId();
  const maxId = useId();

  // Subcategories for the currently selected category (none when "All").
  const activeCategory = CATEGORIES.find((c) => c.slug === filters.category);
  const subcategories = activeCategory ? activeCategory.subcategories : [];

  const setCategory = (slug) => {
    // Changing category clears any subcategory selection that no longer applies.
    onChange({ category: slug || undefined, subcategories: [] });
  };

  const toggleSubcategory = (slug) => {
    const next = filters.subcategories.includes(slug)
      ? filters.subcategories.filter((s) => s !== slug)
      : [...filters.subcategories, slug];
    onChange({ subcategories: next });
  };

  const toggleSize = (size) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ sizes: next });
  };

  const setMinPrice = (raw) => {
    const v = raw === '' ? undefined : Math.max(PRICE_RANGE.min, Number(raw));
    onChange({ minPrice: v });
  };

  const setMaxPrice = (raw) => {
    const v = raw === '' ? undefined : Math.min(PRICE_RANGE.max, Number(raw));
    onChange({ maxPrice: v });
  };

  return (
    <div className={cn('space-y-8', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg text-ink">Filters</h3>
        <button
          type="button"
          onClick={onClearAll}
          className="font-accent text-sm text-gold-dark transition-colors hover:text-ink"
        >
          Clear all
        </button>
      </div>

      {/* Category — single select */}
      <fieldset className="space-y-3">
        <legend className="mb-1 font-accent text-sm font-semibold uppercase tracking-[0.12em] text-ink">
          Category
        </legend>
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-ink-soft">
          <input
            type="radio"
            name="shop-category"
            checked={!filters.category}
            onChange={() => setCategory('')}
            className="h-4 w-4 accent-gold"
          />
          <span>All</span>
        </label>
        {CATEGORIES.map((cat) => (
          <label
            key={cat.slug}
            className="flex min-h-11 cursor-pointer items-center gap-2.5 text-ink-soft"
          >
            <input
              type="radio"
              name="shop-category"
              checked={filters.category === cat.slug}
              onChange={() => setCategory(cat.slug)}
              className="h-4 w-4 accent-gold"
            />
            <span>{cat.name}</span>
          </label>
        ))}
      </fieldset>

      {/* Subcategory — only for the selected category */}
      {subcategories.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="mb-1 font-accent text-sm font-semibold uppercase tracking-[0.12em] text-ink">
            {activeCategory.name} Types
          </legend>
          {subcategories.map((sub) => (
            <label
              key={sub.slug}
              className="flex min-h-11 cursor-pointer items-center gap-2.5 text-ink-soft"
            >
              <input
                type="checkbox"
                checked={filters.subcategories.includes(sub.slug)}
                onChange={() => toggleSubcategory(sub.slug)}
                className="h-4 w-4 rounded accent-gold"
              />
              <span>{sub.name}</span>
            </label>
          ))}
        </fieldset>
      )}

      {/* Price range */}
      <div className="space-y-3">
        <h4 className="font-accent text-sm font-semibold uppercase tracking-[0.12em] text-ink">
          Price
        </h4>
        <div className="flex items-end gap-3">
          <Input
            id={minId}
            label="Min"
            type="number"
            min={PRICE_RANGE.min}
            max={PRICE_RANGE.max}
            step={PRICE_RANGE.step}
            placeholder={`${PRICE_RANGE.min}`}
            value={filters.minPrice ?? ''}
            onChange={(e) => setMinPrice(e.target.value)}
            className="py-2.5"
          />
          <span className="pb-3 text-ink-mute" aria-hidden="true">
            –
          </span>
          <Input
            id={maxId}
            label="Max"
            type="number"
            min={PRICE_RANGE.min}
            max={PRICE_RANGE.max}
            step={PRICE_RANGE.step}
            placeholder={`${PRICE_RANGE.max}`}
            value={filters.maxPrice ?? ''}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="py-2.5"
          />
        </div>
      </div>

      {/* Size — toggle chips */}
      <fieldset className="space-y-3">
        <legend className="mb-1 font-accent text-sm font-semibold uppercase tracking-[0.12em] text-ink">
          Size
        </legend>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                onClick={() => toggleSize(size)}
                className={cn(
                  'flex h-11 min-w-11 items-center justify-center rounded-btn border px-3.5',
                  'font-accent text-sm transition-colors',
                  active
                    ? 'border-gold bg-gold text-ink shadow-soft'
                    : 'border-sand bg-cream text-ink-soft hover:border-gold'
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="font-accent text-sm font-semibold uppercase tracking-[0.12em] text-ink">
          Availability
        </h4>
        <label
          htmlFor={inStockId}
          className="flex min-h-11 cursor-pointer items-center gap-2.5 text-ink-soft"
        >
          <input
            id={inStockId}
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            className="h-4 w-4 rounded accent-gold"
          />
          <span>In stock only</span>
        </label>
      </div>
    </div>
  );
}
