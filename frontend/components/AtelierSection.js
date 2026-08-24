import Link from 'next/link';
import Image from 'next/image';

export default function AtelierSection() {
  return (
    <section className="bg-cloud">
      <div className="container-wide py-16 md:py-24">
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-0 md:gap-0">
          <div className="relative aspect-[4/3] md:aspect-auto">
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400"
              alt="The Urban Thread atelier workspace"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <div className="bg-paper p-8 md:p-12 flex flex-col justify-center md:-ml-16 md:mt-16 md:mb-16 relative">
            <span className="eyebrow mb-4 block">The Atelier</span>
            <h2 className="font-display text-3xl md:text-4xl leading-tight mb-5">
              Architectural
              <br />
              Integrity in Form.
            </h2>
            <p className="text-ash text-sm leading-relaxed mb-8">
              We approach garment construction as a structural engineering challenge. Every seam,
              every fold is calculated to interact with the human form and the urban spaces it
              inhabits.
            </p>
            <Link href="/archive" className="btn-primary w-fit">
              Our Philosophy
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
