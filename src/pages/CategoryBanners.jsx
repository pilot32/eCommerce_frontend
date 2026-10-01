import { useCallback, useEffect, useState } from 'react';
import { categoryTilesApi } from '../services/homeContentApi';
import { uploadImages } from '../services/productApi';
import { useToast } from '../context/ToastContext';
import ContentImageInput from '../components/admin/ContentImageInput';
import FieldHelp from '../components/admin/FieldHelp';
import { CATEGORIES } from '../constants/shop';
import { CATEGORY_TILES } from '../constants/sampleData';

const EMPTY = { name: '', slug: '', to: '/shop', image: '', order: 0, isActive: true };
const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm';
const destinations = CATEGORIES.flatMap(category => [
  { name: category.name, to: `/shop?category=${category.slug}` },
  ...category.subcategories.map(sub => ({ name: sub.name, to: `/shop?category=${category.slug}&subcategory=${sub.slug}` })),
]);
const slugify = value => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function CategoryBanners() {
  const { addToast } = useToast();
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const response = await categoryTilesApi.getAll(false);
      const data = response.data?.data || response.data;
      setTiles(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not load category banners. Please retry.');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const field = (key, value) => setForm(previous => ({ ...previous, [key]: value }));
  const open = (tile = EMPTY) => {
    setForm({ name: tile.name, slug: tile.slug, to: tile.to, image: tile.image, order: tile.order ?? 0, isActive: tile.isActive ?? true });
    setEditingId(tile._id || null);
    setImageFile(null);
    setError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const save = async event => {
    event.preventDefault();
    setError('');
    if (!imageFile && !form.image) { setError('Choose an image before saving.'); return; }
    const to = form.to.trim();
    if (!/^\/shop(?:\?|$)/.test(to)) { setError('Use a shop destination such as /shop?category=jewellery.'); return; }
    setBusy(true);
    try {
      const payload = { ...form, name: form.name.trim(), slug: form.slug.trim(), to };
      if (imageFile) {
        const response = await uploadImages(imageFile);
        const url = response.data?.result?.secure_url;
        if (!url) throw new Error('Image upload failed. Please try again.');
        payload.image = url;
        field('image', url);
        setImageFile(null);
      }
      if (editingId) await categoryTilesApi.update(editingId, payload);
      else await categoryTilesApi.create(payload);
      setShowForm(false);
      addToast('Category banner saved', 'success');
      await refresh();
    } catch (err) { setError(err.response?.data?.message || err.message || 'Could not save banner.'); }
    finally { setBusy(false); }
  };
  const change = async (tile, remove = false) => {
    if (remove && !window.confirm(`Delete the ${tile.name} banner? This does not delete the product category.`)) return;
    setBusy(true);
    setError('');
    try {
      if (remove) await categoryTilesApi.delete(tile._id);
      else await categoryTilesApi.updateStatus(tile._id, { isActive: !tile.isActive });
      if (remove && editingId === tile._id) setShowForm(false);
      addToast(remove ? 'Banner deleted' : 'Visibility updated', 'success');
      await refresh();
    } catch (err) { setError(err.response?.data?.message || 'Could not update banner.'); }
    finally { setBusy(false); }
  };

  return <div>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-2xl font-bold text-gray-900">Category Banners</h1>
        <p className="mt-1 text-sm text-gray-500">Manage the image cards in “Shop by Category” on the homepage. Product categories are managed separately.</p></div>
      <button disabled={busy} onClick={() => open()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">+ Add Category Banner</button>
    </div>
    <details className="mb-5 rounded-lg border border-gray-200 bg-white p-4"><summary className="cursor-pointer text-sm font-medium">Start from a previous sample card</summary>
      <div className="mt-4 flex flex-wrap gap-3">{CATEGORY_TILES.map((tile, index) => <button disabled={busy} key={tile.slug} onClick={() => open({ ...tile, order: index })} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Start with {tile.name}</button>)}</div>
    </details>
    {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error} <button type="button" disabled={busy} onClick={() => { setError(''); refresh(); }} className="underline">Reload list</button></div>}
    {showForm && <form onSubmit={save} className="mb-6 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-5 text-lg font-semibold">{editingId ? 'Edit Category Banner' : 'Add Category Banner'}</h2>
      <fieldset disabled={busy} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div><label htmlFor="tile-name" className="mb-1 block text-sm font-medium">Display name *</label>
            <input id="tile-name" className={inputClass} required value={form.name} placeholder="e.g. Sarees" onChange={event => {
              const name = event.target.value;
              setForm(previous => ({ ...previous, name, slug: !editingId && previous.slug === slugify(previous.name) ? slugify(name) : previous.slug }));
            }} /></div>
          <div><label htmlFor="tile-slug" className="mb-1 block text-sm font-medium">Unique name (slug) *<FieldHelp label="Unique name">A unique identifier such as silk-sarees. Use lowercase letters, numbers and hyphens. It does not determine where the card links.</FieldHelp></label>
            <input id="tile-slug" className={inputClass} required pattern="[a-z0-9-]+" value={form.slug} onChange={event => field('slug', event.target.value)} /></div>
        </div>
        <ContentImageInput key={editingId || "new"} image={form.image} file={imageFile} onChange={setImageFile} disabled={busy} category />
        <div><label htmlFor="tile-preset" className="mb-1 block text-sm font-medium">Choose a shop destination<FieldHelp label="Shop destination">Clicking this card opens the shop with the selected category filter. You can also enter a custom shop link below.</FieldHelp></label>
          <select id="tile-preset" className={inputClass} value={destinations.some(item => item.to === form.to) || form.to === '/shop' ? form.to : 'custom'} onChange={event => { if (event.target.value !== 'custom') field('to', event.target.value); }}>
            <option value="/shop">All products</option>
            {destinations.map(item => <option key={item.to} value={item.to}>{item.name}</option>)}
            <option value="custom" disabled>Custom destination (edit below)</option>
          </select>
          <label htmlFor="tile-to" className="mb-1 mt-3 block text-sm">Destination link *</label>
          <input id="tile-to" className={inputClass} required value={form.to} onChange={event => field('to', event.target.value)} placeholder="/shop?category=jewellery" />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div><label htmlFor="tile-order" className="mr-2 text-sm">Display order<FieldHelp label="Display order">Smaller numbers appear first: 0, 1, 2.</FieldHelp></label><input id="tile-order" className="w-20 rounded-lg border border-gray-300 p-2" type="number" min="0" step="1" required value={form.order} onChange={event => field('order', Number(event.target.value))} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={event => field('isActive', event.target.checked)} />Visible on homepage</label>
        </div>
        <p className="text-xs text-gray-500">Images upload when you save. Hidden banners remain here for editing.</p>
        <div className="flex gap-3"><button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-white">{busy ? 'Uploading / saving...' : 'Save Banner'}</button><button type="button" onClick={() => setShowForm(false)} className="rounded-lg bg-gray-100 px-5 py-2">Cancel</button></div>
      </fieldset>
    </form>}
    {loading ? <p>Loading category banners...</p> : tiles.length === 0 ? <div className="rounded-lg bg-white p-6 shadow">
      <p className="font-medium">No saved category banners yet.</p><p className="mt-2 text-sm text-gray-500">Add your own, or start from one of the previous sample cards above. Review and save each card to show it on the homepage.</p>

    </div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{tiles.map(tile => <article key={tile._id} className="overflow-hidden rounded-lg bg-white shadow">
      <img src={tile.image} alt={tile.name} className="h-44 w-full object-cover" />
      <div className="space-y-3 p-4"><h2 className="font-semibold">{tile.name}</h2><p className="break-all text-xs text-gray-500">{tile.to}</p><p className="text-sm">Order: {tile.order} · {tile.isActive ? 'Visible' : 'Hidden'}</p>
        <div className="flex flex-wrap gap-4 text-sm"><button disabled={busy} onClick={() => open(tile)} className="text-blue-700">Edit</button><button disabled={busy} onClick={() => change(tile)} className="text-blue-700">{tile.isActive ? 'Hide' : 'Show'}</button><button disabled={busy} onClick={() => change(tile, true)} className="text-red-600">Delete</button></div>
      </div></article>)}</div>}
  </div>;
}
