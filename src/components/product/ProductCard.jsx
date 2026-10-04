import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { cn } from '../../utils/cn';
import SmartImage from '../ui/SmartImage';
import Badge from '../ui/Badge';
import PriceTag from '../ui/PriceTag';
import Rating from '../ui/Rating';
import { getDiscountPercent, isInStock } from '../../utils/product';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

/**
 * The catalogue product card — used on Home, Shop, Wishlist and Related.
 * 4:5 imagery, discount/new badges, wishlist toggle, hover zoom + quick add.
 */
export default function ProductCard({ product, className }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const wished = isWishlisted(product._id);
  const discount = getDiscountPercent(product);
  const inStock = isInStock(product);

  const handleWishlist = async (e) => {
    e.preventDefault();
    try {
      const added = await toggleWishlist(product);
      addToast(added ? 'Added to wishlist' : 'Removed from wishlist', added ? 'success' : 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not update wishlist', 'error');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!inStock) return;
    try {
      await addToCart(product, 1);
      addToast(`${product.name} added to cart`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not add item to cart', 'error');
    }
  };

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-lg border border-sand/60 bg-cream',
        'transition-colors duration-200 hover:border-gold/70',
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link to={`/product/${product._id}`} className="block h-full" aria-label={`View ${product.name}`}>
          <SmartImage
            src={product.images?.[0]}
            alt={product.name}
            className="h-full w-full"
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
            {product.isNew && <Badge variant="new">New</Badge>}
          </div>

          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-ivory/60">
              <Badge variant="outOfStock">Out of Stock</Badge>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className={cn(
            'absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cream/90 shadow-soft backdrop-blur transition-transform duration-200 hover:scale-105',
            wished ? 'text-maroon' : 'text-ink'
          )}
        >
          <Heart size={18} className={cn(wished && 'fill-maroon')} />
        </button>

        <div className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 lg:block">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inStock}
            className="flex w-full items-center justify-center gap-2 rounded-btn bg-gold py-2.5 font-accent text-sm font-semibold text-ink shadow-gold transition-colors hover:bg-gold-dark disabled:opacity-50"
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>
        </div>
      </div>

      <Link to={`/product/${product._id}`} className="block p-4">
        <p className="font-accent text-[11px] uppercase tracking-wider text-gold-dark">
          {product.material || product.categoryName}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.6rem] font-accent text-[15px] font-medium text-ink">{product.name}</h3>
        <div className="mt-1.5">
          <Rating value={product.rating} count={product.reviewCount} size={12} showValue={false} />
        </div>
        <div className="mt-2">
          <PriceTag product={product} size="sm" />
        </div>
      </Link>
    </article>
  );
}
