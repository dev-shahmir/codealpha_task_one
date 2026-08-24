import { notFound } from 'next/navigation';
import { serverFetch } from '../../../lib/serverFetch';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  const data = await serverFetch(`/products/${params.slug}`);
  if (!data?.product) return { title: 'Product Not Found' };

  const p = data.product;
  return {
    title: p.seo?.metaTitle || p.name,
    description: p.seo?.metaDescription || p.shortDescription || p.description?.slice(0, 155),
    keywords: p.seo?.keywords || p.tags,
    openGraph: {
      title: p.name,
      description: p.shortDescription,
      images: p.images?.[0]?.url ? [p.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const data = await serverFetch(`/products/${params.slug}`, { next: { revalidate: 0 } });

  if (!data?.product) notFound();

  return <ProductDetailClient initialProduct={data.product} />;
}
