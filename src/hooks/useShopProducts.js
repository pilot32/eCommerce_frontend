import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCatalog } from './useCatalog';
import { filterProducts, sortProducts } from '../utils/product';
import { PRODUCTS_PER_PAGE } from '../constants/shop';

/**
 * Catalogue + client-side filtering, sorting and infinite-scroll pagination.
 * The Shop page drives this with its filter/sort state.
 *
 * @param {object} options
 * @param {object} options.filters - see filterProducts()
 * @param {string} options.sort    - a SORT_OPTIONS value
 * @param {number} [options.pageSize]
 */
export function useShopProducts({ filters, sort = 'featured', pageSize = PRODUCTS_PER_PAGE }) {
  const { products: all, loading, error } = useCatalog();
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loadingMore, setLoadingMore] = useState(false);

  const filtered = useMemo(() => {
    const result = filterProducts(all, filters);
    return sortProducts(result, sort);
  }, [all, filters, sort]);

  // Reset pagination whenever the result set changes (new filters/sort).
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [filtered, pageSize]);

  const products = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const hasMore = visibleCount < filtered.length;

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    // Brief delay so the skeleton loader is visible — feels like a real fetch.
    setTimeout(() => {
      setVisibleCount((count) => count + pageSize);
      setLoadingMore(false);
    }, 450);
  }, [hasMore, loadingMore, pageSize]);

  return {
    products,
    total: filtered.length,
    loading,
    error,
    hasMore,
    loadMore,
    loadingMore,
  };
}
