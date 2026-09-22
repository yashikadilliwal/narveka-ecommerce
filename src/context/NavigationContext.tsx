import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import { useProducts } from './ProductContext';

export type PageView =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'account'
  | 'wishlist'
  | 'about'
  | 'contact';

interface NavigationContextType {
  currentPage: PageView;
  selectedProduct: Product | null;
  selectedCategory: string;
  navigateTo: (page: PageView, data?: { product?: Product; category?: string }) => void;
  openProductDetail: (product: Product) => void;
  openCategory: (category: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  lastConfirmedOrderId: string | null;
  setLastConfirmedOrderId: (id: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useProducts();
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastConfirmedOrderId, setLastConfirmedOrderId] = useState<string | null>(null);

  // Sync with window.location.hash for natural browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) {
        setCurrentPage('home');
        return;
      }

      if (hash.startsWith('product/')) {
        const slugOrId = hash.replace('product/', '');
        const found = products.find((p) => p.slug === slugOrId || p.id === slugOrId);
        if (found) {
          setSelectedProduct(found);
          setCurrentPage('product-detail');
        }
      } else if (hash.startsWith('shop/')) {
        const cat = hash.replace('shop/', '');
        setSelectedCategory(cat);
        setCurrentPage('shop');
      } else if (['home', 'shop', 'cart', 'checkout', 'order-confirmation', 'account', 'wishlist', 'about', 'contact'].includes(hash)) {
        setCurrentPage(hash as PageView);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageView, data?: { product?: Product; category?: string }) => {
    if (data?.product) {
      setSelectedProduct(data.product);
    }
    if (data?.category) {
      setSelectedCategory(data.category);
    }

    setCurrentPage(page);

    // Update URL hash smoothly
    if (page === 'home') {
      window.location.hash = '';
    } else if (page === 'product-detail' && (data?.product || selectedProduct)) {
      const prod = data?.product || selectedProduct;
      window.location.hash = `product/${prod?.slug || prod?.id}`;
    } else if (page === 'shop') {
      const cat = data?.category || selectedCategory;
      window.location.hash = cat !== 'all' ? `shop/${cat}` : 'shop';
    } else {
      window.location.hash = page;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (product: Product) => {
    navigateTo('product-detail', { product });
  };

  const openCategory = (category: string) => {
    navigateTo('shop', { category });
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        selectedProduct,
        selectedCategory,
        navigateTo,
        openProductDetail,
        openCategory,
        isSearchOpen,
        setIsSearchOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        quickViewProduct,
        setQuickViewProduct,
        lastConfirmedOrderId,
        setLastConfirmedOrderId,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};
