'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';

export default function VerifyEmailPage({ params }) {
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    api.get(`/auth/verify-email/${params.token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [params.token]);

  return (
    <div className="container-wide py-32 max-w-md mx-auto text-center">
      {status === 'verifying' && <p className="text-ash">Verifying your email…</p>}
      {status === 'success' && (
        <>
          <h1 className="font-display text-3xl mb-4">Email Verified</h1>
          <p className="text-ash text-sm mb-8">Your demo account is now verified.</p>
          <Link href="/" className="btn-primary">Continue Shopping</Link>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="font-display text-3xl mb-4">Link Invalid or Expired</h1>
          <p className="text-ash text-sm mb-8">Please request a new verification email.</p>
          <Link href="/login" className="btn-primary">Back to Login</Link>
        </>
      )}
    </div>
  );
}
