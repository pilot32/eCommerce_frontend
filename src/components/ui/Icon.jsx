import {
  // USP / feature icons
  Sparkles,
  Truck,
  RefreshCw,
  ShieldCheck,
  // Empty-state icons
  Heart,
  MapPin,
  Package,
  PackageOpen,
  PackageX,
  SearchX,
  ShoppingBag,
  Circle,
} from 'lucide-react';

/**
 * Resolve an icon by name (so constants/props can reference icons as strings).
 *
 * Uses an explicit registry — importing icons by name keeps the bundle
 * tree-shakeable (a wildcard `import *` would pull in all ~1500 Lucide icons).
 * Lucide no longer ships brand logos, so the four social glyphs are provided as
 * small inline SVGs. Unknown names fall back to a circle.
 */

/** Build a filled brand-glyph component with the Lucide-style props API. */
const brand = (label, path) =>
  function BrandIcon({ size = 24, ...props }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        role="img"
        aria-label={label}
        {...props}
      >
        <path d={path} />
      </svg>
    );
  };

const Instagram = brand(
  'Instagram',
  'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.35 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.35-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.06-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.35-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.06-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.35 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88'
);

const Facebook = brand(
  'Facebook',
  'M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07'
);

const Youtube = brand(
  'YouTube',
  'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81M9.55 15.57V8.43L15.82 12l-6.27 3.57'
);

const Twitter = brand(
  'X',
  'M18.24 2.25h3.31l-7.23 8.26L23.13 21.75h-6.63l-5.21-6.82-5.96 6.82H1.66l7.73-8.84L.87 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z'
);

const REGISTRY = {
  Sparkles,
  Truck,
  RefreshCw,
  ShieldCheck,
  Heart,
  MapPin,
  Package,
  PackageOpen,
  PackageX,
  SearchX,
  ShoppingBag,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
};

export default function Icon({ name, ...props }) {
  const Cmp = REGISTRY[name] || Circle;
  return <Cmp {...props} />;
}
