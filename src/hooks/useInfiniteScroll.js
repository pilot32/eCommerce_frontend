import { useEffect, useRef } from 'react';

/**
 * Calls `onLoadMore` when a sentinel element scrolls into view.
 * Attach the returned ref to a div at the bottom of your list.
 *
 * @param {() => void} onLoadMore
 * @param {{ enabled?: boolean, rootMargin?: string }} [options]
 * @returns {import('react').RefObject<HTMLDivElement>}
 */
export function useInfiniteScroll(onLoadMore, { enabled = true, rootMargin = '320px' } = {}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onLoadMore, enabled, rootMargin]);

  return sentinelRef;
}
