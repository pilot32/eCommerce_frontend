import { cn } from '../../utils/cn';
import ProductCard from './ProductCard';

/**
 * Responsive product grid — 1 column on mobile, 2 on tablet, 3 on desktop
 * (per the design spec). Cards fade up with a small stagger.
 */
export default function ProductGrid({ products = [], className }) {
  return (
    <div className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3', className)}>
      {products.map((product, i) => (
        <div
          key={product._id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
