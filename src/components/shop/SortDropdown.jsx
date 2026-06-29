import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SORT_OPTIONS } from '../../constants/shop';

/**
 * Sort control for the shop grid — a styled native <select> for reliability
 * and accessibility. Labelled for screen readers; the visible label sits inline.
 *
 * @param {object} props
 * @param {string} props.value - current SORT_OPTIONS value
 * @param {(value: string) => void} props.onChange
 */
export default function SortDropdown({ value, onChange, className }) {
  const selectId = useId();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label
        htmlFor={selectId}
        className="hidden font-accent text-sm text-ink-mute sm:inline"
      >
        Sort by
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Sort products"
          className={cn(
            'h-11 appearance-none rounded-input border border-sand bg-cream pl-4 pr-10',
            'font-accent text-sm text-ink transition-colors',
            'focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 hover:border-gold'
          )}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-mute"
        />
      </div>
    </div>
  );
}
