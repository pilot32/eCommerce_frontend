import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { formatCurrency, formatDate } from '../utils/format';

const formatStatus = (status) => String(status || '')
  .toLowerCase()
  .split('_')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ');

const EMPTY_DASHBOARD = {
  metrics: {},
  recentOrders: [],
  lowStockProducts: [],
  topSellingProducts: [],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await adminApi.getDashboard();
        setDashboard(response.data?.data || response.data || EMPTY_DASHBOARD);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;

  const metrics = dashboard.metrics || {};
  const cards = [
    { label: 'Delivered Revenue', value: formatCurrency(metrics.totalRevenue || 0), color: 'bg-emerald-500' },
    { label: 'Total Orders', value: metrics.totalOrders || 0, color: 'bg-blue-500' },
    { label: 'Orders to Process', value: metrics.pendingOrders || 0, color: 'bg-amber-500' },
    { label: 'Customers', value: metrics.totalCustomers || 0, color: 'bg-violet-500' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Live store performance and operational alerts.</p>
        </div>
        <button type="button" onClick={() => navigate('/admin/orders')} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
          View Orders
        </button>
      </div>

      {error && <p className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-5">
            <span className={`inline-block h-3 w-3 rounded-full ${card.color}`} />
            <p className="text-sm text-gray-500 mt-3">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <span className="text-xs text-gray-500">{metrics.confirmedOrders || 0} confirmed · {metrics.shippedOrders || 0} in transit</span>
          </div>
          {dashboard.recentOrders?.length ? (
            <div className="divide-y divide-gray-100">
              {dashboard.recentOrders.map((order) => (
                <button key={order._id} type="button" onClick={() => navigate(`/admin/orders/${order._id}`)} className="w-full px-5 py-3 text-left hover:bg-gray-50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.shippingAddress?.fullName || 'Customer'} · {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.grandTotal)}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatStatus(order.orderStatus)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : <p className="px-5 py-8 text-sm text-gray-500">No orders yet.</p>}
        </section>

        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Low Stock</h2>
            <span className="text-xs text-gray-500">{metrics.lowStockProductCount || 0} product(s) at or below threshold</span>
          </div>
          {dashboard.lowStockProducts?.length ? (
            <div className="divide-y divide-gray-100">
              {dashboard.lowStockProducts.map((product) => (
                <button key={product._id} type="button" onClick={() => navigate('/admin/products')} className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {product.images?.[0] && <img src={product.images[0]} alt="" className="h-9 w-9 rounded object-cover" />}
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-amber-700">{product.stock} left</span>
                </button>
              ))}
            </div>
          ) : <p className="px-5 py-8 text-sm text-gray-500">No low-stock products.</p>}
        </section>
      </div>

      <section className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Top Selling Products</h2>
        </div>
        {dashboard.topSellingProducts?.length ? (
          <div className="divide-y divide-gray-100">
            {dashboard.topSellingProducts.map((product) => (
              <div key={product._id} className="px-5 py-3 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.quantitySold} sold · {formatCurrency(product.sales)}</p>
              </div>
            ))}
          </div>
        ) : <p className="px-5 py-8 text-sm text-gray-500">Sales data will appear after orders are confirmed.</p>}
      </section>
    </div>
  );
}
