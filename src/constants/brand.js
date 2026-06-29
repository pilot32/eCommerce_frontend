/**
 * Brand-level constants: identity, navigation, footer, USPs.
 * No magic strings scattered across components — everything lives here.
 */

export const BRAND = {
  name: 'Wornora',
  tagline: 'by keerti',
  description:
    'Handcrafted Indian ethnic women’s fashion — sarees, lehengas, kurtis and jewellery that celebrate your desi heritage.',
  phone: '+91 98765 43210',
  email: 'care@wornora.in',
  addressLine: '12 Heritage Lane, Jaipur, Rajasthan 302001',
  year: 2024,
};

/** Rotating announcement-bar messages. */
export const ANNOUNCEMENTS = [
  '✨ Free shipping on all orders above ₹1,999',
  '🪔 Festive Edit is live — up to 40% off',
  '↩ Easy 7-day returns & exchange',
];

/** Primary header navigation (text links shown on desktop). */
export const PRIMARY_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?filter=new' },
  { label: 'Clothing', to: '/shop?category=clothing' },
  { label: 'Jewellery', to: '/shop?category=jewellery' },
];

/** "Why shop with us" — lucide icon names resolved in the component. */
export const USPS = [
  {
    icon: 'Sparkles',
    title: 'Handcrafted with Love',
    description: 'Every piece is crafted by skilled Indian artisans using time-honoured techniques.',
  },
  {
    icon: 'Truck',
    title: 'Free & Fast Delivery',
    description: 'Complimentary shipping across India on orders above ₹1,999.',
  },
  {
    icon: 'RefreshCw',
    title: 'Easy 7-Day Returns',
    description: 'Changed your mind? Enjoy hassle-free returns and exchange.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Secure Payments',
    description: '100% secure checkout with trusted payment partners.',
  },
];

/** Footer link columns. */
export const FOOTER_LINKS = {
  Shop: [
    { label: 'New Arrivals', to: '/shop?filter=new' },
    { label: 'Sarees', to: '/shop?category=clothing&subcategory=sarees' },
    { label: 'Lehengas', to: '/shop?category=clothing&subcategory=lehengas' },
    { label: 'Jewellery', to: '/shop?category=jewellery' },
    { label: 'Festive Edit', to: '/shop?filter=sale' },
  ],
  'Customer Care': [
    { label: 'Contact Us', to: '/contact' },
    { label: 'Shipping & Returns', to: '/contact' },
    { label: 'Track Order', to: '/profile' },
    { label: 'Size Guide', to: '/contact' },
    { label: 'FAQs', to: '/contact' },
  ],
  Company: [
    { label: 'About Wornora', to: '/about' },
    { label: 'Our Artisans', to: '/about' },
    { label: 'Sustainability', to: '/about' },
    { label: 'Careers', to: '/about' },
  ],
};

/** Social links — lucide icon names. */
export const SOCIAL_LINKS = [
  { label: 'Instagram', icon: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', icon: 'Facebook', href: 'https://facebook.com' },
  { label: 'Youtube', icon: 'Youtube', href: 'https://youtube.com' },
  { label: 'Twitter', icon: 'Twitter', href: 'https://twitter.com' },
];
