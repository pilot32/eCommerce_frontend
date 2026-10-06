import { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/cartApi';
import { useAuth } from './AuthContext';
import { normalizeProduct } from '../utils/product';
import { getCartItemKey, mergeCartItem } from '../utils/cart';

const CartContext = createContext(null);

const normalizeCartItem = (item) => {
  const product = item.productId && typeof item.productId === 'object'
    ? item.productId
    : item;
  const normalized = normalizeProduct(product);

  return {
    ...normalized,
    quantity: item.quantity || 1,
    priceAddition: item.priceAddition,
    selectedSize: item.selectedSize || '',
    selectedColor: item.selectedColor || '',
  };
};

const normalizeCartResponse = (data) => ({
  cart: (data?.cart?.items || []).map(normalizeCartItem),
  summary: data?.summary || { subtotal: 0, discount: 0, shipping: 0, grandTotal: 0 },
  appliedCoupon: data?.cart?.appliedCoupon
    ? {
        code: data.cart.appliedCoupon,
        discount: data?.summary?.discount || 0,
      }
    : null,
});

export function CartProvider({ children }) {
  const { token, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cart') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  });
  const [summary, setSummary] = useState({ subtotal: 0, discount: 0, shipping: 0, grandTotal: 0 });
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token || authLoading) return;
    const savedCart = localStorage.getItem('cart');
    try {
      const saved = savedCart ? JSON.parse(savedCart) : [];
      setCart(Array.isArray(saved) ? saved : []);
    } catch { setCart([]); }
    setSummary({ subtotal: 0, discount: 0, shipping: 0, grandTotal: 0 });
    setCoupon(null);
  }, [token, authLoading]);

  useEffect(() => {
    if (token || authLoading) return;
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart, token, authLoading]);

  const applyBackendCart = (data) => {
    const normalized = normalizeCartResponse(data);
    setCart(normalized.cart);
    setSummary(normalized.summary);
    setCoupon(normalized.appliedCoupon);
    return normalized;
  };

  const refreshCart = async () => {
    if (!token) return null;
    setLoading(true);
    try {
      const response = await cartApi.get();
      return applyBackendCart(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || authLoading) return;
    refreshCart().catch(() => {
      setCart([]);
      setSummary({ subtotal: 0, discount: 0, shipping: 0, grandTotal: 0 });
      setCoupon(null);
    });
  }, [token, authLoading]);

  const addToCart = async (product, quantity = 1, selection = {}) => {
    if (token) {
      const response = await cartApi.add({ productId: product._id, quantity, ...selection });
      return applyBackendCart(response.data);
    }

    setCart((prev) => mergeCartItem(prev, product, quantity, selection));
  };

  const removeFromCart = async (productId, selection = {}) => {
    if (token) {
      const response = await cartApi.remove(productId, { selectedSize: selection.selectedSize || '', selectedColor: selection.selectedColor || '' });
      return applyBackendCart(response.data);
    }

    const key = getCartItemKey({ _id: productId, selectedSize: selection.selectedSize, selectedColor: selection.selectedColor });
    setCart((prev) => prev.filter((item) => getCartItemKey(item) !== key));
  };

  const updateQuantity = async (productId, quantity, selection = {}) => {
    if (quantity <= 0) return removeFromCart(productId, selection);

    if (token) {
      const response = await cartApi.updateQuantity(productId, { quantity, selectedSize: selection.selectedSize || '', selectedColor: selection.selectedColor || '' });
      return applyBackendCart(response.data);
    }

    const key = getCartItemKey({ _id: productId, selectedSize: selection.selectedSize, selectedColor: selection.selectedColor });
    setCart((prev) =>
      prev.map((item) => getCartItemKey(item) === key ? { ...item, quantity } : item)
    );
  };

  const clearCart = async () => {
    if (token) {
      const response = await cartApi.clear();
      return applyBackendCart(response.data);
    }

    setCart([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    if (!token) {
      throw new Error('Please sign in to apply coupons');
    }

    const response = await cartApi.applyCoupon({ code });
    const normalized = applyBackendCart(response.data);
    const applied = response.data.coupon || normalized.appliedCoupon;
    setCoupon(applied);
    return applied;
  };

  const removeCoupon = async () => {
    if (!token) return null;
    const response = await cartApi.removeCoupon();
    return applyBackendCart(response.data);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const localTotal = cart.reduce(
    (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity, 0
  );
  const cartTotal = token ? summary.subtotal : localTotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        summary,
        coupon,
        loading,
        refreshCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export default CartContext;
