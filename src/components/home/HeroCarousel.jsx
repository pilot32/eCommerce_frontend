import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../../constants/sampleData';
import SmartImage from '../ui/SmartImage';
import Container from '../ui/Container';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import { cn } from '../../utils/cn';

const AUTOPLAY_MS = 5000;

/**
 * Full-bleed hero carousel over HERO_SLIDES.
 * Autoplays every 5s (paused on hover), with arrow + dot controls and a
 * crossfade between slides. Each slide layers a SmartImage background, a warm
 * ink gradient for text contrast, and the slide copy + CTAs.
 */
export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = HERO_SLIDES.length;

  const goTo = useCallback((i) => setActive((i + count) % count), [count]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Autoplay via a functional update so the interval never needs the latest
  // `active` (no ref-during-render, no interval churn).
  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  return (
    <section
      aria-label="Featured collections"
      aria-roledescription="carousel"
      className="relative isolate min-h-[72vh] overflow-hidden bg-ink lg:min-h-[82vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {HERO_SLIDES.map((slide, i) => {
        const isActive = i === active;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={cn(
              'absolute inset-0 transition-all duration-700 ease-out',
              isActive ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-4 opacity-0'
            )}
          >
            <SmartImage
              src={slide.image}
              alt={slide.title.replace(/\n/g, ' ')}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/35 to-transparent" />

            <Container className="relative flex min-h-[72vh] items-center lg:min-h-[82vh]">
              <div className="max-w-xl py-16">
                {slide.eyebrow && (
                  <p className="mb-3 font-accent text-xs uppercase tracking-[0.22em] text-gold-light">
                    {slide.eyebrow}
                  </p>
                )}
                <h1 className="whitespace-pre-line font-heading text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="mt-5 max-w-md text-base text-cream/90 sm:text-lg">{slide.subtitle}</p>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  {slide.cta && (
                    <Button to={slide.cta.to} size="lg">
                      {slide.cta.label}
                    </Button>
                  )}
                  {slide.secondaryCta && (
                    <Button to={slide.secondaryCta.to} size="lg" variant="light">
                      {slide.secondaryCta.label}
                    </Button>
                  )}
                </div>
              </div>
            </Container>
          </div>
        );
      })}

      {/* Prev / next arrows */}
      <div className="pointer-events-none absolute inset-x-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-between sm:flex sm:px-2 lg:px-6">
        <IconButton
          label="Previous slide"
          variant="outline"
          size="lg"
          className="pointer-events-auto bg-cream/90 backdrop-blur"
          onClick={prev}
        >
          <ChevronLeft size={20} />
        </IconButton>
        <IconButton
          label="Next slide"
          variant="outline"
          size="lg"
          className="pointer-events-auto bg-cream/90 backdrop-blur"
          onClick={next}
        >
          <ChevronRight size={20} />
        </IconButton>
      </div>

      {/* Dot indicators */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2.5">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={cn(
              'h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
              i === active ? 'w-8 bg-gold' : 'w-2.5 bg-cream/60 hover:bg-cream'
            )}
          />
        ))}
      </div>
    </section>
  );
}
