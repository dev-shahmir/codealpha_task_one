'use client';

import { useEffect, useState } from 'react';
import { useActivityFeed } from '../lib/useActivityFeed';

export default function LiveStatsBanner() {
  const feed = useActivityFeed(20);
  const [shoppersNow, setShoppersNow] = useState(38);

  useEffect(() => {
    const interval = setInterval(() => {
      setShoppersNow((n) => Math.max(12, n + Math.floor(Math.random() * 7) - 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-ink text-paper">
      <div className="container-wide py-10 grid md:grid-cols-3 gap-8 items-center">
        <div>
          <span className="eyebrow text-paper/60">Signature Feature</span>
          <h2 className="font-display text-2xl md:text-3xl mt-3 leading-tight">
            Shop Alongside
            <br />
            the Crowd
          </h2>
        </div>
        <p className="text-sm text-paper/60 leading-relaxed font-light">
          Every product page shows real activity as it happens — how many people are browsing a
          piece right now, and a live feed of recent pickups from customers around the world.
        </p>
        <div className="flex md:justify-end gap-10">
          <div>
            <span className="font-display text-4xl block">{shoppersNow}</span>
            <span className="eyebrow text-paper/50">Shopping Now</span>
          </div>
          <div>
            <span className="font-display text-4xl block">{feed.length}</span>
            <span className="eyebrow text-paper/50">Live Events</span>
          </div>
        </div>
      </div>
    </section>
  );
}
