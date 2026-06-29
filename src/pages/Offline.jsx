import { WifiOff, RotateCw } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

/**
 * Offline — STANDALONE full-screen page shown when there is no internet
 * connection. Includes its own Logo and centers its content.
 */
export default function Offline() {
  return (
    <main className="flex min-h-screen flex-col bg-ivory px-4 py-8">
      <header className="flex justify-center sm:justify-start">
        <Logo size="md" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-glow text-gold-dark">
          <WifiOff size={36} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <h1 className="font-heading text-3xl text-ink sm:text-4xl">
          No internet connection
        </h1>
        <div className="rule-gold mx-auto mt-4 w-24" />

        <p className="mt-4 max-w-md text-ink-soft">
          It looks like you’ve lost your connection. Don’t worry — your cart and
          wishlist are safe. Check your network and try again when you’re back
          online.
        </p>

        <div className="mt-8">
          <Button
            size="lg"
            leftIcon={<RotateCw size={18} />}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    </main>
  );
}
