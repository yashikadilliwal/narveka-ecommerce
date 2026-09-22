import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { BRAND } from '../../config/brand';
import type { ProductColor } from '../../types';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, openProductDetail, setIsSizeGuideOpen } = useNavigation();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = quickViewProduct;

  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product?.colors[0] || { name: 'Black', hex: '#0B0B0B' }
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
  };

  const handleViewFullProduct = () => {
    setQuickViewProduct(null);
    openProductDetail(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-brand-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-brand-ivory border border-brand-lightgrey shadow-modal p-6 sm:p-8 animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 text-brand-stone hover:text-brand-black transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Product Images */}
            <div className="space-y-3">
              <div className="relative aspect-[4/5] bg-brand-offwhite overflow-hidden border border-brand-lightgrey">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-brand-black text-brand-ivory text-[10px] font-semibold tracking-luxury uppercase px-2 py-0.5 border border-brand-gold/40">
                    New Drop
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-16 border overflow-hidden transition-all ${
                        activeImageIndex === idx
                          ? 'border-brand-black ring-1 ring-brand-black'
                          : 'border-brand-lightgrey opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details & Options */}
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-semibold tracking-luxury uppercase text-brand-gold">
                  {product.categoryLabel} • {product.gsm}
                </span>
                <h3 className="text-xl font-semibold text-brand-black tracking-wide mt-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-base font-semibold text-brand-black">
                    {BRAND.currency.symbol}
                    {product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-brand-stone line-through">
                      {BRAND.currency.symbol}
                      {product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-brand-stone leading-relaxed">
                {product.description}
              </p>

              {/* Color Swatches */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-brand-charcoal uppercase tracking-wider">
                    Color: <span className="text-brand-stone font-normal">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                        selectedColor.name === color.name
                          ? 'ring-2 ring-brand-gold ring-offset-2 border-brand-charcoal'
                          : 'border-brand-lightgrey hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-brand-charcoal uppercase tracking-wider">
                    Select Size
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[11px] text-brand-stone hover:text-brand-gold underline underline-offset-2"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-semibold uppercase tracking-wider border transition-all ${
                        selectedSize === sz
                          ? 'bg-brand-black text-brand-ivory border-brand-black'
                          : 'bg-brand-offwhite text-brand-charcoal border-brand-lightgrey hover:border-brand-black'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-brand-lightgrey bg-brand-offwhite">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-xs text-brand-charcoal hover:bg-brand-lightgrey/50"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-semibold text-brand-black min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-xs text-brand-charcoal hover:bg-brand-lightgrey/50"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-brand-black text-brand-ivory hover:bg-brand-charcoal hover:text-brand-gold py-3 px-4 text-xs font-semibold uppercase tracking-luxury transition-all flex items-center justify-center gap-2 border border-brand-black"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Bag</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-3 border border-brand-lightgrey bg-brand-offwhite hover:border-brand-gold transition-colors text-brand-charcoal"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${inWishlist ? 'fill-brand-gold text-brand-gold' : ''}`}
                    />
                  </button>
                </div>

                <button
                  onClick={handleViewFullProduct}
                  className="w-full text-center text-xs text-brand-stone hover:text-brand-black font-medium tracking-wide flex items-center justify-center gap-1.5 py-1"
                >
                  <span>View Full Garment Details & Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
