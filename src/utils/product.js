import { slugify } from './format';

/**
 * Product helpers — keep all catalogue logic (normalising, pricing,
 * filtering, sorting) in one pure module so hooks and components stay thin.
 *
 * Storefront product shape (normalised):
 * {
 *   _id, name, slug, description,
 *   category: 'clothing' | 'jewellery', categoryName,
 *   subcategory, subcategoryName,
 *   price, discountedPrice (number|null),
 *   images: string[],
 *   rating, reviewCount,
 *   sizes: string[], colors: {name,hex}[],
 *   stock, featured, isNew, material, tags: string[]
 * }
 */

/** Price the customer actually pays. */
export function getEffectivePrice(product) {
  if (!product) return 0;
  return product.discountedPrice != null && product.discountedPrice > 0
    ? product.discountedPrice
    : product.price;
}

/** Discount percentage for a product (0 when none). */
export function getDiscountPercent(product) {
  if (!product || product.discountedPrice == null) return 0;
  const { price, discountedPrice } = product;
  if (discountedPrice <= 0 || discountedPrice >= price) return 0;
  return Math.round(((price - discountedPrice) / price) * 100);
}

export function isInStock(product) {
  return product?.stock == null ? true : product.stock > 0;
}

/**
 * Normalise a raw API product (or partial sample) into the storefront shape,
 * filling sensible defaults so the UI never has to null-check.
 */
export function normalizeProduct(raw) {
  if (!raw) return null;
  const name = raw.name || 'Untitled';
  const rawCategory = raw.categoryId || raw.category;
  const rawSubcategory = raw.subcategoryId || raw.subcategory;
  const categoryName =
    raw.categoryName ||
    (rawCategory && typeof rawCategory === 'object' ? rawCategory.name : '');
  const subcategoryName =
    raw.subcategoryName ||
    (rawSubcategory && typeof rawSubcategory === 'object' ? rawSubcategory.name : '');
  const category =
    raw.category ||
    (rawCategory && typeof rawCategory === 'object' ? rawCategory.slug : '') ||
    (typeof raw.categoryName === 'string'
      ? slugify(raw.categoryName)
      : 'clothing');
  const normalizedCategory = category === 'jewelry' ? 'jewellery' : category;
  const isJewellery = normalizedCategory === 'jewellery';

  const images = Array.isArray(raw.images)
    ? raw.images.filter(Boolean)
    : typeof raw.images === 'string'
      ? raw.images.split(',').map((u) => u.trim()).filter(Boolean)
      : [];

  return {
    _id: String(raw._id ?? raw.id ?? slugify(name)),
    name,
    slug: raw.slug || slugify(name),
    description: raw.description || '',
    category: normalizedCategory,
    categoryName: categoryName || (isJewellery ? 'Jewellery' : 'Clothing'),
    subcategory:
      raw.subcategory ||
      (rawSubcategory && typeof rawSubcategory === 'object' ? rawSubcategory.slug : '') ||
      '',
    subcategoryName,
    categoryId:
      rawCategory && typeof rawCategory === 'object' ? rawCategory._id : raw.categoryId,
    subcategoryId:
      rawSubcategory && typeof rawSubcategory === 'object' ? rawSubcategory._id : raw.subcategoryId,
    price: Number(raw.price) || 0,
    discountedPrice:
      raw.discountedPrice != null && Number(raw.discountedPrice) > 0
        ? Number(raw.discountedPrice)
        : null,
    images: images.length ? images : [],
    rating: Number(raw.rating) || 4.6,
    reviewCount: Number(raw.reviewCount ?? raw.reviews) || 0,
    sizes: Array.isArray(raw.sizes) ? raw.sizes.filter(Boolean) : [],
    colors: Array.isArray(raw.colors)
      ? raw.colors
          .filter((color) => color?.name)
          .map((color) => ({ name: color.name, hex: color.hex || '' }))
      : [],
    stock: raw.stock ?? 12,
    featured: Boolean(raw.featured),
    isNew: Boolean(raw.isNew),
    style: raw.style || '',
    material: raw.material || '',
    careInstructions: raw.careInstructions || '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
  };
}

/**
 * Apply storefront filters to a product list (client-side).
 * @param {object[]} products
 * @param {object} filters - { category, subcategories[], sizes[], minPrice, maxPrice, inStockOnly, search }
 */
export function filterProducts(products, filters = {}) {
  const {
    category,
    subcategories = [],
    sizes = [],
    minPrice,
    maxPrice,
    inStockOnly,
    search,
  } = filters;

  const query = search ? search.trim().toLowerCase() : '';

  return products.filter((p) => {
    if (category && p.category !== category) return false;
    if (subcategories.length && !subcategories.includes(p.subcategory)) return false;
    if (sizes.length && !sizes.some((s) => p.sizes.includes(s))) return false;
    if (inStockOnly && !isInStock(p)) return false;

    const effective = getEffectivePrice(p);
    if (minPrice != null && effective < minPrice) return false;
    if (maxPrice != null && effective > maxPrice) return false;

    if (query) {
      const haystack = `${p.name} ${p.description} ${p.style} ${p.material} ${p.subcategoryName} ${p.categoryName} ${p.tags.join(' ')} ${p.colors.map((color) => color.name).join(' ')}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

/**
 * Sort a product list by a known sort key (returns a new array).
 */
export function sortProducts(products, sortKey = 'featured') {
  const list = [...products];
  switch (sortKey) {
    case 'price-asc':
      return list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    case 'price-desc':
      return list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating);
    case 'discount':
      return list.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
    case 'newest':
      return list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case 'featured':
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}
