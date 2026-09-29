import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import IconButton from './IconButton';

const SIDE = {
  left: { pos: 'left-0 top-0 h-full', closed: '-translate-x-full', open: 'translate-x-0', size: 'w-[88%] max-w-sm' },
  right: { pos: 'right-0 top-0 h-full', closed: 'translate-x-full', open: 'translate-x-0', size: 'w-[90%] max-w-md' },
  bottom: { pos: 'inset-x-0 bottom-0 w-full', closed: 'translate-y-full', open: 'translate-y-0', size: 'max-h-[85vh] rounded-t-card' },
};

/**
 * Slide-in panel rendered in a portal. Used for the mobile nav (left),
 * the cart/filters (right) and the mobile filter sheet (bottom).
 * Closes on overlay click and Escape; locks body scroll while open.
 */
export default function Drawer({ open, onClose, side = 'right', title, children, footer, panelClassName }) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const timer = setTimeout(() => setMounted(false), 300);
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
  const s = SIDE[side];

  return createPortal(
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={title || 'Panel'}>
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300',
          shown ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={cn(
          'absolute flex flex-col bg-ivory shadow-lift transition-transform duration-300 ease-out',
          s.pos,
          s.size,
          shown ? s.open : s.closed,
          panelClassName
        )}
      >
        <div className="flex items-center justify-between border-b border-sand/70 px-5 py-4">
          <h2 className="font-heading text-lg text-ink">{title}</h2>
          <IconButton label="Close" variant="soft" size="sm" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-sand/70 bg-cream p-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
