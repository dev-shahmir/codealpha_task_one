'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-wide py-20 max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-2">Reset Password</h1>
      <p className="text-xs text-ash mb-10">
        Enter your account email and we&apos;ll send a (fake) reset link — demo store, no real password recovery risk.
      </p>
      {sent ? (
        <p className="text-sm bg-hairline/40 p-4">
          If an account exists for that email, a reset link has been sent. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="email" placeholder="Email" className="input-field"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
}
