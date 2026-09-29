import { useState, useEffect } from 'react';

/**
 * Tracks a CSS media query, e.g. useMediaQuery('(min-width: 1024px)').
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** Convenience: true on desktop (>= 1024px). */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}
