import { cn } from '../../utils/cn';

/**
 * Minimal spinner that inherits the current text color (border-current),
 * so it looks right on any background.
 */
export default function Spinner({ size = 20, className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent align-[-0.125em]',
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
