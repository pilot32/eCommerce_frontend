/**
 * Sample catalogue + content.
 *
 * The storefront talks to the real backend first; when the API is
 * unavailable or empty (e.g. local frontend preview), the data hooks fall
 * back to this set so every page stays fully populated and reviewable.
 *
 * Imagery uses LoremFlickr (real, theme-matched photos, stable per `lock`).
 * Components also render a graceful gradient fallback if an image fails.
 */

/** Build a stable, theme-matched photo URL. */
const img = (keyword, lock, w = 800, h = 1000) =>
  `https://loremflickr.com/${w}/${h}/${keyword}?lock=${lock}`;

const C = {
  gold: { name: 'Gold', hex: '#C9A96E' },
  maroon: { name: 'Maroon', hex: '#8B1A1A' },
  teal: { name: 'Teal', hex: '#2C6E6E' },
  terracotta: { name: 'Terracotta', hex: '#D4836A' },
  ivory: { name: 'Ivory', hex: '#FAF6F0' },
  saffron: { name: 'Saffron', hex: '#E8A87C' },
  emerald: { name: 'Emerald', hex: '#1F6B5B' },
  rose: { name: 'Rose Pink', hex: '#C76B7E' },
};

const CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const FREE = ['Free Size'];

/**
 * Compact seeds expanded into full products by buildProduct().
 * keyword drives the photo theme; lock makes each image stable.
 */
const SEEDS = [
  // ---------- Sarees ----------
  { id: 'wn-001', name: 'Banarasi Silk Saree', sub: 'sarees', kw: 'saree', lock: 11, price: 4999, discount: 2999, rating: 4.8, reviews: 124, colors: [C.gold, C.maroon, C.teal], material: 'Pure Banarasi Silk', featured: true, isNew: true, tags: ['wedding', 'festive', 'silk'] },
  { id: 'wn-002', name: 'Kanjivaram Zari Saree', sub: 'sarees', kw: 'silk,saree', lock: 12, price: 8999, discount: 6499, rating: 4.9, reviews: 88, colors: [C.maroon, C.gold, C.emerald], material: 'Kanjivaram Silk', featured: true, tags: ['wedding', 'silk'] },
  { id: 'wn-003', name: 'Bandhani Georgette Saree', sub: 'sarees', kw: 'saree,fashion', lock: 13, price: 3499, discount: 1999, rating: 4.6, reviews: 210, colors: [C.saffron, C.rose, C.teal], material: 'Georgette', isNew: true, tags: ['casual', 'festive'] },
  { id: 'wn-004', name: 'Organza Floral Saree', sub: 'sarees', kw: 'saree,woman', lock: 14, price: 5499, rating: 4.5, reviews: 67, colors: [C.ivory, C.rose], material: 'Organza', tags: ['party'] },

  // ---------- Lehengas ----------
  { id: 'wn-005', name: 'Royal Velvet Bridal Lehenga', sub: 'lehengas', kw: 'lehenga', lock: 21, price: 14999, discount: 9999, rating: 4.9, reviews: 56, colors: [C.maroon, C.emerald], material: 'Velvet', featured: true, tags: ['bridal', 'wedding'] },
  { id: 'wn-006', name: 'Mirror-Work Lehenga Choli', sub: 'lehengas', kw: 'lehenga,fashion', lock: 22, price: 7999, discount: 5999, rating: 4.7, reviews: 142, colors: [C.saffron, C.teal, C.rose], material: 'Georgette', isNew: true, tags: ['festive', 'sangeet'] },
  { id: 'wn-007', name: 'Pastel Sequin Lehenga', sub: 'lehengas', kw: 'lehenga,wedding', lock: 23, price: 10999, discount: 8499, rating: 4.6, reviews: 39, colors: [C.ivory, C.gold], material: 'Net', featured: true, tags: ['reception'] },

  // ---------- Kurtis ----------
  { id: 'wn-008', name: 'Chikankari Cotton Kurti', sub: 'kurtis', kw: 'kurti', lock: 31, price: 1499, discount: 999, rating: 4.5, reviews: 320, colors: [C.ivory, C.teal, C.rose], material: 'Cotton', isNew: true, tags: ['daily', 'office'] },
  { id: 'wn-009', name: 'Hand-Block Print Kurti', sub: 'kurtis', kw: 'kurti,fashion', lock: 32, price: 1799, discount: 1299, rating: 4.4, reviews: 188, colors: [C.terracotta, C.gold], material: 'Cotton', tags: ['daily'] },
  { id: 'wn-010', name: 'Rayon Straight Kurti', sub: 'kurtis', kw: 'indian,dress', lock: 33, price: 1299, rating: 4.3, reviews: 256, colors: [C.maroon, C.teal], material: 'Rayon', tags: ['casual'] },

  // ---------- Suits & Anarkalis ----------
  { id: 'wn-011', name: 'Chikankari Anarkali Suit', sub: 'suits', kw: 'anarkali', lock: 41, price: 3999, discount: 2799, rating: 4.7, reviews: 97, colors: [C.ivory, C.gold, C.teal], material: 'Georgette', featured: true, isNew: true, tags: ['festive', 'party'] },
  { id: 'wn-012', name: 'Embroidered Palazzo Suit Set', sub: 'suits', kw: 'salwar', lock: 42, price: 2999, discount: 2199, rating: 4.5, reviews: 134, colors: [C.saffron, C.rose], material: 'Cotton Silk', tags: ['festive'] },
  { id: 'wn-013', name: 'Velvet Sharara Set', sub: 'suits', kw: 'indian,dress,fashion', lock: 43, price: 5999, discount: 4499, rating: 4.6, reviews: 45, colors: [C.maroon, C.emerald], material: 'Velvet', tags: ['wedding'] },

  // ---------- Dupattas ----------
  { id: 'wn-014', name: 'Phulkari Embroidered Dupatta', sub: 'dupattas', kw: 'dupatta,scarf', lock: 51, price: 1299, discount: 899, rating: 4.4, reviews: 76, colors: [C.saffron, C.rose, C.teal], material: 'Cotton', isNew: true, tags: ['festive'] },
  { id: 'wn-015', name: 'Banarasi Silk Dupatta', sub: 'dupattas', kw: 'silk,scarf', lock: 52, price: 1599, rating: 4.5, reviews: 52, colors: [C.gold, C.maroon], material: 'Banarasi Silk', tags: ['festive'] },

  // ---------- Ethnic Gowns ----------
  { id: 'wn-016', name: 'Floor-Length Ethnic Gown', sub: 'gowns', kw: 'gown,indian', lock: 61, price: 6499, discount: 4999, rating: 4.7, reviews: 61, colors: [C.emerald, C.maroon], material: 'Georgette', featured: true, tags: ['party', 'reception'] },
  { id: 'wn-017', name: 'Sequinned Cocktail Gown', sub: 'gowns', kw: 'gown,fashion', lock: 62, price: 7999, discount: 5999, rating: 4.6, reviews: 33, colors: [C.gold, C.rose], material: 'Net', isNew: true, tags: ['party'] },

  // ---------- Jewellery: Necklaces ----------
  { id: 'wn-018', name: 'Kundan Bridal Necklace Set', sub: 'necklaces', cat: 'jewellery', kw: 'necklace,gold', lock: 71, price: 3499, discount: 1999, rating: 4.8, reviews: 142, colors: [C.gold], material: 'Kundan & Pearls', featured: true, isNew: true, tags: ['bridal', 'wedding'] },
  { id: 'wn-019', name: 'Temple Jewellery Necklace', sub: 'necklaces', cat: 'jewellery', kw: 'jewellery,gold', lock: 72, price: 2999, discount: 2299, rating: 4.7, reviews: 88, colors: [C.gold], material: 'Gold-Plated Brass', tags: ['festive', 'traditional'] },
  { id: 'wn-020', name: 'Jadau Choker Set', sub: 'necklaces', cat: 'jewellery', kw: 'necklace,jewelry', lock: 73, price: 4499, discount: 3299, rating: 4.9, reviews: 47, colors: [C.gold, C.maroon], material: 'Jadau', featured: true, tags: ['bridal'] },

  // ---------- Jewellery: Earrings ----------
  { id: 'wn-021', name: 'Meenakari Jhumka Earrings', sub: 'earrings', cat: 'jewellery', kw: 'earrings,gold', lock: 81, price: 999, discount: 699, rating: 4.6, reviews: 264, colors: [C.gold, C.rose, C.teal], material: 'Meenakari', isNew: true, tags: ['festive', 'daily'] },
  { id: 'wn-022', name: 'Polki Drop Earrings', sub: 'earrings', cat: 'jewellery', kw: 'earrings,jewelry', lock: 82, price: 1499, discount: 1099, rating: 4.7, reviews: 119, colors: [C.gold], material: 'Polki', featured: true, tags: ['party'] },

  // ---------- Jewellery: Bangles ----------
  { id: 'wn-023', name: 'Gold-Plated Kada Bangles Set', sub: 'bangles', cat: 'jewellery', kw: 'bangles,gold', lock: 91, price: 1799, discount: 1299, rating: 4.5, reviews: 73, colors: [C.gold], material: 'Gold-Plated Brass', tags: ['festive'] },
  { id: 'wn-024', name: 'Lac Bridal Chooda Set', sub: 'bangles', cat: 'jewellery', kw: 'bangles,indian', lock: 92, price: 2199, discount: 1599, rating: 4.6, reviews: 41, colors: [C.maroon, C.gold], material: 'Lac', isNew: true, tags: ['bridal'] },

  // ---------- Jewellery: Maang Tikka / Anklets / Rings ----------
  { id: 'wn-025', name: 'Pearl Maang Tikka', sub: 'maang-tikka', cat: 'jewellery', kw: 'jewellery,pearl', lock: 101, price: 899, discount: 599, rating: 4.4, reviews: 58, colors: [C.gold, C.ivory], material: 'Pearl & Kundan', tags: ['bridal', 'festive'] },
  { id: 'wn-026', name: 'Oxidised Silver Anklets', sub: 'anklets', cat: 'jewellery', kw: 'anklet,silver', lock: 102, price: 799, discount: 549, rating: 4.5, reviews: 96, colors: [{ name: 'Oxidised Silver', hex: '#9aa0a6' }], material: 'Oxidised Silver', isNew: true, tags: ['boho', 'daily'] },
];

function buildProduct(seed) {
  const category = seed.cat || 'clothing';
  const isJewellery = category === 'jewellery';
  const galleryKw = seed.kw;
  return {
    _id: seed.id,
    name: seed.name,
    slug: seed.id,
    description:
      seed.description ||
      `${seed.name} crafted in ${seed.material || 'premium fabric'} with intricate detailing. A timeless addition to your festive and celebration wardrobe, made by skilled Indian artisans.`,
    category,
    categoryName: isJewellery ? 'Jewellery' : 'Clothing',
    subcategory: seed.sub,
    subcategoryName: '', // resolved at render time via SUBCATEGORY_LOOKUP if needed
    price: seed.price,
    discountedPrice: seed.discount || null,
    images: [
      img(galleryKw, seed.lock),
      img(galleryKw, seed.lock + 200),
      img(galleryKw, seed.lock + 400),
      img(galleryKw, seed.lock + 600),
    ],
    rating: seed.rating,
    reviewCount: seed.reviews,
    sizes: isJewellery ? FREE : CLOTHING_SIZES,
    colors: seed.colors,
    stock: seed.stock ?? 18,
    featured: Boolean(seed.featured),
    isNew: Boolean(seed.isNew),
    material: seed.material || '',
    tags: seed.tags || [],
  };
}

export const SAMPLE_PRODUCTS = SEEDS.map(buildProduct);

/** Hero carousel slides. */
export const HERO_SLIDES = [
  {
    id: 'h1',
    eyebrow: 'Handcrafted Elegance',
    title: 'Celebrate Your\nDesi Heritage',
    subtitle: 'Sarees, lehengas & jewellery woven with timeless artistry.',
    cta: { label: 'Shop the Collection', to: '/shop' },
    secondaryCta: { label: 'New Arrivals', to: '/shop?filter=new' },
    image: img('saree,indian,woman', 5, 1600, 1000),
    align: 'left',
  },
  {
    id: 'h2',
    eyebrow: 'The Festive Edit',
    title: 'Radiance for\nEvery Celebration',
    subtitle: 'Bridal lehengas & Kundan sets that make moments unforgettable.',
    cta: { label: 'Explore Festive', to: '/shop?filter=sale' },
    secondaryCta: { label: 'View Lehengas', to: '/shop?category=clothing&subcategory=lehengas' },
    image: img('lehenga,wedding', 6, 1600, 1000),
    align: 'left',
  },
  {
    id: 'h3',
    eyebrow: 'Everyday Grace',
    title: 'Effortless\nEthnic Edits',
    subtitle: 'Breezy chikankari kurtis & suits made for daily elegance.',
    cta: { label: 'Shop Kurtis', to: '/shop?category=clothing&subcategory=kurtis' },
    secondaryCta: { label: 'Shop All', to: '/shop' },
    image: img('indian,dress,fashion', 7, 1600, 1000),
    align: 'left',
  },
];

/** Promotional banners (homepage). */
export const PROMO_BANNERS = [
  {
    id: 'promo-festive',
    eyebrow: 'Festive Sale',
    title: 'Up to 40% Off',
    subtitle: 'Use code FESTIVE20 at checkout',
    cta: { label: 'Shop Now', to: '/shop?filter=sale' },
    image: img('saree,festival', 8, 800, 600),
    accent: 'maroon',
  },
  {
    id: 'promo-new',
    eyebrow: 'New Arrivals',
    title: 'The Winter Edit',
    subtitle: 'Fresh drops in velvet & silk',
    cta: { label: 'Discover', to: '/shop?filter=new' },
    image: img('lehenga,fashion', 9, 800, 600),
    accent: 'terracotta',
  },
  {
    id: 'promo-jewel',
    eyebrow: 'Jewellery',
    title: 'Handpicked Sets',
    subtitle: 'Kundan, Polki & Temple jewellery',
    cta: { label: 'Shop Jewellery', to: '/shop?category=jewellery' },
    image: img('jewellery,gold', 10, 800, 600),
    accent: 'gold',
  },
];

/** Category showcase tiles (homepage / shop entry). */
export const CATEGORY_TILES = [
  { slug: 'sarees', name: 'Sarees', to: '/shop?category=clothing&subcategory=sarees', image: img('saree', 111, 600, 750) },
  { slug: 'lehengas', name: 'Lehengas', to: '/shop?category=clothing&subcategory=lehengas', image: img('lehenga', 112, 600, 750) },
  { slug: 'kurtis', name: 'Kurtis', to: '/shop?category=clothing&subcategory=kurtis', image: img('kurti', 113, 600, 750) },
  { slug: 'jewellery', name: 'Jewellery', to: '/shop?category=jewellery', image: img('jewellery,gold', 114, 600, 750) },
];

/** Customer testimonials. */
export const TESTIMONIALS = [
  { id: 't1', name: 'Ananya R.', location: 'Mumbai', rating: 5, text: 'The Banarasi saree is absolutely stunning — the zari work looks even better in person. Wore it to my sister’s wedding and got endless compliments!' },
  { id: 't2', name: 'Priya S.', location: 'Delhi', rating: 5, text: 'Beautiful craftsmanship and the fit was perfect. Delivery was quick and the packaging felt so premium and festive.' },
  { id: 't3', name: 'Meera K.', location: 'Bengaluru', rating: 4, text: 'Loved the Kundan necklace set. Looks rich and elegant. Will definitely shop again for the festive season.' },
];

/** Coupon codes recognised by the cart. */
export const COUPONS = [
  { code: 'FESTIVE20', type: 'percent', value: 20, maxDiscount: 1500, minCart: 1999, label: '20% off above ₹1,999 (max ₹1,500)' },
  { code: 'WELCOME10', type: 'percent', value: 10, maxDiscount: 800, minCart: 0, label: '10% off your first order' },
  { code: 'FLAT200', type: 'flat', value: 200, minCart: 1499, label: '₹200 off above ₹1,499' },
];

export const DELIVERY_FEE = 50;
export const FREE_DELIVERY_THRESHOLD = 1999;

/** Demo signed-in customer (profile page). */
export const SAMPLE_USER = {
  name: 'Priya Sharma',
  email: 'priya@email.com',
  phone: '+91 98765 43210',
  avatar: img('portrait,woman', 200, 200, 200),
  memberSince: '2024',
};

/** Demo order history. */
export const SAMPLE_ORDERS = [
  {
    id: 'ORD-1042',
    date: '2026-06-12',
    status: 'Delivered',
    total: 5747,
    items: [
      { _id: 'wn-001', name: 'Banarasi Silk Saree', variant: 'Gold · M', qty: 1, price: 2999, image: img('saree', 11, 200, 250) },
      { _id: 'wn-018', name: 'Kundan Bridal Necklace Set', variant: 'Gold', qty: 1, price: 1999, image: img('necklace,gold', 71, 200, 250) },
      { _id: 'wn-014', name: 'Phulkari Embroidered Dupatta', variant: 'Maroon', qty: 1, price: 899, image: img('dupatta,scarf', 51, 200, 250) },
    ],
  },
  {
    id: 'ORD-1039',
    date: '2026-05-28',
    status: 'Shipped',
    total: 3499,
    items: [
      { _id: 'wn-003', name: 'Bandhani Georgette Saree', variant: 'Saffron · L', qty: 1, price: 1999, image: img('saree,fashion', 13, 200, 250) },
      { _id: 'wn-021', name: 'Meenakari Jhumka Earrings', variant: 'Gold', qty: 2, price: 699, image: img('earrings,gold', 81, 200, 250) },
    ],
  },
  {
    id: 'ORD-1031',
    date: '2026-05-04',
    status: 'Processing',
    total: 1999,
    items: [
      { _id: 'wn-018', name: 'Kundan Bridal Necklace Set', variant: 'Gold', qty: 1, price: 1999, image: img('necklace,gold', 71, 200, 250) },
    ],
  },
];

/** Demo saved addresses. */
export const SAMPLE_ADDRESSES = [
  { id: 'addr-1', label: 'Home', name: 'Priya Sharma', phone: '+91 98765 43210', line: '123, Linking Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', isDefault: true },
  { id: 'addr-2', label: 'Work', name: 'Priya Sharma', phone: '+91 98765 43210', line: '456, IT Park, Hinjewadi Phase 2', city: 'Pune', state: 'Maharashtra', pincode: '411057', isDefault: false },
];
