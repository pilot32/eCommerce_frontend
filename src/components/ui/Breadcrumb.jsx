import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Breadcrumb trail. `items` = [{ label, to? }]; the last item is the current page.
 */
export default function Breadcrumb({ items = [], className }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex flex-wrap items-center gap-1.5 font-accent text-sm text-ink-mute', className)}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
            {item.to && !last ? (
              <Link to={item.to} className="transition-colors hover:text-gold-dark">
                {item.label}
              </Link>
            ) : (
              <span className={cn(last && 'text-ink-soft')} aria-current={last ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!last && <ChevronRight size={14} className="text-sand" />}
          </span>
        );
      })}
    </nav>
  );
}
