'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';

export default function OrderConfirmationPage({ params }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/orders/${params.id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setError('Order not found.'));
  }, [params.id]);

  if (error) return <div className="container-wide py-32 text-center text-ash">{error}</div>;
  if (!order) return <div className="container-wide py-32 text-center text-ash">Loading…</div>;

  return (
    <div className="container-wide py-20 max-w-2xl">
      <span className="eyebrow text-paper bg-ink inline-block px-3 py-1 mb-6">Order Confirmed</span>
      <h1 className="font-display text-3xl md:text-4xl mb-3">Thanks for your order</h1>
      <p className="text-ash text-sm mb-10">
        Order #{order.orderNumber} — a confirmation email is on its way (demo mode; no real charge occurred).
      </p>

      <div className="border border-hairline divide-y divide-hairline mb-8">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between p-4 text-sm">
            <span>{item.name} ({item.size}/{item.color}) x{item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between p-4 text-sm font-medium">
          <span>Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/account/orders" className="btn-primary">View Orders</Link>
        <Link href="/products" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
