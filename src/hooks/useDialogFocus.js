import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Keeps keyboard focus inside a modal surface and returns it to its trigger. */
export default function useDialogFocus(open, panelRef, onClose) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    triggerRef.current = document.activeElement;
    const appRoot = document.getElementById('root');
    const wasInert = appRoot?.inert;
    if (appRoot) appRoot.inert = true;

    const focusPanel = () => {
      const focusable = panelRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
      (focusable?.[0] || panelRef.current)?.focus();
    };
    const frame = requestAnimationFrame(focusPanel);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR)];
      if (!focusable.length) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      if (appRoot) appRoot.inert = wasInert;
      triggerRef.current?.focus?.();
    };
  }, [open, onClose, panelRef]);
}
