import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useNavigation } from '../context/NavigationContext';
import { ProductCard } from '../components/shop/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts } = useWishlist();
  const { navigateTo } = useNavigation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left pb-6 border-b border-brand-lightgrey">
        <span className="text-[11px] uppercase tracking-luxury text-brand-gold font-semibold">
          {BRAND.established} • PRIVATE CURATION
        </span>
        <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black mt-2">
          Your Wishlist
        </h1>
        <p className="text-xs text-brand-stone max-w-xl mt-2 leading-relaxed">
          Garments saved for later consideration. You can quick-add items directly to your shopping bag.
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 bg-brand-offwhite border border-brand-lightgrey p-8 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-ivory border border-brand-lightgrey mx-auto flex items-center justify-center text-brand-stone">
            <Heart className="w-7 h-7 stroke-1" />
          </div>
          <h3 className="editorial-title text-xl font-bold text-brand-black">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-brand-stone leading-relaxed">
            Explore our contemporary streetwear archive. Tap the heart icon on any piece to save your favorite silhouettes here.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-brand-ivory text-xs uppercase font-semibold tracking-luxury hover:bg-brand-charcoal hover:text-brand-gold transition-colors"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
