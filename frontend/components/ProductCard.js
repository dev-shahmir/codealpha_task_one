'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '../lib/useWishlist';

export default function ProductCard({ product }) {
  const { isSaved, toggle } = useWishlist();
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const saved = isSaved(product._id);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-cloud">
        {product.images?.[0]?.url && (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            className="object-cover grayscale-[15%] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-ink text-paper text-[10px] tracking-widest2 uppercase px-2 py-1">
            -{discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="absolute top-3 right-3 border border-ink bg-paper text-ink text-[10px] tracking-widest2 uppercase px-2 py-1">
            New
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product._id);
          }}
          aria-label={saved ? 'Remove from Archive' : 'Save to Archive'}
          className="absolute bottom-3 right-3 w-8 h-8 bg-paper/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? '#111111' : 'none'} stroke="#111111" strokeWidth="1.5">
            <path d="M12 21s-7.5-4.7-10-9.3C.5 8.1 2.3 4 6.2 4 8.6 4 10.6 5.4 12 7.3 13.4 5.4 15.4 4 17.8 4 21.7 4 23.5 8.1 22 11.7 19.5 16.3 12 21 12 21z" />
          </svg>
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base text-ink leading-snug">{product.name}</h3>
          <p className="eyebrow mt-1">{product.subCategory || product.category}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-sm text-ink">${product.price}</span>
          {discount > 0 && (
            <span className="block text-xs text-ash line-through">${product.compareAtPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
