import { cn } from '../../utils/cn';

const VARIANTS = {
  sale: 'bg-maroon text-cream',
  new: 'bg-teal text-cream',
  gold: 'bg-gold text-ink',
  soft: 'bg-gold-glow text-gold-dark',
  neutral: 'bg-beige text-ink-soft',
  outOfStock: 'bg-ink/75 text-cream',
};

/**
 * Small pill label — discount badges, "New", stock status, etc.
 */
export default function Badge({ variant = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 font-accent text-[11px] font-semibold tracking-wide',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
