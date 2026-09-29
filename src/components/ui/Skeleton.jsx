import { cn } from '../../utils/cn';

/**
 * Shimmering skeleton block (uses the `.skeleton` class from index.css).
 */
export function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-md', className)} />;
}

/** Skeleton matching the ProductCard layout. */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-sand/60 bg-cream">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}

/** A responsive grid of product card skeletons. */
export function ProductGridSkeleton({ count = 6, className }) {
  return (
    <div className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
