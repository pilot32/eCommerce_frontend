import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import IconButton from './IconButton';
import useDialogFocus from '../../hooks/useDialogFocus';

/**
 * Centered modal dialog rendered in a portal.
 * Closes on overlay click and Escape; locks body scroll while open.
 */
export default function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-lg' }) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const panelRef = useRef(null);

  useDialogFocus(open && mounted, panelRef, onClose);

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
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
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
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-card bg-ivory shadow-lift transition-all duration-300',
          maxWidth,
          shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'
        )}
      >
        {title && (
          <div className="flex shrink-0 items-center justify-between border-b border-sand/70 px-5 py-4">
            <h2 className="font-heading text-lg text-ink">{title}</h2>
            <IconButton label="Close" variant="soft" size="sm" onClick={onClose}>
              <X size={18} />
            </IconButton>
          </div>
        )}
        <div className="min-h-0 overflow-y-auto overscroll-contain p-5">{children}</div>
        {footer && <div className="shrink-0 border-t border-sand/70 bg-cream p-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
