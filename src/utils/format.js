/**
 * Formatting helpers — pure functions, no side effects.
 */

/**
 * Format a number as Indian Rupees, e.g. 24999 -> "₹24,999".
 * @param {number|string} value
 * @returns {string}
 */
export function formatCurrency(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/**
 * Percentage saved between an original and discounted price.
 * @returns {number} e.g. 40 (meaning 40% off), or 0 when there is no saving.
 */
export function calcDiscountPercent(price, discountedPrice) {
  const p = Number(price);
  const d = Number(discountedPrice);
  if (!Number.isFinite(p) || !Number.isFinite(d) || d <= 0 || d >= p) return 0;
  return Math.round(((p - d) / p) * 100);
}

/**
 * Truncate text to a maximum length, adding an ellipsis.
 * @param {string} text
 * @param {number} max
 */
export function truncate(text, max = 80) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

/**
 * Pluralise a noun based on count: pluralize(1,'item') -> "1 item".
 */
export function pluralize(count, singular, plural) {
  const word = count === 1 ? singular : plural || `${singular}s`;
  return `${count} ${word}`;
}

/**
 * Friendly date, e.g. "12 Jun 2026".
 */
export function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Build a URL-friendly slug from a string.
 */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
