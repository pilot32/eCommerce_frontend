import { useEffect, useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import StoreHeader from '../components/layout/StoreHeader';
import StoreFooter from '../components/layout/StoreFooter';
import PageLoader from '../components/ui/PageLoader';

/**
 * Storefront shell: sticky header + page (Outlet) + footer.
 * Scrolls to top and fades content in on every route change, and shows a
 * back-to-top button once the user scrolls down.
 */
export default function StoreLayout() {
  const { pathname } = useLocation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <StoreHeader />
      <main className="flex-1">
        <div key={pathname} className="animate-fade-in">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <StoreFooter />

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 animate-scale-in items-center justify-center rounded-full bg-gold text-ink shadow-lift transition-transform hover:scale-110"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
