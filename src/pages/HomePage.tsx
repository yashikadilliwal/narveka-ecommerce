import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { LOOKBOOK_GALLERY } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { BRAND } from '../config/brand';
import { ArrowRight, Sparkles, Shield, Compass, Feather, Check } from 'lucide-react';
import { InstagramIcon } from '../components/common/SocialIcons';
import { useToast } from '../context/ToastContext';
import { useProducts } from '../context/ProductContext';

export const HomePage: React.FC = () => {
  const { navigateTo, openCategory } = useNavigation();
  const { showToast } = useToast();
  const { products } = useProducts();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const newArrivals = products.filter((p) => p.isNew || p.category === 't-shirts').slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('You have joined the NARVEKA community.', 'success');
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* 1. Full-Screen Editorial Hero Section */}
      <section className="relative min-h-[92vh] sm:min-h-[95vh] flex items-center justify-center bg-brand-charcoal text-brand-ivory overflow-hidden">
        {/* Background Editorial Fashion Imagery with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop"
            alt="NARVEKA Editorial Hero"
            className="w-full h-full object-cover object-center opacity-45 scale-105 animate-pulse-subtle"
          />
          {/* Gradients for luxury depth and high contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-transparent to-brand-black/80" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-12">
          {/* Established pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-brand-gold/40 bg-brand-black/60 backdrop-blur-md text-xs font-semibold uppercase tracking-luxury text-brand-gold mb-6 animate-fade-in">
            <span className="text-brand-gold text-xs">✦</span>
            <span>{BRAND.established} • CONTEMPORARY STREETWEAR</span>
            <span className="text-brand-gold text-xs">✦</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="editorial-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-luxury text-brand-ivory mb-4 drop-shadow-md">
            NARVEKA
          </h1>

          {/* Brand Tagline */}
          <p className="text-lg sm:text-2xl md:text-3xl text-brand-gold font-light tracking-widest uppercase mb-4">
            {BRAND.tagline}
          </p>

          {/* Subtitle Statement */}
          <p className="text-sm sm:text-base md:text-lg text-brand-offwhite/90 max-w-2xl font-light tracking-wide leading-relaxed mb-10">
            {BRAND.taglineSecondary} Heavyweight drape, architectural silhouettes, and pure minimalist restraint.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigateTo('shop')}
              className="w-full sm:w-auto px-8 py-4 bg-brand-ivory text-brand-black hover:bg-brand-gold hover:text-brand-black text-xs font-bold uppercase tracking-luxury transition-all duration-300 shadow-luxury flex items-center justify-center gap-2 border border-brand-ivory"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openCategory('new-arrivals')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-brand-ivory hover:bg-brand-ivory/10 hover:text-brand-gold text-xs font-bold uppercase tracking-luxury transition-all duration-300 border border-brand-offwhite/40 flex items-center justify-center gap-2 backdrop-blur-xs"
            >
              <span>Explore Collection</span>
            </button>
          </div>

          {/* Subtle scroll cue */}
          <div className="mt-14 sm:mt-18 flex flex-col items-center gap-2 text-brand-stone text-[11px] tracking-widest uppercase opacity-80">
            <span>Scroll To Discover</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-brand-gold to-transparent" />
          </div>
        </div>
      </section>

      {/* 2. Brand Philosophy / Statement Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-block p-1 border-b border-brand-gold/60 mb-6">
          <span className="text-[11px] uppercase tracking-luxury font-semibold text-brand-gold">
            The NARVEKA Manifesto
          </span>
        </div>
        <blockquote className="text-xl sm:text-2xl md:text-3xl font-light text-brand-black leading-relaxed tracking-wide italic">
          “NARVEKA is created for those who believe style doesn’t need to be loud. We focus on modern silhouettes, minimal details and everyday comfort — designed to let you be yourself.”
        </blockquote>
        <div className="mt-6 flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-brand-stone">
          <span>Bengaluru Atelier</span>
          <span>•</span>
          <span>EST. 2026</span>
        </div>
      </section>

      {/* 3. New Arrivals Section (Editorial Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-brand-lightgrey">
          <div>
            <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
              Drop 01 / 2026
            </span>
            <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-brand-black mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => openCategory('new-arrivals')}
            className="mt-3 sm:mt-0 text-xs uppercase tracking-wide-editorial font-semibold text-brand-charcoal hover:text-brand-gold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Large Visual Featured Collection Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[500px] md:min-h-[580px] bg-brand-charcoal overflow-hidden flex items-center p-8 sm:p-14 lg:p-20 text-brand-ivory border border-brand-charcoal">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop"
            alt="Designed for your everyday"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-100 hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/60 to-transparent" />

          {/* Content */}
          <div className="relative z-10 max-w-xl space-y-6">
            <span className="text-xs font-semibold uppercase tracking-luxury text-brand-gold">
              Featured Streetwear Edit
            </span>
            <h2 className="editorial-title text-3xl sm:text-5xl font-bold tracking-luxury leading-tight">
              Designed For Your Everyday.
            </h2>
            <p className="text-xs sm:text-sm text-brand-offwhite/90 leading-relaxed font-light">
              Crafted from heavyweight French Terry and custom-milled 280 GSM combed interlock cotton. Cut boxy and draped intentionally to complement every movement.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => openCategory('hoodies')}
                className="px-6 py-3.5 bg-brand-ivory text-brand-black text-xs font-bold uppercase tracking-luxury hover:bg-brand-gold transition-colors flex items-center gap-2"
              >
                <span>Explore Hoodies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openCategory('t-shirts')}
                className="px-6 py-3.5 bg-transparent border border-brand-ivory/50 text-brand-ivory hover:border-brand-gold hover:text-brand-gold text-xs font-bold uppercase tracking-luxury transition-colors"
              >
                <span>Oversized Tees</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-brand-lightgrey">
          <div>
            <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
              The Essentials
            </span>
            <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-brand-black mt-1">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => openCategory('best-sellers')}
            className="mt-3 sm:mt-0 text-xs uppercase tracking-wide-editorial font-semibold text-brand-charcoal hover:text-brand-gold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Shop All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Why NARVEKA (Four Minimalist Pillars) */}
      <section className="bg-brand-offwhite py-20 border-y border-brand-lightgrey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
              The Atelier Standard
            </span>
            <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-brand-black">
              Why NARVEKA
            </h2>
            <p className="text-xs text-brand-stone leading-relaxed">
              Every detail is considered. No unnecessary branding, no compromise on raw materials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1 */}
            <div className="bg-brand-ivory p-8 border border-brand-lightgrey flex flex-col items-start space-y-4 transition-all hover:border-brand-gold/60 hover:shadow-card">
              <div className="w-12 h-12 rounded-sm bg-brand-charcoal text-brand-gold flex items-center justify-center">
                <Compass className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-luxury text-brand-black">
                Modern Silhouettes
              </h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                Sculpted drop-shoulders, clean boxy chest profiles, and architectural proportions engineered for contemporary urban life.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-brand-ivory p-8 border border-brand-lightgrey flex flex-col items-start space-y-4 transition-all hover:border-brand-gold/60 hover:shadow-card">
              <div className="w-12 h-12 rounded-sm bg-brand-charcoal text-brand-gold flex items-center justify-center">
                <Sparkles className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-luxury text-brand-black">
                Premium Feel
              </h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                Custom milled 280 to 450 GSM luxury fabrics. Enzyme-washed for zero shrinkage and an ultra-soft hand feel that lasts for years.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-brand-ivory p-8 border border-brand-lightgrey flex flex-col items-start space-y-4 transition-all hover:border-brand-gold/60 hover:shadow-card">
              <div className="w-12 h-12 rounded-sm bg-brand-charcoal text-brand-gold flex items-center justify-center">
                <Feather className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-luxury text-brand-black">
                Minimal Design
              </h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                Stripped of gaudy graphics and loud slogans. Refined tone-on-tone textures and subtle muted champagne hardware.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-brand-ivory p-8 border border-brand-lightgrey flex flex-col items-start space-y-4 transition-all hover:border-brand-gold/60 hover:shadow-card">
              <div className="w-12 h-12 rounded-sm bg-brand-charcoal text-brand-gold flex items-center justify-center">
                <Shield className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-luxury text-brand-black">
                Made For Everyday
              </h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                Built with reinforced double-needle seams and non-bacon collar ribs so your garments look as sharp on day 200 as on day 1.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Lookbook & Instagram Visual Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-brand-lightgrey">
          <div>
            <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
              Visual Archive
            </span>
            <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-brand-black mt-1">
              The Lookbook
            </h2>
          </div>
          <a
            href={BRAND.socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-3 sm:mt-0 text-xs uppercase tracking-wide-editorial font-semibold text-brand-charcoal hover:text-brand-gold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-brand-gold" />
            <span>Follow @narvekaclothing</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {LOOKBOOK_GALLERY.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[3/4] overflow-hidden bg-brand-charcoal border border-brand-lightgrey cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-brand-ivory">
                <span className="text-[10px] text-brand-gold uppercase tracking-luxury font-semibold">
                  {item.tag}
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wide mt-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-brand-stone">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Newsletter Invitation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-brand-charcoal text-brand-ivory p-8 sm:p-14 text-center border border-brand-gold/30 shadow-luxury space-y-6">
          <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
            ✦ Privileged Access ✦
          </span>
          <h2 className="editorial-title text-2xl sm:text-4xl font-bold tracking-luxury text-brand-ivory">
            Join the NARVEKA Community
          </h2>
          <p className="text-xs sm:text-sm text-brand-stone max-w-xl mx-auto leading-relaxed">
            Receive exclusive early release access for upcoming streetwear drops, invitation to private studio previews, and members-only styling releases.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 p-3 bg-brand-black border border-brand-gold text-xs text-brand-ivory">
              <Check className="w-4 h-4 text-brand-gold" />
              <span>Thank you for subscribing. Check your inbox for your private invitation.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-brand-black border border-brand-stone/40 px-4 py-3 text-xs text-brand-ivory placeholder-brand-stone/60 focus:outline-none focus:border-brand-gold"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-brand-ivory text-brand-black hover:bg-brand-gold hover:text-brand-black text-xs font-bold uppercase tracking-luxury transition-colors border border-brand-ivory shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[10px] text-brand-stone/60">
            Strict privacy guaranteed. No promotional spam, only curated releases.
          </p>
        </div>
      </section>
    </div>
  );
};
