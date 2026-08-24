'use client';

const reviews = [
  {
    id: 1,
    quote:
      "The silhouette and drape on the Oversized Fleece Hoodie is unmatched. Heavyweight quality that feels straight off the runway.",
    author: "Zayn R.",
    location: "London, UK",
    role: "Verified Buyer",
    item: "Oversized Cotton Hoodie",
  },
  {
    id: 2,
    quote:
      "Precision tailoring on the wool coat. Fits like a custom atelier piece. Express checkout and live order updates were seamless.",
    author: "Elena V.",
    location: "Berlin, DE",
    role: "Verified Buyer",
    item: "Tailored Wool-Blend Overcoat",
  },
  {
    id: 3,
    quote:
      "Minimalist design with incredible attention to hardware and stitching. The leather tote has become my daily essential.",
    author: "Tariq K.",
    location: "Dubai, UAE",
    role: "Verified Buyer",
    item: "Minimal Leather Tote",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-ink text-paper py-20 md:py-28 my-12">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="eyebrow text-ash mb-3 block">Community Voices</span>
            <h2 className="font-display text-3xl md:text-5xl text-paper">
              Worn &amp; Trusted Worldwide
            </h2>
          </div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-sm">
            <span>★★★★★</span>
            <span className="text-paper/70 font-sans text-xs">4.9/5 Average Rating (1,200+ Reviews)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:border-white/30 transition-colors"
            >
              <div>
                <div className="text-amber-400 mb-4 tracking-widest text-sm">★★★★★</div>
                <p className="text-paper/90 font-display text-lg leading-relaxed mb-6 font-light">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-between items-end text-xs">
                <div>
                  <h4 className="font-semibold text-paper text-sm">{r.author}</h4>
                  <span className="text-ash block">{r.location}</span>
                </div>
                <span className="eyebrow text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-none border border-emerald-800/40">
                  {r.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
