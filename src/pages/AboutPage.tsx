import React from 'react';
import { BRAND } from '../config/brand';
import { useNavigation } from '../context/NavigationContext';
import { ArrowRight, Sparkles, Feather, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Editorial Header */}
      <section className="relative py-20 sm:py-28 bg-brand-charcoal text-brand-ivory overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop"
            alt="Atelier"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
            {BRAND.established} • ATELIER STORY
          </span>
          <h1 className="editorial-title text-3xl sm:text-5xl md:text-6xl font-bold tracking-luxury text-brand-ivory">
            The NARVEKA Philosophy
          </h1>
          <p className="text-sm sm:text-base text-brand-offwhite/90 max-w-xl mx-auto font-light tracking-wide">
            “{BRAND.tagline}”
          </p>
        </div>
      </section>

      {/* Main Narrative & Logo Showcase */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
              Modern • Minimal • You
            </span>
            <blockquote className="editorial-serif text-2xl sm:text-3xl text-brand-black leading-relaxed italic border-l-2 border-brand-gold pl-4">
              “NARVEKA is created for those who believe style doesn’t need to be loud. We focus on modern silhouettes, minimal details and everyday comfort — designed to let you be yourself.”
            </blockquote>
            <p className="text-xs sm:text-sm text-brand-stone leading-relaxed">
              Founded in 2026, NARVEKA was conceived in response to an increasingly noisy fashion landscape. We stripped away excess graphics, loud monograms, and superficial branding to direct all focus onto what truly matters: architectural proportion, heavyweight drape, and fabric excellence.
            </p>
            <p className="text-xs sm:text-sm text-brand-stone leading-relaxed">
              Every garment starts at the raw yarn level. Custom-milling 280 GSM interlock jersey and 450 GSM pure loopback French Terry ensures our pieces hold their structural geometry through daily life.
            </p>
          </div>

          <div className="relative aspect-[4/5] bg-brand-offwhite border border-brand-lightgrey overflow-hidden shadow-card flex items-center justify-center p-8">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
              alt="NARVEKA Atelier Craft"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-brand-ivory/95 backdrop-blur-sm border border-brand-lightgrey text-center">
              <BrandLogo variant="minimal" className="!h-10 mx-auto" />
              <p className="text-[10px] text-brand-stone uppercase tracking-widest mt-1">
                Bengaluru Atelier • Limited Batches
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Standards */}
      <section className="bg-brand-offwhite py-20 border-y border-brand-lightgrey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
              Raw Materials & Discipline
            </span>
            <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-brand-black">
              The Three Tenets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-brand-ivory border border-brand-lightgrey space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-black">
                Custom-Milled Weights
              </h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                We reject stock off-the-shelf fabrics. Our cottons are combed, compacted, and custom-spun at weights between 280 GSM and 450 GSM to resist washing distortion.
              </p>
            </div>

            <div className="p-8 bg-brand-ivory border border-brand-lightgrey space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-black">
                Architectural Fit
              </h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                Streetwear should flatter naturally. Drop-shoulders are balanced with wide chest spans and precisely calculated sleeve openings for effortless posture.
              </p>
            </div>

            <div className="p-8 bg-brand-ivory border border-brand-lightgrey space-y-3">
              <div className="w-10 h-10 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-black">
                Restraint In Details
              </h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                Subtle champagne-gold metal hardware, concealed plackets, and tone-on-tone embroidery. Luxury that whispers rather than screams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center max-w-xl mx-auto px-4 space-y-6">
        <h3 className="editorial-title text-2xl font-bold text-brand-black">
          Discover The New Standard
        </h3>
        <p className="text-xs text-brand-stone">
          Explore our initial drop of oversized t-shirts, heavyweight French Terry hoodies, and architectural poplin shirts.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-black text-brand-ivory text-xs uppercase font-semibold tracking-luxury hover:bg-brand-charcoal hover:text-brand-gold transition-colors"
        >
          <span>Explore Streetwear Archive</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
