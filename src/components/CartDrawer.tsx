import React, { useState } from 'react';
import { X, Minus, Plus, Wallet, CreditCard, Ticket, ChevronRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Cake, Coupon } from '../types';
import { cn, formatCurrency } from '../utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: (CartItem & { cake: Cake })[];
  onRemove: (cakeId: string, type: 'whole' | 'slice') => void;
  subtotal: number;
  total: number;
  discount: number;
  onApplyCoupon: (code: string) => boolean;
  appliedCoupon: Coupon | null;
  walletBalance: number;
  onCheckout: (method: 'wallet' | 'pix' | 'whatsapp') => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
  subtotal,
  total,
  discount,
  onApplyCoupon,
  appliedCoupon,
  walletBalance,
  onCheckout,
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'pix' | 'whatsapp'>('wallet');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md glass-dark z-[70] flex flex-col shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <div className="bg-white/10 p-6 rounded-full">
                    <Plus size={48} />
                  </div>
                  <p className="text-lg font-medium">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const cake = item.cake;
                    let price = item.type === 'whole' ? cake.priceWhole : cake.priceSlice;
                    if (item.type === 'whole' && cake.salePriceWhole) price = cake.salePriceWhole;
                    if (item.type === 'slice' && cake.salePriceSlice) price = cake.salePriceSlice;

                    return (
                      <div key={`${item.cakeId}-${item.type}`} className="glass p-4 rounded-2xl flex gap-4">
                        <img src={cake.images[0] || cake.image} alt={cake.name} className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">{cake.name}</h4>
                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                              {item.type}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{formatCurrency(price * item.quantity)}</span>
                            <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1">
                              <button onClick={() => onRemove(item.cakeId, item.type)} className="p-1 hover:bg-white/10 rounded">
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => {/* App.tsx handles add via addToCart */}} className="p-1 hover:bg-white/10 rounded opacity-20 cursor-not-allowed">
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {items.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-white/10">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Discount Code</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Ticket size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Enter code"
                          className="w-full glass bg-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 ring-white/20"
                        />
                      </div>
                      <button
                        onClick={() => onApplyCoupon(couponInput)}
                        className="glass px-4 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-xs text-emerald-400 font-medium px-1">
                        Coupon {appliedCoupon.code} applied! {appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}% off` : `${formatCurrency(appliedCoupon.discount)} off`}.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentMethod('wallet')}
                        className={cn(
                          "glass p-3 rounded-2xl flex flex-col items-center gap-2 transition-all",
                          paymentMethod === 'wallet' ? "bg-white text-black border-transparent" : "opacity-50"
                        )}
                      >
                        <Wallet size={18} />
                        <span className="text-[10px] font-bold">Wallet</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('pix')}
                        className={cn(
                          "glass p-3 rounded-2xl flex flex-col items-center gap-2 transition-all",
                          paymentMethod === 'pix' ? "bg-white text-black border-transparent" : "opacity-50"
                        )}
                      >
                        <CreditCard size={18} />
                        <span className="text-[10px] font-bold">Pix</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('whatsapp')}
                        className={cn(
                          "glass p-3 rounded-2xl flex flex-col items-center gap-2 transition-all",
                          paymentMethod === 'whatsapp' ? "bg-emerald-500 text-white border-transparent" : "opacity-50"
                        )}
                      >
                        <MessageCircle size={18} />
                        <span className="text-[10px] font-bold">WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 glass-dark border-t border-white/10 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-400">
                      <span>Discount</span>
                      <span>- {formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  disabled={paymentMethod === 'wallet' && walletBalance < total}
                  onClick={() => onCheckout(paymentMethod)}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95",
                    paymentMethod === 'whatsapp' 
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                      : "bg-white text-black hover:bg-white/90",
                    paymentMethod === 'wallet' && walletBalance < total && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {paymentMethod === 'wallet' && walletBalance < total ? (
                    "Insufficient Balance"
                  ) : (
                    <>
                      {paymentMethod === 'whatsapp' ? "Order via WhatsApp" : "Confirm Order"}
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
