'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useWishlist } from '../../../lib/useWishlist';
import AddressManager from '../../../components/AddressManager';
import OrderTimeline from '../../../components/OrderTimeline';
import api from '../../../lib/api';

const statusDot = {
  processing: 'text-ash',
  confirmed: 'text-ink',
  shipped: 'text-ink',
  delivered: 'text-emerald-700 font-bold',
  cancelled: 'text-rust',
};

export default function MyOrdersPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [tab, setTab] = useState('orders');
  const { products: wishlistProducts, loading: wishlistLoading, toggle: toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/account/orders');
      return;
    }
    if (user) {
      api.get('/orders/my-orders')
        .then(({ data }) => setOrders(data.orders))
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  if (loading || fetching) return <div className="container-wide py-20 text-ash">Loading…</div>;

  return (
    <div>
      <div className="container-wide pt-14 pb-10">
        <span className="eyebrow mb-3 block">Atelier Client</span>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <h1 className="font-display text-5xl leading-tight">
            Welcome back,
            <br />
            {user.name.split(' ')[0]}.
          </h1>
          <div className="text-right">
            <span className="eyebrow block mb-2">Member since {new Date(user.createdAt || Date.now()).getFullYear()}</span>
            <button onClick={logout} className="btn-outline">Sign Out</button>
          </div>
        </div>
      </div>

      <div className="container-wide border-t border-hairline">
        <div className="grid md:grid-cols-[180px_1fr] gap-10 md:gap-16 py-12">
          <aside className="flex md:flex-col gap-6 flex-wrap">
            {[
              { key: 'orders', label: 'Order History' },
              { key: 'profile', label: 'Profile' },
              { key: 'addresses', label: 'Addresses' },
              { key: 'archive', label: 'The Archive' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`eyebrow text-left pb-1 border-b ${tab === t.key ? 'text-ink border-ink' : 'text-ash border-transparent'}`}
              >
                {t.label}
              </button>
            ))}
          </aside>

          <div>
            {tab === 'orders' && (
              <>
                <h2 className="font-display text-2xl mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <div className="py-10">
                    <p className="text-ash mb-6">You haven&apos;t placed any (demo) orders yet.</p>
                    <Link href="/products" className="btn-primary">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white border border-hairline p-6 hover:border-ink transition-colors"
                      >
                        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-hairline pb-4 mb-4">
                          <div>
                            <span className="font-display font-semibold text-lg text-ink block">
                              Order #{order.orderNumber}
                            </span>
                            <span className="text-xs text-ash">
                              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-display font-bold text-ink text-lg block">
                              ${order.totalPrice.toFixed(2)}
                            </span>
                            <span className={`eyebrow ${statusDot[order.status]}`}>
                              ● {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Visual Step Tracker Timeline */}
                        <OrderTimeline currentStatus={order.status} />

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-ash font-mono">
                            {order.items?.length || 0} Item(s)
                          </span>
                          <Link
                            href={`/order-confirmation/${order._id}`}
                            className="btn-outline text-[10px] py-2 px-4"
                          >
                            View Full Receipt →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === 'profile' && (
              <div>
                <h2 className="font-display text-2xl mb-6">Profile</h2>
                <div className="space-y-6 max-w-sm border-t border-hairline pt-6">
                  <div>
                    <span className="eyebrow block mb-1">Full Name</span>
                    <p className="text-sm">{user.name}</p>
                  </div>
                  <div>
                    <span className="eyebrow block mb-1">Email Address</span>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <span className="eyebrow block mb-1">Password</span>
                    <p className="text-sm">••••••••</p>
                  </div>
                </div>
              </div>
            )}

            {tab === 'addresses' && <AddressManager />}

            {tab === 'archive' && (
              <div>
                <h2 className="font-display text-2xl mb-6">The Archive</h2>
                {wishlistLoading ? (
                  <p className="text-sm text-ash">Loading…</p>
                ) : wishlistProducts.length === 0 ? (
                  <>
                    <p className="text-sm text-ash mb-6">
                      Pieces you save will appear here. Tap the heart icon on any product to add it.
                    </p>
                    <Link href="/products" className="btn-outline">Explore Collections</Link>
                  </>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlistProducts.map((p) => (
                      <div key={p._id} className="group relative">
                        <Link href={`/products/${p.slug}`} className="block">
                          <div className="relative aspect-[3/4] bg-cloud mb-3">
                            {p.images?.[0]?.url && (
                              <Image src={p.images[0].url} alt={p.images[0].alt || p.name} fill className="object-cover" />
                            )}
                          </div>
                          <h3 className="text-sm">{p.name}</h3>
                          <p className="text-sm text-ash mt-1">${p.price?.toFixed(2)}</p>
                        </Link>
                        <button
                          onClick={() => toggleWishlist(p._id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-paper/90 flex items-center justify-center"
                          aria-label="Remove from Archive"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#111111" stroke="#111111" strokeWidth="1.5">
                            <path d="M12 21s-7.5-4.7-10-9.3C.5 8.1 2.3 4 6.2 4 8.6 4 10.6 5.4 12 7.3 13.4 5.4 15.4 4 17.8 4 21.7 4 23.5 8.1 22 11.7 19.5 16.3 12 21 12 21z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
