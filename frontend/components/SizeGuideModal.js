'use client';

import Modal from './Modal';

const apparelSizes = [
  { size: 'XS', chest: '32-34"', waist: '25-27"', hip: '35-37"' },
  { size: 'S', chest: '35-37"', waist: '28-30"', hip: '38-40"' },
  { size: 'M', chest: '38-40"', waist: '31-33"', hip: '41-43"' },
  { size: 'L', chest: '41-43"', waist: '34-36"', hip: '44-46"' },
  { size: 'XL', chest: '44-46"', waist: '37-39"', hip: '47-49"' },
];

const footwearSizes = [
  { size: '39', us: '6.5', uk: '6' },
  { size: '40', us: '7', uk: '6.5' },
  { size: '41', us: '8', uk: '7.5' },
  { size: '42', us: '9', uk: '8.5' },
  { size: '43', us: '10', uk: '9.5' },
];

export default function SizeGuideModal({ open, onClose, category }) {
  const isFootwear = category === 'footwear';

  return (
    <Modal open={open} onClose={onClose} title="Size Guide">
      <p className="text-sm text-ash mb-6 leading-relaxed">
        Measurements are body measurements, not garment measurements. If you fall between sizes,
        we recommend sizing up for a relaxed fit consistent with our silhouettes.
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="eyebrow border-b border-hairline">
            <th className="text-left py-3">Size</th>
            {isFootwear ? (
              <>
                <th className="text-left py-3">US</th>
                <th className="text-left py-3">UK</th>
              </>
            ) : (
              <>
                <th className="text-left py-3">Chest</th>
                <th className="text-left py-3">Waist</th>
                <th className="text-left py-3">Hip</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {(isFootwear ? footwearSizes : apparelSizes).map((row) => (
            <tr key={row.size} className="border-b border-hairline">
              <td className="py-3 font-medium">{row.size}</td>
              {isFootwear ? (
                <>
                  <td className="py-3 text-ash">{row.us}</td>
                  <td className="py-3 text-ash">{row.uk}</td>
                </>
              ) : (
                <>
                  <td className="py-3 text-ash">{row.chest}</td>
                  <td className="py-3 text-ash">{row.waist}</td>
                  <td className="py-3 text-ash">{row.hip}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
