import { Link } from 'react-router-dom';
import { ChevronRight, User, Heart, ShoppingBag } from 'lucide-react';
import Drawer from '../ui/Drawer';
import SearchBar from './SearchBar';
import { PRIMARY_NAV } from '../../constants/brand';
import { CATEGORIES } from '../../constants/shop';
import { useAuth } from '../../context/AuthContext';

/**
 * Left slide-in navigation for mobile/tablet.
 */
export default function MobileNav({ open, onClose }) {
  const { user } = useAuth();

  return (
    <Drawer open={open} onClose={onClose} side="left" title="Menu">
      <div className="space-y-7 p-5">
        <SearchBar onSubmitted={onClose} />

        <nav className="flex flex-col">
          {PRIMARY_NAV.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="flex items-center justify-between border-b border-sand/60 py-3 font-accent text-ink transition-colors hover:text-gold-dark"
            >
              {link.label}
              <ChevronRight size={16} className="text-sand" />
            </Link>
          ))}
        </nav>

        <div>
          <p className="mb-3 font-accent text-xs uppercase tracking-[0.18em] text-ink-mute">
            Shop by Category
          </p>
          {CATEGORIES.map((cat) => (
            <div key={cat.slug} className="mb-4">
              <Link
                to={`/shop?category=${cat.slug}`}
                onClick={onClose}
                className="font-heading text-ink"
              >
                {cat.name}
              </Link>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5">
                {cat.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    to={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                    onClick={onClose}
                    className="text-sm text-ink-soft transition-colors hover:text-gold-dark"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1 border-t border-sand/60 pt-4">
          <Link to={user ? '/profile' : '/login'} onClick={onClose} className="flex items-center gap-3 py-2.5 font-accent text-ink">
            <User size={18} className="text-gold-dark" /> {user ? 'My Account' : 'Login / Register'}
          </Link>
          <Link to="/wishlist" onClick={onClose} className="flex items-center gap-3 py-2.5 font-accent text-ink">
            <Heart size={18} className="text-gold-dark" /> Wishlist
          </Link>
          <Link to="/cart" onClick={onClose} className="flex items-center gap-3 py-2.5 font-accent text-ink">
            <ShoppingBag size={18} className="text-gold-dark" /> Cart
          </Link>
        </div>
      </div>
    </Drawer>
  );
}
