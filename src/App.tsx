import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { ProductProvider } from './context/ProductContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

const AppContent: React.FC = () => {
  const { currentPage } = useNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-brand-ivory text-brand-black selection:bg-brand-gold selection:text-brand-black">
      {/* Sticky Top Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'shop' && <ShopPage />}
        {currentPage === 'product-detail' && <ProductDetailPage />}
        {currentPage === 'cart' && <ShopPage />} {/* Fallback if navigated to cart url directly */}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'order-confirmation' && <OrderConfirmationPage />}
        {currentPage === 'account' && <AccountPage />}
        {currentPage === 'wishlist' && <WishlistPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Global Modals & Slide-out Drawers */}
      <CartDrawer />
      <SearchModal />
      <SizeGuideModal />
      <QuickViewModal />

      {/* Dark Luxury Editorial Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <ProductProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <NavigationProvider>
                <AppContent />
              </NavigationProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ProductProvider>
    </ToastProvider>
  );
}
