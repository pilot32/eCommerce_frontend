import { productApi } from './productApi';
import { normalizeProduct } from '../utils/product';
import { SAMPLE_PRODUCTS } from '../constants/sampleData';

/**
 * Single source of truth for the product catalogue.
 *
 * Tries the real backend once and caches the promise (so navigating between
 * pages doesn't refetch). If the API is unreachable or returns nothing, it
 * falls back to the bundled sample catalogue so the storefront stays usable.
 */
const cache = new Map();

const cacheKey = (params) => JSON.stringify(params || {});

export function loadCatalog({ force = false, params = {} } = {}) {
  const key = cacheKey(params);
  if (cache.has(key) && !force) return cache.get(key);

  const request = productApi
    .getCustomerAll({ limit: 100, ...params })
    .then((res) => {
      const raw = res.data?.products || res.data || [];
      const list = Array.isArray(raw) ? raw : [];
      const normalized = list.map(normalizeProduct).filter(Boolean);
      return normalized.length ? normalized : SAMPLE_PRODUCTS;
    })
    .catch(() => SAMPLE_PRODUCTS);

  cache.set(key, request);
  return request;
}

export function clearCatalogCache() {
  cache.clear();
}
