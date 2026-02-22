import { useState, useMemo, useCallback } from 'react';
import { CartItem, Cake, Coupon } from '../types';

export function useCart(availableCoupons: Coupon[], cakes: Cake[]) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback((cakeId: string, type: 'whole' | 'slice') => {
    setItems((prev) => {
      const existing = prev.find((i) => i.cakeId === cakeId && i.type === type);
      if (existing) {
        return prev.map((i) =>
          i.cakeId === cakeId && i.type === type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { cakeId, type, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((cakeId: string, type: 'whole' | 'slice') => {
    setItems((prev) => {
      const existing = prev.find((i) => i.cakeId === cakeId && i.type === type);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.cakeId === cakeId && i.type === type
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }
      return prev.filter((i) => !(i.cakeId === cakeId && i.type === type));
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const cake = cakes.find((c) => c.id === item.cakeId);
      if (!cake) return acc;
      
      let price = item.type === 'whole' ? cake.priceWhole : cake.priceSlice;
      
      // Check for sale price
      if (item.type === 'whole' && cake.salePriceWhole) price = cake.salePriceWhole;
      if (item.type === 'slice' && cake.salePriceSlice) price = cake.salePriceSlice;
      
      return acc + price * item.quantity;
    }, 0);
  }, [items, cakes]);

  const applyCoupon = useCallback((code: string) => {
    const found = availableCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      return true;
    }
    setAppliedCoupon(null);
    return false;
  }, [availableCoupons]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return subtotal * (appliedCoupon.discount / 100);
    }
    return Math.min(appliedCoupon.discount, subtotal);
  }, [appliedCoupon, subtotal]);

  const total = subtotal - discount;

  return {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    subtotal,
    total,
    discount,
    appliedCoupon,
    applyCoupon,
  };
}
