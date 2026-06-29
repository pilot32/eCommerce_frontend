import { useParams } from 'react-router-dom';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Breadcrumb from '../components/ui/Breadcrumb';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductTabs from '../components/product/ProductTabs';
import ProductRail from '../components/product/ProductRail';
import { useProduct } from '../hooks/useProduct';

/** Two-column loading placeholder mirroring the gallery + info layout. */
function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <Skeleton className="aspect-[4/5] w-full rounded-image" />
      <div className="space-y-4 pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-11 rounded-full" />
          <Skeleton className="h-11 w-11 rounded-full" />
          <Skeleton className="h-11 w-11 rounded-full" />
        </div>
        <div className="flex gap-2.5 pt-2">
          <Skeleton className="h-11 w-14" />
          <Skeleton className="h-11 w-14" />
          <Skeleton className="h-11 w-14" />
        </div>
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      </div>
    </div>
  );
}

/**
 * Product Details page — gallery + buying panel, detail tabs, and a related
 * product rail. Handles loading (skeleton), not-found (empty state) and the
 * happy path. Rendered inside StoreLayout, so it returns only its own content.
 */
export default function ProductDetails() {
  const { id } = useParams();
  const { product, related, loading, error } = useProduct(id);

  if (loading) {
    return (
      <Container className="py-10 sm:py-14">
        <ProductDetailsSkeleton />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-10 sm:py-14">
        <EmptyState
          icon="PackageX"
          title="Product not found"
          description="This piece may no longer be available."
          actionLabel="Continue Shopping"
          actionTo="/shop"
        />
      </Container>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    {
      label: product.categoryName,
      to: `/shop?category=${product.category}`,
    },
    { label: product.name },
  ];

  return (
    <>
      <Container className="py-8 sm:py-10">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        <div className="mt-12 sm:mt-16">
          <ProductTabs product={product} />
        </div>
      </Container>

      {related.length > 0 && (
        <Section title="You May Also Like">
          <ProductRail products={related} />
        </Section>
      )}
    </>
  );
}
