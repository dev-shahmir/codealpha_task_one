'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    // Trigger zoom after mount for the Ken Burns effect
    const timer = setTimeout(() => setZoomed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-[80vh] md:h-[92vh] overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-[18000ms] ease-in-out"
        style={{ transform: zoomed ? 'scale(1.12)' : 'scale(1)' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1600"
          alt="UrbanThread Fall/Winter campaign — Collection 01, The Architect"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_25%]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative h-full container-wide flex flex-col justify-end pb-16 md:pb-24">
        <span className="eyebrow text-white/70 mb-3 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">Fall / Winter</span>
        <h1 className="font-display text-white text-4xl md:text-7xl leading-[1.05] mb-8 max-w-xl animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
          Collection 01
          <br />/ The Architect
        </h1>
        <Link href="/products" className="btn-primary w-fit bg-white text-ink hover:bg-white/85 animate-[fadeInUp_0.8s_ease-out_0.7s_both]">
          Explore Collection
        </Link>
      </div>
    </section>
  );
}
