/**
 * Shop / catalogue constants: categories, sizes, sort options, pricing,
 * pagination. Used by filters, the shop grid and the data hooks.
 */

export const CATEGORIES = [
  {
    slug: 'clothing',
    name: 'Clothing',
    subcategories: [
      { slug: 'sarees', name: 'Sarees' },
      { slug: 'lehengas', name: 'Lehengas' },
      { slug: 'kurtis', name: 'Kurtis' },
      { slug: 'suits', name: 'Suits & Anarkalis' },
      { slug: 'dupattas', name: 'Dupattas' },
      { slug: 'gowns', name: 'Ethnic Gowns' },
    ],
  },
  {
    slug: 'jewellery',
    name: 'Jewellery',
    subcategories: [
      { slug: 'necklaces', name: 'Necklaces' },
      { slug: 'earrings', name: 'Earrings' },
      { slug: 'bangles', name: 'Bangles' },
      { slug: 'maang-tikka', name: 'Maang Tikka' },
      { slug: 'anklets', name: 'Anklets' },
      { slug: 'rings', name: 'Rings' },
    ],
  },
];

/** Flat lookup: slug -> { name, category } for every subcategory. */
export const SUBCATEGORY_LOOKUP = CATEGORIES.reduce((acc, cat) => {
  cat.subcategories.forEach((sub) => {
    acc[sub.slug] = { name: sub.name, category: cat.slug };
  });
  return acc;
}, {});

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Biggest Discount' },
];

export const PRICE_RANGE = { min: 0, max: 50000, step: 500 };

/** Products fetched per "page" for the infinite scroll grid (3 rows × 3). */
export const PRODUCTS_PER_PAGE = 9;
