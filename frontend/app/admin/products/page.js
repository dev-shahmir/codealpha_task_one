'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products', { params: { limit: 100 } })
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted.');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">+ Add Product</Link>
      </div>

      {loading ? (
        <p className="text-ash">Loading…</p>
      ) : (
        <div className="border border-hairline divide-y divide-hairline">
          {products.map((p) => (
            <div key={p._id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-ash capitalize">{p.category} · ${p.price} · {p.totalStock} in stock</p>
              </div>
              <div className="flex gap-4 text-xs">
                <Link href={`/admin/products/${p._id}/edit`} className="underline hover:text-ash">Edit</Link>
                <button onClick={() => handleDelete(p._id)} className="underline hover:text-ash text-rust">Delete</button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="p-4 text-sm text-ash">No products yet.</p>}
        </div>
      )}
    </div>
  );
}
