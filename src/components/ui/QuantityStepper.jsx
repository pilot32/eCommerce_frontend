import { Minus, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';

const SIZES = { sm: 'h-9', md: 'h-11' };

/**
 * Controlled quantity stepper used on the product page and in the cart.
 */
export default function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md', className }) {
  const btn =
    'flex aspect-square h-full items-center justify-center text-ink transition-colors hover:bg-beige disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div
      className={cn(
        'inline-flex items-center overflow-hidden rounded-btn border border-sand bg-cream',
        SIZES[size],
        className
      )}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span className="min-w-[2.5rem] text-center font-accent text-sm font-semibold text-ink" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
