'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');

  const [address, setAddress] = useState({
    fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '',
  });
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user) {
      api.get('/users/addresses').then(({ data }) => {
        setSavedAddresses(data.addresses);
        const def = data.addresses.find((a) => a.isDefault) || data.addresses[0];
        if (def) {
          setSelectedAddressId(def._id);
          setAddress(def);
        }
      }).catch(() => {});
    }
  }, [user]);

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    if (id === 'new') {
      setAddress({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '' });
    } else {
      const found = savedAddresses.find((a) => a._id === id);
      if (found) setAddress(found);
    }
  };

  useEffect(() => {
    if (mounted && !loading && !user) {
      toast.error('Please log in to checkout.');
      router.push('/login?redirect=/checkout');
    }
  }, [mounted, loading, user, router]);

  if (!mounted || loading || !user) return null;

  const sub = subtotal();
  const discountAmount = couponApplied?.discountAmount || 0;
  const netSubtotal = Math.max(0, sub - discountAmount);
  const shipping = couponApplied?.freeShipping || sub > 100 ? 0 : 9.99;
  const tax = Number((netSubtotal * 0.08).toFixed(2));
  const total = Number((netSubtotal + shipping + tax).toFixed(2));

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    try {
      const { data } = await api.post('/orders/validate-coupon', {
        couponCode: couponInput,
        itemsPrice: sub,
      });
      setCouponApplied(data);
      toast.success(`Coupon "${data.code}" applied! ${data.description}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
      setCouponApplied(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ productId: i.productId, size: i.size, color: i.color, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod: 'mock_card',
        couponCode: couponApplied?.code,
      });
      clearCart();
      toast.success('Order placed! Check your email for confirmation.');
      router.push(`/order-confirmation/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div>
      <div className="border-b border-hairline py-6 text-center">
        <span className="font-display text-xl">URBAN THREAD</span>
      </div>

      <div className="container-wide py-14">
        <h1 className="font-display text-4xl md:text-5xl mb-3">Checkout</h1>
        <p className="text-xs text-rust mb-12 font-medium">
          Demo mode: payment is simulated. No real card is charged.
        </p>

        <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-3 gap-14">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="font-display text-2xl border-b border-hairline pb-3 mb-6">1. Shipment</h2>

              {savedAddresses.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {savedAddresses.map((a) => (
                    <button
                      key={a._id}
                      type="button"
                      onClick={() => handleSelectAddress(a._id)}
                      className={`text-left text-xs px-4 py-3 border max-w-[220px] ${
                        selectedAddressId === a._id ? 'border-ink bg-cloud' : 'border-hairline hover:border-ink'
                      }`}
                    >
                      <span className="font-medium block mb-1">{a.fullName}</span>
                      <span className="text-ash">{a.line1}, {a.city}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleSelectAddress('new')}
                    className={`text-xs px-4 py-3 border eyebrow ${
                      selectedAddressId === 'new' ? 'border-ink bg-cloud' : 'border-hairline hover:border-ink'
                    }`}
                  >
                    + New Address
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <input required placeholder="First Name" className="input-field"
                  value={address.fullName.split(' ')[0] || ''}
                  onChange={(e) => setAddress({ ...address, fullName: `${e.target.value} ${address.fullName.split(' ').slice(1).join(' ')}`.trim() })} />
                <input required placeholder="Last Name" className="input-field"
                  value={address.fullName.split(' ').slice(1).join(' ')}
                  onChange={(e) => setAddress({ ...address, fullName: `${address.fullName.split(' ')[0] || ''} ${e.target.value}`.trim() })} />
                <input required placeholder="Phone" className="input-field col-span-2"
                  value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                <input required placeholder="Address" className="input-field col-span-2"
                  value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                <input placeholder="Apt, suite (optional)" className="input-field col-span-2"
                  value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
                <input required placeholder="City" className="input-field"
                  value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <input required placeholder="Postal Code" className="input-field"
                  value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
                <input placeholder="State / Province" className="input-field"
                  value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                <input required placeholder="Country" className="input-field"
                  value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl border-b border-hairline pb-3 mb-6">2. Payment</h2>
              <div className="grid grid-cols-2 gap-5">
                <input required placeholder="0000 0000 0000 0000" maxLength={19} className="input-field col-span-2"
                  value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
                <input required placeholder="MM/YY" className="input-field"
                  value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
                <input required placeholder="CVV" className="input-field"
                  value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} />
              </div>
              <p className="text-[11px] text-ash mt-3">
                This form does not connect to any real payment processor. Enter any values.
              </p>
            </section>
          </div>

          <div className="bg-cloud/40 border border-hairline p-7 h-fit">
            <h2 className="font-display text-2xl border-b border-hairline pb-3 mb-6">3. Review Order</h2>
            <div className="space-y-5 mb-6 max-h-64 overflow-y-auto">
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}-${i.color}`} className="flex gap-4">
                  <div className="relative w-14 h-16 bg-cloud shrink-0">
                    {i.image && <Image src={i.image} alt={i.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{i.name}</p>
                    <p className="text-xs text-ash mt-0.5">{i.color} / {i.size}</p>
                  </div>
                  <span className="text-sm">${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-hairline py-4 my-2">
              <span className="eyebrow text-ash mb-2 block text-[10px]">Promo / Coupon Code</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. URBAN15"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="input-field text-xs uppercase py-2"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                  className="btn-outline py-2 px-3 text-[10px]"
                >
                  {applyingCoupon ? '...' : 'Apply'}
                </button>
              </div>
              {couponApplied && (
                <p className="text-[11px] text-emerald-700 font-mono mt-2 flex items-center justify-between">
                  <span>✓ {couponApplied.code} applied</span>
                  <button type="button" onClick={() => setCouponApplied(null)} className="text-ash underline">Remove</button>
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm mb-4 border-t border-hairline pt-4">
              <div className="flex justify-between"><span className="text-ash">Subtotal</span><span>${sub.toFixed(2)}</span></div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-mono">
                  <span>Promo Discount ({couponApplied?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between"><span className="text-ash">Shipping</span><span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span className="text-ash">Taxes</span><span>${tax.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-between border-t border-hairline pt-4 mb-6 font-bold text-base">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
            <button type="submit" disabled={placing || items.length === 0} className="btn-primary w-full">
              {placing ? 'Placing Order…' : 'Confirm Order'}
            </button>
            <p className="text-[11px] text-ash mt-4 text-center flex items-center justify-center gap-1.5 font-mono">
              🔒 Secure Express Checkout
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
