import { RotateCw, Home, ServerCrash } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

/**
 * ServerError (500) — STANDALONE full-screen page shown when the app shell
 * fails. Includes its own Logo and centers its content.
 */
export default function ServerError() {
  return (
    <main className="flex min-h-screen flex-col bg-ivory px-4 py-8">
      <header className="flex justify-center sm:justify-start">
        <Logo size="md" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-glow text-gold-dark">
          <ServerCrash size={32} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <p className="text-gold-gradient font-heading text-7xl font-semibold leading-none sm:text-8xl">
          500
        </p>

        <h1 className="mt-4 font-heading text-3xl text-ink sm:text-4xl">
          Something went wrong
        </h1>
        <div className="rule-gold mx-auto mt-4 w-24" />

        <p className="mt-4 max-w-md text-ink-soft">
          A little knot tangled on our end. Our team has been notified — please
          try again in a moment, and thank you for your patience.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            leftIcon={<RotateCw size={18} />}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
          <Button to="/" variant="outline" size="lg" leftIcon={<Home size={18} />}>
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
