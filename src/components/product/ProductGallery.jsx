import { useState } from 'react';
import { cn } from '../../utils/cn';
import SmartImage from '../ui/SmartImage';
import Badge from '../ui/Badge';
import { getDiscountPercent } from '../../utils/product';

/**
 * Product image gallery — a large 4:5 hero image plus a row/column of
 * thumbnails that switch the active image (local index state). The active
 * thumbnail gets a gold ring; every control is keyboard operable & labelled.
 */
export default function ProductGallery({ product, className }) {
  const [active, setActive] = useState(0);

  const images = product.images?.length ? product.images : [undefined];
  const discount = getDiscountPercent(product);

  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row-reverse sm:gap-5', className)}>
      {/* Main image */}
      <div className="relative flex-1">
        <div className="overflow-hidden rounded-image border border-sand/60 bg-cream shadow-card">
          <SmartImage
            key={active}
            src={images[active]}
            alt={`${product.name} — view ${active + 1}`}
            className="aspect-[4/5] w-full animate-fade-in"
          />
        </div>

        <div className="absolute left-4 top-4 flex flex-col gap-1.5">
          {discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
          {product.isNew && <Badge variant="new">New</Badge>}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <ul
          className="no-scrollbar flex gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible"
          aria-label="Product image thumbnails"
        >
          {images.map((src, i) => {
            const isActive = i === active;
            return (
              <li key={i} className="flex-none">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1} of ${images.length}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'block h-20 w-16 overflow-hidden rounded-image border bg-cream transition-all duration-200 sm:w-full',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                    isActive
                      ? 'border-gold ring-2 ring-gold'
                      : 'border-sand/60 opacity-80 hover:opacity-100'
                  )}
                >
                  <SmartImage
                    src={src}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    className="h-full w-full"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
