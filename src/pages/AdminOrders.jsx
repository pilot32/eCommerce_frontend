import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const PAYMENT_STATUSES = ['PENDING', 'PAID', 'COMPLETED', 'FAILED', 'REFUNDED'];

const formatStatus = (status) =>
  String(status || '')
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getOrdersFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data?.orders)) return data.data.orders;
  return [];
};

const getPaginationFromResponse = (data) =>
  data?.pagination || data?.data?.pagination || null;

export default function AdminOrders() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    orderStatus: '',
    paymentStatus: '',
  });
  const [draftStatus, setDraftStatus] = useState({});
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const fetchOrders = async (nextFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(
        Object.entries(nextFilters).filter(([, value]) => value)
      );
      const response = await orderApi.getAll(params);
      const list = getOrdersFromResponse(response.data);
      setOrders(list);
      setPagination(getPaginationFromResponse(response.data));
      setDraftStatus(
        list.reduce((acc, order) => ({
          ...acc,
          [order._id]: order.orderStatus,
        }), {})
      );
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch orders';
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilterChange = (field) => (e) =>
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleResetFilters = () => {
    const nextFilters = { search: '', orderStatus: '', paymentStatus: '' };
    setFilters(nextFilters);
    fetchOrders(nextFilters);
  };

  const handleStatusChange = (orderId) => (e) =>
    setDraftStatus((prev) => ({ ...prev, [orderId]: e.target.value }));

  const handleUpdateStatus = async (order) => {
    const nextStatus = draftStatus[order._id];
    if (!nextStatus || nextStatus === order.orderStatus) return;

    setUpdatingId(order._id);
    try {
      await orderApi.updateStatus(order._id, { orderStatus: nextStatus });
      addToast('Order status updated', 'success');
      await fetchOrders();
    } catch (err) {
      const message = err.response?.data?.message || 'Status update failed';
      setError(message);
      addToast(message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading orders...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          {pagination?.total !== undefined && (
            <p className="text-sm text-gray-500 mt-1">{pagination.total} total orders</p>
          )}
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleApplyFilters} className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={handleFilterChange('search')}
              placeholder="Order no, name, phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
            <select
              value={filters.orderStatus}
              onChange={handleFilterChange('orderStatus')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>{formatStatus(status)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={handleFilterChange('paymentStatus')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>{formatStatus(status)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No orders found</td></tr>
              ) : (
                orders.map((order) => {
                  const address = order.shippingAddress || {};
                  const itemCount = (order.orderItems || []).reduce(
                    (sum, item) => sum + (item.quantity || 0),
                    0
                  );

                  return (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="hover:bg-gray-50 align-top cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {order.orderNumber || order._id}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {address.fullName || order.userId?.name || '-'}
                        </p>
                        <p className="text-xs text-gray-500">{address.phone || order.userId?.email || '-'}</p>
                        <p className="text-xs text-gray-400 max-w-52 truncate">
                          {[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {itemCount} item{itemCount === 1 ? '' : 's'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{order.paymentMethod || '-'}</p>
                        <span className="inline-flex mt-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {formatStatus(order.paymentStatus || 'PENDING')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(order.grandTotal)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={draftStatus[order._id] || order.orderStatus || 'PLACED'}
                          onChange={handleStatusChange(order._id)}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>{formatStatus(status)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(order);
                          }}
                          disabled={updatingId === order._id || draftStatus[order._id] === order.orderStatus}
                          className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          {updatingId === order._id ? 'Updating...' : 'Update'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
