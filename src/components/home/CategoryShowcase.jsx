import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categoryTilesApi } from '../../services/homeContentApi';
import { useHomeContent } from '../../hooks/useHomeContent';
import Section from '../ui/Section';
import SmartImage from '../ui/SmartImage';

/**
 * "Shop by Category" — a grid of overlaid image tiles, each linking into the
 * shop with a subtle hover zoom on the photo.
 */
export default function CategoryShowcase() {
  const tiles = useHomeContent(categoryTilesApi);
  if (!tiles.length) return null;
  return (
    <Section eyebrow="Explore" title="Shop by Category" className="bg-ivory">
      <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {tiles.map((tile) => (
          <li key={tile._id}>
            <Link
              to={tile.to}
              className="group relative block overflow-hidden rounded-card shadow-soft transition-shadow duration-300 hover:shadow-lift"
            >
              <SmartImage
                src={tile.image}
                alt={tile.name}
                className="aspect-[4/5] w-full"
                imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-heading text-xl text-cream sm:text-2xl">{tile.name}</h3>
                <span className="mt-1 inline-flex items-center gap-1.5 font-accent text-xs uppercase tracking-[0.18em] text-gold-light">
                  Shop Now
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
