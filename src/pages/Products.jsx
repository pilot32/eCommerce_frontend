import { useState, useEffect, useRef } from 'react';
import { productApi} from '../services/productApi';
import { categoryApi } from '../services/categoryApi';
import { subcategoryApi } from '../services/subcategoryApi';
import { useToast } from '../context/ToastContext';
import { uploadImages } from '../services/productApi';

const emptyForm = {
  name: '', description: '', categoryId: '', subcategoryId: '',
  price: '', discountedPrice: '', stock: '', images: [],
  style: '', material: '', colors: [], sizes: '', tags: '', careInstructions: '',
  isActive: true, featured: false,
};

const toCsv = (value) => Array.isArray(value) ? value.join(', ') : value || '';

const fromCsv = (value) => (value || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const normalizeColors = (colors) => Array.isArray(colors)
  ? colors.map((color) => ({
      name: color.name || '',
      hex: color.hex || '',
    }))
  : [];

const getId = (value) => value && typeof value === 'object' ? value._id : value;

export default function Products() {
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  //file uploading state and function
  const [uploading,setUploading]=useState(false);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll();
      const data = res.data.products || res.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch products');
      addToast('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      const data = res.data.categories || res.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) { setSubcategories([]); return; }
    try {
      const res = await subcategoryApi.getAll({ categoryId });
      const data = res.data.subcategories || res.data || [];
      setSubcategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setSubcategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSubcategories([]);
  };
  //hadler to manage the file upload function
const handleFileSelect = (e) => {
    const files = e.target.files;
    //console.log('Raw e.target.files:', files);
    //console.log('File count:', files.length);
    if (!files || files.length === 0) return;
    
    const fileArray = [];
    for (let i = 0; i < files.length; i++) {
      fileArray.push(files[i]);
    }
    //console.log('File array:', fileArray.map(f => ({ name: f.name, size: f.size, type: f.type })));
    uploadFiles(fileArray);
};

const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const fileArray = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        fileArray.push(files[i]);
      }
    }
    //console.log('Dropped files:', fileArray.map(f => ({ name: f.name, size: f.size, type: f.type })));
    uploadFiles(fileArray);
};

const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

const uploadFiles = async (files) => {
    //console.log('uploadFiles received:', files);
    if (!Array.isArray(files) || files.length === 0) return;

    setUploading(true);

    try {
      let urls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
       // console.log('Uploading file:', file.name, file.size, file.type);
        const res = await uploadImages(file);
        const secureUrl = res.data?.result?.secure_url || res.data?.result?.url;
        if (secureUrl) {
          urls.push(secureUrl);
        }
      }

      //console.log('Extracted URLs:', urls);

      if (urls.length > 0) {
        setForm((prev) => {
          const updated = { ...prev, images: [...prev.images, ...urls] };
          //console.log('Updated form.images:', updated.images);
          return updated;
        });
        addToast(`${urls.length} image(s) uploaded!`, 'success');
      } else {
        addToast('Upload succeeded but no URLs found', 'warning');
      }
    } catch (err) {
      //console.log('UPLOAD ERROR:', err.message);
      //console.log('ERROR DATA:', err.response?.data);
      addToast('Image upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addColor = () => {
    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: '', hex: '' }],
    }));
  };

  const updateColor = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((color, i) => (
        i === index ? { ...color, [field]: value } : color
      )),
    }));
  };

  const removeColor = (index) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  //handles to submit final
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: form.stock ? Number(form.stock) : undefined,
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined,
      images: form.images,
      categoryId: form.categoryId || undefined,
      subcategoryId: form.subcategoryId || undefined,
      style: form.style.trim(),
      material: form.material.trim(),
      colors: form.colors
        .map((color) => ({
          name: color.name.trim(),
          hex: color.hex.trim(),
        }))
        .filter((color) => color.name),
      sizes: fromCsv(form.sizes),
      tags: fromCsv(form.tags),
      careInstructions: form.careInstructions.trim(),
    };
    try {
      if (editingId) {
        await productApi.update(editingId, payload);
        addToast('Product updated successfully!', 'success');
      } else {
        await productApi.create(payload);
        addToast('Product created successfully!', 'success');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || '', description: product.description || '',
      categoryId: getId(product.categoryId) || '', subcategoryId: getId(product.subcategoryId) || '',
      price: product.price || '', discountedPrice: product.discountedPrice || '',
      stock: product.stock || '',

      images: Array.isArray(product.images)
        ? [...product.images]
        : typeof product.images === 'string'
          ? product.images.split(',').map(u => u.trim()).filter(Boolean)
          : [],
      style: product.style || '',
      material: product.material || '',
      colors: normalizeColors(product.colors),
      sizes: toCsv(product.sizes),
      tags: toCsv(product.tags),
      careInstructions: product.careInstructions || '',
      isActive: product.isActive ?? true, featured: product.featured || false,
    });
    setEditingId(product._id);
    setShowForm(true);
    if (getId(product.categoryId)) fetchSubcategories(getId(product.categoryId));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productApi.delete(id);
      addToast('Product deleted successfully!', 'success');
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Delete failed';
      setError(msg);
      addToast(msg, 'error');
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      await productApi.updateStatus(product._id, { isActive: !product.isActive });
      addToast(`Product marked as ${product.isActive ? 'inactive' : 'active'}`, 'success');
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Status update failed';
      setError(msg);
      addToast(msg, 'error');
    }
  };

  const getCategoryName = (catId) => {
    const id = getId(catId);
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.name : '-';
  };

  if (loading) return <p className="text-gray-500">Loading products...</p>;

return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Product
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.categoryId} onChange={(e) => { setForm({ ...form, categoryId: e.target.value, subcategoryId: '' }); fetchSubcategories(e.target.value); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Category</option>
                  {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <select value={form.subcategoryId} onChange={(e) => setForm({ ...form, subcategoryId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price</label>
                <input type="number" value={form.discountedPrice} onChange={(e) => setForm({ ...form, discountedPrice: e.target.value })} min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style / Type</label>
                <input type="text" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} placeholder="Kurti, Top, Earrings" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material / Fabric</label>
                <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} placeholder="Cotton, Silk, Alloy" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
                <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-400 mt-1">Use comma separated values.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="festive, casual, summer" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-gray-400 mt-1">Use comma separated values.</p>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Colors</label>
                  <button type="button" onClick={addColor} className="text-sm font-medium text-blue-600 hover:text-blue-800">Add Color</button>
                </div>
                {form.colors.length === 0 ? (
                  <p className="text-sm text-gray-400 border border-dashed border-gray-300 rounded-lg p-3">No colors added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {form.colors.map((color, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_160px_auto] gap-3 items-center">
                        <input type="text" value={color.name} onChange={(e) => updateColor(index, 'name', e.target.value)} placeholder="Color name, e.g. Red" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" value={color.hex} onChange={(e) => updateColor(index, 'hex', e.target.value)} placeholder="#B11226" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button type="button" onClick={() => removeColor(index)} className="text-sm font-medium text-red-600 hover:text-red-800">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
                <textarea value={form.careInstructions} onChange={(e) => setForm({ ...form, careInstructions: e.target.value })} rows="2" placeholder="Hand wash separately, dry in shade..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>

                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {uploading ? (
                    <p className="text-blue-500 text-sm">Uploading...</p>
                  ) : (
                    <>
                      <p className="text-gray-500 text-sm">Click or drag images here to upload</p>
                      <p className="text-gray-400 text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </>
                  )}
                </div>

                {/* Image Previews */}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {form.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Product ${index + 1}`} className="w-24 h-24 object-cover rounded-lg border" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors">
                {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" onClick={resetForm} disabled={submitting} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Featured</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">No products found</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No img</div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-48">{product.style || product.description}</p>
                          {product.colors?.length > 0 && (
                            <p className="text-xs text-gray-400 truncate max-w-48">Colors: {product.colors.map((color) => color.name).join(', ')}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{getCategoryName(product.categoryId)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="font-medium">₹{product.price}</span>
                      {product.discountedPrice && <span className="text-gray-400 line-through ml-2 text-xs">₹{product.discountedPrice}</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.stock ?? '-'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggleStatus(product)} className={`px-3 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {product.featured ? <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">Featured</span> : <span className="text-gray-400 text-xs">No</span>}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

}



