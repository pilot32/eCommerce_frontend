import { COUPONS, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../constants/sampleData';

/** Look up a coupon by code (case-insensitive). */
export function findCoupon(code) {
  if (!code) return null;
  return COUPONS.find((c) => c.code.toLowerCase() === code.trim().toLowerCase()) || null;
}

/**
 * Validate & apply a coupon against a cart subtotal.
 * @returns {{ valid:boolean, discount:number, message:string, coupon:object|null }}
 */
export function applyCoupon(code, subtotal) {
  const coupon = findCoupon(code);
  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code', coupon: null };
  }
  if (subtotal < coupon.minCart) {
    const gap = (coupon.minCart - subtotal).toLocaleString('en-IN');
    return { valid: false, discount: 0, message: `Add ₹${gap} more to use ${coupon.code}`, coupon: null };
  }

  let discount =
    coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    discount,
    message: `${coupon.code} applied — you saved ₹${discount.toLocaleString('en-IN')}`,
    coupon,
  };
}

/** Delivery fee — free above the threshold. */
export function getDeliveryFee(subtotalAfterDiscount) {
  return subtotalAfterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}
