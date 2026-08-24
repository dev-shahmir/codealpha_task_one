'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data.stats));
  }, []);

  if (!stats) return <p className="text-ash">Loading stats…</p>;

  const cards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}` },
    { label: 'Total Orders', value: stats.totalOrders },
    { label: 'Products', value: stats.totalProducts },
    { label: 'Customers', value: stats.totalUsers },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {cards.map((c) => (
          <div key={c.label} className="border border-hairline p-5">
            <span className="font-display text-2xl block mb-1">{c.value}</span>
            <span className="eyebrow text-ash">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="eyebrow mb-4">Recent Orders</h2>
          <div className="border border-hairline divide-y divide-hairline">
            {stats.recentOrders.map((o) => (
              <div key={o._id} className="p-3 flex justify-between text-sm">
                <span>#{o.orderNumber} — {o.user?.name}</span>
                <span>${o.totalPrice.toFixed(2)}</span>
              </div>
            ))}
            {stats.recentOrders.length === 0 && <p className="p-3 text-sm text-ash">No orders yet.</p>}
          </div>
          <Link href="/admin/orders" className="text-xs underline mt-3 inline-block hover:text-ash">
            View all orders →
          </Link>
        </div>

        <div>
          <h2 className="eyebrow mb-4">Low Stock Alert</h2>
          <div className="border border-hairline divide-y divide-hairline">
            {stats.lowStockProducts.map((p) => (
              <div key={p._id} className="p-3 text-sm">
                <span className="font-medium">{p.name}</span>
                <div className="text-xs text-ash mt-1">
                  {p.variants.filter((v) => v.stock <= 5).map((v) => (
                    <span key={v._id} className="mr-3">{v.size}/{v.color}: {v.stock} left</span>
                  ))}
                </div>
              </div>
            ))}
            {stats.lowStockProducts.length === 0 && <p className="p-3 text-sm text-ash">Stock levels look healthy.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
