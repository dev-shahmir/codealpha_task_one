import Link from 'next/link';
import Image from 'next/image';

export default function FeatureSplit({ eyebrow, title, description, href, image, imageAlt, reverse }) {
  return (
    <section className="container-wide py-16 md:py-24">
      <div className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
        <div className="relative aspect-[4/5] bg-cloud">
          <Image src={image} alt={imageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div className={reverse ? '' : 'md:pl-8'}>
          {eyebrow && <span className="eyebrow mb-4 block">{eyebrow}</span>}
          <h2 className="font-display text-3xl md:text-4xl leading-tight mb-5">{title}</h2>
          <p className="text-ash text-sm md:text-base leading-relaxed max-w-sm mb-7">{description}</p>
          <Link href={href} className="eyebrow border-b border-ink pb-1 hover:text-ash hover:border-ash transition-colors">
            View Category →
          </Link>
        </div>
      </div>
    </section>
  );
}
