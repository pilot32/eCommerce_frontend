import { useState, useEffect } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of no changes. Used for the search input.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
