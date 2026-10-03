import { ShoppingBag, ShieldCheck, RefreshCcw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import CouponInput from './CouponInput';
import { formatCurrency } from '../../utils/format';

/**
 * Sticky order summary card — totals breakdown, coupon entry,
 * a free-delivery nudge, the checkout CTA and trust badges.
 * Presentational: all cart logic is owned by the Cart page.
 */
export default function OrderSummary({
  subtotal,
  coupon,
  shippingQuote,
  shippingLoading = false,
  onApplyCoupon,
  onCheckout,
  checkoutLabel = 'Proceed to Checkout',
  checkoutDisabled = false,
}) {
  const discount = coupon?.discount || 0;
  const subtotalAfterDiscount = subtotal - discount;
  const deliveryFee = shippingQuote?.deliveryCharge;
  const grandTotal = subtotalAfterDiscount + (deliveryFee || 0);

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-heading text-xl text-ink">Order Summary</h2>
      <div className="mt-2 rule-gold" />

      {/* Totals breakdown */}
      <dl className="mt-5 space-y-3 font-accent text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="font-semibold text-ink">{formatCurrency(subtotal)}</dd>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-maroon">
            <dt>Discount {coupon?.code ? `(${coupon.code})` : ''}</dt>
            <dd className="font-semibold">-{formatCurrency(discount)}</dd>
          </div>
        )}

        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Delivery Fee</dt>
          <dd className="font-semibold">
            {shippingLoading ? (
              <span className="text-ink-soft">Calculating...</span>
            ) : deliveryFee === undefined ? (
              <span className="text-ink-soft">Enter delivery address</span>
            ) : deliveryFee === 0 ? (
              <span className="text-teal">FREE</span>
            ) : (
              <span className="text-ink">{formatCurrency(deliveryFee)}</span>
            )}
          </dd>
        </div>
      </dl>

      {shippingQuote?.isEstimated && (
        <p className="mt-3 rounded-input bg-gold-glow px-3 py-2 text-xs text-ink-soft">
          Delivery is estimated from your selected pincode and package details. The final charge is confirmed when the order is placed.
        </p>
      )}

      <div className="my-5 border-t border-sand" />

      {/* Grand total */}
      <div className="flex items-baseline justify-between">
        <span className="font-heading text-lg text-ink">Grand Total</span>
        <span className="font-accent text-xl font-semibold text-ink">
          {formatCurrency(grandTotal)}
        </span>
      </div>

      {/* Coupon */}
      <div className="mt-5">
        <CouponInput onApply={onApplyCoupon} applied={coupon} />
      </div>

      {/* Checkout */}
      <Button
        fullWidth
        size="lg"
        className="mt-5"
        leftIcon={<ShoppingBag size={18} />}
        onClick={onCheckout}
        disabled={checkoutDisabled}
      >
        {checkoutLabel}
      </Button>

      {/* Trust badges */}
      <ul className="mt-5 grid grid-cols-2 gap-3 font-accent text-xs text-ink-mute">
        <li className="flex items-center gap-2">
          <ShieldCheck size={16} className="shrink-0 text-gold-dark" />
          Secure payment
        </li>
        <li className="flex items-center gap-2">
          <RefreshCcw size={16} className="shrink-0 text-gold-dark" />
          Easy 7-day returns
        </li>
      </ul>
    </Card>
  );
}
