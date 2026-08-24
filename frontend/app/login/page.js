'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back');
      router.push(searchParams.get('redirect') || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Atelier Client"
      title="Login"
      image="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1000"
    >
      <p className="text-xs text-ash mb-8">
        Demo store — use the account you registered, or the seeded admin account.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required type="email" placeholder="Email" className="input-field"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password" className="input-field"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
      <div className="flex justify-between mt-6 text-xs">
        <Link href="/forgot-password" className="text-ash hover:text-ink underline">Forgot password?</Link>
        <Link href="/register" className="text-ash hover:text-ink underline">Create an account</Link>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-ash font-mono">Loading authentication...</div>}>
      <LoginContent />
    </Suspense>
  );
}
