'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const stores = [
  { name: 'Paris Flagship', city: 'Paris, FR', x: 120, y: 90 },
  { name: 'SoHo Atelier', city: 'New York, US', x: 260, y: 60 },
  { name: 'Shoreditch Studio', city: 'London, UK', x: 190, y: 40 },
  { name: 'Aoyama Space', city: 'Tokyo, JP', x: 340, y: 110 },
];

export default function ClientServicesPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', inquiry: '', message: '' });
  const [sending, setSending] = useState(false);
  const [activeStore, setActiveStore] = useState(stores[0]);
  const [locating, setLocating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/auth/contact', form);
      toast.success('Inquiry submitted! Confirmation email has been sent.');
      setForm({ firstName: '', lastName: '', email: '', inquiry: '', message: '' });
    } catch {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleLocate = () => {
    setLocating(true);
    setTimeout(() => {
      setActiveStore(stores[0]);
      setLocating(false);
      toast.success(`Nearest atelier: ${stores[0].name}`);
    }, 700);
  };

  return (
    <div>
      <div className="container-wide pt-14 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-5">Client Services</h1>
          <p className="text-ash text-sm md:text-base leading-relaxed max-w-md">
            Our dedicated team is available to assist you with bespoke inquiries, product details,
            and exclusive appointments.
          </p>
        </div>
        <div className="relative aspect-[16/10]">
          <Image
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900"
            alt="Urban Thread flagship architecture"
            fill
            className="object-cover grayscale"
          />
        </div>
      </div>

      <div className="container-wide grid md:grid-cols-2 gap-8 pb-20">
        <form onSubmit={handleSubmit} className="border border-hairline p-8 bg-cloud/40">
          <h2 className="font-display text-2xl mb-6">Inquire</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input required placeholder="First Name" className="input-field"
              value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input required placeholder="Last Name" className="input-field"
              value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <input required type="email" placeholder="Email Address" className="input-field mb-4"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Nature of Inquiry" className="input-field mb-4"
            value={form.inquiry} onChange={(e) => setForm({ ...form, inquiry: e.target.value })} />
          <textarea placeholder="Message" className="input-field h-28 mb-6"
            value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button type="submit" disabled={sending} className="btn-primary">
            {sending ? 'Sending…' : 'Submit Inquiry'}
          </button>
        </form>

        <div className="space-y-6">
          <div className="border border-hairline">
            <div className="relative aspect-[16/9]">
              <Image
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900"
                alt="Paris flagship store"
                fill
                className="object-cover grayscale"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl mb-2">Paris Flagship</h3>
              <p className="text-sm text-ash">15 Rue Cambon<br />75001 Paris, France</p>
              <p className="text-xs text-ash mt-3">Mon – Sat: 10am – 7pm</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-hairline p-5">
              <h4 className="eyebrow mb-2">Press</h4>
              <a href="mailto:press@urbanthread.demo" className="text-sm underline">press@urbanthread.demo</a>
            </div>
            <div className="border border-hairline p-5">
              <h4 className="eyebrow mb-2">Wholesale</h4>
              <a href="mailto:wholesale@urbanthread.demo" className="text-sm underline">wholesale@urbanthread.demo</a>
            </div>
          </div>
        </div>
      </div>

      {/* Store network dashboard */}
      <div className="container-wide pb-20">
        <h2 className="font-display text-2xl mb-6">Locate an Atelier</h2>
        <div className="border border-hairline grid md:grid-cols-[1fr_260px]">
          <div className="relative bg-ink aspect-[16/9] md:aspect-auto overflow-hidden">
            <svg viewBox="0 0 400 160" className="w-full h-full">
              <rect width="400" height="160" fill="#111111" />
              {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#ffffff" strokeOpacity="0.06" />
              ))}
              {[20, 50, 80, 110, 140].map((y) => (
                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#ffffff" strokeOpacity="0.06" />
              ))}
              {stores.map((s) => (
                <g key={s.name} onClick={() => setActiveStore(s)} className="cursor-pointer">
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r={activeStore.name === s.name ? 7 : 5}
                    fill={activeStore.name === s.name ? '#B94A2C' : '#F7F6F3'}
                    className={activeStore.name === s.name ? 'animate-pulseDot' : ''}
                  />
                  <text x={s.x + 10} y={s.y + 4} fill="#F7F6F3" fontSize="9">{s.city}</text>
                </g>
              ))}
            </svg>
            <span className="absolute bottom-3 left-3 eyebrow text-paper/50">Store Network</span>
          </div>
          <div className="p-6">
            <div className="space-y-1 mb-5">
              {stores.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setActiveStore(s)}
                  className={`w-full text-left px-3 py-2 text-sm border ${
                    activeStore.name === s.name ? 'border-ink bg-cloud' : 'border-transparent hover:bg-cloud/50'
                  }`}
                >
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-ash">{s.city}</p>
                </button>
              ))}
            </div>
            <button onClick={handleLocate} disabled={locating} className="btn-outline w-full text-xs">
              {locating ? 'Locating…' : 'Locate Atelier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
