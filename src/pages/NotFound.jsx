import { Home, Search, Compass } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';

/**
 * NotFound (404) — friendly, centered. Renders inside StoreLayout (content only).
 */
export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-glow text-gold-dark animate-float">
        <Compass size={32} strokeWidth={1.5} aria-hidden="true" />
      </div>

      <p className="text-gold-gradient font-heading text-7xl font-semibold leading-none sm:text-8xl">
        404
      </p>

      <h1 className="mt-4 font-heading text-3xl text-ink sm:text-4xl">
        Page not found
      </h1>
      <div className="rule-gold mx-auto mt-4 w-24" />

      <p className="mt-4 max-w-md text-ink-soft">
        We couldn’t find the page you were looking for. It may have moved, or
        perhaps the thread led elsewhere. Let’s guide you back to something
        beautiful.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button to="/" size="lg" leftIcon={<Home size={18} />}>
          Back to Home
        </Button>
        <Button to="/shop" variant="outline" size="lg" leftIcon={<Search size={18} />}>
          Browse Shop
        </Button>
      </div>
    </Container>
  );
}
