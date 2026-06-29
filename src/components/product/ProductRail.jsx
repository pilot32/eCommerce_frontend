import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import IconButton from '../ui/IconButton';
import { cn } from '../../utils/cn';

/**
 * Horizontally scrolling product rail with snap + desktop arrow controls.
 * Used for New Arrivals / Featured on Home and for Related Products.
 */
export default function ProductRail({ products = [], className }) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className={cn('group/rail relative', className)}>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:gap-6"
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="w-[72%] flex-none snap-start sm:w-[45%] lg:w-[31.5%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between lg:flex">
        <IconButton
          label="Scroll left"
          variant="outline"
          className="pointer-events-auto -ml-5 bg-cream opacity-0 shadow-card transition-opacity group-hover/rail:opacity-100"
          onClick={() => scroll(-1)}
        >
          <ChevronLeft size={18} />
        </IconButton>
        <IconButton
          label="Scroll right"
          variant="outline"
          className="pointer-events-auto -mr-5 bg-cream opacity-0 shadow-card transition-opacity group-hover/rail:opacity-100"
          onClick={() => scroll(1)}
        >
          <ChevronRight size={18} />
        </IconButton>
      </div>
    </div>
  );
}
