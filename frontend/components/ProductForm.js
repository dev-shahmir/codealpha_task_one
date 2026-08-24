'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../lib/api';

const emptyVariant = { size: '', color: '', colorHex: '#111111', stock: 0 };

export default function ProductForm({ initialData, productId }) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    shortDescription: initialData?.shortDescription || '',
    category: initialData?.category || 'unisex',
    subCategory: initialData?.subCategory || '',
    price: initialData?.price || '',
    compareAtPrice: initialData?.compareAtPrice || '',
    material: initialData?.material || '',
    careInstructions: initialData?.careInstructions || '',
    featured: initialData?.featured || false,
    isNewArrival: initialData?.isNewArrival || false,
  });
  const [variants, setVariants] = useState(initialData?.variants?.length ? initialData.variants : [emptyVariant]);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const updateVariant = (idx, key, value) => {
    setVariants((v) => v.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      fd.append('variants', JSON.stringify(variants.map((v) => ({ ...v, stock: Number(v.stock) }))));
      images.forEach((img) => fd.append('images', img));

      if (isEdit) {
        await api.patch(`/products/${productId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated.');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created.');
      }
      router.push('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl">
      <section className="space-y-4">
        <h2 className="eyebrow">Basic Info</h2>
        <input required placeholder="Product name" className="input-field"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea required placeholder="Full description" className="input-field h-28"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Short description (for cards/SEO)" className="input-field"
          value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />

        <div className="grid grid-cols-2 gap-4">
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['men', 'women', 'unisex', 'accessories', 'footwear'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input placeholder="Sub-category (e.g. hoodies)" className="input-field"
            value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input required type="number" step="0.01" placeholder="Price" className="input-field"
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" step="0.01" placeholder="Compare-at price (optional)" className="input-field"
            value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} />
        </div>

        <input placeholder="Material" className="input-field"
          value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
        <input placeholder="Care instructions" className="input-field"
          value={form.careInstructions} onChange={(e) => setForm({ ...form, careInstructions: e.target.value })} />

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} />
            New Arrival
          </label>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="eyebrow">Variants (Size / Color / Stock)</h2>
          <button type="button" className="text-xs underline" onClick={() => setVariants((v) => [...v, emptyVariant])}>
            + Add Variant
          </button>
        </div>
        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 items-center">
              <input required placeholder="Size" className="input-field" value={v.size}
                onChange={(e) => updateVariant(idx, 'size', e.target.value)} />
              <input required placeholder="Color" className="input-field" value={v.color}
                onChange={(e) => updateVariant(idx, 'color', e.target.value)} />
              <input type="color" className="h-11 w-full border border-hairline" value={v.colorHex}
                onChange={(e) => updateVariant(idx, 'colorHex', e.target.value)} />
              <input required type="number" placeholder="Stock" className="input-field" value={v.stock}
                onChange={(e) => updateVariant(idx, 'stock', e.target.value)} />
              <button type="button" className="text-xs text-rust underline"
                onClick={() => setVariants((vs) => vs.filter((_, i) => i !== idx))}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="eyebrow mb-4">Images</h2>
        <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} />
        <p className="text-xs text-ash mt-2">Uploaded via Cloudinary. Max 6 images.</p>
      </section>

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}
