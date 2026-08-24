'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../lib/api';
import ProductCard from '../../components/ProductCard';

const categories = ['men', 'women', 'unisex', 'accessories', 'footwear'];
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
const colorSwatches = [
  { name: 'Black', hex: '#111111' },
  { name: 'Bone', hex: '#EDECE7' },
  { name: 'Charcoal', hex: '#4A4A46' },
];
const sortOptions = [
  { value: '', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState('grid');

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const isNewArrival = searchParams.get('isNewArrival') || '';
  const search = searchParams.get('search') || '';
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (sort) params.sort = sort;
      if (isNewArrival) params.isNewArrival = isNewArrival;
      if (search) params.search = search;
      if (size) params.size = size;
      if (color) params.color = color;

      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, sort, isNewArrival, search, size, color]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  };

  const toggleCategory = (c) => updateFilter('category', category === c ? '' : c);

  return (
    <div className="container-wide py-12">
      <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-16">
        {/* Sidebar */}
        <aside>
          <span className="eyebrow mb-3 block">
            {category ? category : "Autumn / Winter '24"}
          </span>
          <h1 className="font-display text-3xl md:text-4xl leading-tight mb-4 capitalize">
            {category || "Autumn / Winter '24"}
          </h1>
          <p className="text-sm text-ash mb-8 max-w-xs">
            {total} pieces in this edit — filtered for structure and intent.
          </p>

          <button
            className="md:hidden eyebrow border border-hairline px-4 py-2 mb-6"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            Filters {filtersOpen ? '▲' : '▼'}
          </button>

          <div className={`${filtersOpen ? 'block' : 'hidden'} md:block space-y-8`}>
            <div className="flex gap-6 border-b border-hairline pb-4">
              <button onClick={() => setView('grid')} className={`eyebrow ${view === 'grid' ? 'text-ink' : 'text-ash/60'}`}>
                Grid
              </button>
              <button onClick={() => setView('editorial')} className={`eyebrow ${view === 'editorial' ? 'text-ink' : 'text-ash/60'}`}>
                Editorial
              </button>
            </div>

            <div>
              <h4 className="eyebrow mb-4">Category</h4>
              <div className="space-y-3">
                {categories.map((c) => (
                  <label key={c} className="flex items-center gap-3 text-sm capitalize cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category === c}
                      onChange={() => toggleCategory(c)}
                      className="accent-ink w-4 h-4"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="eyebrow mb-4">Size</h4>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateFilter('size', size === s ? '' : s)}
                    className={`w-10 h-9 text-xs border ${size === s ? 'bg-ink text-paper border-ink' : 'border-hairline hover:border-ink'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="eyebrow mb-4">Color</h4>
              <div className="flex gap-3">
                {colorSwatches.map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => updateFilter('color', color === c.name ? '' : c.name)}
                    className={`w-7 h-7 rounded-full border-2 ${color === c.name ? 'border-ink' : 'border-transparent'}`}
                    style={{ backgroundColor: c.hex, boxShadow: '0 0 0 1px #DBDAD3' }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="eyebrow block mb-2">Sort</label>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input-field text-xs eyebrow py-2"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div>
          {loading ? (
            <div className={`grid ${view === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-6 md:gap-8`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-cloud animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={`grid ${view === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-6 md:gap-8`}>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-ash text-sm py-20 text-center">
              No products match these filters yet. Try clearing a filter or seeding the catalog.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-wide py-20 text-ash text-center font-mono">Loading archive...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
