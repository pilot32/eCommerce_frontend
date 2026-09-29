import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import SmartImage from '../ui/SmartImage';
import EmptyState from '../ui/EmptyState';
import { formatCurrency, formatDate, pluralize } from '../../utils/format';

/** Map an order status to a Badge variant. */
const STATUS_VARIANT = {
  Delivered: 'new',
  Shipped: 'gold',
  Processing: 'soft',
  Pending: 'neutral',
  DELIVERED: 'new',
  SHIPPED: 'gold',
  OUT_FOR_DELIVERY: 'gold',
  CONFIRMED: 'soft',
  PLACED: 'neutral',
  CANCELLED: 'sale',
  RETURNED: 'neutral',
};

const formatStatus = (status) =>
  String(status || 'Pending')
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const normalizeOrderItem = (item) => ({
  _id: item._id || item.productId?._id || item.productId || item.name,
  name: item.name || item.productName || item.productId?.name || 'Product',
  image: item.image || item.productImage || item.productId?.images?.[0] || '',
  variant: item.variant || '',
  qty: item.qty || item.quantity || 1,
  price: item.price || item.unitPrice || item.discountedPrice || 0,
});

const normalizeOrder = (order) => ({
  id: order.orderNumber || order.id || order._id,
  status: order.orderStatus || order.status || 'Pending',
  date: order.createdAt || order.date,
  total: order.grandTotal || order.total || 0,
  items: (order.orderItems || order.items || []).map(normalizeOrderItem),
  paymentMethod: order.paymentMethod,
});

/** A single expandable order card. */
function OrderRow({ order }) {
  const [expanded, setExpanded] = useState(false);
  const viewOrder = normalizeOrder(order);
  const itemCount = viewOrder.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Card className="overflow-hidden p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-heading text-lg text-ink">{viewOrder.id}</h3>
            <Badge variant={STATUS_VARIANT[viewOrder.status] || 'neutral'}>
              {formatStatus(viewOrder.status)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-ink-mute">{formatDate(viewOrder.date)}</p>
          {viewOrder.paymentMethod && (
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-mute">
              {viewOrder.paymentMethod}
            </p>
          )}
        </div>

        <div className="text-right">
          <p className="font-heading text-lg text-ink">{formatCurrency(viewOrder.total)}</p>
          <p className="text-sm text-ink-mute">{pluralize(itemCount, 'item')}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {viewOrder.items.map((item) => (
          <SmartImage
            key={item._id}
            src={item.image}
            alt={item.name}
            className="h-14 w-14 shrink-0 rounded-image"
          />
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          rightIcon={expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide Details' : 'View Details'}
        </Button>
      </div>

      {expanded && (
        <ul className="mt-2 divide-y divide-sand/70 border-t border-sand/70 pt-2">
          {viewOrder.items.map((item) => (
            <li key={item._id} className="flex items-center gap-4 py-3">
              <SmartImage
                src={item.image}
                alt={item.name}
                className="h-16 w-16 shrink-0 rounded-image"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{item.name}</p>
                {item.variant && (
                  <p className="text-sm text-ink-mute">{item.variant}</p>
                )}
              </div>
              <p className="shrink-0 text-sm text-ink-soft">
                {item.qty} &times; {formatCurrency(item.price)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/**
 * Customer order history — a list of expandable order cards,
 * or a friendly empty state when there are no orders.
 */
export default function OrderHistory({ orders = [], loading = false, signedIn = true }) {
  if (!signedIn) {
    return (
      <EmptyState
        icon="Package"
        title="Sign in to view orders"
        description="Your orders are saved to your account."
        actionLabel="Sign In"
        actionTo="/login"
      />
    );
  }

  if (loading) {
    return <p className="text-ink-soft">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="Package"
        title="No orders yet"
        description="When you place an order, it will appear here for easy tracking."
        actionLabel="Start Shopping"
        actionTo="/shop"
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderRow key={order.orderNumber || order.id || order._id} order={order} />
      ))}
    </div>
  );
}
