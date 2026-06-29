import { useState, useEffect } from 'react';
import { productApi } from '../services/productApi';
import { loadCatalog } from '../services/catalog';
import { normalizeProduct } from '../utils/product';

/**
 * Loads a single product by id (or slug) plus a few related products.
 *
 * @param {string} id
 * @returns {{ product: object|null, related: object[], loading: boolean, error: Error|null }}
 */
export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setProduct(null);

    async function run() {
      const catalog = await loadCatalog();
      let found = catalog.find((p) => p._id === id || p.slug === id);

      // For real backend ids that aren't in the cached list, try a direct fetch.
      if (!found) {
        try {
          const res = await productApi.getById(id);
          const raw = res.data?.product || res.data;
          if (raw && raw._id) found = normalizeProduct(raw);
        } catch {
          /* handled below */
        }
      }

      if (!active) return;

      if (!found) {
        setError(new Error('not-found'));
        setLoading(false);
        return;
      }

      setProduct(found);

      const sameLine = catalog.filter(
        (p) =>
          p._id !== found._id &&
          (p.subcategory === found.subcategory || p.category === found.category)
      );
      const fallback = catalog.filter((p) => p._id !== found._id);
      setRelated((sameLine.length ? sameLine : fallback).slice(0, 4));
      setLoading(false);
    }

    run();
    return () => {
      active = false;
    };
  }, [id]);

  return { product, related, loading, error };
}
