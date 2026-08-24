'use client';

import { useEffect, useState } from 'react';
import api from '../../../../../lib/api';
import ProductForm from '../../../../../components/ProductForm';

export default function EditProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products', { params: { limit: 500 } }).then(({ data }) => {
      const found = data.products.find((p) => p._id === params.id);
      setProduct(found);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <p className="text-ash">Loading…</p>;
  if (!product) return <p className="text-ash">Product not found.</p>;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Edit Product</h1>
      <ProductForm initialData={product} productId={product._id} />
    </div>
  );
}
