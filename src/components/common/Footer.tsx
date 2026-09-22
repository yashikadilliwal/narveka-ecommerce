import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { BRAND } from '../../config/brand';
import { useNavigation } from '../../context/NavigationContext';
import { useToast } from '../../context/ToastContext';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  const { navigateTo, openCategory, setIsSizeGuideOpen } = useNavigation();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the NARVEKA inner circle.', 'success');
  };

  return (
    <footer className="bg-brand-black text-brand-offwhite border-t border-brand-charcoal pt-16 pb-12">
      {/* Brand Values Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-white/10 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-luxury uppercase text-brand-ivory">
                Complimentary Shipping
              </h4>
              <p className="text-xs text-brand-stone mt-0.5">
                On domestic orders above ₹2,499
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-luxury uppercase text-brand-ivory">
                7-Day Returns & Exchanges
              </h4>
              <p className="text-xs text-brand-stone mt-0.5">
                Effortless return process via door pickup
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center text-brand-gold shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-luxury uppercase text-brand-ivory">
                Artisan Quality Guaranteed
              </h4>
              <p className="text-xs text-brand-stone mt-0.5">
                Custom-milled 280-450 GSM luxury fabrics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Column 1: Brand & Logo */}
          <div className="md:col-span-4 flex flex-col space-y-5">
            <BrandLogo variant="footer" />
            <div>
              <h3 className="text-sm font-semibold tracking-luxury text-brand-ivory uppercase">
                {BRAND.name}
              </h3>
              <p className="text-xs text-brand-gold tracking-wide mt-1 font-medium">
                “{BRAND.tagline}” — {BRAND.established}
              </p>
            </div>
            <p className="text-xs text-brand-stone leading-relaxed max-w-sm">
              {BRAND.aboutShort}
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href={BRAND.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-brand-charcoal bg-brand-charcoal/60 flex items-center justify-center text-brand-stone hover:text-brand-gold hover:border-brand-gold/40 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={BRAND.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-brand-charcoal bg-brand-charcoal/60 flex items-center justify-center text-brand-stone hover:text-brand-gold hover:border-brand-gold/40 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-luxury text-brand-ivory border-b border-brand-charcoal pb-2">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-stone">
              <li>
                <button
                  onClick={() => openCategory('all')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Shop All
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('new-arrivals')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('best-sellers')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('t-shirts')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Oversized T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('hoodies')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Heavyweight Hoodies
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('shirts')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Architectural Shirts
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Care */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-luxury text-brand-ivory border-b border-brand-charcoal pb-2">
              Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-stone">
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  About NARVEKA
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Contact & Atelier
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Size & Fit Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Shipping & Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-brand-gold transition-colors text-left"
                >
                  Fabric & Craftsmanship
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-luxury text-brand-ivory border-b border-brand-charcoal pb-2">
              Join The Community
            </h4>
            <p className="text-xs text-brand-stone leading-relaxed">
              Subscribe for private drop notifications, seasonal lookbooks, and exclusive limited edition releases.
            </p>
            {subscribed ? (
              <div className="p-3 bg-brand-charcoal border border-brand-gold/40 text-brand-ivory text-xs flex items-center gap-2">
                <span className="text-brand-gold">✦</span>
                <span>You are on the private collector list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-brand-charcoal border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-ivory placeholder-brand-stone/70 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-brand-ivory text-brand-black hover:bg-brand-gold hover:text-brand-black transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-brand-stone/70">
                  By joining, you agree to our Terms & Privacy Policy. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment badges */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-stone">
          <p>© {new Date().getFullYear()} NARVEKA Studio Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <button onClick={() => navigateTo('about')} className="hover:text-brand-ivory transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('about')} className="hover:text-brand-ivory transition-colors">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-brand-ivory transition-colors">
              Size Chart
            </button>
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-brand-stone/70 uppercase tracking-widest">
            <span className="px-2 py-0.5 rounded border border-brand-charcoal bg-brand-charcoal/40">UPI</span>
            <span className="px-2 py-0.5 rounded border border-brand-charcoal bg-brand-charcoal/40">Cards</span>
            <span className="px-2 py-0.5 rounded border border-brand-charcoal bg-brand-charcoal/40">Razorpay Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
