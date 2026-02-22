import React from 'react';
import { Cake } from '../types';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatCurrency } from '../utils';

interface CakeCardProps {
  cake: Cake;
  onAdd: (type: 'whole' | 'slice') => void;
  isOutOfStock?: boolean;
}

export function CakeCard({ cake, onAdd, isOutOfStock }: CakeCardProps) {
  const hasSale = cake.salePriceSlice || cake.salePriceWhole;
  const isLowStock = cake.stockCount > 0 && cake.stockCount <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "glass rounded-3xl overflow-hidden flex flex-col group transition-all duration-500",
        (isOutOfStock || cake.stockCount === 0) && "opacity-50 grayscale pointer-events-none"
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={cake.image}
          alt={cake.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasSale && (
            <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg">
              Sale
            </div>
          )}
          {isLowStock && (
            <div className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg">
              Limited Stock
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
          {isOutOfStock || cake.stockCount === 0 ? "Out of Stock" : cake.category}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold leading-tight mb-1">{cake.name}</h3>
        <p className="text-white/50 text-xs line-clamp-2 mb-4 flex-1">{cake.description}</p>
        
        {!(isOutOfStock || cake.stockCount === 0) && (
          <div className="space-y-2">
            <button
              onClick={() => onAdd('slice')}
              className="w-full flex items-center justify-between glass hover:bg-white/20 px-3 py-2 rounded-xl transition-colors group/btn"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-white/40 uppercase font-bold">Slice</span>
                <div className="flex items-center gap-2">
                  {cake.salePriceSlice ? (
                    <>
                      <span className="text-sm font-semibold line-through opacity-40">{formatCurrency(cake.priceSlice)}</span>
                      <span className="text-sm font-bold text-red-400">{formatCurrency(cake.salePriceSlice)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold">{formatCurrency(cake.priceSlice)}</span>
                  )}
                </div>
              </div>
              <div className="bg-white text-black p-1 rounded-lg group-hover/btn:scale-110 transition-transform">
                <Plus size={16} />
              </div>
            </button>

            <button
              onClick={() => onAdd('whole')}
              className="w-full flex items-center justify-between bg-white text-black hover:bg-white/90 px-3 py-2 rounded-xl transition-colors group/btn"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-black/40 uppercase font-bold">Whole Cake</span>
                <div className="flex items-center gap-2">
                  {cake.salePriceWhole ? (
                    <>
                      <span className="text-sm font-semibold line-through opacity-40">{formatCurrency(cake.priceWhole)}</span>
                      <span className="text-sm font-bold text-red-600">{formatCurrency(cake.salePriceWhole)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-bold">{formatCurrency(cake.priceWhole)}</span>
                  )}
                </div>
              </div>
              <div className="bg-black text-white p-1 rounded-lg group-hover/btn:scale-110 transition-transform">
                <Plus size={16} />
              </div>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
