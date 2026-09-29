import { useState, useEffect } from 'react';
import { heroSlidesApi } from '../services/homeContentApi';
import { useToast } from '../context/ToastContext';

const EMPTY_FORM = {
  eyebrow: '',
  title: '',
  subtitle: '',
  cta: { label: '', to: '' },
  secondaryCta: { label: '', to: '' },
  image: '',
  align: 'left',
  isActive: true,
  order: 0,
};

export default function HeroSlides() {
  const { addToast } = useToast();

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ── helpers ────────────────────────────────────────────────────────────────

  const fetchSlides = async () => {
    try {
      const res = await heroSlidesApi.getAll(false); // false = include inactive
      const data = res.data?.data || res.data || [];
      setSlides(Array.isArray(data) ? data : []);
    } catch {
      addToast('Failed to fetch hero slides', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const setCtaField = (key, value) =>
    setForm(f => ({ ...f, cta: { ...f.cta, [key]: value } }));
  const setSecCtaField = (key, value) =>
    setForm(f => ({ ...f, secondaryCta: { ...f.secondaryCta, [key]: value } }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (slide) => {
    setForm({
      eyebrow: slide.eyebrow || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      cta: { label: slide.cta?.label || '', to: slide.cta?.to || '' },
      secondaryCta: {
        label: slide.secondaryCta?.label || '',
        to: slide.secondaryCta?.to || '',
      },
      image: slide.image || '',
      align: slide.align || 'left',
      isActive: slide.isActive ?? true,
      order: slide.order ?? 0,
    });
    setEditingId(slide._id);
    setShowForm(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Strip empty secondaryCta so the API doesn't reject it
    const payload = { ...form };
    if (!payload.secondaryCta.label && !payload.secondaryCta.to) {
      delete payload.secondaryCta;
    }

    try {
      if (editingId) {
        await heroSlidesApi.update(editingId, payload);
        addToast('Hero slide updated', 'success');
      } else {
        await heroSlidesApi.create(payload);
        addToast('Hero slide created', 'success');
      }
      resetForm();
      fetchSlides();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (slide) => {
    try {
      await heroSlidesApi.updateStatus(slide._id, { isActive: !slide.isActive });
      addToast(`Slide marked ${slide.isActive ? 'inactive' : 'active'}`, 'success');
      fetchSlides();
    } catch (err) {
      addToast(err.response?.data?.message || 'Status update failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hero slide?')) return;
    try {
      await heroSlidesApi.delete(id);
      addToast('Hero slide deleted', 'success');
      fetchSlides();
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  // ── shared input classes ───────────────────────────────────────────────────
  const inputCls =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── page header ── */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage the full-width slides shown at the top of the homepage.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Add Slide
        </button>
      </div>

      {/* ── error banner ── */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      {/* ── form ── */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            {editingId ? 'Edit Hero Slide' : 'Add New Hero Slide'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1 — title (required) + eyebrow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setField('title', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="e.g. New Banarasi Silk"
                />
              </div>
              <div>
                <label className={labelCls}>Eyebrow</label>
                <input
                  type="text"
                  value={form.eyebrow}
                  onChange={e => setField('eyebrow', e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Exclusive Launch"
                />
              </div>
            </div>

            {/* Row 2 — subtitle */}
            <div>
              <label className={labelCls}>Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={e => setField('subtitle', e.target.value)}
                className={inputCls}
                placeholder="e.g. Handwoven sarees for every occasion"
              />
            </div>

            {/* Row 3 — image URL + align */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>Image URL *</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={e => setField('image', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className={labelCls}>Text Alignment</label>
                <select
                  value={form.align}
                  onChange={e => setField('align', e.target.value)}
                  className={inputCls}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>

            {/* Row 4 — CTA (required) */}
            <div>
              <p className={labelCls}>Primary CTA *</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={form.cta.label}
                  onChange={e => setCtaField('label', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="Button label (e.g. Shop Now)"
                />
                <input
                  type="text"
                  value={form.cta.to}
                  onChange={e => setCtaField('to', e.target.value)}
                  required
                  className={inputCls}
                  placeholder="Route (e.g. /shop)"
                />
              </div>
            </div>

            {/* Row 5 — Secondary CTA (optional) */}
            <div>
              <p className={labelCls}>Secondary CTA <span className="text-gray-400 font-normal">(optional)</span></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={form.secondaryCta.label}
                  onChange={e => setSecCtaField('label', e.target.value)}
                  className={inputCls}
                  placeholder="Button label (e.g. New Arrivals)"
                />
                <input
                  type="text"
                  value={form.secondaryCta.to}
                  onChange={e => setSecCtaField('to', e.target.value)}
                  className={inputCls}
                  placeholder="Route (e.g. /shop?filter=new)"
                />
              </div>
            </div>

            {/* Row 6 — order + isActive */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Display Order</label>
                <input
                  type="number"
                  min="0"
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
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            {/* Image preview */}
            {form.image && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Preview</p>
                <img
                  src={form.image}
                  alt="preview"
                  className="h-32 rounded-lg object-cover border border-gray-200"
                  onError={e => (e.target.style.display = 'none')}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {submitting ? 'Saving...' : editingId ? 'Update Slide' : 'Create Slide'}
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
          </form>
        </div>
      )}

      {/* ── table ── */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading slides...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Order</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Image</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Title / Eyebrow</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">CTA</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Align</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {slides.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400 text-sm">
                    No hero slides yet. Click <strong>+ Add Slide</strong> to create one.
                  </td>
                </tr>
              ) : (
                slides.map(slide => (
                  <tr key={slide._id} className="hover:bg-gray-50">
                    {/* order */}
                    <td className="px-5 py-4 text-sm text-gray-500 text-center">{slide.order}</td>
                    {/* image */}
                    <td className="px-5 py-4">
                      {slide.image ? (
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-20 h-12 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                    {/* title / eyebrow */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">{slide.title}</p>
                      {slide.eyebrow && (
                        <p className="text-xs text-gray-400 mt-0.5">{slide.eyebrow}</p>
                      )}
                    </td>
                    {/* cta */}
                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-gray-700">{slide.cta?.label}</p>
                      <p className="text-xs text-gray-400">{slide.cta?.to}</p>
                    </td>
                    {/* align */}
                    <td className="px-5 py-4 text-sm text-gray-500 capitalize">{slide.align}</td>
                    {/* status toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(slide)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          slide.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {slide.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    {/* actions */}
                    <td className="px-5 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(slide._id)}
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
