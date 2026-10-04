const RAZORPAY_CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

export const loadRazorpayCheckout = () => new Promise((resolve, reject) => {
  if (window.Razorpay) {
    resolve();
    return;
  }

  const existingScript = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_URL}"]`);
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(), { once: true });
    existingScript.addEventListener('error', () => reject(new Error('Razorpay Checkout could not be loaded')), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = RAZORPAY_CHECKOUT_URL;
  script.async = true;
  script.onload = () => resolve();
  script.onerror = () => reject(new Error('Razorpay Checkout could not be loaded'));
  document.body.appendChild(script);
});

export const openRazorpayCheckout = (options) => new Promise((resolve, reject) => {
  const checkout = new window.Razorpay({
    ...options,
    handler: resolve,
    modal: {
      ondismiss: () => reject(new Error('Payment cancelled')),
    },
  });

  checkout.on('payment.failed', (response) => {
    reject(new Error(response.error?.description || 'Razorpay payment failed'));
  });
  checkout.open();
});
