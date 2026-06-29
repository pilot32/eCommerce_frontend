import { cn } from '../../utils/cn';

/**
 * Circular icon button (header actions, wishlist toggle, carousel arrows…).
 * `label` is required for accessibility. Optional numeric `badge` shows a count.
 */
const SIZES = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11', // 44px touch target
  lg: 'h-12 w-12',
};

const VARIANTS = {
  ghost: 'text-ink hover:bg-beige',
  soft: 'bg-beige text-ink hover:bg-sand',
  gold: 'bg-gold text-ink hover:bg-gold-dark shadow-soft',
  outline: 'border border-sand text-ink hover:border-gold hover:text-gold-dark bg-cream/70',
};

export default function IconButton({
  label,
  variant = 'ghost',
  size = 'md',
  badge,
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        SIZES[size],
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-semibold text-cream">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}
