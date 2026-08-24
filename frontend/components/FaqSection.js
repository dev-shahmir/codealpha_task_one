'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'How does the express mock checkout work?',
    a: 'UrbanThread is an interactive demo platform. Clicking checkout simulates a real-time payment gateway transaction instantly without charging any real currency, while generating authentic order receipts and transactional emails.',
  },
  {
    q: 'What shipping options are available?',
    a: 'We offer complimentary express shipping on all orders over $100. Standard delivery takes 2–4 business days worldwide.',
  },
  {
    q: 'How do I choose the correct size?',
    a: 'Each product detail page features an architectural size guide modal with exact chest, shoulder, and waist measurements in both inches and centimeters.',
  },
  {
    q: 'What is your return & exchange policy?',
    a: 'We accept returns within 30 days of delivery. Returned items must be unworn, unwashed, and in their original packaging with all tags attached.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="container-wide py-16 md:py-24 border-t border-hairline">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="eyebrow text-ash mb-2 block">Client Care</span>
          <h2 className="font-display text-3xl md:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-hairline bg-white transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center font-display text-lg text-ink font-medium"
                >
                  <span>{faq.q}</span>
                  <span className="text-2xl font-sans text-ash leading-none">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-ash text-sm leading-relaxed border-t border-hairline/50 font-body">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
