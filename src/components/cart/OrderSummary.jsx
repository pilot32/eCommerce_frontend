import { ShoppingBag, ShieldCheck, RefreshCcw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import CouponInput from './CouponInput';
import { formatCurrency } from '../../utils/format';
import { getDeliveryFee } from '../../utils/coupon';
import { FREE_DELIVERY_THRESHOLD } from '../../constants/sampleData';

/**
 * Sticky order summary card — totals breakdown, coupon entry,
 * a free-delivery nudge, the checkout CTA and trust badges.
 * Presentational: all cart logic is owned by the Cart page.
 */
export default function OrderSummary({ subtotal, coupon, summary, onApplyCoupon, onCheckout }) {
  const discount = coupon?.discount || 0;
  const subtotalAfterDiscount = subtotal - discount;
  const hasBackendSummary = summary && Number(summary.subtotal) === Number(subtotal);
  const deliveryFee = hasBackendSummary ? summary.shipping : getDeliveryFee(subtotalAfterDiscount);
  const grandTotal = hasBackendSummary ? summary.grandTotal : subtotalAfterDiscount + deliveryFee;

  // How much more (after discount) unlocks free delivery.
  const freeDeliveryGap = FREE_DELIVERY_THRESHOLD - subtotalAfterDiscount;

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
            {deliveryFee === 0 ? (
              <span className="text-teal">FREE</span>
            ) : (
              <span className="text-ink">{formatCurrency(deliveryFee)}</span>
            )}
          </dd>
        </div>
      </dl>

      {/* Free-delivery nudge */}
      {deliveryFee > 0 && freeDeliveryGap > 0 && (
        <p className="mt-3 rounded-input bg-gold-glow px-3 py-2 text-xs text-ink-soft">
          Add <span className="font-semibold text-gold-dark">{formatCurrency(freeDeliveryGap)}</span>{' '}
          more to unlock free delivery.
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
      >
        Proceed to Checkout
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
