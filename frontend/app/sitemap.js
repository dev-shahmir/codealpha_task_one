import { serverFetch } from '../lib/serverFetch';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticRoutes = ['', '/products', '/login', '/register'].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const data = await serverFetch('/products?limit=200');
  const productRoutes = (data?.products || []).map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt || Date.now()),
  }));

  return [...staticRoutes, ...productRoutes];
}
