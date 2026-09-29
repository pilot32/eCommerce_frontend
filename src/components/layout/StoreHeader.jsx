import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, Heart, ShoppingBag, User, ChevronDown } from 'lucide-react';
import Container from '../ui/Container';
import Logo from '../ui/Logo';
import IconButton from '../ui/IconButton';
import SearchBar from './SearchBar';
import MobileNav from './MobileNav';
import AnnouncementBar from './AnnouncementBar';
import { cn } from '../../utils/cn';
import { CATEGORIES } from '../../constants/shop';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?filter=new' },
];

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

  const navLinkClass = ({ isActive }) =>
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
        <Container className="flex h-16 items-center gap-3 lg:h-20 lg:gap-6">
          <IconButton label="Open menu" className="lg:hidden" onClick={() => setMenuOpen(true)}>
            <Menu size={22} />
          </IconButton>

          <Logo size="md" className="shrink-0" />

          <div className="mx-auto hidden w-full max-w-md lg:block">
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
          <Container className="flex h-12 items-center justify-center gap-8">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}

            {/* Categories mega menu */}
            <div className="group relative">
              <button className="inline-flex items-center gap-1 font-accent text-sm text-ink transition-colors hover:text-gold-dark">
                Categories
                <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="w-[560px] rounded-card border border-sand/60 bg-ivory p-6 shadow-lift">
                  <div className="grid grid-cols-2 gap-6">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.slug}>
                        <Link
                          to={`/shop?category=${cat.slug}`}
                          className="font-heading text-ink transition-colors hover:text-gold-dark"
                        >
                          {cat.name}
                        </Link>
                        <ul className="mt-2.5 space-y-1.5">
                          {cat.subcategories.map((sub) => (
                            <li key={sub.slug}>
                              <Link
                                to={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                                className="text-sm text-ink-soft transition-colors hover:text-gold-dark"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <NavLink to="/shop?filter=sale" className="font-accent text-sm font-medium text-maroon transition-colors hover:text-gold-dark">
              Festive Sale
            </NavLink>
          </Container>
        </nav>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
