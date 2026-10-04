import { cn } from '../../utils/cn';
import ProductCard from './ProductCard';

/**
 * Responsive retail grid — compact two-up scanning on mobile and progressively
 * wider density as space becomes available.
 */
export default function ProductGrid({ products = [], className }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4 xl:gap-6', className)}>
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
