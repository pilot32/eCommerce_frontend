import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/Button';
import SmartImage from '../ui/SmartImage';
import ProductCard from '../product/ProductCard';

/** A single editorial moment that breaks up otherwise regular product grids. */
export default function EditorialFeature({ products = [] }) {
  const [feature, ...supporting] = products;
  if (!feature) return null;

  return (
    <section className="bg-cream py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="grid overflow-hidden border border-sand/70 bg-ivory lg:grid-cols-[1.15fr_0.85fr]">
          <Link to={`/product/${feature._id}`} className="group relative block min-h-[24rem] overflow-hidden sm:min-h-[32rem]">
            <SmartImage
              src={feature.images?.[0]}
              alt={feature.name}
              className="absolute inset-0 h-full w-full"
              imgClassName="transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-cream sm:inset-x-8 sm:bottom-8">
              <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold-light">The Wornora edit</p>
              <h2 className="mt-2 font-heading text-3xl text-cream sm:text-4xl">{feature.name}</h2>
              <span className="mt-4 inline-flex items-center gap-2 font-accent text-sm font-semibold">
                Explore the piece <ArrowRight size={16} />
              </span>
            </div>
          </Link>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold-dark">A considered pairing</p>
            <h2 className="mt-3 font-heading text-3xl text-ink sm:text-4xl">A little more to discover</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
              Explore a focused selection instead of another long product rail. Each piece keeps the attention on material, silhouette and craft.
            </p>
            <Button to="/shop" variant="outline" className="mt-7 w-fit" rightIcon={<ArrowRight size={17} />}>
              Shop the full collection
            </Button>

            {supporting.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                {supporting.slice(0, 2).map((product) => <ProductCard key={product._id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
