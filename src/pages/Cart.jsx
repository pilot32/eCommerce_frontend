import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Container from '../components/ui/Container';
import Breadcrumb from '../components/ui/Breadcrumb';
import EmptyState from '../components/ui/EmptyState';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { applyCoupon } from '../utils/coupon';
import { pluralize } from '../utils/format';

/**
 * Cart page — lists the customer's selected items with a sticky order
 * summary. Owns the applied-coupon state and the (mock) checkout flow.
 */
export default function Cart() {
  const { cart, clearCart, cartCount, cartTotal } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Applied coupon: { discount, coupon, code } | null
  const [coupon, setCoupon] = useState(null);

  const handleApplyCoupon = (code) => {
    const result = applyCoupon(code, cartTotal);
    if (result.valid) {
      setCoupon({ discount: result.discount, coupon: result.coupon, code: result.coupon.code });
      addToast(result.message, 'success');
    } else {
      setCoupon(null);
      addToast(result.message, 'error');
    }
  };

  const handleClearCart = () => {
    clearCart();
    setCoupon(null);
    addToast('Cart cleared', 'info');
  };

  const handleCheckout = () => {
    addToast('Order placed successfully!', 'success');
    clearCart();
    navigate('/profile');
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
            <OrderSummary
              subtotal={cartTotal}
              coupon={coupon}
              onApplyCoupon={handleApplyCoupon}
              onCheckout={handleCheckout}
            />
          </div>
        </aside>
      </div>
    </Container>
  );
}
