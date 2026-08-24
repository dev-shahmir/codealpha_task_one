'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

const statuses = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/orders').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success('Order status updated — email sent to customer.');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Orders</h1>
      {loading ? (
        <p className="text-ash">Loading…</p>
      ) : (
        <div className="border border-hairline divide-y divide-hairline">
          {orders.map((o) => (
            <div key={o._id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-medium">#{o.orderNumber}</p>
                <p className="text-xs text-ash">{o.user?.name} · {o.user?.email}</p>
              </div>
              <span className="text-sm">${o.totalPrice.toFixed(2)}</span>
              <select
                value={o.status}
                onChange={(e) => handleStatusChange(o._id, e.target.value)}
                className="input-field w-auto text-xs"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
          {orders.length === 0 && <p className="p-4 text-sm text-ash">No orders yet.</p>}
        </div>
      )}
    </div>
  );
}
