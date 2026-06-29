import { PROMO_BANNERS } from '../../constants/sampleData';
import Container from '../ui/Container';
import SmartImage from '../ui/SmartImage';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

/**
 * Maps a banner `accent` to a left border + eyebrow colour so each promo
 * carries its own festive tint without hardcoding hex values.
 */
const ACCENTS = {
  maroon: { border: 'border-l-maroon', eyebrow: 'text-maroon' },
  terracotta: { border: 'border-l-terracotta', eyebrow: 'text-terracotta' },
  gold: { border: 'border-l-gold', eyebrow: 'text-gold-dark' },
};

/**
 * A 3-up grid of promotional banners (festive sale / new edit / jewellery).
 * Each card pairs an image with copy and a CTA, tinted by its accent colour.
 */
export default function PromoBanners() {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROMO_BANNERS.map((banner) => {
            const accent = ACCENTS[banner.accent] || ACCENTS.gold;
            return (
              <li key={banner.id}>
                <article
                  className={cn(
                    'group flex h-full flex-col overflow-hidden rounded-card border border-sand/60 border-l-4 bg-cream shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
                    accent.border
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SmartImage
                      src={banner.image}
                      alt={banner.title}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {banner.eyebrow && (
                      <p
                        className={cn(
                          'mb-2 font-accent text-xs font-semibold uppercase tracking-[0.2em]',
                          accent.eyebrow
                        )}
                      >
                        {banner.eyebrow}
                      </p>
                    )}
                    <h3 className="font-heading text-2xl text-ink">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="mt-2 text-sm text-ink-soft">{banner.subtitle}</p>
                    )}
                    {banner.cta && (
                      <div className="mt-5 pt-1">
                        <Button to={banner.cta.to} variant="outline" size="sm">
                          {banner.cta.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
