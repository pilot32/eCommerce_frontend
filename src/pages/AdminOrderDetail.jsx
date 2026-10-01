import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { orderApi } from '../services/orderApi';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/format';

const ORDER_STATUSES = [
  'PLACED',
  'CONFIRMED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
];

const formatStatus = (status) =>
  String(status || '')
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getOrderFromResponse = (data) => data?.data?.order || data?.order || data?.data || data;

function InfoCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value || '-'}</span>
    </div>
  );
}

function AddressBlock({ address }) {
  if (!address) return <p className="text-sm text-gray-500">No address found</p>;

  return (
    <div className="text-sm text-gray-700 space-y-1">
      <p className="font-medium text-gray-900">{address.fullName || '-'}</p>
      <p>{address.email || '-'}</p>
      <p>{address.phone || '-'}</p>
      <p>{address.addressLine1}</p>
      {address.addressLine2 && <p>{address.addressLine2}</p>}
      <p>{[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}</p>
      <p>{address.country || 'India'}</p>
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({
    orderStatus: '',
    trackingNumber: '',
    trackingUrl: '',
    adminNote: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await orderApi.getById(id);
      const nextOrder = getOrderFromResponse(response.data);
      setOrder(nextOrder);
      setForm({
        orderStatus: nextOrder.orderStatus || 'PLACED',
        trackingNumber: nextOrder.trackingNumber || '',
        trackingUrl: nextOrder.trackingUrl || '',
        adminNote: nextOrder.adminNote || '',
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch order';
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await orderApi.updateStatus(id, {
        orderStatus: form.orderStatus,
        trackingNumber: form.trackingNumber,
        trackingUrl: form.trackingUrl,
        adminNote: form.adminNote,
      });
      const updatedOrder = getOrderFromResponse(response.data);
      setOrder(updatedOrder);
      setForm({
        orderStatus: updatedOrder.orderStatus || form.orderStatus,
        trackingNumber: updatedOrder.trackingNumber || '',
        trackingUrl: updatedOrder.trackingUrl || '',
        adminNote: updatedOrder.adminNote || '',
      });
      addToast('Order updated successfully', 'success');
    } catch (err) {
      const message = err.response?.data?.message || 'Order update failed';
      setError(message);
      addToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading order...</p>;

  if (error && !order) {
    return (
      <div>
        <button type="button" onClick={() => navigate('/admin/orders')} className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4">
          ← Back to orders
        </button>
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>
      </div>
    );
  }

  const payment = order.payment || {};
  const coupon = order.appliedCoupon || {};
  const items = order.orderItems || [];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Order {order.orderNumber || order._id}</h1>
          <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
          {formatStatus(order.orderStatus)}
        </span>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <InfoCard title="Order Items">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.slug}`} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-xs text-gray-500">Unit: {formatCurrency(item.unitPrice)}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          </InfoCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Shipping Address">
              <AddressBlock address={order.shippingAddress} />
            </InfoCard>
            <InfoCard title="Billing Address">
              <AddressBlock address={order.billingAddress} />
            </InfoCard>
          </div>

          {order.deliveryNotes && (
            <InfoCard title="Delivery Notes">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.deliveryNotes}</p>
            </InfoCard>
          )}
        </div>

        <div className="space-y-6">
          <InfoCard title="Payment Summary">
            <DetailRow label="Subtotal" value={formatCurrency(order.subTotal)} />
            <DetailRow label="Discount" value={formatCurrency(order.discountAmount)} />
            <DetailRow label="Delivery" value={formatCurrency(order.deliveryCharges)} />
            <DetailRow label="Tax" value={formatCurrency(order.tax)} />
            <DetailRow label="Grand Total" value={formatCurrency(order.grandTotal)} />
            <DetailRow label="Payment Method" value={payment.method} />
            <DetailRow label="Payment Status" value={formatStatus(payment.status)} />
            <DetailRow label="Transaction ID" value={payment.transactionId} />
            <DetailRow label="Paid At" value={payment.paidAt ? formatDate(payment.paidAt) : '-'} />
          </InfoCard>

          <InfoCard title="Coupon">
            <DetailRow label="Code" value={coupon.code} />
            <DetailRow label="Type" value={coupon.discountType} />
            <DetailRow label="Value" value={coupon.discountValue != null ? coupon.discountValue : '-'} />
          </InfoCard>

          <InfoCard title="Admin Controls">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                <select
                  value={form.orderStatus}
                  onChange={handleChange('orderStatus')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>{formatStatus(status)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={form.trackingNumber}
                  onChange={handleChange('trackingNumber')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking URL</label>
                <input
                  type="url"
                  value={form.trackingUrl}
                  onChange={handleChange('trackingUrl')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Note</label>
                <textarea
                  value={form.adminNote}
                  onChange={handleChange('adminNote')}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save Order'}
              </button>
            </form>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
