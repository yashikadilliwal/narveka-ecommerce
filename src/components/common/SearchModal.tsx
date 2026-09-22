import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { BRAND } from '../../config/brand';
import { useProducts } from '../../context/ProductContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openProductDetail } = useNavigation();
  const { products } = useProducts();
  const [query, setQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Clear query when opened
  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.gsm.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-16 sm:pt-24">
        <div className="relative w-full max-w-2xl bg-brand-ivory border border-brand-lightgrey shadow-modal p-6 sm:p-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-lightgrey">
            <span className="text-[11px] font-semibold tracking-luxury uppercase text-brand-stone">
              Search NARVEKA Archive
            </span>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-brand-stone hover:text-brand-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="mt-4 relative flex items-center">
            <Search className="w-5 h-5 text-brand-stone absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search oversized tees, French Terry hoodies, shirts, 280 GSM..."
              className="w-full bg-brand-offwhite border border-brand-stone/30 pl-11 pr-4 py-3.5 text-sm text-brand-black placeholder-brand-stone/60 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
            />
          </div>

          {/* Quick Suggestions / Results */}
          <div className="mt-6 max-h-[60vh] overflow-y-auto pr-1">
            {query.trim() === '' ? (
              <div>
                <p className="text-xs uppercase tracking-luxury text-brand-stone font-semibold mb-3">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Heavyweight Hoodie', '280 GSM Tee', 'Poplin Shirt', 'French Terry', 'Oversized'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1.5 bg-brand-offwhite text-brand-charcoal text-xs border border-brand-lightgrey hover:border-brand-gold hover:text-brand-gold transition-colors"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-luxury text-brand-stone font-semibold mb-2">
                  Found {filteredProducts.length} Piece{filteredProducts.length > 1 ? 's' : ''}
                </p>
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openProductDetail(prod);
                    }}
                    className="group flex items-center gap-4 p-2.5 bg-brand-offwhite/50 border border-brand-lightgrey/60 hover:border-brand-gold/60 cursor-pointer transition-all"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-14 h-18 object-cover shrink-0 bg-brand-stone/10"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-luxury text-brand-gold font-medium">
                        {prod.categoryLabel} • {prod.gsm}
                      </span>
                      <h4 className="text-sm font-semibold text-brand-black group-hover:text-brand-gold transition-colors truncate">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-brand-stone mt-0.5">
                        {BRAND.currency.symbol}
                        {prod.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-stone group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-brand-stone">
                <p className="text-sm">No garments found matching "{query}".</p>
                <p className="text-xs mt-1 text-brand-stone/70">
                  Try searching for 'Tee', 'Hoodie', 'Shirt', or 'French Terry'.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
