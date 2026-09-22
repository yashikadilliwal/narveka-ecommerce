import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigation } from '../context/NavigationContext';
import { useToast } from '../context/ToastContext';
import { BRAND } from '../config/brand';
import {
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';

export const AccountPage: React.FC = () => {
  const {
    user,
    isLoggedIn,
    login,
    register,
    logout,
    orders,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    activeTrackingOrder,
    setActiveTrackingOrder,
  } = useAuth();

  const { wishlistProducts } = useWishlist();
  const { navigateTo } = useNavigation();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'tracking' | 'addresses' | 'wishlist'>('orders');

  // Login form state
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // New Address form modal state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddressLine1, setNewAddressLine1] = useState('');
  const [newAddressLine2, setNewAddressLine2] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newIsDefault, setNewIsDefault] = useState(false);

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginEmail.includes('@') || !loginPassword) {
      showToast('Please enter a valid email and password.', 'error');
      return;
    }
    try {
      if (isRegisterMode) {
        if (!loginName.trim()) { showToast('Please enter your name.', 'error'); return; }
        await register(loginName, loginEmail, loginPassword, loginPhone);
      } else {
        await login(loginEmail, loginPassword);
      }
    } catch (err) {
      showToast((err as Error).message || 'Authentication failed.', 'error');
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newAddressLine1 || !newCity || !newPincode) {
      showToast('Please fill all required address fields.', 'error');
      return;
    }

    addAddress({
      fullName: newFullName,
      email: user?.email || '',
      phone: newPhone || user?.phone || '',
      addressLine1: newAddressLine1,
      addressLine2: newAddressLine2,
      city: newCity,
      state: newState || 'Karnataka',
      pincode: newPincode,
      isDefault: newIsDefault,
    });

    setIsAddAddressOpen(false);
    // Reset fields
    setNewFullName('');
    setNewAddressLine1('');
    setNewAddressLine2('');
    setNewCity('');
    setNewPincode('');
  };

  // If not logged in, render luxury authentication portal
  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-brand-offwhite p-8 border border-brand-lightgrey shadow-modal space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase tracking-luxury text-brand-gold font-semibold">
              Atelier Collector Portal
            </span>
            <h1 className="editorial-title text-2xl font-bold text-brand-black">
              {isRegisterMode ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-xs text-brand-stone">
              {isRegisterMode
                ? 'Register to track orders and access private drop releases.'
                : 'Access your order history, delivery tracking, and saved addresses.'}
            </p>
          </div>

          <form onSubmit={handleLoginFormSubmit} className="space-y-4">
            {isRegisterMode && (
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="e.g. Arjun Mehta"
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="collector@example.com"
                className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
              />
            </div>

            {isRegisterMode && (
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-brand-ivory border border-brand-stone/30 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-black text-brand-ivory hover:bg-brand-charcoal hover:text-brand-gold py-3.5 text-xs font-semibold uppercase tracking-luxury transition-all border border-brand-black shadow-sm"
            >
              {isRegisterMode ? 'Create NARVEKA Account' : 'Sign In To Atelier'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-brand-stone hover:text-brand-black underline underline-offset-2"
            >
              {isRegisterMode
                ? 'Already have an account? Sign In'
                : 'New to NARVEKA? Create an Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tracking order: either selected active or latest order
  const currentTrackOrder = activeTrackingOrder || orders[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Account Header */}
      <div className="bg-brand-charcoal text-brand-ivory p-6 sm:p-10 border border-brand-charcoal shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-black border border-brand-gold/40 flex items-center justify-center text-brand-gold font-bold text-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold uppercase tracking-wide text-brand-ivory">
                {user.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full border border-brand-gold/50 bg-brand-gold/10 text-brand-gold text-[9px] uppercase tracking-luxury font-semibold">
                Atelier Member
              </span>
            </div>
            <p className="text-xs text-brand-stone mt-0.5">{user.email} • {user.phone}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-brand-black border border-brand-stone/30 text-brand-stone hover:text-brand-ivory hover:border-brand-gold transition-colors text-xs uppercase tracking-wider"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-brand-lightgrey">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide-editorial transition-all border ${
            activeTab === 'orders'
              ? 'bg-brand-black text-brand-ivory border-brand-black shadow-sm'
              : 'bg-brand-offwhite text-brand-charcoal border-brand-lightgrey hover:text-brand-black'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide-editorial transition-all border ${
            activeTab === 'tracking'
              ? 'bg-brand-black text-brand-ivory border-brand-black shadow-sm'
              : 'bg-brand-offwhite text-brand-charcoal border-brand-lightgrey hover:text-brand-black'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Live Tracking</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide-editorial transition-all border ${
            activeTab === 'addresses'
              ? 'bg-brand-black text-brand-ivory border-brand-black shadow-sm'
              : 'bg-brand-offwhite text-brand-charcoal border-brand-lightgrey hover:text-brand-black'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide-editorial transition-all border ${
            activeTab === 'wishlist'
              ? 'bg-brand-black text-brand-ivory border-brand-black shadow-sm'
              : 'bg-brand-offwhite text-brand-charcoal border-brand-lightgrey hover:text-brand-black'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistProducts.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders List */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-brand-offwhite border border-brand-lightgrey p-8 space-y-4">
              <Package className="w-10 h-10 text-brand-stone mx-auto stroke-1" />
              <h3 className="text-base font-semibold uppercase tracking-luxury text-brand-black">
                No Orders Placed Yet
              </h3>
              <p className="text-xs text-brand-stone">
                You have not placed any orders with the atelier yet.
              </p>
              <button
                onClick={() => navigateTo('shop')}
                className="px-6 py-2.5 bg-brand-black text-brand-ivory text-xs uppercase font-semibold tracking-luxury hover:bg-brand-gold hover:text-brand-black transition-colors"
              >
                Browse Archive
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-brand-offwhite border border-brand-lightgrey p-6 space-y-4 shadow-sm"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-lightgrey gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-luxury text-brand-black">
                        Order #{order.id}
                      </span>
                      <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-stone mt-0.5">
                      Placed on {order.date} • Courier Airway Bill: <span className="font-mono text-brand-black">{order.trackingNumber}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTrackingOrder(order);
                      setActiveTab('tracking');
                    }}
                    className="px-4 py-1.5 bg-brand-ivory border border-brand-black text-brand-black hover:bg-brand-black hover:text-brand-ivory text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Truck className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Track Package</span>
                  </button>
                </div>

                {/* Items in order */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs gap-4">
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
                      <span className="font-semibold text-brand-black">
                        {BRAND.currency.symbol}
                        {(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total & Delivery Address */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-brand-lightgrey text-xs text-brand-stone gap-2">
                  <p>
                    Delivery Destination: <strong className="text-brand-black">{order.shippingAddress.city}, {order.shippingAddress.state}</strong>
                  </p>
                  <p className="text-sm font-bold text-brand-black">
                    Total: {BRAND.currency.symbol}{order.total.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Live Tracking Timeline */}
      {activeTab === 'tracking' && (
        <div className="bg-brand-offwhite border border-brand-lightgrey p-6 sm:p-10 space-y-8">
          {currentTrackOrder ? (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-lightgrey gap-4">
                <div>
                  <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold">
                    Live Atelier Transit Tracking
                  </span>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-brand-black mt-1">
                    Order #{currentTrackOrder.id}
                  </h3>
                  <p className="text-xs text-brand-stone mt-1">
                    Airway Bill No: <strong className="font-mono text-brand-black">{currentTrackOrder.trackingNumber}</strong> • Partner: Bluedart Express Air
                  </p>
                </div>

                <div className="p-3 bg-brand-ivory border border-brand-lightgrey text-xs">
                  <p className="text-brand-stone">Expected Handover:</p>
                  <p className="font-bold text-brand-black text-sm">{currentTrackOrder.estimatedDelivery}</p>
                </div>
              </div>

              {/* Step Progress Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {/* Step 1 */}
                <div className="flex md:flex-col items-start gap-4 p-4 bg-brand-ivory border border-brand-lightgrey">
                  <div className="w-9 h-9 rounded-full bg-brand-black text-brand-ivory flex items-center justify-center text-xs font-bold shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold uppercase tracking-luxury text-brand-black">
                      1. Order Confirmed
                    </p>
                    <p className="text-[11px] text-brand-stone">{currentTrackOrder.date}</p>
                    <p className="text-[10px] text-emerald-700 font-medium">Payment Verified</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex md:flex-col items-start gap-4 p-4 bg-brand-ivory border border-brand-gold/60 ring-1 ring-brand-gold/30">
                  <div className="w-9 h-9 rounded-full bg-brand-gold text-brand-black flex items-center justify-center text-xs font-bold shrink-0 animate-pulse">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold uppercase tracking-luxury text-brand-black">
                      2. Atelier QC & Pack
                    </p>
                    <p className="text-[11px] text-brand-stone">In Process</p>
                    <p className="text-[10px] text-brand-gold font-medium">Dustproof Packing</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex md:flex-col items-start gap-4 p-4 bg-brand-ivory border border-brand-lightgrey opacity-60">
                  <div className="w-9 h-9 rounded-full bg-brand-lightgrey text-brand-stone flex items-center justify-center text-xs font-bold shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold uppercase tracking-luxury text-brand-charcoal">
                      3. Express Air Transit
                    </p>
                    <p className="text-[11px] text-brand-stone">Upcoming</p>
                    <p className="text-[10px] text-brand-stone">Bluedart Priority</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex md:flex-col items-start gap-4 p-4 bg-brand-ivory border border-brand-lightgrey opacity-60">
                  <div className="w-9 h-9 rounded-full bg-brand-lightgrey text-brand-stone flex items-center justify-center text-xs font-bold shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold uppercase tracking-luxury text-brand-charcoal">
                      4. Doorstep Handover
                    </p>
                    <p className="text-[11px] text-brand-stone">Upcoming</p>
                    <p className="text-[10px] text-brand-stone">{currentTrackOrder.shippingAddress.city}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-brand-stone text-xs">
              No orders selected for tracking.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-brand-lightgrey">
            <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-black">
              Saved Shipping Destinations
            </h3>
            <button
              onClick={() => setIsAddAddressOpen(true)}
              className="px-4 py-2 bg-brand-black text-brand-ivory hover:bg-brand-charcoal hover:text-brand-gold text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-6 bg-brand-offwhite border border-brand-lightgrey relative flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-brand-black">{addr.fullName}</h4>
                    {addr.isDefault ? (
                      <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 text-[9px] uppercase font-bold tracking-luxury">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[10px] text-brand-stone hover:text-brand-black underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-brand-stone mt-2 space-y-0.5">
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="pt-1 text-brand-charcoal">Phone: {addr.phone}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-lightgrey/60 flex items-center justify-end">
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-xs text-brand-stone hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {isAddAddressOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div
                className="fixed inset-0 bg-brand-black/70 backdrop-blur-xs"
                onClick={() => setIsAddAddressOpen(false)}
              />
              <div className="relative min-h-screen flex items-center justify-center p-4">
                <form
                  onSubmit={handleSaveAddress}
                  className="relative w-full max-w-lg bg-brand-ivory border border-brand-lightgrey p-6 sm:p-8 shadow-modal space-y-4 animate-fade-in"
                >
                  <h4 className="text-sm font-bold uppercase tracking-luxury text-brand-black pb-3 border-b border-brand-lightgrey">
                    Add New Shipping Address
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full bg-brand-offwhite border border-brand-stone/30 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full bg-brand-offwhite border border-brand-stone/30 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPincode}
                        onChange={(e) => setNewPincode(e.target.value)}
                        className="w-full bg-brand-offwhite border border-brand-stone/30 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddressLine1}
                      onChange={(e) => setNewAddressLine1(e.target.value)}
                      className="w-full bg-brand-offwhite border border-brand-stone/30 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={newAddressLine2}
                      onChange={(e) => setNewAddressLine2(e.target.value)}
                      className="w-full bg-brand-offwhite border border-brand-stone/30 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full bg-brand-offwhite border border-brand-stone/30 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-brand-charcoal font-medium">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full bg-brand-offwhite border border-brand-stone/30 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-2 text-xs text-brand-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsDefault}
                      onChange={(e) => setNewIsDefault(e.target.checked)}
                      className="accent-brand-black"
                    />
                    <span>Set as default shipping address</span>
                  </label>

                  <div className="pt-4 flex justify-end gap-2 border-t border-brand-lightgrey">
                    <button
                      type="button"
                      onClick={() => setIsAddAddressOpen(false)}
                      className="px-4 py-2 border border-brand-lightgrey text-xs uppercase font-medium text-brand-stone"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-brand-black text-brand-ivory text-xs uppercase font-semibold tracking-wider hover:bg-brand-charcoal"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-brand-lightgrey">
            <h3 className="text-xs font-bold uppercase tracking-luxury text-brand-black">
              Saved Atelier Garments ({wishlistProducts.length})
            </h3>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs text-brand-stone hover:text-brand-black flex items-center gap-1 underline"
            >
              <span>Explore More Pieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-brand-offwhite border border-brand-lightgrey p-8 space-y-4">
              <Heart className="w-10 h-10 text-brand-stone mx-auto stroke-1" />
              <h4 className="text-base font-semibold uppercase tracking-luxury text-brand-black">
                Your Wishlist is Empty
              </h4>
              <p className="text-xs text-brand-stone">
                Tap the heart icon on any product card to curate your wishlist here.
              </p>
              <button
                onClick={() => navigateTo('shop')}
                className="px-6 py-2.5 bg-brand-black text-brand-ivory text-xs uppercase font-semibold tracking-luxury hover:bg-brand-gold hover:text-brand-black transition-colors"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
