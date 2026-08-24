'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

export default function ResetPasswordPage({ params }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch(`/auth/reset-password/${params.token}`, { password });
      localStorage.setItem('ut_token', data.token);
      toast.success('Password reset successfully.');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-wide py-20 max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-2">Set New Password</h1>
      <p className="text-xs text-ash mb-10">Demo store — choose any new password (min 8 characters).</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required type="password" minLength={8} placeholder="New password" className="input-field"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
