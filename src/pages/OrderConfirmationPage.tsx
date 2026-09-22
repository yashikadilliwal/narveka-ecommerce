import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../config/brand';
import { CheckCircle2, Package, Truck, ArrowRight, Printer } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { navigateTo, lastConfirmedOrderId } = useNavigation();
  const { orders, setActiveTrackingOrder } = useAuth();

  const confirmedOrder =
    orders.find((o) => o.id === lastConfirmedOrderId) || orders[0];

  if (!confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="editorial-title text-2xl font-bold text-brand-black">No Recent Order Found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 bg-brand-black text-brand-ivory text-xs uppercase font-semibold tracking-luxury"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleTrackInAccount = () => {
    setActiveTrackingOrder(confirmedOrder);
    navigateTo('account');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 animate-fade-in">
      {/* Top Banner */}
      <div className="text-center space-y-4 pb-10 border-b border-brand-lightgrey">
        <div className="w-16 h-16 mx-auto rounded-full bg-brand-offwhite border-2 border-brand-gold flex items-center justify-center text-brand-gold shadow-sm">
          <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
        </div>

        <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block">
          Order Verified • Atelier Processing
        </span>

        <h1 className="editorial-title text-3xl sm:text-4xl font-bold text-brand-black">
          Thank You For Your Order
        </h1>

        <p className="text-xs sm:text-sm text-brand-stone max-w-lg mx-auto">
          We have received your order <strong className="text-brand-black">{confirmedOrder.id}</strong>. A confirmation email and tracking itinerary have been dispatched to{' '}
          <strong className="text-brand-black">{confirmedOrder.shippingAddress.email}</strong>.
        </p>

        {/* Tracking Details Banner */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 p-3 bg-brand-offwhite border border-brand-lightgrey text-xs mt-4">
          <span>Tracking No: <strong className="text-brand-black font-mono">{confirmedOrder.trackingNumber}</strong></span>
          <span>•</span>
          <span>Estimated Handover: <strong className="text-brand-black">{confirmedOrder.estimatedDelivery}</strong></span>
        </div>
      </div>

      {/* Visual Tracking Progress Timeline */}
      <div className="my-10 p-6 sm:p-8 bg-brand-offwhite border border-brand-lightgrey space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-black">
          Atelier Dispatch Progress
        </h3>

        <div className="grid grid-cols-4 gap-2 relative">
          <div className="text-center space-y-1">
            <div className="w-8 h-8 mx-auto rounded-full bg-brand-black text-brand-ivory flex items-center justify-center text-xs font-bold ring-4 ring-brand-gold/20">
              ✓
            </div>
            <p className="text-[11px] font-bold text-brand-black uppercase">Order Placed</p>
            <p className="text-[10px] text-brand-stone">Confirmed</p>
          </div>

          <div className="text-center space-y-1">
            <div className="w-8 h-8 mx-auto rounded-full bg-brand-gold text-brand-black flex items-center justify-center text-xs font-bold animate-pulse">
              2
            </div>
            <p className="text-[11px] font-bold text-brand-black uppercase">Quality QC</p>
            <p className="text-[10px] text-brand-stone">In Preparation</p>
          </div>

          <div className="text-center space-y-1 opacity-50">
            <div className="w-8 h-8 mx-auto rounded-full bg-brand-lightgrey text-brand-stone flex items-center justify-center text-xs font-bold">
              3
            </div>
            <p className="text-[11px] font-semibold text-brand-charcoal uppercase">Dispatched</p>
            <p className="text-[10px] text-brand-stone">Air Courier</p>
          </div>

          <div className="text-center space-y-1 opacity-50">
            <div className="w-8 h-8 mx-auto rounded-full bg-brand-lightgrey text-brand-stone flex items-center justify-center text-xs font-bold">
              4
            </div>
            <p className="text-[11px] font-semibold text-brand-charcoal uppercase">Delivered</p>
            <p className="text-[10px] text-brand-stone">Doorstep</p>
          </div>
        </div>
      </div>

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
        {/* Shipping Destination */}
        <div className="p-6 bg-brand-ivory border border-brand-lightgrey space-y-2 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-brand-lightgrey">
            <Truck className="w-4 h-4 text-brand-gold" />
            <h4 className="font-bold uppercase tracking-luxury text-brand-black">
              Delivery Destination
            </h4>
          </div>
          <p className="font-semibold text-brand-black text-sm">{confirmedOrder.shippingAddress.fullName}</p>
          <p className="text-brand-stone">{confirmedOrder.shippingAddress.addressLine1}</p>
          {confirmedOrder.shippingAddress.addressLine2 && (
            <p className="text-brand-stone">{confirmedOrder.shippingAddress.addressLine2}</p>
          )}
          <p className="text-brand-stone">
            {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} -{' '}
            {confirmedOrder.shippingAddress.pincode}
          </p>
          <p className="text-brand-stone pt-1">Contact: {confirmedOrder.shippingAddress.phone}</p>
        </div>

        {/* Payment Summary */}
        <div className="p-6 bg-brand-ivory border border-brand-lightgrey space-y-2 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-brand-lightgrey">
            <Package className="w-4 h-4 text-brand-gold" />
            <h4 className="font-bold uppercase tracking-luxury text-brand-black">
              Payment & Settlement
            </h4>
          </div>
          <div className="space-y-1 text-brand-charcoal pt-1">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <strong className="uppercase">{confirmedOrder.paymentMethod}</strong>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <strong className="text-emerald-700 uppercase">{confirmedOrder.paymentStatus}</strong>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{BRAND.currency.symbol}{confirmedOrder.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {confirmedOrder.discount > 0 && (
              <div className="flex justify-between text-brand-gold">
                <span>Voucher Discount:</span>
                <span>-{BRAND.currency.symbol}{confirmedOrder.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{confirmedOrder.shippingFee === 0 ? 'Free' : `${BRAND.currency.symbol}${confirmedOrder.shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-brand-black pt-2 border-t border-brand-lightgrey">
              <span>Total Paid:</span>
              <span>{BRAND.currency.symbol}{confirmedOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="border border-brand-lightgrey bg-brand-offwhite p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-luxury text-brand-black">
          Garments In This Delivery
        </h4>
        <div className="divide-y divide-brand-lightgrey/70">
          {confirmedOrder.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-14 object-cover border border-brand-lightgrey"
                />
                <div>
                  <p className="font-semibold text-brand-black uppercase tracking-wide">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] text-brand-stone">
                    Size: {item.selectedSize} • Color: {item.selectedColor.name} • Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-bold text-brand-black">
                {BRAND.currency.symbol}
                {(item.product.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-brand-lightgrey">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-5 py-3 border border-brand-lightgrey bg-brand-ivory text-brand-black text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:border-brand-black transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleTrackInAccount}
            className="w-full sm:w-auto px-6 py-3 bg-brand-offwhite border border-brand-black text-brand-black text-xs font-semibold uppercase tracking-luxury hover:bg-brand-charcoal hover:text-brand-ivory transition-colors"
          >
            Track in My Account
          </button>
          <button
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-auto px-6 py-3 bg-brand-black text-brand-ivory text-xs font-semibold uppercase tracking-luxury hover:bg-brand-gold hover:text-brand-black transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
