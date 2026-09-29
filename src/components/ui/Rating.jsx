import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Star rating display (read-only). Rounds to the nearest whole star.
 */
export default function Rating({ value = 0, count, size = 14, showValue = true, className }) {
  const filled = Math.round(value);

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="inline-flex" aria-label={`Rated ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= filled ? 'fill-gold text-gold' : 'fill-sand text-sand'}
          />
        ))}
      </span>
      {showValue && (
        <span className="font-accent text-xs font-semibold text-ink-soft">{Number(value).toFixed(1)}</span>
      )}
      {count != null && <span className="font-accent text-xs text-ink-mute">({count})</span>}
    </div>
  );
}
