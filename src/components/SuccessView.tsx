import React from 'react';
import { QrCode, MapPin, CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Store } from '../types';

interface SuccessViewProps {
  store: Store;
  onBack: () => void;
}

export function SuccessView({ store, onBack }: SuccessViewProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 pb-32">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className="bg-emerald-500 p-4 rounded-full"
      >
        <CheckCircle2 size={48} className="text-white" />
      </motion.div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Ready for Pickup!</h2>
        <p className="text-white/50">Your order is being prepared with love.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-8 rounded-[2.5rem] flex flex-col items-center space-y-6 w-full max-w-xs ios-shadow"
      >
        <div className="bg-white p-4 rounded-3xl">
          <QrCode size={180} className="text-black" />
        </div>
        <div className="text-center space-y-1">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Order ID</span>
          <div className="font-mono text-lg font-bold">#VA-94281</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-3xl p-6 w-full max-w-sm flex items-start gap-4"
      >
        <div className="bg-white/10 p-3 rounded-2xl">
          <MapPin size={24} className="text-white" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold">{store.name}</h4>
          <p className="text-sm text-white/50 leading-tight">{store.address}</p>
        </div>
      </motion.div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium"
      >
        <ChevronLeft size={16} /> Back to Catalog
      </button>
    </div>
  );
}
