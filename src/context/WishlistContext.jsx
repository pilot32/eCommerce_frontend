import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Wishlist state — persisted to localStorage, keyed on product `_id`
 * (mirrors CartContext so the two feel consistent).
 */
const WishlistContext = createContext(null);

const STORAGE_KEY = 'wornora_wishlist';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isWishlisted = (productId) => items.some((item) => item._id === productId);

  const addToWishlist = (product) => {
    setItems((prev) =>
      prev.some((item) => item._id === product._id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (productId) => {
    setItems((prev) => prev.filter((item) => item._id !== productId));
  };

  /** Toggle membership; returns true if the item is now wishlisted. */
  const toggleWishlist = (product) => {
    const exists = isWishlisted(product._id);
    if (exists) {
      removeFromWishlist(product._id);
      return false;
    }
    addToWishlist(product);
    return true;
  };

  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount: items.length,
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
