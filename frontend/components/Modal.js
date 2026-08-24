'use client';

import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <div className={`relative bg-paper w-full ${wide ? 'max-w-3xl' : 'max-w-md'} max-h-[85vh] overflow-y-auto border border-hairline`}>
        <div className="flex items-center justify-between px-7 py-5 border-b border-hairline sticky top-0 bg-paper">
          <h3 className="font-display text-xl">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-xl leading-none">×</button>
        </div>
        <div className="p-7">{children}</div>
      </div>
    </div>
  );
}
