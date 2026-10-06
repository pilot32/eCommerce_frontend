import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Card from '../ui/Card';
import SmartImage from '../ui/SmartImage';
import PriceTag from '../ui/PriceTag';
import QuantityStepper from '../ui/QuantityStepper';
import IconButton from '../ui/IconButton';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/format';
import { getEffectivePrice } from '../../utils/product';

/**
 * A single line in the cart — thumbnail, name, variant, unit price,
 * quantity stepper, line total and a remove button.
 * Stacks on mobile, becomes a horizontal row from `sm:` upwards.
 */
export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { addToast } = useToast();

  const productLink = `/product/${item._id}`;
  const lineTotal = getEffectivePrice(item) * item.quantity;

  const variant = [
    item.selectedSize && `Size: ${item.selectedSize}`,
    item.selectedColor && `Colour: ${item.selectedColor}`,
  ].filter(Boolean).join(' · ');

  const handleRemove = async () => {
    try {
      await removeFromCart(item._id, item);
      addToast(`${item.name} removed from cart`, 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not remove item', 'error');
    }
  };

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Thumbnail */}
        <Link
          to={productLink}
          className="block shrink-0 self-start sm:self-auto"
          aria-label={item.name}
        >
          <SmartImage
            src={item.images?.[0]}
            alt={item.name}
            className="aspect-[4/5] w-24 rounded-image sm:w-28"
          />
        </Link>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={productLink}
                className="font-heading text-base text-ink transition-colors hover:text-gold-dark sm:text-lg"
              >
                {item.name}
              </Link>
              {variant && (
                <p className="mt-0.5 font-accent text-sm text-ink-soft">{variant}</p>
              )}
              {item.sizes?.length > 0 && !item.selectedSize && (
                <p className="mt-0.5 text-sm text-ink-soft">Size not selected — remove this item and choose a size.</p>
              )}
              <div className="mt-1.5">
                <PriceTag product={item} size="sm" />
              </div>
            </div>

            {/* Remove (desktop placement) */}
            <IconButton
              label="Remove"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="hidden text-ink-mute hover:text-maroon sm:inline-flex"
            >
              <Trash2 size={18} />
            </IconButton>
          </div>

          {/* Quantity + line total */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <QuantityStepper
              value={item.quantity}
              onChange={(q) => updateQuantity(item._id, q, item).catch((err) => {
                addToast(err.response?.data?.message || 'Could not update quantity', 'error');
              })}
              max={10}
              size="sm"
            />

            <div className="flex items-center gap-3">
              <span className="font-accent text-base font-semibold text-ink">
                {formatCurrency(lineTotal)}
              </span>
              {/* Remove (mobile placement) */}
              <IconButton
                label="Remove"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-ink-mute hover:text-maroon sm:hidden"
              >
                <Trash2 size={18} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
