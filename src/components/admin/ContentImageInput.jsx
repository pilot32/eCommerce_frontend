import { useEffect, useId, useState } from 'react';
export default function ContentImageInput({ image, file, onChange, disabled, hero, category = false }) {
  const id = useId();
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const select = e => {
    const next = e.target.files?.[0]; e.target.value = '';
    if (!next) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(next.type)) { setError('Choose a JPG, PNG, or WebP image.'); return; }
    if (next.size > 5 * 1024 * 1024) { setError('Choose an image no larger than 5 MB.'); return; }
    setError(''); onChange(next);
  };
  const src = file ? preview : image;
  return <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{image || file ? 'Replace image' : 'Upload image'} *</label>
    <input id={id} type="file" accept="image/jpeg,image/png,image/webp" onChange={select} disabled={disabled} aria-describedby={`${id}-hint`} className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white" />
    <p id={`${id}-hint`} className="mt-2 text-xs text-gray-500">JPG, PNG or WebP · Up to 5 MB. {hero ? 'Use a wide image, ideally 1920 × 900 px. Leave space for text.' : category ? 'Use a portrait image, ideally 800 × 1000 px (4:5).' : 'Use a landscape image, ideally 1200 × 900 px (4:3).'} Images may be cropped to fit.</p>
    {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    {file && <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600"><span>{file.name} · Uploads when you save</span><button type="button" disabled={disabled} onClick={() => onChange(null)} className="text-blue-700 underline">{image ? 'Keep original image' : 'Clear selection'}</button></div>}
    {src && <img src={src} alt="Selected image preview" className="mt-3 max-h-48 w-full rounded-lg bg-white object-contain" />}
  </div>;
}
