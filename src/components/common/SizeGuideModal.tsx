import React, { useState } from 'react';
import { X, Ruler, Check } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useNavigation();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [activeTab, setActiveTab] = useState<'tee' | 'hoodie' | 'shirt'>('tee');

  if (!isSizeGuideOpen) return null;

  const teeData = {
    in: [
      { size: 'XS', chest: '42', length: '27.5', shoulder: '20.5', sleeve: '8.5' },
      { size: 'S', chest: '44', length: '28.5', shoulder: '21.5', sleeve: '9.0' },
      { size: 'M', chest: '46', length: '29.5', shoulder: '22.5', sleeve: '9.5' },
      { size: 'L', chest: '48', length: '30.5', shoulder: '23.5', sleeve: '10.0' },
      { size: 'XL', chest: '50', length: '31.5', shoulder: '24.5', sleeve: '10.5' },
      { size: 'XXL', chest: '52', length: '32.5', shoulder: '25.5', sleeve: '11.0' },
    ],
    cm: [
      { size: 'XS', chest: '106', length: '70', shoulder: '52', sleeve: '21.5' },
      { size: 'S', chest: '112', length: '72', shoulder: '55', sleeve: '23.0' },
      { size: 'M', chest: '117', length: '75', shoulder: '57', sleeve: '24.0' },
      { size: 'L', chest: '122', length: '77', shoulder: '60', sleeve: '25.5' },
      { size: 'XL', chest: '127', length: '80', shoulder: '62', sleeve: '26.5' },
      { size: 'XXL', chest: '132', length: '82', shoulder: '65', sleeve: '28.0' },
    ],
  };

  const hoodieData = {
    in: [
      { size: 'S', chest: '46', length: '27.0', shoulder: '22.0', sleeve: '25.5' },
      { size: 'M', chest: '48', length: '28.0', shoulder: '23.0', sleeve: '26.0' },
      { size: 'L', chest: '50', length: '29.0', shoulder: '24.0', sleeve: '26.5' },
      { size: 'XL', chest: '52', length: '30.0', shoulder: '25.0', sleeve: '27.0' },
      { size: 'XXL', chest: '54', length: '31.0', shoulder: '26.0', sleeve: '27.5' },
    ],
    cm: [
      { size: 'S', chest: '117', length: '68', shoulder: '56', sleeve: '65' },
      { size: 'M', chest: '122', length: '71', shoulder: '58', sleeve: '66' },
      { size: 'L', chest: '127', length: '74', shoulder: '61', sleeve: '67' },
      { size: 'XL', chest: '132', length: '76', shoulder: '63', sleeve: '68' },
      { size: 'XXL', chest: '137', length: '79', shoulder: '66', sleeve: '70' },
    ],
  };

  const shirtData = {
    in: [
      { size: 'S', chest: '44', length: '29.0', shoulder: '20.0', sleeve: '25.0' },
      { size: 'M', chest: '46', length: '30.0', shoulder: '21.0', sleeve: '25.5' },
      { size: 'L', chest: '48', length: '31.0', shoulder: '22.0', sleeve: '26.0' },
      { size: 'XL', chest: '50', length: '32.0', shoulder: '23.0', sleeve: '26.5' },
    ],
    cm: [
      { size: 'S', chest: '112', length: '74', shoulder: '51', sleeve: '63' },
      { size: 'M', chest: '117', length: '76', shoulder: '53', sleeve: '65' },
      { size: 'L', chest: '122', length: '79', shoulder: '56', sleeve: '66' },
      { size: 'XL', chest: '127', length: '81', shoulder: '58', sleeve: '67' },
    ],
  };

  const currentRows =
    activeTab === 'tee'
      ? teeData[unit]
      : activeTab === 'hoodie'
      ? hoodieData[unit]
      : shirtData[unit];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-brand-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-brand-ivory border border-brand-lightgrey shadow-modal p-6 sm:p-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-lightgrey">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-brand-gold" />
              <h3 className="text-base font-semibold tracking-wide-editorial uppercase text-brand-black">
                NARVEKA Size & Fit Guide
              </h3>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="text-brand-stone hover:text-brand-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fit Note */}
          <div className="mt-4 p-3 bg-brand-offwhite border-l-2 border-brand-gold text-xs text-brand-charcoal space-y-1">
            <p className="font-semibold text-brand-black uppercase tracking-wide">
              Architectural Oversized Fit Philosophy
            </p>
            <p className="text-brand-stone">
              All NARVEKA garments are intentionally designed with dropped shoulders, wide chests, and an architectural drape. Choose your normal size for our intended runway silhouette. For a standard tailored fit, select one size down.
            </p>
          </div>

          {/* Controls: Category tabs & Unit switch */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('tee')}
                className={`px-3 py-1.5 text-xs uppercase font-medium transition-colors ${
                  activeTab === 'tee'
                    ? 'bg-brand-black text-brand-ivory'
                    : 'bg-brand-offwhite text-brand-stone hover:text-brand-black'
                }`}
              >
                Oversized Tees
              </button>
              <button
                onClick={() => setActiveTab('hoodie')}
                className={`px-3 py-1.5 text-xs uppercase font-medium transition-colors ${
                  activeTab === 'hoodie'
                    ? 'bg-brand-black text-brand-ivory'
                    : 'bg-brand-offwhite text-brand-stone hover:text-brand-black'
                }`}
              >
                Hoodies
              </button>
              <button
                onClick={() => setActiveTab('shirt')}
                className={`px-3 py-1.5 text-xs uppercase font-medium transition-colors ${
                  activeTab === 'shirt'
                    ? 'bg-brand-black text-brand-ivory'
                    : 'bg-brand-offwhite text-brand-stone hover:text-brand-black'
                }`}
              >
                Shirts
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="flex items-center bg-brand-offwhite border border-brand-lightgrey p-0.5 rounded text-xs">
              <button
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  unit === 'in'
                    ? 'bg-brand-black text-brand-ivory'
                    : 'text-brand-stone hover:text-brand-black'
                }`}
              >
                INCHES (")
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  unit === 'cm'
                    ? 'bg-brand-black text-brand-ivory'
                    : 'text-brand-stone hover:text-brand-black'
                }`}
              >
                CM
              </button>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="mt-5 overflow-x-auto border border-brand-lightgrey">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-offwhite border-b border-brand-lightgrey text-brand-charcoal uppercase tracking-luxury font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest Width</th>
                  <th className="py-2.5 px-3">Body Length</th>
                  <th className="py-2.5 px-3">Shoulder</th>
                  <th className="py-2.5 px-3">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-lightgrey/60 text-brand-charcoal">
                {currentRows.map((row) => (
                  <tr key={row.size} className="hover:bg-brand-offwhite/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-brand-black">{row.size}</td>
                    <td className="py-2.5 px-3">{row.chest} {unit}</td>
                    <td className="py-2.5 px-3">{row.length} {unit}</td>
                    <td className="py-2.5 px-3">{row.shoulder} {unit}</td>
                    <td className="py-2.5 px-3">{row.sleeve} {unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Model measurement note */}
          <div className="mt-5 flex items-center gap-2 text-xs text-brand-stone">
            <Check className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span>Studio model is 6'1" (185 cm) tall, 78 kg, wearing size Large for an exaggerated drape.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
