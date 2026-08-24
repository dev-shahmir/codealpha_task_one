'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function NotifyStockModal({ isOpen, onClose, productName, variantDetails }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/auth/notify-stock', { email, productName, variantDetails });
      setSubmitted(true);
      toast.success('Confirmation email sent! We will notify you when back in stock.');
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        onClose();
      }, 1500);
    } catch {
      toast.error('Failed to submit notification request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-hairline p-8 max-w-md w-full relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ash hover:text-ink font-mono"
        >
          ✕
        </button>

        <span className="eyebrow text-rust block mb-2 font-mono">Out of Stock Alert</span>
        <h3 className="font-display text-xl text-ink font-semibold mb-2">Back in Stock Notification</h3>
        <p className="text-ash text-xs mb-6">
          Get notified immediately when <strong className="text-ink">{productName}</strong> ({variantDetails}) returns to our atelier inventory.
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-mono text-center">
            ✓ Request submitted successfully.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="input-field"
            />
            <button type="submit" className="btn-primary w-full py-3">
              Notify Me
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
