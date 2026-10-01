import FieldHelp from '../components/admin/FieldHelp';
import ContentImageInput from '../components/admin/ContentImageInput';
import { uploadImages } from '../services/productApi';
import { useState, useEffect } from 'react';
import { promoBannersApi } from '../services/homeContentApi';
import { useToast } from '../context/ToastContext';

const ACCENT_OPTIONS = ['gold', 'maroon', 'terracotta'];

const EMPTY_FORM = {
  eyebrow: '',
  title: '',
  subtitle: '',
  cta: { label: '', to: '' },
  image: '',
  accent: 'gold',
  isActive: true,
  order: 0,
};

export default function PromoBanners() {
  const { addToast } = useToast();

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ── helpers ────────────────────────────────────────────────────────────────

  const fetchBanners = async () => {
    try {
      const res = await promoBannersApi.getAll(false);
      const data = res.data?.data || res.data || [];
      setBanners(Array.isArray(data) ? data : []);
    } catch {
      addToast('Failed to fetch promo banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const setCtaField = (key, value) =>
    setForm(f => ({ ...f, cta: { ...f.cta, [key]: value } }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (banner) => {
    setForm({
      eyebrow: banner.eyebrow || '',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      cta: { label: banner.cta?.label || '', to: banner.cta?.to || '' },
      image: banner.image || '',
      accent: banner.accent || 'gold',
      isActive: banner.isActive ?? true,
      order: banner.order ?? 0,
    });
    setImageFile(null);
    setEditingId(banner._id);
    setShowForm(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.image && !imageFile) { setError('Choose an image before saving.'); return; }
    setSubmitting(true);
    const payload = { ...form };
    try {
      if (imageFile) {
        const response = await uploadImages(imageFile);
        const url = response.data?.result?.secure_url;
        if (!url) throw new Error('Image upload failed. Please try again.');
        payload.image = url;
        setField('image', url);
        setImageFile(null);
      }
      if (editingId) {
        await promoBannersApi.update(editingId, payload);
        addToast('Promo banner updated', 'success');
      } else {
        await promoBannersApi.create(payload);
        addToast('Promo banner created', 'success');
      }
      resetForm();
      fetchBanners();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (banner) => {
    try {
      await promoBannersApi.updateStatus(banner._id, { isActive: !banner.isActive });
      addToast(`Banner marked ${banner.isActive ? 'inactive' : 'active'}`, 'success');
      fetchBanners();
    } catch (err) {
      addToast(err.response?.data?.message || 'Status update failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promo banner?')) return;
    try {
      await promoBannersApi.delete(id);
      addToast('Promo banner deleted', 'success');
      fetchBanners();
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  // ── accent colour dot map ──────────────────────────────────────────────────
  const accentDot = {
    gold: 'bg-yellow-500',
    maroon: 'bg-red-800',
    terracotta: 'bg-orange-600',
  };

  // ── shared input class ─────────────────────────────────────────────────────
  const inputCls =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── page header ── */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promo Banners</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage promotional banners displayed on the homepage.
          </p>
        </div>
        <button
          disabled={submitting}
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Add Banner
        </button>
      </div>

      {/* ── error banner ── */}
      {error && (
        <div role="alert" className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      {/* ── form ── */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            {editingId ? 'Edit Promo Banner' : 'Add New Promo Banner'}
          </h2>

          <form onSubmit={handleSubmit}>
            <p className="mb-5 text-sm text-gray-500">Fields marked * are required. Click an i button for help. Images upload when you save.</p>
            <fieldset disabled={submitting} className="space-y-5">
            {/* Row 1 — title (required) + eyebrow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Headline *<FieldHelp label="Headline">The main heading customers see, for example: Up to 40% Off.</FieldHelp></label>
                <input
                  type="text"
                  aria-label="Headline"
                  value={form.title}
                  onChange={e => setField('title', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="e.g. Up to 40% Off"
                />
              </div>
              <div>
                <label className={labelCls}>Small heading (eyebrow)<FieldHelp label="Small heading (eyebrow)">A short line above the main headline, such as Festive Sale or New Collection.</FieldHelp></label>
                <input
                  type="text"
                  aria-label="Small heading"
                  value={form.eyebrow}
                  onChange={e => setField('eyebrow', e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Festive Sale"
                />
              </div>
            </div>

            {/* Row 2 — subtitle */}
            <div>
              <label className={labelCls}>Supporting text<FieldHelp label="Supporting text">Extra details below the headline. A coupon mentioned here must also be configured separately to work at checkout.</FieldHelp></label>
              <input
                type="text"
                aria-label="Supporting text"
                  value={form.subtitle}
                onChange={e => setField('subtitle', e.target.value)}
                className={inputCls}
                placeholder="e.g. Use code FESTIVE20 at checkout"
              />
            </div>

            {/* Row 3 — image + accent */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <ContentImageInput key={editingId || "new"} image={form.image} file={imageFile} onChange={setImageFile} disabled={submitting} hero={false} />
              </div>
              <div>
                <label className={labelCls}>Highlight colour<FieldHelp label="Highlight colour">The colour of the card border and small heading. It does not recolour your photo.</FieldHelp></label>
                <select
                  aria-label="Highlight colour"
                  value={form.accent}
                  onChange={e => setField('accent', e.target.value)}
                  className={inputCls}
                >
                  {ACCENT_OPTIONS.map(a => (
                    <option key={a} value={a}>
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4 — CTA (required) */}
            <div>
              <p className={labelCls}>Button (CTA) *<FieldHelp label="Button (CTA)">CTA means Call to Action: a button inviting customers to do something. Enter its text (Shop Now) and destination (/shop).</FieldHelp></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={form.cta.label}
                  onChange={e => setCtaField('label', e.target.value)}
                  required
                  className={inputCls}
                  aria-label="Button text" placeholder="Button text (e.g. Shop Now)"
                />
                <input
                  type="text"
                  value={form.cta.to}
                  onChange={e => setCtaField('to', e.target.value)}
                  required
                  className={inputCls}
                  aria-label="Button destination" placeholder="Destination page (e.g. /shop?filter=sale)"
                />
              </div>
            </div>

            {/* Row 5 — order + isActive */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Display order<FieldHelp label="Display order">Smaller numbers appear first: 0, then 1, then 2.</FieldHelp></label>
                <input
                  type="number"
                  min="0"
                  aria-label="Display order"
                  value={form.order}
                  onChange={e => setField('order', Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setField('isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Visible on homepage</span>
              </label>
            </div>

            <p className="text-xs text-gray-500">Visible on homepage: uncheck to hide this item without deleting it.</p>
            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {submitting ? 'Uploading / saving...' : editingId ? 'Update Banner' : 'Create Banner'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
            </fieldset>
          </form>
        </div>
      )}

      {/* ── table ── */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading banners...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Order</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Image</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Headline / Small heading</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Button</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Accent</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400 text-sm">
                    No promo banners yet. Click <strong>+ Add Banner</strong> to create one.
                  </td>
                </tr>
              ) : (
                banners.map(banner => (
                  <tr key={banner._id} className="hover:bg-gray-50">
                    {/* order */}
                    <td className="px-5 py-4 text-sm text-gray-500 text-center">{banner.order}</td>
                    {/* image */}
                    <td className="px-5 py-4">
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-20 h-12 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                    {/* title */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">{banner.title}</p>
                      {banner.eyebrow && (
                        <p className="text-xs text-gray-400 mt-0.5">{banner.eyebrow}</p>
                      )}
                    </td>
                    {/* cta */}
                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-gray-700">{banner.cta?.label}</p>
                      <p className="text-xs text-gray-400">{banner.cta?.to}</p>
                    </td>
                    {/* accent */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-3 h-3 rounded-full inline-block ${accentDot[banner.accent] || 'bg-gray-300'}`}
                        />
                        <span className="text-sm text-gray-600 capitalize">{banner.accent}</span>
                      </div>
                    </td>
                    {/* status */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(banner)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          banner.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    {/* actions */}
                    <td className="px-5 py-4 text-right space-x-3">
                      <button
                        disabled={submitting}
                        onClick={() => handleEdit(banner)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
