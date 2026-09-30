import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistApi } from '../services/wishlistApi';
import { useAuth } from './AuthContext';
import { normalizeProduct } from '../utils/product';

/**
 * Wishlist state — persisted to localStorage, keyed on product `_id`
 * (mirrors CartContext so the two feel consistent).
 */
const WishlistContext = createContext(null);

const STORAGE_KEY = 'wornora_wishlist';

export function WishlistProvider({ children }) {
  const { token, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token || authLoading) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token, authLoading]);

  useEffect(() => {
    if (token) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, token]);

  const normalizeWishlistItem = (item) => {
    const product = item.productId && typeof item.productId === 'object'
      ? item.productId
      : item;
    return normalizeProduct(product);
  };

  const applyBackendWishlist = (data) => {
    const rawItems = data?.items || data?.wishlist || data || [];
    const list = Array.isArray(rawItems)
      ? rawItems.map(normalizeWishlistItem).filter(Boolean)
      : [];
    setItems(list);
    return list;
  };

  const refreshWishlist = async () => {
    if (!token) return null;
    setLoading(true);
    try {
      const response = await wishlistApi.get();
      return applyBackendWishlist(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || authLoading) return;
    refreshWishlist().catch(() => setItems([]));
  }, [token, authLoading]);

  const isWishlisted = (productId) => items.some((item) => item._id === productId);

  const addToWishlist = async (product) => {
    if (token) {
      const response = await wishlistApi.add({ productId: product._id });
      const item = response.data.item || response.data;
      const normalized = normalizeWishlistItem(item) || product;
      setItems((prev) =>
        prev.some((existing) => existing._id === normalized._id)
          ? prev
          : [...prev, normalized]
      );
      return normalized;
    }

    setItems((prev) =>
      prev.some((item) => item._id === product._id) ? prev : [...prev, product]
    );
    return product;
  };

  const removeFromWishlist = async (productId) => {
    if (token) {
      await wishlistApi.remove(productId);
    }

    setItems((prev) => prev.filter((item) => item._id !== productId));
  };

  /** Toggle membership; returns true if the item is now wishlisted. */
  const toggleWishlist = async (product) => {
    const exists = isWishlisted(product._id);
    if (exists) {
      await removeFromWishlist(product._id);
      return false;
    }
    await addToWishlist(product);
    return true;
  };

  const clearWishlist = async () => {
    if (token) {
      await wishlistApi.clear();
    }
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        wishlistCount: items.length,
        refreshWishlist,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}

export default WishlistContext;
