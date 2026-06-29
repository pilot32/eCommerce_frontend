import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/format';
import { getEffectivePrice, getDiscountPercent } from '../../utils/product';

const SIZES = {
  sm: { cur: 'text-base', orig: 'text-xs' },
  md: { cur: 'text-lg', orig: 'text-sm' },
  lg: { cur: 'text-2xl', orig: 'text-base' },
};

/**
 * Renders current price, struck-through original price and discount %.
 */
export default function PriceTag({ product, size = 'md', showDiscount = true, className }) {
  const effective = getEffectivePrice(product);
  const hasDiscount = product.discountedPrice != null && product.discountedPrice < product.price;
  const pct = getDiscountPercent(product);
  const s = SIZES[size] || SIZES.md;

  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn('font-accent font-semibold text-ink', s.cur)}>
        {formatCurrency(effective)}
      </span>
      {hasDiscount && (
        <span className={cn('text-ink-mute line-through', s.orig)}>{formatCurrency(product.price)}</span>
      )}
      {hasDiscount && showDiscount && pct > 0 && (
        <span className={cn('font-accent font-semibold text-maroon', s.orig)}>{pct}% OFF</span>
      )}
    </div>
  );
}
