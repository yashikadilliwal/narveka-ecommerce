import React from 'react';

interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'hero' | 'minimal' | 'emblem';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'header', className = '' }) => {
  if (variant === 'header') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src="/narveka-logo.jpg"
          alt="NARVEKA - Modern. Minimal. You."
          className="h-14 sm:h-16 w-auto object-contain mix-blend-multiply transition-opacity duration-300 hover:opacity-90"
        />
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img
          src="/narveka-logo.jpg"
          alt="NARVEKA - Modern. Minimal. You."
          className="w-full max-w-[420px] sm:max-w-[540px] md:max-w-[620px] h-auto object-contain mix-blend-multiply drop-shadow-sm"
        />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col items-start ${className}`}>
        {/* On dark charcoal/black footer, render in a refined ivory luxury container so original logo colors and proportions are 100% preserved */}
        <div className="bg-brand-ivory p-2.5 sm:p-3 rounded-sm border border-brand-gold/30 shadow-luxury inline-block">
          <img
            src="/narveka-logo.jpg"
            alt="NARVEKA"
            className="h-12 sm:h-14 w-auto object-contain mix-blend-multiply"
          />
        </div>
      </div>
    );
  }

  // Fallback / default
  return (
    <img
      src="/narveka-logo.jpg"
      alt="NARVEKA"
      className={`h-12 w-auto object-contain mix-blend-multiply ${className}`}
    />
  );
};
