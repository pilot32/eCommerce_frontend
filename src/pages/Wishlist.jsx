import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import ProductGrid from '../components/product/ProductGrid';
import { useWishlist } from '../context/WishlistContext';
import { pluralize } from '../utils/format';

/**
 * Wishlist page — the customer's saved pieces. Items can be removed via the
 * heart toggle on each ProductCard. Shows a friendly empty state when bare.
 */
export default function Wishlist() {
  const { items, wishlistCount } = useWishlist();

  return (
    <Container className="py-10 sm:py-14">
      <header className="mb-8">
        <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold-dark">
          Saved For Later
        </p>
        <h1 className="mt-2 font-heading text-3xl text-ink sm:text-4xl">My Wishlist</h1>
        {wishlistCount > 0 && (
          <p className="mt-2 text-ink-soft">{pluralize(wishlistCount, 'saved item')}</p>
        )}
      </header>

      {wishlistCount === 0 ? (
        <EmptyState
          icon="Heart"
          title="Your wishlist is empty"
          description="Save your favourite pieces to find them here later."
          actionLabel="Explore Collection"
          actionTo="/shop"
        />
      ) : (
        <ProductGrid products={items} />
      )}
    </Container>
  );
}
