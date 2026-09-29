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
};

/** A single expandable order card. */
function OrderRow({ order }) {
  const [expanded, setExpanded] = useState(false);
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Card className="overflow-hidden p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-heading text-lg text-ink">{order.id}</h3>
            <Badge variant={STATUS_VARIANT[order.status] || 'neutral'}>
              {order.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-ink-mute">{formatDate(order.date)}</p>
        </div>

        <div className="text-right">
          <p className="font-heading text-lg text-ink">{formatCurrency(order.total)}</p>
          <p className="text-sm text-ink-mute">{pluralize(itemCount, 'item')}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {order.items.map((item) => (
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
          {order.items.map((item) => (
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
export default function OrderHistory({ orders = [] }) {
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
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  );
}
