'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../lib/api';
import useCartStore from '../store/cartStore';
import { useAuth } from '../context/AuthContext';

/* Lookbook Editorial Outfits */
const looks = [
  {
    id: 1,
    num: '01',
    label: 'Oversized Hoodie',
    tag: 'Look 01 / Outerwear',
    heroImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1400',
    hotspot: { x: '50%', y: '35%' },
    slug: 'oversized-cotton-hoodie',
    fallback: {
      name: 'Oversized Cotton Hoodie',
      category: 'Unisex / Hoodies',
      price: 68,
      comparePrice: 85,
      material: '100% Heavyweight Brushed Cotton (450 GSM)',
      description: 'Garment-dyed vintage wash with dropped shoulders and double-lined hood.',
    },
  },
  {
    id: 2,
    num: '02',
    label: 'Selvedge Denim',
    tag: 'Look 02 / Pants',
    heroImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1400',
    hotspot: { x: '52%', y: '55%' },
    slug: 'relaxed-fit-denim-jeans',
    fallback: {
      name: 'Relaxed Fit Denim Jeans',
      category: 'Men / Denim',
      price: 92,
      comparePrice: 120,
      material: '100% Japanese Selvedge Cotton Denim',
      description: 'Relaxed straight leg, mid-rise fit built to age gracefully over time.',
    },
  },
  {
    id: 3,
    num: '03',
    label: 'Court Sneakers',
    tag: 'Look 03 / Footwear',
    heroImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1400',
    hotspot: { x: '48%', y: '65%' },
    slug: 'court-leather-sneakers',
    fallback: {
      name: 'Court Leather Sneakers',
      category: 'Footwear / Minimal',
      price: 118,
      comparePrice: null,
      material: 'Full-Grain Italian Calfskin & Vulcanized Cupsole',
      description: 'Handcrafted low-top minimalist silhouette with padded leather lining.',
    },
  },
];

export default function LookbookSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [products, setProducts] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [isChanging, setIsChanging] = useState(false);

  const { user } = useAuth();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetched = {};
      for (const item of looks) {
        try {
          const { data } = await api.get(`/products/${item.slug}`);
          if (data?.product) {
            fetched[item.slug] = data.product;
            const firstVar = data.product.variants?.[0];
            if (firstVar) {
              setSelectedSizes((prev) => ({ ...prev, [item.slug]: firstVar.size }));
              setSelectedColors((prev) => ({ ...prev, [item.slug]: firstVar.color }));
            }
          }
        } catch {}
      }
      setProducts(fetched);
    };
    fetchProducts();
  }, []);

  const activeLook = looks[activeIdx];
  const product = products[activeLook.slug];

  const uniqueSizes = product
    ? [...new Set(product.variants?.map((v) => v.size))]
    : ['S', 'M', 'L', 'XL'];

  const uniqueColors = product
    ? [...new Set(product.variants?.map((v) => JSON.stringify({ color: v.color, hex: v.colorHex })))].map((s) =>
        JSON.parse(s)
      )
    : [{ color: 'Black', hex: '#111111' }, { color: 'Sand', hex: '#d8c3a5' }];

  const currentSize = selectedSizes[activeLook.slug] || uniqueSizes[0];
  const currentColor = selectedColors[activeLook.slug] || uniqueColors[0]?.color;

  const matchedVariant = product?.variants?.find(
    (v) => v.size === currentSize && v.color === currentColor
  );
  const inStock = matchedVariant ? matchedVariant.stock > 0 : true;

  const handleSelectLook = (idx) => {
    if (idx === activeIdx || isChanging) return;
    setIsChanging(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setIsChanging(false);
    }, 180);
  };

  const handleAddToCart = () => {
    // ENFORCE LOGIN CHECK BEFORE ADD TO CART
    if (!user) {
      toast.error('Please login to add items to your cart!');
      router.push('/login');
      return;
    }

    const itemToAdd = {
      productId: product?._id || activeLook.id,
      slug: activeLook.slug,
      name: product?.name || activeLook.fallback.name,
      image: product?.images?.[0]?.url || activeLook.heroImage,
      price: product?.price || activeLook.fallback.price,
      size: currentSize,
      color: currentColor || 'Black',
      quantity: 1,
      maxStock: matchedVariant?.stock || 10,
    };
    addItem(itemToAdd);
    toast.success(`${itemToAdd.name} added to your bag!`);
  };

  const displayName = product?.name || activeLook.fallback.name;
  const displayCategory = product
    ? `${product.category} / ${product.subCategory}`
    : activeLook.fallback.category;
  const displayPrice = product?.price ?? activeLook.fallback.price;
  const displayComparePrice = product?.compareAtPrice ?? activeLook.fallback.comparePrice;
  const displayMaterial = product?.material || activeLook.fallback.material;
  const displayDescription = product?.shortDescription || product?.description || activeLook.fallback.description;

  return (
    <section className="container-wide py-16 md:py-24 border-t border-hairline">
      {/* Section Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="eyebrow mb-2 block text-ash">Interactive Campaign</span>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight">
            Shop The Look — Lookbook 04
          </h2>
        </div>
        <p className="text-ash text-xs md:text-sm max-w-md leading-relaxed">
          Select any look below or click the hotspot markers to switch background photos and inspect garment details.
        </p>
      </div>

      {/* Main 2-Column Split: NO OVERLAP */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 Cols): Editorial Photo Container */}
        <div className="lg:col-span-7">
          <div className="relative w-full h-[450px] sm:h-[520px] lg:h-[580px] bg-ink rounded-sm overflow-hidden border border-hairline shadow-sm">
            <Image
              key={activeLook.heroImage}
              src={activeLook.heroImage}
              alt={displayName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className={`object-cover object-center transition-all duration-500 ${
                isChanging ? 'opacity-20 scale-105 blur-sm' : 'opacity-100 scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

            {/* Glowing Hotspot Marker */}
            <div
              style={{ left: activeLook.hotspot.x, top: activeLook.hotspot.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${
                isChanging ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-12 h-12 rounded-full bg-white/50 animate-ping" />
                <button
                  className="relative w-10 h-10 rounded-full bg-ink text-white ring-4 ring-white/70 shadow-2xl flex items-center justify-center font-mono font-bold text-xs"
                  aria-label={`Active item ${displayName}`}
                >
                  {activeLook.num}
                </button>
              </div>
            </div>

            {/* Top Left Tag Badge */}
            <div className="absolute top-4 left-4 bg-ink/80 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-sm uppercase tracking-widest border border-white/20">
              {activeLook.tag}
            </div>

            {/* Top Right Counter Badge */}
            <div className="absolute top-4 right-4 bg-ink/80 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-sm uppercase tracking-widest border border-white/20">
              {activeLook.num} / 03
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Product Specs & Purchase Card (Clean & Spacious) */}
        <div className="lg:col-span-5 bg-white border border-hairline p-6 md:p-8 rounded-sm shadow-sm flex flex-col justify-between min-h-[450px] sm:min-h-[520px] lg:min-h-[580px]">
          
          <div className={`transition-all duration-300 ${isChanging ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            
            {/* Category Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="eyebrow text-ash text-[10px] font-mono uppercase tracking-widest">
                {displayCategory}
              </span>
              <span className="bg-cloud text-ink text-[10px] font-mono uppercase px-2.5 py-0.5 tracking-widest rounded-sm font-semibold">
                Look {activeLook.num}
              </span>
            </div>

            {/* Product Title */}
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-2 leading-tight">
              {displayName}
            </h3>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-display text-3xl font-bold text-ink">${displayPrice}</span>
              {displayComparePrice && (
                <span className="text-ash line-through text-sm">${displayComparePrice}</span>
              )}
            </div>

            {/* Product Description */}
            <p className="text-xs text-ash leading-relaxed mb-5 border-b border-hairline pb-4">
              {displayDescription}
            </p>

            {/* Material Specifications */}
            <div className="mb-5 bg-cloud/50 p-3 rounded-sm border border-hairline">
              <span className="eyebrow text-ash block text-[9px] mb-1 font-mono">Fabric Composition</span>
              <p className="text-xs text-ink font-mono font-medium">{displayMaterial}</p>
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-ash uppercase tracking-widest">Select Size</span>
                <span className="text-[10px] font-mono text-ink font-bold">{currentSize}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {uniqueSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSizes((prev) => ({ ...prev, [activeLook.slug]: sz }))}
                    className={`py-2 text-xs font-mono border text-center transition-all duration-200 rounded-sm font-semibold ${
                      currentSize === sz
                        ? 'border-ink bg-ink text-white shadow-sm'
                        : 'border-hairline hover:border-ink bg-white text-ink'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-5">
              <span className="text-[10px] font-mono text-ash uppercase tracking-widest block mb-2">
                Color Choice: <strong className="text-ink">{currentColor}</strong>
              </span>
              <div className="flex gap-2.5">
                {uniqueColors.map(({ color, hex }) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColors((prev) => ({ ...prev, [activeLook.slug]: color }))}
                    className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm text-xs font-mono transition-all ${
                      currentColor === color
                        ? 'border-ink bg-ink/5 ring-1 ring-ink font-bold text-ink'
                        : 'border-hairline hover:border-ash text-ash'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: hex || '#111' }} />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Notice */}
            <div className="mb-5 flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-500 animate-pulse' : 'bg-rust'}`} />
              <span className={inStock ? 'text-emerald-700 font-medium' : 'text-rust font-medium'}>
                {inStock ? 'In Stock — Available in atelier' : 'Out of Stock'}
              </span>
            </div>

          </div>

          {/* Action Buttons: Add to Bag (Requires Login) & Inspect Details */}
          <div className="space-y-3 pt-4 border-t border-hairline mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-primary w-full py-4 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink/90 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8h12l-1 12H7L6 8z" />
                <path d="M9 8V6a3 3 0 016 0v2" />
              </svg>
              + Add {displayName} to Bag
            </button>

            <Link
              href={`/products/${activeLook.slug}`}
              className="btn-outline w-full py-3.5 text-center text-xs font-semibold uppercase tracking-widest block hover:bg-ink hover:text-white transition-all"
            >
              View Full Product Specs →
            </Link>

            {!user && (
              <p className="text-[10px] text-ash text-center font-mono mt-1">
                * Note: Login is required to place items in cart
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Outfit Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {looks.map((item, idx) => {
          const isActive = activeIdx === idx;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectLook(idx)}
              className={`p-4 border text-left transition-all duration-300 rounded-sm flex items-center gap-4 ${
                isActive
                  ? 'border-ink bg-ink text-white shadow-lg translate-y-[-2px]'
                  : 'border-hairline hover:border-ash bg-white text-ink hover:bg-cloud/30'
              }`}
            >
              <div className="relative w-12 h-14 bg-cloud rounded-sm overflow-hidden flex-shrink-0 border border-hairline">
                <Image
                  src={item.heroImage}
                  alt={item.label}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[10px] font-mono tracking-widest uppercase ${isActive ? 'text-white/70' : 'text-ash'}`}>
                    {item.num} / {item.label}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </div>
                <h4 className="text-xs md:text-sm font-semibold truncate">{item.fallback.name}</h4>
                <p className={`text-[11px] font-mono ${isActive ? 'text-white/90' : 'text-ash'}`}>
                  ${item.fallback.price}
                </p>
              </div>
            </button>
          );
        })}
      </div>

    </section>
  );
}
