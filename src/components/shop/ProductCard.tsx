import React, { useState } from 'react';
import type { Product } from '../../types';
import { BRAND } from '../../config/brand';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '../../context/NavigationContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { openProductDetail, setQuickViewProduct } = useNavigation();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [showSizeFlyout, setShowSizeFlyout] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const mainImage = product.images[0];
  const hoverImage = product.images[1] || product.images[0];

  const handleQuickAddSize = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    addToCart(product, size, product.colors[selectedColorIndex] || product.colors[0]);
    setShowSizeFlyout(false);
  };

  return (
    <div
      className="group relative flex flex-col cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizeFlyout(false);
      }}
      onClick={() => openProductDetail(product)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-brand-offwhite overflow-hidden border border-brand-lightgrey/60 transition-all duration-500 group-hover:border-brand-stone/40">
        {/* Primary Image */}
        <img
          src={mainImage}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            isHovered && product.images.length > 1 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
        />

        {/* Secondary Hover Image */}
        {product.images.length > 1 && (
          <img
            src={hoverImage}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            loading="lazy"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-brand-black text-brand-ivory text-[9px] font-semibold uppercase tracking-luxury px-2 py-0.5 border border-brand-gold/40">
              New Drop
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="bg-brand-offwhite text-brand-black text-[9px] font-semibold uppercase tracking-luxury px-2 py-0.5 border border-brand-lightgrey">
              Best Seller
            </span>
          )}
          <span className="bg-brand-ivory/90 backdrop-blur-xs text-brand-stone text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 self-start">
            {product.gsm}
          </span>
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-brand-ivory/80 backdrop-blur-sm border border-brand-lightgrey/80 flex items-center justify-center text-brand-charcoal hover:text-brand-gold hover:bg-brand-ivory transition-all z-10"
          aria-label="Save to Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              inWishlist ? 'fill-brand-gold text-brand-gold' : 'stroke-[1.75]'
            }`}
          />
        </button>

        {/* Quick View & Quick Add Floating Bottom Bar */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-brand-black/60 via-brand-black/20 to-transparent transition-all duration-300 flex flex-col gap-2 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          {showSizeFlyout ? (
            <div
              className="bg-brand-ivory p-2 shadow-lg border border-brand-lightgrey animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-brand-lightgrey text-[10px] uppercase font-semibold text-brand-stone">
                <span>Select Size:</span>
                <button
                  onClick={() => setShowSizeFlyout(false)}
                  className="text-brand-stone hover:text-brand-black"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={(e) => handleQuickAddSize(e, sz)}
                    className="py-1 text-[10px] font-bold uppercase bg-brand-offwhite hover:bg-brand-black hover:text-brand-ivory text-brand-black border border-brand-lightgrey transition-colors"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickViewProduct(product);
                }}
                className="py-2 px-2 bg-brand-ivory/95 hover:bg-brand-ivory text-brand-black text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-brand-lightgrey"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizeFlyout(true);
                }}
                className="py-2 px-2 bg-brand-black hover:bg-brand-charcoal text-brand-ivory hover:text-brand-gold text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-brand-black"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add To Bag</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Metadata */}
      <div className="pt-3 pb-1 flex flex-col space-y-1">
        {/* Category & Color Swatches Row */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-luxury text-brand-stone font-medium">
            {product.categoryLabel}
          </span>

          {/* Color Dots */}
          <div
            className="flex items-center space-x-1"
            onClick={(e) => e.stopPropagation()}
          >
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                onClick={() => setSelectedColorIndex(idx)}
                title={color.name}
                className={`w-2.5 h-2.5 rounded-full border transition-transform ${
                  selectedColorIndex === idx
                    ? 'ring-1 ring-brand-black ring-offset-1 scale-110'
                    : 'border-brand-stone/30 hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-black group-hover:text-brand-gold transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Price & Rating */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-black">
              {BRAND.currency.symbol}
              {product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-brand-stone line-through">
                {BRAND.currency.symbol}
                {product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="text-[10px] text-brand-stone">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};
