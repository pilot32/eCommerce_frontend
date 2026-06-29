import Spinner from './Spinner';
import { cn } from '../../utils/cn';

/**
 * Fallback shown while a lazy-loaded route chunk is fetched.
 * `fullScreen` is used for standalone routes; the inline variant keeps the
 * storefront header/footer visible while the page content loads.
 */
export default function PageLoader({ fullScreen = false }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullScreen ? 'min-h-screen bg-ivory' : 'min-h-[60vh]'
      )}
    >
      <div className="flex flex-col items-center gap-3 text-gold-dark">
        <Spinner size={32} />
        <span className="font-accent text-sm text-ink-mute">Loading…</span>
      </div>
    </div>
  );
}
