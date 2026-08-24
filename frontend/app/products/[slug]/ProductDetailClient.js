'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '../../../lib/api';
import useCartStore from '../../../store/cartStore';
import { useProductViewers } from '../../../lib/useActivityFeed';
import { useWishlist } from '../../../lib/useWishlist';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import SizeGuideModal from '../../../components/SizeGuideModal';
import StoreLocatorModal from '../../../components/StoreLocatorModal';
import NotifyStockModal from '../../../components/NotifyStockModal';
import ReviewForm from '../../../components/ReviewForm';

function Accordion({ title, children, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-hairline">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 eyebrow text-ink"
      >
        {title}
        <span className="text-base">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="pb-5 text-sm text-ash leading-relaxed">{children}</div>}
    </div>
  );
}

export default function ProductDetailClient({ initialProduct }) {
  const [product, setProduct] = useState(initialProduct);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [storeLocatorOpen, setStoreLocatorOpen] = useState(false);
  const [notifyStockOpen, setNotifyStockOpen] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const viewers = useProductViewers(product._id);
  const { user } = useAuth();
  const router = useRouter();
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(product._id);

  const fetchProductData = async () => {
    try {
      const { data } = await api.get(`/products/${product.slug}`);
      if (data.product) setProduct(data.product);
    } catch (err) {
      console.error(err);
    }
  };

  const sizes = useMemo(() => [...new Set(product.variants.map((v) => v.size))], [product]);
  const selectedVariant = product.variants.find((v) => v.size === size && v.color === color);
  const activeColorName = color || product.variants[0]?.color;

  useEffect(() => {
    api.get('/products', { params: { category: product.category, limit: 4 } })
      .then(({ data }) => setRelated(data.products.filter((p) => p._id !== product._id).slice(0, 3)))
      .catch(() => {});
  }, [product]);

  const handleAddToCart = () => {
    if (!size || !color) {
      toast.error('Please select a size and color.');
      return;
    }
    if (!selectedVariant || selectedVariant.stock < 1) {
      setNotifyStockOpen(true);
      return;
    }
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url,
      price: product.price,
      size,
      color,
      quantity,
      maxStock: selectedVariant.stock,
    });
    toast.success('Added to bag');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to leave a review.');
      router.push('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      toast.success('Review submitted — thanks!');
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container-wide py-8">
      {/* Breadcrumb */}
      <div className="eyebrow text-ash mb-8 flex gap-2">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-ink">Collections</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] bg-cloud mb-3">
            {product.images[activeImage]?.url && (
              <Image
                src={product.images[activeImage].url}
                alt={product.images[activeImage].alt || product.name}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-2 gap-3">
              {product.images.slice(1).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx + 1)}
                  className="relative aspect-[4/3] bg-cloud"
                >
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="font-display text-3xl md:text-4xl leading-tight">{product.name}</h1>
            <button
              onClick={() => toggle(product._id)}
              aria-label={saved ? 'Remove from Archive' : 'Save to Archive'}
              className="w-10 h-10 border border-hairline flex items-center justify-center shrink-0 hover:border-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? '#111111' : 'none'} stroke="#111111" strokeWidth="1.5">
                <path d="M12 21s-7.5-4.7-10-9.3C.5 8.1 2.3 4 6.2 4 8.6 4 10.6 5.4 12 7.3 13.4 5.4 15.4 4 17.8 4 21.7 4 23.5 8.1 22 11.7 19.5 16.3 12 21 12 21z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-lg">${product.price.toFixed(2)}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-ash line-through text-sm">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-sm text-ash leading-relaxed mb-8 max-w-md">{product.description}</p>

          {viewers !== null && (
            <div className="flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulseDot" />
              <span className="text-xs text-ash">
                <strong className="text-ink">{viewers} people</strong> are viewing this piece right now
              </span>
            </div>
          )}

          {/* Color selector */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <span className="eyebrow">Color</span>
              <span className="eyebrow text-ink">{activeColorName}</span>
            </div>
            <div className="flex gap-3">
              {[...new Map(product.variants.map((v) => [v.color, v])).values()].map((v) => (
                <button
                  key={v.color}
                  onClick={() => setColor(v.color)}
                  title={v.color}
                  className={`w-8 h-8 border-2 transition-all ${
                    (color || activeColorName) === v.color ? 'border-ink' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: v.colorHex, boxShadow: '0 0 0 1px #DBDAD3' }}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="eyebrow">Size</span>
              <button type="button" onClick={() => setSizeGuideOpen(true)} className="eyebrow underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-[52px] px-3 py-2.5 border text-xs eyebrow ${
                    size === s ? 'bg-ink text-paper border-ink' : 'border-hairline hover:border-ink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {selectedVariant && (
              <p className="text-xs text-ash mt-3">
                {selectedVariant.stock <= 5 && selectedVariant.stock > 0
                  ? `Only ${selectedVariant.stock} left in stock`
                  : selectedVariant.stock === 0
                  ? 'Out of stock'
                  : 'In stock'}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-hairline">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-11">−</button>
              <span className="w-9 text-center text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="w-9 h-11">+</button>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-10">
            {selectedVariant && selectedVariant.stock === 0 ? (
              <button
                type="button"
                onClick={() => setNotifyStockOpen(true)}
                className="btn-outline border-rust text-rust hover:bg-rust hover:text-white w-full"
              >
                Notify When Back in Stock 🔔
              </button>
            ) : (
              <button onClick={handleAddToCart} className="btn-primary w-full">
                Add to Bag →
              </button>
            )}
            <button type="button" onClick={() => setStoreLocatorOpen(true)} className="btn-outline w-full">
              Find in Store
            </button>
          </div>

          <div>
            <Accordion title="Details" defaultOpen>
              <ul className="space-y-1.5">
                {product.material && <li>— {product.material}</li>}
                <li>— Concealed front closure</li>
                <li>— Structured construction</li>
                {product.careInstructions && <li>— {product.careInstructions}</li>}
              </ul>
            </Accordion>
            <Accordion title="Provenance">
              <p>Designed in-house and cut in small runs to reduce overproduction. Made to order where possible.</p>
            </Accordion>
            <Accordion title="Sustainability">
              <p>Constructed from responsibly-sourced materials. This is a demo product listing — no physical inventory exists.</p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Complete the Look */}
      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="font-display text-2xl md:text-3xl mb-8">Complete the Look</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {related.map((p) => (
              <Link key={p._id} href={`/products/${p.slug}`} className="group block">
                <div className="relative aspect-[3/4] bg-cloud mb-3">
                  {p.images?.[0]?.url && (
                    <Image src={p.images[0].url} alt={p.images[0].alt || p.name} fill className="object-cover" />
                  )}
                </div>
                <h3 className="text-sm">{p.name}</h3>
                <p className="text-sm text-ash mt-1">${p.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-24 max-w-2xl">
        <h2 className="font-display text-2xl mb-6">
          Client Reviews {product.ratingsQuantity > 0 && `· ★ ${product.ratingsAverage.toFixed(1)} (${product.ratingsQuantity})`}
        </h2>

        <div className="space-y-6 mb-10">
          {product.reviews?.length > 0 ? (
            product.reviews.map((r, idx) => (
              <div key={idx} className="border-b border-hairline pb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{r.name}</span>
                  <span className="text-xs text-amber-500 font-mono">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p className="text-sm text-ash">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-ash">No reviews yet — be the first to share your thoughts.</p>
          )}
        </div>

        {user ? (
          <ReviewForm productId={product._id} onReviewAdded={fetchProductData} />
        ) : (
          <div className="p-6 bg-cloud/50 border border-hairline text-center text-xs text-ash">
            Please <Link href="/login" className="text-ink underline">log in</Link> to share a product review.
          </div>
        )}
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} category={product.category} />
      <StoreLocatorModal open={storeLocatorOpen} onClose={() => setStoreLocatorOpen(false)} productName={product.name} />
      <NotifyStockModal
        isOpen={notifyStockOpen}
        onClose={() => setNotifyStockOpen(false)}
        productName={product.name}
        variantDetails={`${size || 'Standard'} / ${color || activeColorName}`}
      />
    </div>
  );
}
