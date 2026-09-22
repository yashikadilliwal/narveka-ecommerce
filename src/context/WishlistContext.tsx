import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useProducts } from './ProductContext';
import { useAuth } from './AuthContext';
import { api } from '../api';

import type { Product } from '../types';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'narveka_wishlist_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const { products } = useProducts();
  const { isLoggedIn } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const load=async()=>{
      if(isLoggedIn){
        try { const ids=await api<string[]>('/wishlist/',{},true); setWishlistIds(ids.map(String)); return; } catch {}
      }
      try { localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds)); } catch {}
    };
    load();
  }, [isLoggedIn]);

  const toggleWishlist = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    const title = product ? product.name : 'Item';
    const exists = wishlistIds.includes(productId);
    if(isLoggedIn){
      try{
        if(exists) await api(`/wishlist/${productId}/`,{method:'DELETE'},true);
        else await api('/wishlist/',{method:'POST',body:JSON.stringify({product_id:productId})},true);
      }catch(e){ showToast((e as Error).message,'error'); return; }
    }
    setWishlistIds(prev=>exists?prev.filter(id=>id!==productId):[...prev,productId]);
    showToast(exists?'Removed from Wishlist':`Saved ${title} to Wishlist`,exists?'info':'success');
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
