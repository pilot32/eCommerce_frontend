import { useCatalog } from '../hooks/useCatalog';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import Section from '../components/ui/Section';
import ProductRail from '../components/product/ProductRail';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryShowcase from '../components/home/CategoryShowcase';
import PromoBanners from '../components/home/PromoBanners';
import WhyShopWithUs from '../components/home/WhyShopWithUs';
import Testimonials from '../components/home/Testimonials';

/**
 * Storefront home — the showcase page. Top to bottom: hero carousel, category
 * showcase, new arrivals rail, promo banners, featured collection rail, the
 * brand promise strip and customer testimonials.
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
          <ProductGridSkeleton count={3} />
        ) : (
          <ProductRail products={newArrivals} />
        )}
      </Section>

      <PromoBanners />

      <Section eyebrow="Curated" title="Featured Collection" viewAllTo="/shop" className="bg-cream">
        {loading ? (
          <ProductGridSkeleton count={3} />
        ) : (
          <ProductRail products={featuredCollection} />
        )}
      </Section>

      <WhyShopWithUs />

      <Testimonials />
    </>
  );
}
