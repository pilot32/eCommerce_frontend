import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Container from '../components/ui/Container';
import Breadcrumb from '../components/ui/Breadcrumb';
import EmptyState from '../components/ui/EmptyState';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addressApi } from '../services/addressApi';
import { orderApi } from '../services/orderApi';
import { shippingApi } from '../services/shippingApi';
import { pluralize } from '../utils/format';

/**
 * Cart page — lists the customer's selected items with a sticky order
 * summary. Owns the applied-coupon state and the (mock) checkout flow.
 */
export default function Cart() {
  const { cart, clearCart, refreshCart, cartCount, cartTotal, coupon, applyCoupon } = useCart();
  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [shippingQuote, setShippingQuote] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const defaultAddressId = defaultAddress?._id;
  const cartQuoteKey = cart.map((item) => `${item._id}:${item.quantity}:${item.priceAddition || item.price}`).join('|');

  useEffect(() => {
    if (!token || cart.length === 0) {
      setDefaultAddress(null);
      return;
    }

    let active = true;
    const loadDefaultAddress = async () => {
      setAddressLoading(true);
      try {
        const response = await addressApi.getDefault();
        if (active) setDefaultAddress(response.data.address || response.data || null);
      } catch (err) {
        if (active) setDefaultAddress(null);
      } finally {
        if (active) setAddressLoading(false);
      }
    };

    loadDefaultAddress();
    return () => { active = false; };
  }, [token, cart.length]);

  useEffect(() => {
    if (!token || !defaultAddressId || !cartQuoteKey) {
      setShippingQuote(null);
      setShippingError('');
      return;
    }

    let active = true;
    const loadShippingQuote = async () => {
      setShippingLoading(true);
      setShippingError('');
      try {
        const response = await shippingApi.getQuote({
          shippingAddressId: defaultAddressId,
          paymentMethod: 'COD',
        });
        if (active) setShippingQuote(response.data);
      } catch (err) {
        if (active) {
          setShippingQuote(null);
          setShippingError(err.response?.data?.message || 'Delivery charges could not be calculated');
        }
      } finally {
        if (active) setShippingLoading(false);
      }
    };

    loadShippingQuote();
    return () => { active = false; };
  }, [token, defaultAddressId, cartQuoteKey, coupon?.code, coupon?.discount]);

  const handleApplyCoupon = async (code) => {
    try {
      const result = await applyCoupon(code);
      addToast(`${result.code} applied`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Invalid coupon code', 'error');
    }
  };

  const handleClearCart = async () => {
    await clearCart();
    addToast('Cart cleared', 'info');
  };

  const handleCheckout = async () => {
    if (!token) {
      addToast('Please sign in to place your order', 'error');
      navigate('/login');
      return;
    }

    if (!defaultAddress?._id) {
      addToast('Add a default delivery address before checkout', 'error');
      navigate('/profile?tab=addresses');
      return;
    }

    setPlacingOrder(true);
    try {
      const response = await orderApi.create({
        shippingAddressId: defaultAddress._id,
        paymentMethod: 'COD',
      });
      const order = response.data.order || response.data;
      await refreshCart();
      addToast(`Order ${order.orderNumber || ''} placed successfully`, 'success');
      navigate('/profile?tab=orders');
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not place order', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  // ---- Empty state ----
  if (cart.length === 0) {
    return (
      <Container className="py-14 sm:py-20">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} className="mb-6" />
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">Your Cart</h1>
        <div className="mt-8">
          <EmptyState
            icon="ShoppingBag"
            title="Your cart is empty"
            description="Explore our handcrafted collection and add your favourites."
            actionLabel="Start Shopping"
            actionTo="/shop"
          />
        </div>
      </Container>
    );
  }

  // ---- Happy path ----
  return (
    <Container className="py-10 sm:py-14">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} className="mb-6" />

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold-dark">
            Shopping Bag
          </p>
          <h1 className="mt-1 font-heading text-3xl text-ink sm:text-4xl">Your Cart</h1>
          <p className="mt-1 text-ink-soft">{pluralize(cartCount, 'item')} in your cart</p>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <section className="lg:col-span-2" aria-label="Cart items">
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item._id}>
                <CartItem item={item} />
              </li>
            ))}
          </ul>

          {/* Cart actions */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="inline-flex h-11 items-center gap-2 font-accent text-sm font-semibold text-ink transition-colors hover:text-gold-dark"
            >
              <ArrowLeft size={16} />
              Continue shopping
            </button>

            <button
              type="button"
              onClick={handleClearCart}
              className="inline-flex h-11 items-center gap-2 font-accent text-sm font-semibold text-ink-mute transition-colors hover:text-maroon"
            >
              <Trash2 size={16} />
              Clear cart
            </button>
          </div>
        </section>

        {/* Summary */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-28">
            <div className="mb-4 rounded-card border border-sand bg-white p-4 shadow-soft">
              <p className="font-accent text-xs uppercase tracking-[0.18em] text-gold-dark">
                Delivery Address
              </p>
              {!token ? (
                <p className="mt-2 text-sm text-ink-soft">
                  Sign in to use saved addresses and place a COD order.
                </p>
              ) : addressLoading ? (
                <p className="mt-2 text-sm text-ink-soft">Loading address...</p>
              ) : defaultAddress ? (
                <div className="mt-2 text-sm text-ink-soft">
                  <p className="font-medium text-ink">{defaultAddress.fullName}</p>
                  <p>{defaultAddress.addressLine1}</p>
                  {defaultAddress.addressLine2 && <p>{defaultAddress.addressLine2}</p>}
                  <p>
                    {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}
                  </p>
                  <p className="mt-1 text-ink-mute">{defaultAddress.phone}</p>
                  {shippingLoading && <p className="mt-3 text-xs text-ink-mute">Calculating delivery charges...</p>}
                  {shippingError && <p className="mt-3 text-xs text-maroon">{shippingError}</p>}
                  {shippingQuote?.recommendedCourier && (
                    <p className="mt-3 text-xs text-teal">
                      {shippingQuote.recommendedCourier.courierName} · estimated delivery in{' '}
                      {shippingQuote.recommendedCourier.estimatedDeliveryDays.min}–{shippingQuote.recommendedCourier.estimatedDeliveryDays.max} days
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-sm text-ink-soft">
                    Add a default address before placing your COD order.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/profile?tab=addresses')}
                    className="mt-2 font-accent text-sm font-semibold text-gold-dark hover:text-ink"
                  >
                    Manage addresses
                  </button>
                </div>
              )}
            </div>
            <OrderSummary
              subtotal={cartTotal}
              coupon={coupon}
              shippingQuote={shippingQuote}
              shippingLoading={shippingLoading}
              onApplyCoupon={handleApplyCoupon}
              onCheckout={handleCheckout}
              checkoutLabel={placingOrder ? 'Placing Order...' : 'Place COD Order'}
              checkoutDisabled={placingOrder || addressLoading || shippingLoading || Boolean(token && defaultAddress && !shippingQuote)}
            />
          </div>
        </aside>
      </div>
    </Container>
  );
}
