'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="container-wide py-32 text-center text-ash">Checking access…</div>;
  }

  return (
    <div className="container-wide py-10">
      <div className="grid md:grid-cols-[200px_1fr] gap-10">
        <aside className="border-r border-hairline pr-6">
          <p className="eyebrow mb-6">Admin Panel</p>
          <nav className="flex md:flex-col gap-3 flex-wrap">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm py-1 ${pathname === link.href ? 'text-ink font-medium' : 'text-ash hover:text-ink'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
