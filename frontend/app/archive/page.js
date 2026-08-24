import Image from 'next/image';

export const metadata = {
  title: 'Archive — Our Philosophy',
  description: 'Urban Thread is a study in precision and proportion — architectural integrity in form.',
};

export default function ArchivePage() {
  return (
    <div>
      <div className="container-wide pt-16 pb-14 text-center">
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-8">
          Architectural
          <br />
          Integrity in Form
        </h1>
        <p className="text-ash text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Urban Thread is a study in precision and proportion. We construct garments not as mere
          coverings, but as structured environments for the modern body.
        </p>
      </div>

      <div className="container-wide grid md:grid-cols-2 gap-12 items-center pb-20">
        <div className="relative aspect-[3/4]">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900"
            alt="Urban Thread archive campaign"
            fill
            className="object-cover grayscale"
          />
        </div>
        <div>
          <span className="eyebrow mb-4 block">Our Philosophy</span>
          <h2 className="font-display text-3xl md:text-4xl mb-6">Form Follows Structure</h2>
          <p className="text-ash text-sm md:text-base leading-relaxed mb-6">
            We reject the superfluous. Our design ethos is rooted in brutalist architecture —
            finding beauty in raw materials, exposed construction, and monumental volumes. Every
            seam is intentional; every silhouette is calculated. We do not decorate; we engineer.
          </p>
          <div className="w-12 border-t border-ink" />
        </div>
      </div>

      <div className="bg-cloud border-y border-hairline">
        <div className="container-wide py-16 text-center">
          <p className="font-display text-2xl md:text-3xl italic max-w-2xl mx-auto leading-relaxed">
            &ldquo;We are not dressing the body; we are building an extension of the urban
            landscape around it.&rdquo;
          </p>
          <span className="eyebrow block mt-6">— The Founders</span>
        </div>
      </div>

      <div className="container-wide py-20 grid md:grid-cols-3 gap-8">
        <div>
          <span className="font-display text-3xl block mb-3">01</span>
          <h3 className="eyebrow text-ink mb-2">Considered Volume</h3>
          <p className="text-sm text-ash leading-relaxed">Two capsules a year, released in full instead of chased in trend cycles.</p>
        </div>
        <div>
          <span className="font-display text-3xl block mb-3">02</span>
          <h3 className="eyebrow text-ink mb-2">Raw Material</h3>
          <p className="text-sm text-ash leading-relaxed">Wool, leather, and cotton sourced for weight, hand-feel, and longevity.</p>
        </div>
        <div>
          <span className="font-display text-3xl block mb-3">03</span>
          <h3 className="eyebrow text-ink mb-2">Exposed Construction</h3>
          <p className="text-sm text-ash leading-relaxed">Seams and structure are shown, not hidden — the making is part of the design.</p>
        </div>
      </div>
    </div>
  );
}
