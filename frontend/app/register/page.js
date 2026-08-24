'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created — check your email to verify.');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Join the Atelier"
      title="Create Account"
      image="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000"
    >
      <p className="text-xs text-ash mb-8">
        Demo store registration. A (fake) welcome/verification email will be sent.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Full name" className="input-field"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" className="input-field"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" minLength={8} placeholder="Password (min 8 characters)" className="input-field"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
      <p className="text-xs mt-6">
        Already have an account? <Link href="/login" className="underline hover:text-ash">Login</Link>
      </p>
    </AuthLayout>
  );
}
