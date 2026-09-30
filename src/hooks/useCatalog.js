import { useState, useEffect } from 'react';
import { loadCatalog } from '../services/catalog';

/**
 * Loads the full (normalised) product catalogue with loading/error state.
 * Backed by a cached promise, so it's cheap to call from multiple pages.
 *
 * @returns {{ products: object[], loading: boolean, error: Error|null }}
 */
export function useCatalog(options = {}) {
  const { params } = options;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params || {});

  useEffect(() => {
    let active = true;
    setLoading(true);

    loadCatalog({ params })
      .then((list) => {
        if (!active) return;
        setProducts(list);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [paramsKey]);

  return { products, loading, error };
}
