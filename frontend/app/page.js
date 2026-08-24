import Hero from '../components/Hero';
import FeatureSplit from '../components/FeatureSplit';
import AtelierSection from '../components/AtelierSection';
import LiveStatsBanner from '../components/LiveStatsBanner';
import ProductCard from '../components/ProductCard';
import LookbookSection from '../components/LookbookSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CraftsmanshipSection from '../components/CraftsmanshipSection';
import FaqSection from '../components/FaqSection';
import { serverFetch } from '../lib/serverFetch';
import Link from 'next/link';

export default async function HomePage() {
  const data = await serverFetch('/products/featured');
  const products = data?.products || [];

  return (
    <>
      <Hero />

      <LookbookSection />

      <FeatureSplit
        eyebrow="Tailoring / Fluidity"
        title="Women's Silhouettes"
        description="Rigorous tailoring meets fluid forms. A study in contrasts, designed for the modern urban environment."
        href="/products?category=women"
        image="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000"
        imageAlt="Women's silhouettes campaign"
      />

      <FeatureSplit
        eyebrow="Precision / Weight"
        title="Men's Structure"
        description="Structured outerwear built for the after-dark city — heavyweight fabrics cut with architectural precision."
        href="/products?category=men"
        image="https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1000"
        imageAlt="Men's structure campaign"
        reverse
      />

      <section className="container-wide pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-[4/3] bg-cloud group overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900"
              alt="Objects and artifacts — accessories"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="font-display text-white text-2xl mb-2 drop-shadow">Objects &amp; Artifacts</h3>
              <Link href="/products?category=accessories" className="eyebrow text-white underline underline-offset-4">
                Shop Accessories
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] bg-cloud overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900"
              alt="New arrivals"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="font-display text-white text-2xl mb-2 drop-shadow">New Season Arrivals</h3>
              <Link href="/products?isNewArrival=true" className="eyebrow text-white underline underline-offset-4">
                Explore Editorial
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 md:py-24 border-t border-hairline">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="eyebrow mb-3 block text-ash">Editor&apos;s Pick</span>
            <h2 className="font-display text-2xl md:text-4xl">Featured Pieces</h2>
          </div>
          <Link href="/products" className="eyebrow hover:text-ash hidden md:block">
            View All →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-ash text-sm">
            No featured products yet — run the backend seed script to populate the catalog.
          </p>
        )}
      </section>

      <CraftsmanshipSection />

      <LiveStatsBanner />

      <TestimonialsSection />

      <AtelierSection />

      <FaqSection />
    </>
  );
}

