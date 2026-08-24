import { INITIAL_PRODUCTS } from './mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function serverFetch(path, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200); // 1.2s timeout for fast fallback

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      next: { revalidate: 60, ...(options.next || {}) },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend is offline or timed out — return Standalone Mock Data!
  }

  // --- Fallback Mock Responses for Server Components ---
  if (path.includes('/products/featured')) {
    const products = INITIAL_PRODUCTS.filter((p) => p.featured);
    return { success: true, products };
  }

  if (path.includes('/products/')) {
    const slugOrId = path.split('/products/')[1]?.split('?')[0];
    const product = INITIAL_PRODUCTS.find((p) => p.slug === slugOrId || p._id === slugOrId);
    if (product) return { success: true, product };
  }

  if (path.startsWith('/products')) {
    return { success: true, count: INITIAL_PRODUCTS.length, products: INITIAL_PRODUCTS };
  }

  return null;
}
