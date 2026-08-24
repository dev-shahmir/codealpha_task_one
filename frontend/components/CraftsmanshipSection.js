export default function CraftsmanshipSection() {
  return (
    <section className="container-wide py-20 md:py-28 border-t border-hairline">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow mb-3 block text-ash">Atelier Standard</span>
          <h2 className="font-display text-3xl md:text-5xl font-medium mb-6 leading-tight">
            Architectural Precision, Sustainable Sourcing.
          </h2>
          <p className="text-ash text-base mb-8 leading-relaxed">
            Every garment in the UrbanThread archive is designed in response to the modern cityscape. We blend heavyweight organic knits with precise, fluid tailoring—engineered to endure seasons rather than trends.
          </p>

          <div className="grid grid-cols-2 gap-6 border-t border-hairline pt-8">
            <div>
              <span className="font-display text-3xl font-bold block mb-1 text-ink">100%</span>
              <span className="eyebrow text-ash">Garment-Dyed Cotton</span>
            </div>
            <div>
              <span className="font-display text-3xl font-bold block mb-1 text-ink">Zero</span>
              <span className="eyebrow text-ash">Single-Use Plastics</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] bg-cloud overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800"
              alt="Textile craftsmanship"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-[3/4] bg-cloud overflow-hidden mt-8">
            <img
              src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800"
              alt="Atelier tailoring"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
