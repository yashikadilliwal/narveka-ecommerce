import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigation } from '../../context/NavigationContext';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentPage, navigateTo, openCategory, setIsSearchOpen } = useNavigation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: any, category?: string) => {
    setMobileMenuOpen(false);
    if (category) {
      openCategory(category);
    } else {
      navigateTo(page);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-brand-black text-brand-offwhite text-[11px] font-medium tracking-luxury py-2 px-4 text-center border-b border-brand-charcoal/50 flex items-center justify-center gap-2 select-none">
        <span className="text-brand-gold text-xs">✦</span>
        <span>COMPLIMENTARY EXPRESS SHIPPING ON ALL ORDERS ABOVE ₹2,499</span>
        <span className="hidden sm:inline text-brand-gold text-xs">✦</span>
        <span className="hidden sm:inline text-brand-stone">EST. 2026</span>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-ivory/95 backdrop-blur-md shadow-card border-b border-brand-lightgrey/80 py-2.5'
            : 'bg-brand-ivory border-b border-brand-lightgrey/50 py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile Menu Trigger / Desktop Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-brand-black hover:text-brand-gold transition-colors p-1"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              <button
                onClick={() => handleNavClick('shop', 'all')}
                className={`text-xs font-semibold uppercase tracking-wide-editorial transition-colors py-1 relative ${
                  currentPage === 'shop'
                    ? 'text-brand-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-brand-gold'
                    : 'text-brand-charcoal/80 hover:text-brand-black hover:text-brand-gold'
                }`}
              >
                Shop
              </button>
              <button
                onClick={() => handleNavClick('shop', 'new-arrivals')}
                className="text-xs font-semibold uppercase tracking-wide-editorial text-brand-charcoal/80 hover:text-brand-gold transition-colors py-1"
              >
                New Arrivals
              </button>
              <button
                onClick={() => handleNavClick('shop', 'best-sellers')}
                className="text-xs font-semibold uppercase tracking-wide-editorial text-brand-charcoal/80 hover:text-brand-gold transition-colors py-1"
              >
                Best Sellers
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-xs font-semibold uppercase tracking-wide-editorial transition-colors py-1 relative ${
                  currentPage === 'about'
                    ? 'text-brand-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-brand-gold'
                    : 'text-brand-charcoal/80 hover:text-brand-gold'
                }`}
              >
                About
              </button>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
          >
            <BrandLogo variant="header" />
          </div>

          {/* Right: Actions (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-brand-charcoal hover:text-brand-gold transition-colors p-1"
              aria-label="Search catalog"
              title="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            <button
              onClick={() => handleNavClick('account')}
              className={`text-brand-charcoal hover:text-brand-gold transition-colors p-1 ${
                currentPage === 'account' ? 'text-brand-gold' : ''
              }`}
              aria-label="My Account"
              title="Account"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
            </button>

            <button
              onClick={() => handleNavClick('wishlist')}
              className="text-brand-charcoal hover:text-brand-gold transition-colors p-1 relative"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart
                className={`w-5 h-5 stroke-[1.75] ${
                  wishlistCount > 0 ? 'fill-brand-gold text-brand-gold' : ''
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-black text-brand-ivory text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-gold/60">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="text-brand-charcoal hover:text-brand-gold transition-colors p-1 relative"
              aria-label="Cart"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-brand-ivory shadow-2xl flex flex-col justify-between p-6 z-10 border-r border-brand-lightgrey">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-brand-lightgrey">
                <BrandLogo variant="header" className="!h-10" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-brand-charcoal hover:text-brand-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-5">
                <button
                  onClick={() => handleNavClick('home')}
                  className="text-left text-sm font-semibold tracking-wide-editorial uppercase text-brand-black hover:text-brand-gold"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('shop', 'all')}
                  className="text-left text-sm font-semibold tracking-wide-editorial uppercase text-brand-black hover:text-brand-gold"
                >
                  All Streetwear
                </button>
                <button
                  onClick={() => handleNavClick('shop', 't-shirts')}
                  className="text-left text-sm font-medium tracking-wide-editorial text-brand-stone hover:text-brand-black pl-2"
                >
                  — Oversized T-Shirts
                </button>
                <button
                  onClick={() => handleNavClick('shop', 'hoodies')}
                  className="text-left text-sm font-medium tracking-wide-editorial text-brand-stone hover:text-brand-black pl-2"
                >
                  — French Terry Hoodies
                </button>
                <button
                  onClick={() => handleNavClick('shop', 'shirts')}
                  className="text-left text-sm font-medium tracking-wide-editorial text-brand-stone hover:text-brand-black pl-2"
                >
                  — Architectural Shirts
                </button>
                <button
                  onClick={() => handleNavClick('shop', 'new-arrivals')}
                  className="text-left text-sm font-semibold tracking-wide-editorial uppercase text-brand-black hover:text-brand-gold"
                >
                  New Arrivals
                </button>
                <button
                  onClick={() => handleNavClick('shop', 'best-sellers')}
                  className="text-left text-sm font-semibold tracking-wide-editorial uppercase text-brand-black hover:text-brand-gold"
                >
                  Best Sellers
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className="text-left text-sm font-semibold tracking-wide-editorial uppercase text-brand-black hover:text-brand-gold"
                >
                  About NARVEKA
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="text-left text-sm font-semibold tracking-wide-editorial uppercase text-brand-black hover:text-brand-gold"
                >
                  Concierge & Contact
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-lightgrey">
              <p className="text-[11px] text-brand-stone uppercase tracking-luxury mb-3">
                Atelier Client Service
              </p>
              <div className="flex flex-col gap-2 text-xs text-brand-charcoal">
                <button
                  onClick={() => handleNavClick('account')}
                  className="flex items-center justify-between text-left font-medium hover:text-brand-gold"
                >
                  <span>My Account & Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleNavClick('wishlist')}
                  className="flex items-center justify-between text-left font-medium hover:text-brand-gold"
                >
                  <span>Wishlist ({wishlistCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
