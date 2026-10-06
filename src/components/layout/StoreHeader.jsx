import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Heart, ShoppingBag, User } from 'lucide-react';
import Container from '../ui/Container';
import Logo from '../ui/Logo';
import IconButton from '../ui/IconButton';
import SearchBar from './SearchBar';
import MobileNav from './MobileNav';
import AnnouncementBar from './AnnouncementBar';
import { cn } from '../../utils/cn';
import { PRIMARY_NAV } from '../../constants/brand';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

/** Icon link with an optional count badge (header actions). */
function ActionLink({ to, label, badge = 0, children }) {
  return (
    <Link
      to={to}
      aria-label={label}
      title={label}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-all duration-200 hover:bg-beige active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark"
    >
      {children}
      {badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-semibold text-cream">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

export default function StoreHeader() {
  const { pathname, search } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const params = new URLSearchParams(search);
  const filter = params.get('filter');
  const category = params.get('category');
  // Shop links share a pathname, so query state determines the selected collection.
  const activeDestination = pathname !== '/shop' ? pathname
    : ['new', 'sale'].includes(filter) ? `/shop?filter=${filter}`
      : ['clothing', 'jewellery'].includes(category) ? `/shop?category=${category}`
        : '/shop';

  const navLinkClass = (isActive) =>
    cn(
      'font-accent text-sm transition-colors hover:text-gold-dark',
      isActive ? 'text-gold-dark' : 'text-ink'
    );

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />

      <div
        className={cn(
          'border-b border-sand/60 bg-ivory/95 backdrop-blur transition-shadow duration-300',
          scrolled && 'shadow-soft'
        )}
      >
        {/* Primary bar */}
        <Container className="flex h-16 items-center gap-3 lg:h-16 lg:gap-6">
          <IconButton label="Open menu" className="lg:hidden" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </IconButton>

          <Logo size="sm" className="shrink-0" />

          <div className="mx-auto hidden w-full max-w-sm lg:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
            <IconButton
              label="Search"
              className="lg:hidden"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search size={20} />
            </IconButton>
            <ActionLink to="/wishlist" label="Wishlist" badge={wishlistCount}>
              <Heart size={20} />
            </ActionLink>
            <ActionLink to="/cart" label="Cart" badge={cartCount}>
              <ShoppingBag size={20} />
            </ActionLink>
            <ActionLink to={user ? '/profile' : '/login'} label={user ? 'My account' : 'Login'}>
              <User size={20} />
            </ActionLink>
          </div>
        </Container>

        {/* Mobile search row */}
        {searchOpen && (
          <div className="border-t border-sand/60 px-4 py-3 lg:hidden">
            <SearchBar autoFocus onSubmitted={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Secondary nav (desktop) */}
        <nav className="hidden border-t border-sand/50 lg:block">
          <Container className="flex h-10 items-center justify-center gap-6">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={activeDestination === item.to ? 'page' : undefined}
                className={navLinkClass(activeDestination === item.to)}
              >
                {item.label}
              </Link>
            ))}

            <Link to="/shop?filter=sale" aria-current={activeDestination === '/shop?filter=sale' ? 'page' : undefined} className={cn('font-accent text-sm font-medium transition-colors hover:text-gold-dark', activeDestination === '/shop?filter=sale' ? 'text-gold-dark' : 'text-maroon')}>
              Festive Sale
            </Link>
          </Container>
        </nav>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
