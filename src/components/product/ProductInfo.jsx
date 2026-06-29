import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Heart, RefreshCw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import Rating from '../ui/Rating';
import PriceTag from '../ui/PriceTag';
import QuantityStepper from '../ui/QuantityStepper';
import Badge from '../ui/Badge';
import { isInStock } from '../../utils/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

const REASSURANCE = [
  { icon: Truck, text: 'Free delivery in 3–5 days' },
  { icon: RefreshCw, text: '7-day easy returns & exchange' },
  { icon: ShieldCheck, text: '100% secure payments' },
];

/**
 * Right-hand column on the product page: eyebrow, title, rating, price,
 * description, colour & size selectors, quantity, the add-to-cart / buy-now /
 * wishlist actions, and a reassurance block. Receives the product and owns
 * only the local buying-intent state (selected colour/size/quantity).
 */
export default function ProductInfo({ product, className }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const isJewellery = product.category === 'jewellery';
  const inStock = isInStock(product);
  const maxQty = Math.min(product.stock || 10, 10) || 10;

  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');
  // Jewellery is one-size, so pre-select it; clothing must be chosen explicitly.
  const [selectedSize, setSelectedSize] = useState(isJewellery ? sizes[0] || '' : '');
  const [quantity, setQuantity] = useState(1);

  const wished = isWishlisted(product._id);

  /** Validate, then add to cart. Returns true when the item was added. */
  const tryAddToCart = () => {
    if (!inStock) {
      addToast('This piece is currently out of stock', 'warning');
      return false;
    }
    if (!isJewellery && !selectedSize) {
      addToast('Please select a size', 'warning');
      return false;
    }
    addToCart(product, quantity);
    return true;
  };

  const handleAddToCart = () => {
    if (tryAddToCart()) {
      addToast(`${product.name} added to cart`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (tryAddToCart()) navigate('/cart');
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product);
    addToast(added ? 'Added to wishlist' : 'Removed from wishlist', added ? 'success' : 'info');
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Eyebrow */}
      <p className="font-accent text-xs uppercase tracking-[0.2em] text-gold-dark">
        {product.material || product.subcategoryName || product.categoryName}
      </p>

      {/* Title */}
      <h1 className="mt-2 font-heading text-3xl text-ink lg:text-4xl">{product.name}</h1>

      {/* Rating */}
      <div className="mt-3">
        <Rating value={product.rating} count={product.reviewCount} size={16} />
      </div>

      {/* Price */}
      <div className="mt-4">
        <PriceTag product={product} size="lg" />
      </div>

      {/* Description */}
      {product.description && (
        <p className="mt-5 max-w-prose leading-relaxed text-ink-soft">{product.description}</p>
      )}

      <div className="rule-gold my-7 w-full" />

      {/* Colour selector */}
      {colors.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 font-accent text-sm font-semibold text-ink">
            Colour: <span className="font-normal text-ink-soft">{selectedColor}</span>
          </p>
          <ul className="flex flex-wrap gap-3" aria-label="Select a colour">
            {colors.map((color) => {
              const isSelected = color.name === selectedColor;
              return (
                <li key={color.name}>
                  <button
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={`Colour ${color.name}`}
                    aria-pressed={isSelected}
                    title={color.name}
                    className={cn(
                      'relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                      isSelected
                        ? 'border-gold ring-2 ring-gold ring-offset-2 ring-offset-ivory'
                        : 'border-sand hover:border-gold-dark'
                    )}
                  >
                    <span
                      className="h-7 w-7 rounded-full border border-ink/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    {isSelected && (
                      <Check
                        size={16}
                        strokeWidth={3}
                        className="absolute text-cream drop-shadow"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Size selector */}
      {sizes.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-accent text-sm font-semibold text-ink">
              {isJewellery ? 'Size' : 'Select Size'}
            </p>
            {!isJewellery && (
              <button
                type="button"
                onClick={() => addToast('Size guide coming soon', 'info')}
                className="font-accent text-xs font-medium text-gold-dark underline-offset-2 transition-colors hover:text-ink hover:underline"
              >
                Size guide
              </button>
            )}
          </div>
          <ul className="flex flex-wrap gap-2.5" aria-label="Select a size">
            {sizes.map((size) => {
              const isSelected = size === selectedSize;
              return (
                <li key={size}>
                  <button
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={isSelected}
                    className={cn(
                      'inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-btn border px-4 font-accent text-sm font-semibold transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                      isSelected
                        ? 'border-gold bg-gold text-ink shadow-soft'
                        : 'border-sand bg-cream text-ink hover:border-gold-dark'
                    )}
                  >
                    {size}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Quantity + stock note */}
      <div className="mb-7 flex flex-wrap items-center gap-4">
        <div>
          <p className="mb-3 font-accent text-sm font-semibold text-ink">Quantity</p>
          <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={maxQty} />
        </div>
        {inStock ? (
          product.stock != null && product.stock <= 5 && (
            <Badge variant="soft">Only {product.stock} left</Badge>
          )
        ) : (
          <Badge variant="outOfStock">Out of Stock</Badge>
        )}
      </div>

      {/* Action row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          size="lg"
          className="flex-1"
          disabled={!inStock}
          leftIcon={<ShoppingBag size={18} />}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="flex-1"
          disabled={!inStock}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
        <Button
          size="lg"
          variant="outline"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className="sm:w-12 sm:flex-none sm:px-0"
          onClick={handleWishlist}
          leftIcon={<Heart size={18} className={cn(wished && 'fill-maroon text-maroon')} />}
        >
          <span className="sm:hidden">{wished ? 'Wishlisted' : 'Add to Wishlist'}</span>
        </Button>
      </div>

      {/* Reassurance block */}
      <ul className="mt-8 space-y-3 rounded-card border border-sand/60 bg-cream p-5">
        {REASSURANCE.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gold-glow text-gold-dark">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <span className="font-accent text-sm text-ink-soft">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
