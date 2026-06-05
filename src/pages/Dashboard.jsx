import { useState, useEffect } from 'react';
import { categoryApi } from '../services/categoryApi';
import { productApi } from '../services/productApi';

export default function Dashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, activeProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryApi.getAll(),
          productApi.getAll(),
        ]);
        const categories = catRes.data.categories || catRes.data || [];
        const products = prodRes.data.products || prodRes.data || [];
        setStats({
          categories: Array.isArray(categories) ? categories.length : 0,
          products: Array.isArray(products) ? products.length : 0,
          activeProducts: Array.isArray(products)
            ? products.filter((p) => p.isActive).length
            : 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  const cards = [
    { label: 'Total Categories', value: stats.categories, color: 'bg-blue-500' },
    { label: 'Total Products', value: stats.products, color: 'bg-green-500' },
    { label: 'Active Products', value: stats.activeProducts, color: 'bg-purple-500' },
    { label: 'Inactive Products', value: stats.products - stats.activeProducts, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-6">
            <div className={`inline-block w-3 h-3 rounded-full ${card.color} mr-2`} />
            <p className="text-sm text-gray-500 mt-2">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}