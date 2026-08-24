'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useCartStore from '../store/cartStore';
import LiveTicker from './LiveTicker';
import SearchModal from './SearchModal';

const navLinks = [
  { label: 'Collections', href: '/products' },
  { label: 'Editorial', href: '/products?isNewArrival=true' },
  { label: 'Archive', href: '/archive' },
  { label: 'Maison', href: '/client-services' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 bg-paper border-b border-hairline">
      <LiveTicker />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <div className="container-wide grid grid-cols-3 items-center h-[76px]">
        <div className="flex items-center gap-6">
          <button
            className="lg:hidden text-ink"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-px bg-ink mb-1.5" />
            <span className="block w-5 h-px bg-ink" />
          </button>
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="eyebrow text-ink hover:text-ash transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="font-display text-xl md:text-2xl text-center tracking-tight">
          URBAN THREAD
        </Link>

        <div className="flex items-center justify-end gap-5">
          <button
            onClick={() => setSearchOpen(true)}
            className="text-ink hover:text-ash transition-colors"
            aria-label="Search Catalog"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </button>

          {mounted && user ? (
            <div className="hidden lg:flex items-center gap-5">
              <Link href="/account/orders" className="eyebrow hover:text-ash">
                {user.name.split(' ')[0]}
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="eyebrow hover:text-ash">
                  Dashboard
                </Link>
              )}
              <button onClick={logout} className="eyebrow hover:text-ash">
                Sign Out
              </button>
            </div>
          ) : (
            mounted && (
              <Link href="/login" className="hidden lg:block eyebrow hover:text-ash">
                Login
              </Link>
            )
          )}

          <Link href="/cart" className="relative" aria-label="Bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-ink text-paper text-[10px] w-4 h-4 flex items-center justify-center font-mono font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <Link href={user ? '/account/orders' : '/login'} aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5 20c1.6-3.6 4.6-5.4 7-5.4S17.4 16.4 19 20" />
            </svg>
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-hairline px-5 py-5 flex flex-col gap-4 bg-paper">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="eyebrow" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="border-t border-hairline pt-4 flex flex-col gap-4">
            {mounted && user ? (
              <>
                <Link href="/account/orders" className="eyebrow" onClick={() => setMenuOpen(false)}>
                  My Orders
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="eyebrow" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                )}
                <button onClick={logout} className="eyebrow text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="eyebrow" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
