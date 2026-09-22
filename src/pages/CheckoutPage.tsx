import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useToast } from '../context/ToastContext';
import { BRAND } from '../config/brand';
import { ShieldCheck, Lock, CreditCard, Smartphone, Building2, ArrowLeft } from 'lucide-react';
import { api } from '../api';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, discount, appliedCoupon, shippingFee, total, clearCart } = useCart();
  const { user, addresses, createOrder } = useAuth();
  const { navigateTo, setLastConfirmedOrderId } = useNavigation();
  const { showToast } = useToast();

  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  // Customer & Shipping Form State
  const [fullName, setFullName] = useState(defaultAddr?.fullName || user?.name || '');
  const [email, setEmail] = useState(defaultAddr?.email || user?.email || '');
  const [phone, setPhone] = useState(defaultAddr?.phone || user?.phone || '');
  const [addressLine1, setAddressLine1] = useState(defaultAddr?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(defaultAddr?.addressLine2 || '');
  const [city, setCity] = useState(defaultAddr?.city || 'Bengaluru');
  const [state, setState] = useState(defaultAddr?.state || 'Karnataka');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '560038');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'priority'>('standard');

  // Payment Selection structured for Razorpay
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'razorpay' | 'cod'>('razorpay');
  const [razorpayMethod, setRazorpayMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const [isProcessing, setIsProcessing] = useState(false);

  // If cart is empty, redirect or display prompt
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="editorial-title text-2xl font-bold text-brand-black">Your Bag is Empty</h2>
        <p className="text-xs text-brand-stone">Add garments to your shopping bag before proceeding to checkout.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 bg-brand-black text-brand-ivory text-xs uppercase font-semibold tracking-luxury hover:bg-brand-charcoal hover:text-brand-gold transition-colors"
        >
          Explore Catalogue
        </button>
      </div>
    );
  }

  const effectiveShipping = shippingMethod === 'priority' ? shippingFee + 150 : shippingFee;
  const grandTotal = total + (shippingMethod === 'priority' ? 150 : 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !addressLine1.trim() || !pincode.trim()) {
      showToast('Please complete all mandatory contact and shipping fields.', 'error');
      return;
    }
    if (!user) {
      showToast('Please sign in or create an account before checkout.', 'error');
      navigateTo('account');
      return;
    }

    setIsProcessing(true);
    const shippingAddress = { fullName, email, phone, addressLine1, addressLine2, city, state, pincode };
    const payload = {
      items: cart.map((item) => ({
        productId: item.product.slug,
        size: item.selectedSize,
        colorName: item.selectedColor.name,
        quantity: item.quantity,
      })),
      shippingAddress,
      shippingMethod,
      couponCode: appliedCoupon || '',
      paymentMethod: selectedPaymentMode,
    };

    try {
      const order = await createOrder(payload);

      if (selectedPaymentMode === 'cod') {
        clearCart();
        await api('/orders/', {}, true).catch(() => null);
        setLastConfirmedOrderId(order.orderNumber);
        navigateTo('order-confirmation');
        showToast(`Order ${order.orderNumber} confirmed.`, 'success');
        return;
      }

      if (!(window as any).Razorpay) {
        throw new Error('Razorpay Checkout could not load. Please refresh and try again.');
      }

      const razorpay = new (window as any).Razorpay({
        key: order.razorpayKeyId,
        amount: Math.round(Number(order.amount) * 100),
        currency: order.currency,
        name: BRAND.name,
        description: 'NARVEKA — Modern. Minimal. You.',
        image: BRAND.logoUrl,
        order_id: order.razorpayOrderId,
        prefill: { name: fullName, email, contact: phone },
        notes: { order_number: order.orderNumber },
        theme: { color: BRAND.colors.black },
        modal: { ondismiss: () => setIsProcessing(false) },
        handler: async (response: any) => {
          try {
            await api('/orders/verify-payment/', {
              method: 'POST',
              body: JSON.stringify({
                orderId: order.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }, true);
            clearCart();
            setLastConfirmedOrderId(order.orderNumber);
            navigateTo('order-confirmation');
            showToast(`Payment successful. Order ${order.orderNumber} is confirmed.`, 'success');
          } catch (err) {
            showToast((err as Error).message || 'Payment verification failed. Please contact NARVEKA support.', 'error');
          } finally {
            setIsProcessing(false);
          }
        },
      });

      razorpay.on('payment.failed', (response: any) => {
        setIsProcessing(false);
        showToast(response?.error?.description || 'Payment failed. Your order was not confirmed.', 'error');
      });

      razorpay.open();
    } catch (err) {
      setIsProcessing(false);
      showToast((err as Error).message || 'Unable to place the order.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Return to cart */}
      <button
        onClick={() => navigateTo('shop')}
        className="inline-flex items-center gap-1.5 text-xs text-brand-stone hover:text-brand-black uppercase tracking-wider mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return To Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Form (Contact, Shipping, Payment) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-10">
          {/* 1. Contact Info */}
          <div className="bg-brand-offwhite p-6 sm:p-8 border border-brand-lightgrey space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-brand-lightgrey">
              <h2 className="text-xs font-bold uppercase tracking-luxury text-brand-black flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-black text-brand-ivory flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Contact & Collector Details</span>
              </h2>
              <span className="text-[11px] text-brand-stone">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arjun Mehta"
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Email Address (for order tracking) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arjun@example.com"
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Phone Number (for courier delivery) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-brand-offwhite p-6 sm:p-8 border border-brand-lightgrey space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-brand-lightgrey">
              <h2 className="text-xs font-bold uppercase tracking-luxury text-brand-black flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-black text-brand-ivory flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Shipping Address</span>
              </h2>
              <span className="text-[11px] text-brand-stone">Step 2 of 3</span>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Street Address, Apartment / Flat / Suite *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="House/Apt No., Building Name, Street"
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Apartment Details, Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Near Landmark / Area"
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560038"
                    className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Shipping Speed Option */}
              <div className="pt-2 space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-semibold">
                  Delivery Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                      shippingMethod === 'standard'
                        ? 'border-brand-black bg-brand-ivory ring-1 ring-brand-black'
                        : 'border-brand-lightgrey bg-brand-ivory/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="mt-0.5 accent-brand-black"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-brand-black">Standard Express Air</p>
                      <p className="text-brand-stone text-[11px]">3 - 5 Business Days</p>
                      <p className="font-medium text-emerald-700 mt-1">
                        {shippingFee === 0 ? 'Complimentary' : `${BRAND.currency.symbol}${shippingFee}`}
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setShippingMethod('priority')}
                    className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                      shippingMethod === 'priority'
                        ? 'border-brand-black bg-brand-ivory ring-1 ring-brand-black'
                        : 'border-brand-lightgrey bg-brand-ivory/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'priority'}
                      onChange={() => setShippingMethod('priority')}
                      className="mt-0.5 accent-brand-black"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-brand-black">Next-Day Priority Atelier</p>
                      <p className="text-brand-stone text-[11px]">1 - 2 Business Days</p>
                      <p className="font-medium text-brand-black mt-1">
                        +{BRAND.currency.symbol}150
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Section (Structured for Razorpay) */}
          <div className="bg-brand-offwhite p-6 sm:p-8 border border-brand-lightgrey space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-brand-lightgrey">
              <h2 className="text-xs font-bold uppercase tracking-luxury text-brand-black flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-black text-brand-ivory flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Secure Payment</span>
              </h2>
              <span className="text-[11px] text-brand-stone">Step 3 of 3</span>
            </div>

            {/* Razorpay Gateway Structured Info Banner */}
            <div className="p-3.5 bg-brand-charcoal text-brand-ivory border-l-2 border-brand-gold text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-luxury text-brand-gold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-gold" />
                  Live Razorpay Checkout
                </span>
                <span className="text-[10px] uppercase tracking-wider text-brand-stone bg-brand-black px-2 py-0.5 border border-brand-stone/30">
                  Live/Test Key
                </span>
              </div>
              <p className="text-brand-stone text-[11px] leading-relaxed">
                Secure Razorpay Checkout is connected to the NARVEKA backend. Your payment is verified server-side before the order is marked paid.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMode('razorpay')}
                  className={`p-3.5 text-left border transition-all ${
                    selectedPaymentMode === 'razorpay'
                      ? 'border-brand-black bg-brand-ivory ring-1 ring-brand-black'
                      : 'border-brand-lightgrey bg-brand-ivory/60'
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-luxury text-brand-black">
                    Online via Razorpay
                  </p>
                  <p className="text-[11px] text-brand-stone mt-0.5">
                    UPI, Cards, Net Banking, Wallets
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMode('cod')}
                  className={`p-3.5 text-left border transition-all ${
                    selectedPaymentMode === 'cod'
                      ? 'border-brand-black bg-brand-ivory ring-1 ring-brand-black'
                      : 'border-brand-lightgrey bg-brand-ivory/60'
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-luxury text-brand-black">
                    Cash On Delivery (COD)
                  </p>
                  <p className="text-[11px] text-brand-stone mt-0.5">
                    Pay upon doorstep courier handover
                  </p>
                </button>
              </div>

              {selectedPaymentMode === 'razorpay' && (
                <div className="p-4 bg-brand-ivory border border-brand-lightgrey space-y-3 animate-fade-in">
                  <span className="text-[11px] uppercase tracking-wider text-brand-stone font-semibold block">
                    Supported Modes via Razorpay:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRazorpayMethod('upi')}
                      className={`p-2.5 border text-center text-xs flex flex-col items-center gap-1 transition-colors ${
                        razorpayMethod === 'upi'
                          ? 'border-brand-black bg-brand-offwhite font-bold'
                          : 'border-brand-lightgrey text-brand-stone hover:text-brand-black'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-brand-gold" />
                      <span>Instant UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRazorpayMethod('card')}
                      className={`p-2.5 border text-center text-xs flex flex-col items-center gap-1 transition-colors ${
                        razorpayMethod === 'card'
                          ? 'border-brand-black bg-brand-offwhite font-bold'
                          : 'border-brand-lightgrey text-brand-stone hover:text-brand-black'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-brand-gold" />
                      <span>Debit/Credit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRazorpayMethod('netbanking')}
                      className={`p-2.5 border text-center text-xs flex flex-col items-center gap-1 transition-colors ${
                        razorpayMethod === 'netbanking'
                          ? 'border-brand-black bg-brand-offwhite font-bold'
                          : 'border-brand-lightgrey text-brand-stone hover:text-brand-black'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-brand-gold" />
                      <span>Net Banking</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-brand-black text-brand-ivory hover:bg-brand-charcoal hover:text-brand-gold py-4 px-6 text-xs font-semibold uppercase tracking-luxury transition-all flex items-center justify-center gap-2 border border-brand-black shadow-card disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Opening Secure Payment...'
                  : `Confirm & Place Order • ${BRAND.currency.symbol}${grandTotal.toLocaleString('en-IN')}`}
              </span>
            </button>

            <p className="text-center text-[10px] text-brand-stone flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              <span>256-Bit SSL Encrypted & Confidential Checkout</span>
            </p>
          </div>
        </form>

        {/* Right Column: Order Summary (Sticky) */}
        <div className="lg:col-span-5 bg-brand-offwhite p-6 sm:p-8 border border-brand-lightgrey space-y-6 shadow-sm lg:sticky lg:top-28">
          <div className="flex items-center justify-between pb-3 border-b border-brand-lightgrey">
            <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-black">
              Order Summary ({cart.reduce((t, i) => t + i.quantity, 0)} Items)
            </h3>
            <button
              onClick={() => navigateTo('shop')}
              className="text-[11px] text-brand-stone hover:text-brand-black underline"
            >
              Modify
            </button>
          </div>

          {/* Line Items List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs pb-3 border-b border-brand-lightgrey/60">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-14 h-18 object-cover bg-brand-stone/10 border border-brand-lightgrey/50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-brand-black truncate uppercase tracking-wide">
                    {item.product.name}
                  </h4>
                  <p className="text-brand-stone text-[11px] mt-0.5">
                    Qty: {item.quantity} • Size: {item.selectedSize} • {item.selectedColor.name}
                  </p>
                  <p className="font-bold text-brand-black mt-1">
                    {BRAND.currency.symbol}
                    {(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 text-xs border-t border-brand-lightgrey pt-4">
            <div className="flex justify-between text-brand-charcoal">
              <span>Bag Subtotal</span>
              <span>{BRAND.currency.symbol}{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-brand-gold font-medium">
                <span>Voucher ({appliedCoupon})</span>
                <span>-{BRAND.currency.symbol}{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-brand-charcoal">
              <span>Shipping Fee</span>
              <span>
                {effectiveShipping === 0 ? (
                  <span className="text-emerald-700 font-semibold uppercase text-[11px]">Free</span>
                ) : (
                  `${BRAND.currency.symbol}${effectiveShipping}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-brand-black pt-3 border-t border-brand-lightgrey">
              <span>Grand Total</span>
              <span>{BRAND.currency.symbol}{grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-brand-stone">Inclusive of GST and all applicable local duties.</p>
          </div>

          {/* Guarantee Badges */}
          <div className="p-3 bg-brand-ivory border border-brand-lightgrey text-[11px] text-brand-stone space-y-1">
            <p className="font-semibold text-brand-black">✦ NARVEKA Client Promise</p>
            <p>Every piece arrives in signature dustproof garment wrapping with individual batch seal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
