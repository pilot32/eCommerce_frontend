/**
 * cn — tiny className combiner.
 * Joins truthy string/array args into a single space-separated className.
 * Keeps us dependency-free (no clsx / tailwind-merge needed).
 *
 * @param {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default cn;
