import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-hairline mt-32 bg-cloud">
      <div className="container-wide py-16 flex flex-col md:flex-row md:items-start justify-between gap-10">
        <div>
          <span className="font-display text-2xl">URBAN THREAD</span>
          <p className="text-sm text-ash mt-3 max-w-xs leading-relaxed">
            Architectural integrity in form. Designing the uniform for the modern urban landscape.
          </p>
        </div>
        <div className="flex gap-16 flex-wrap">
          <div>
            <h4 className="eyebrow mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-ash">
              <li><Link href="/archive" className="hover:text-ink">Sustainability</Link></li>
              <li><Link href="/archive" className="hover:text-ink">Atelier</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="eyebrow mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-ash">
              <li><Link href="/client-services" className="hover:text-ink">Client Services</Link></li>
              <li><Link href="/client-services" className="hover:text-ink">Legal</Link></li>
              <li><Link href="/client-services" className="hover:text-ink">Press</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="eyebrow mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-ash">
              <li><Link href="/login" className="hover:text-ink">Login</Link></li>
              <li><Link href="/register" className="hover:text-ink">Register</Link></li>
              <li><Link href="/account/orders" className="hover:text-ink">Order History</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="container-wide py-6 flex flex-col md:flex-row justify-between gap-2 text-[11px] text-ash">
          <span>© {new Date().getFullYear()} URBAN THREAD. ARCHITECTURAL INTEGRITY IN FORM.</span>
          <span>Portfolio demo store — payments are simulated.</span>
        </div>
      </div>
    </footer>
  );
}
