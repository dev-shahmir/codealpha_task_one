'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../lib/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products?search=${encodeURIComponent(query)}`);
        setResults(data.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-start justify-center pt-16 px-4 animate-fadeUp">
      <div className="bg-paper border border-hairline w-full max-w-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-ash hover:text-ink text-xl font-mono"
        >
          ✕
        </button>

        <span className="eyebrow text-ash mb-2 block">Catalog Search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search oversized hoodies, outerwear, sneakers..."
          autoFocus
          className="input-field text-lg py-4 mb-6 font-display"
        />

        {loading && (
          <div className="py-8 text-center text-ash text-sm font-mono animate-pulse">
            Searching UrbanThread archive...
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="py-8 text-center text-ash text-sm">
            No products found matching &ldquo;{query}&rdquo;
          </div>
        )}

        {results.length > 0 && (
          <div className="max-h-[350px] overflow-y-auto space-y-3 divide-y divide-hairline">
            {results.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="pt-3 first:pt-0 flex items-center gap-4 group hover:bg-cloud/50 p-2 transition-colors"
              >
                <img
                  src={product.images[0]?.url || 'https://via.placeholder.com/80'}
                  alt={product.name}
                  className="w-14 h-14 object-cover bg-cloud"
                />
                <div className="flex-1">
                  <h4 className="font-display font-medium text-ink group-hover:text-rust transition-colors">
                    {product.name}
                  </h4>
                  <span className="eyebrow text-[10px] text-ash capitalize">{product.category}</span>
                </div>
                <span className="font-display font-bold text-ink">${product.price}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
