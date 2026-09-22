import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { CartItem, Product, ProductColor } from '../types';
import { BRAND } from '../config/brand';
import { useToast } from './ToastContext';

interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
}

const AVAILABLE_COUPONS: Record<string, Coupon> = {
  NARVEKA10: { code: 'NARVEKA10', type: 'percentage', value: 10 },
  FIRSTDROP: { code: 'FIRSTDROP', type: 'fixed', value: 500, minSpend: 2500 },
  MINIMALVIP: { code: 'MINIMALVIP', type: 'percentage', value: 15 },
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  shippingFee: number;
  total: number;
  freeShippingProgress: number; // 0 to 100
  freeShippingRemaining: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'narveka_cart_v1';
const COUPON_STORAGE_KEY = 'narveka_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, appliedCoupon);
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, size: string, color: ProductColor, quantity = 1) => {
    const itemId = `${product.id}-${size}-${color.name.toLowerCase().replace(/\s+/g, '-')}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
        },
      ];
    });

    showToast(`Added ${product.name} (${size}) to Bag`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from bag', 'info');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const coupon = AVAILABLE_COUPONS[appliedCoupon];
    if (!coupon) return 0;

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return 0;
    }

    if (coupon.type === 'percentage') {
      return Math.round((subtotal * coupon.value) / 100);
    } else {
      return Math.min(coupon.value, subtotal);
    }
  }, [appliedCoupon, subtotal]);

  const applyCoupon = (rawCode: string) => {
    const cleanCode = rawCode.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS[cleanCode];

    if (!coupon) {
      return { success: false, message: 'Invalid promo code. Try NARVEKA10 or FIRSTDROP.' };
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Code requires a minimum cart value of ₹${coupon.minSpend}.`,
      };
    }

    setAppliedCoupon(cleanCode);
    showToast(`Promo code ${cleanCode} applied!`, 'success');
    return { success: true, message: 'Promo code applied successfully.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= BRAND.freeShippingThreshold ? 0 : 199;
  }, [subtotal]);

  const total = useMemo(() => {
    const discounted = Math.max(0, subtotal - discount);
    return discounted === 0 ? 0 : discounted + shippingFee;
  }, [subtotal, discount, shippingFee]);

  const freeShippingProgress = useMemo(() => {
    if (subtotal >= BRAND.freeShippingThreshold) return 100;
    return Math.min(100, Math.round((subtotal / BRAND.freeShippingThreshold) * 100));
  }, [subtotal]);

  const freeShippingRemaining = useMemo(() => {
    return Math.max(0, BRAND.freeShippingThreshold - subtotal);
  }, [subtotal]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        subtotal,
        discount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        shippingFee,
        total,
        freeShippingProgress,
        freeShippingRemaining,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
