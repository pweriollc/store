import React, { useState } from 'react';
import { MapPin, ChevronDown, ShoppingCart } from 'lucide-react';
import { STORES } from '../constants';
import { Store } from '../types';
import { cn } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  selectedStore: Store;
  onStoreChange: (store: Store) => void;
  cartCount: number;
  onCartClick: () => void;
}

export function Header({ selectedStore, onStoreChange, cartCount, onCartClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark px-4 py-3 flex items-center justify-between">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          <MapPin size={16} className="text-white/60" />
          <span>{selectedStore.name}</span>
          <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 z-40"
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-64 glass rounded-2xl overflow-hidden z-50 ios-shadow"
              >
                {STORES.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => {
                      onStoreChange(store);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors border-b border-white/5 last:border-0",
                      selectedStore.id === store.id && "text-white font-semibold bg-white/5"
                    )}
                  >
                    {store.name}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onCartClick}
        className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <ShoppingCart size={22} />
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.span
              key="cart-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
            >
              <motion.span
                key={cartCount}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute"
              >
                {cartCount}
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </header>
  );
}
