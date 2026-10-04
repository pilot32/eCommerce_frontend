import { useCatalog } from '../hooks/useCatalog';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import Section from '../components/ui/Section';
import ProductGrid from '../components/product/ProductGrid';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryShowcase from '../components/home/CategoryShowcase';
import EditorialFeature from '../components/home/EditorialFeature';
import WhyShopWithUs from '../components/home/WhyShopWithUs';

/**
 * Storefront home — a focused path from an editorial opening to category
 * discovery, a compact product grid, one featured story and useful policy help.
 */
export default function Home() {
  const { products, loading } = useCatalog();

  // Prefer flagged products; fall back to the first 8 so rails stay populated.
  const newOnes = products.filter((p) => p.isNew);
  const featured = products.filter((p) => p.featured);
  const newArrivals = newOnes.length ? newOnes : products.slice(0, 8);
  const featuredCollection = featured.length ? featured : products.slice(0, 8);

  return (
    <>
      <HeroCarousel />

      <CategoryShowcase />

      <Section eyebrow="Just In" title="New Arrivals" viewAllTo="/shop?filter=new" className="bg-ivory">
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <ProductGrid products={newArrivals.slice(0, 8)} />
        )}
      </Section>

      {!loading && <EditorialFeature products={featuredCollection.slice(0, 3)} />}

      <WhyShopWithUs />
    </>
  );
}
