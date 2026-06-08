import { useState, useEffect } from 'react';
import { categoryApi } from '../services/categoryApi';
import { useToast } from '../context/ToastContext';

export default function Categories() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', slug: '', isActive: true, image: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      const data = res.data.categories || res.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch categories');
      addToast('Failed to fetch categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm({ name: '', slug: '', isActive: true, image: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingId) {
        await categoryApi.update(editingId, form);
        addToast('Category updated successfully!', 'success');
      } else {
        await categoryApi.create(form);
        addToast('Category created successfully!', 'success');
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      isActive: cat.isActive ?? true,
      image: cat.image || '',
    });
    setEditingId(cat._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryApi.delete(id);
      addToast('Category deleted successfully!', 'success');
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Delete failed';
      setError(msg);
      addToast(msg, 'error');
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      await categoryApi.updateStatus(cat._id, { isActive: !cat.isActive });
      addToast(`Category marked as ${cat.isActive ? 'inactive' : 'active'}`, 'success');
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Status update failed';
      setError(msg);
      addToast(msg, 'error');
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading categories...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="auto-generated if empty"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
  <button
    type="submit"
    disabled={submitting}
    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
  >
    {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
  </button>
  <button
    type="button"
    onClick={resetForm}
    disabled={submitting}
    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
  >
    Cancel
  </button>
</div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">No categories found</td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat.slug || '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}