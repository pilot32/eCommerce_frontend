import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import IconButton from './IconButton';

/**
 * Centered modal dialog rendered in a portal.
 * Closes on overlay click and Escape; locks body scroll while open.
 */
export default function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-lg' }) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const timer = setTimeout(() => setMounted(false), 250);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300',
          shown ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-card bg-ivory shadow-lift transition-all duration-300',
          maxWidth,
          shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-sand/70 px-5 py-4">
            <h2 className="font-heading text-lg text-ink">{title}</h2>
            <IconButton label="Close" variant="soft" size="sm" onClick={onClose}>
              <X size={18} />
            </IconButton>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && <div className="border-t border-sand/70 bg-cream p-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
