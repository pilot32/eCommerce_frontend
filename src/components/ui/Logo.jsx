import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { BRAND } from '../../constants/brand';

const SIZES = {
  sm: 'text-lg sm:text-xl',
  md: 'text-2xl',
  lg: 'text-3xl sm:text-4xl',
};

/**
 * Golden Wornora wordmark with the "by keerti" sub-label.
 */
export default function Logo({ size = 'md', to = '/', className }) {
  return (
    <Link
      to={to}
      className={cn('group inline-flex flex-col leading-none', className)}
      aria-label={`${BRAND.name} — home`}
    >
      <span className={cn('text-gold-gradient font-heading font-semibold tracking-wide', SIZES[size])}>
        {BRAND.name}
      </span>
      <span className="mt-0.5 self-end font-accent text-[10px] uppercase tracking-[0.3em] text-ink-mute">
        {BRAND.tagline}
      </span>
    </Link>
  );
}
