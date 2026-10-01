import { useEffect, useState } from 'react';

// An empty result stays empty: hidden/deleted content must not become sample promotions.
export function useHomeContent(api) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let cancelled = false;
    api.getAll(true).then(response => {
      const data = Array.isArray(response.data) ? response.data : response.data?.data;
      if (!cancelled) setItems(Array.isArray(data) ? data : []);
    }).catch(() => { /* Leave promotional content hidden if it cannot be loaded. */ });
    return () => { cancelled = true; };
  }, [api]);
  return items;
}
