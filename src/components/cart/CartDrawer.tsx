import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigation } from '../../context/NavigationContext';
import { BRAND } from '../../config/brand';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingFee,
    total,
    freeShippingProgress,
    freeShippingRemaining,
  } = useCart();

  const { navigateTo } = useNavigation();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-brand-ivory shadow-2xl flex flex-col z-10 border-l border-brand-lightgrey animate-slide-left">
        {/* Top Header */}
        <div className="p-5 border-b border-brand-lightgrey flex items-center justify-between bg-brand-ivory">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-black" />
            <h3 className="text-sm font-semibold uppercase tracking-luxury text-brand-black">
              Shopping Bag ({cart.reduce((t, i) => t + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-brand-stone hover:text-brand-black transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-brand-offwhite px-5 py-3 border-b border-brand-lightgrey">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-brand-charcoal">
              {freeShippingRemaining === 0 ? (
                <span className="text-brand-black font-semibold flex items-center gap-1">
                  <span className="text-brand-gold">✦</span> You unlocked Complimentary Shipping!
                </span>
              ) : (
                <>
                  Add{' '}
                  <span className="font-semibold text-brand-black">
                    {BRAND.currency.symbol}
                    {freeShippingRemaining.toLocaleString('en-IN')}
                  </span>{' '}
                  more for Free Express Shipping
                </>
              )}
            </span>
            <span className="text-[10px] text-brand-stone font-semibold">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-brand-lightgrey rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-gold transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-brand-offwhite border border-brand-lightgrey flex items-center justify-center text-brand-stone">
                <ShoppingBag className="w-7 h-7 stroke-1" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold uppercase tracking-luxury text-brand-black">
                  Your bag is empty
                </h4>
                <p className="text-xs text-brand-stone">
                  Explore our luxury streetwear essentials to elevate your everyday uniform.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('shop');
                }}
                className="inline-block mt-2 px-6 py-2.5 bg-brand-black text-brand-ivory text-xs font-semibold uppercase tracking-luxury hover:bg-brand-charcoal hover:text-brand-gold transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-brand-offwhite border border-brand-lightgrey relative group"
              >
                {/* Thumbnail */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover shrink-0 bg-brand-stone/10 border border-brand-lightgrey/60"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <span className="text-[9px] uppercase tracking-luxury text-brand-gold font-medium">
                      {item.product.categoryLabel}
                    </span>
                    <h4 className="text-xs font-semibold text-brand-black uppercase tracking-wide truncate">
                      {item.product.name}
                    </h4>

                    {/* Variant specs */}
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-brand-stone">
                      <span>Size: <strong className="text-brand-charcoal">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        Color:
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-brand-stone/40"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <strong className="text-brand-charcoal">{item.selectedColor.name}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-lightgrey/60">
                    <div className="flex items-center border border-brand-lightgrey bg-brand-ivory">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-brand-charcoal hover:bg-brand-lightgrey/50"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-semibold text-brand-black min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-brand-charcoal hover:bg-brand-lightgrey/50"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-brand-black">
                        {BRAND.currency.symbol}
                        {(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-brand-stone hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with summary and checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-brand-lightgrey bg-brand-ivory space-y-4">
            {/* Promo Code Form */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-brand-gold/10 border border-brand-gold/30 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-brand-gold" />
                    <span className="font-semibold text-brand-black tracking-wide">
                      {appliedCoupon}
                    </span>
                    <span className="text-[10px] text-brand-stone">
                      (-{BRAND.currency.symbol}{discount.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-brand-charcoal hover:text-red-600 underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Promo code (e.g. NARVEKA10)"
                      className="flex-1 bg-brand-offwhite border border-brand-stone/30 px-3 py-1.5 text-xs text-brand-black placeholder-brand-stone/60 uppercase focus:outline-none focus:border-brand-gold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase hover:bg-brand-black hover:text-brand-gold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-red-600 pt-0.5">{couponError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs border-t border-brand-lightgrey/60 pt-3">
              <div className="flex justify-between text-brand-stone">
                <span>Subtotal</span>
                <span>{BRAND.currency.symbol}{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-gold font-medium">
                  <span>Voucher Discount</span>
                  <span>-{BRAND.currency.symbol}{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-brand-stone">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-[11px]">Free</span>
                  ) : (
                    `${BRAND.currency.symbol}${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-black pt-2 border-t border-brand-lightgrey">
                <span>Total</span>
                <span>{BRAND.currency.symbol}{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-brand-black text-brand-ivory hover:bg-brand-charcoal hover:text-brand-gold py-3.5 px-4 text-xs font-semibold uppercase tracking-luxury transition-all flex items-center justify-center gap-2 border border-brand-black"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-brand-stone">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              <span>Complimentary Returns • 100% Authentic Contemporary Streetwear</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
