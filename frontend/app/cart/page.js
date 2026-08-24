'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useCartStore from '../../store/cartStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const sub = subtotal();
  const shipping = sub > 100 || sub === 0 ? 0 : 9.99;
  const tax = Number((sub * 0.08).toFixed(2));
  const total = Number((sub + shipping + tax).toFixed(2));

  if (items.length === 0) {
    return (
      <div className="container-wide py-32 text-center">
        <h1 className="font-display text-4xl mb-4">Atelier Bag</h1>
        <p className="text-ash mb-8">Your bag is empty. Add something considered to it.</p>
        <Link href="/products" className="btn-primary">Shop the Edit</Link>
      </div>
    );
  }

  return (
    <div className="container-wide py-12">
      <h1 className="font-display text-4xl md:text-5xl mb-2">Atelier Bag</h1>
      <p className="text-ash text-sm mb-10">{items.length} Item{items.length > 1 ? 's' : ''}</p>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 divide-y divide-hairline border-t border-hairline">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-6 py-8">
              <div className="relative w-32 h-40 bg-cloud shrink-0">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <Link href={`/products/${item.slug}`} className="font-display text-lg hover:text-ash">
                      {item.name.toUpperCase()}
                    </Link>
                    <p className="text-xs text-ash mt-2">{item.color} | Size {item.size}</p>
                  </div>
                  <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}>+</button>
                  </div>
                  <button className="eyebrow underline">Move to Archive</button>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="eyebrow underline ml-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-hairline p-7 h-fit bg-cloud/40">
          <h2 className="font-display text-2xl mb-6">Summary</h2>
          <div className="space-y-3 text-sm mb-6 border-t border-hairline pt-5">
            <div className="flex justify-between"><span className="text-ash">Subtotal</span><span>${sub.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-ash">Shipping</span><span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-ash">Taxes</span><span className="text-ash">Calculated at checkout</span></div>
          </div>
          <div className="flex justify-between border-t border-hairline pt-4 mb-6">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full text-center block">
            Continue to Checkout →
          </Link>
          <p className="text-[11px] text-ash mt-4 text-center">
            Complimentary returns within 30 days. Demo checkout — no real charge occurs.
          </p>
        </div>
      </div>
    </div>
  );
}
