'use client';

import { useState } from 'react';
import Modal from './Modal';

const stores = [
  { name: 'Paris Flagship', city: 'Paris, FR', address: '15 Rue Cambon, 75001', x: 120, y: 90, inStock: true },
  { name: 'SoHo Atelier', city: 'New York, US', address: '212 Mercer St, NY 10012', x: 260, y: 60, inStock: true },
  { name: 'Shoreditch Studio', city: 'London, UK', address: '48 Redchurch St, E2 7DP', x: 190, y: 40, inStock: false },
  { name: 'Aoyama Space', city: 'Tokyo, JP', address: '3-2-1 Kita-Aoyama, Minato', x: 340, y: 110, inStock: true },
];

export default function StoreLocatorModal({ open, onClose, productName }) {
  const [active, setActive] = useState(stores[0]);
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    setLocating(true);
    setTimeout(() => {
      setActive(stores[0]);
      setLocating(false);
    }, 700);
  };

  return (
    <Modal open={open} onClose={onClose} title={`Find "${productName}" In Store`} wide>
      <div className="grid md:grid-cols-[1fr_260px] gap-6">
        <div className="relative bg-ink aspect-[4/3] overflow-hidden">
          <svg viewBox="0 0 400 160" className="w-full h-full">
            <rect width="400" height="160" fill="#111111" />
            {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#ffffff" strokeOpacity="0.06" />
            ))}
            {[20, 50, 80, 110, 140].map((y) => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#ffffff" strokeOpacity="0.06" />
            ))}
            {stores.map((s) => (
              <g key={s.name} onClick={() => setActive(s)} className="cursor-pointer">
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={active.name === s.name ? 7 : 5}
                  fill={active.name === s.name ? '#B94A2C' : '#F7F6F3'}
                  className={active.name === s.name ? 'animate-pulseDot' : ''}
                />
                <text x={s.x + 10} y={s.y + 4} fill="#F7F6F3" fontSize="9" fontFamily="var(--font-body)">
                  {s.city}
                </text>
              </g>
            ))}
          </svg>
          <span className="absolute bottom-3 left-3 eyebrow text-paper/50">Store Network</span>
        </div>

        <div>
          <div className="space-y-1 mb-5">
            {stores.map((s) => (
              <button
                key={s.name}
                onClick={() => setActive(s)}
                className={`w-full text-left px-3 py-2.5 text-sm border ${
                  active.name === s.name ? 'border-ink bg-cloud' : 'border-transparent hover:bg-cloud/50'
                }`}
              >
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-ash">{s.city}</p>
              </button>
            ))}
          </div>

          <div className="border-t border-hairline pt-4 mb-4">
            <p className="text-sm font-medium">{active.name}</p>
            <p className="text-xs text-ash mt-1">{active.address}</p>
            <p className={`text-xs mt-2 ${active.inStock ? 'text-ink' : 'text-ash'}`}>
              {active.inStock ? '● In stock at this location' : '○ Available to order in-store'}
            </p>
          </div>

          <button onClick={handleLocate} disabled={locating} className="btn-outline w-full text-xs">
            {locating ? 'Locating…' : 'Locate Nearest Atelier'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
