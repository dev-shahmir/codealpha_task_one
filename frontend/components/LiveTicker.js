'use client';

import { useActivityFeed } from '../lib/useActivityFeed';

export default function LiveTicker() {
  const feed = useActivityFeed(6);

  const items =
    feed.length > 0
      ? feed
      : [{ productName: 'Live activity', city: 'connecting…', timestamp: null, placeholder: true }];

  const doubled = [...items, ...items];

  return (
    <div className="bg-ink text-paper h-7 overflow-hidden flex items-center">
      <div className="flex items-center gap-2 pl-5 pr-4 shrink-0 border-r border-paper/15 h-full">
        <span className="w-1.5 h-1.5 rounded-full bg-paper animate-pulseDot" />
        <span className="text-[10px] tracking-widest2 uppercase font-medium text-paper/90">Live</span>
      </div>
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="flex gap-10 whitespace-nowrap animate-marquee">
          {doubled.map((item, idx) => (
            <span key={idx} className="text-[11px] tracking-wide text-paper/70 font-light">
              {item.placeholder
                ? 'Connecting to live activity feed…'
                : `${item.simulated ? 'Someone' : 'A customer'} in ${item.city} just picked up "${item.productName}"`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
