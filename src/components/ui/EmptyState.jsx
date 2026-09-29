import { cn } from '../../utils/cn';
import Button from './Button';
import Icon from './Icon';

/**
 * Friendly empty state — used for empty cart/wishlist, no orders,
 * no products and no search results.
 */
export default function EmptyState({
  icon = 'PackageOpen',
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  secondary,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}>
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gold-glow text-gold-dark">
        <Icon name={icon} size={34} strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-2xl text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-md text-ink-soft">{description}</p>}
      {actionLabel && (actionTo || onAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button to={actionTo} onClick={onAction}>
            {actionLabel}
          </Button>
          {secondary}
        </div>
      )}
    </div>
  );
}
