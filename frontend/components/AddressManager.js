'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

const emptyForm = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '', isDefault: false };

export default function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = () => {
    setLoading(true);
    api.get('/users/addresses')
      .then(({ data }) => setAddresses(data.addresses))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (addr) => {
    setForm(addr);
    setEditingId(addr._id);
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/users/addresses/${editingId}`, form);
        toast.success('Address updated.');
      } else {
        await api.post('/users/addresses', form);
        toast.success('Address added.');
      }
      setFormOpen(false);
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this address?')) return;
    try {
      await api.delete(`/users/addresses/${id}`);
      toast.success('Address removed.');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to remove address.');
    }
  };

  if (loading) return <p className="text-sm text-ash">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl">Addresses</h2>
        {!formOpen && (
          <button onClick={openNew} className="eyebrow underline">Add New</button>
        )}
      </div>

      {formOpen ? (
        <form onSubmit={handleSubmit} className="border border-hairline p-6 mb-8 max-w-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input required placeholder="Full Name" className="input-field col-span-2"
              value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <input required placeholder="Phone" className="input-field col-span-2"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input required placeholder="Address Line 1" className="input-field col-span-2"
              value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            <input placeholder="Address Line 2" className="input-field col-span-2"
              value={form.line2 || ''} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
            <input required placeholder="City" className="input-field"
              value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input placeholder="State / Province" className="input-field"
              value={form.state || ''} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <input required placeholder="Postal Code" className="input-field"
              value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
            <input required placeholder="Country" className="input-field"
              value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm mb-5">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            Set as default address
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save Address'}
            </button>
            <button type="button" onClick={() => setFormOpen(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-ash">No saved addresses yet — add one for faster checkout.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="border border-hairline p-5 relative">
              {addr.isDefault && (
                <span className="absolute top-4 right-4 bg-ink text-paper text-[10px] tracking-widest2 uppercase px-2 py-1">
                  Default
                </span>
              )}
              <p className="text-sm font-medium mb-1">{addr.fullName}</p>
              <p className="text-xs text-ash leading-relaxed">
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                {addr.city}, {addr.state} {addr.postalCode}<br />
                {addr.country}
              </p>
              <div className="flex gap-4 mt-4 text-xs">
                <button onClick={() => openEdit(addr)} className="underline">Edit</button>
                <button onClick={() => handleDelete(addr._id)} className="underline text-rust">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
