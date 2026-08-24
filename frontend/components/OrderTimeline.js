'use client';

const steps = [
  { key: 'confirmed', label: 'Order Confirmed' },
  { key: 'processing', label: 'In Atelier Processing' },
  { key: 'shipped', label: 'Shipped & En Route' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderTimeline({ currentStatus }) {
  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="py-6 border-t border-hairline my-4">
      <span className="eyebrow text-ash mb-4 block font-mono">Fulfillment Status Tracker</span>
      <div className="grid grid-cols-4 gap-2 relative">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono mb-2 transition-all ${
                  isCurrent
                    ? 'bg-ink text-paper ring-4 ring-hairline font-bold'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cloud text-ash'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span
                className={`text-[11px] font-mono leading-tight ${
                  isDone ? 'text-ink font-semibold' : 'text-ash'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
