import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, CreditCard, History, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { WalletTier, PaymentMethod } from '../types';
import { cn, formatCurrency } from '../utils';

interface WalletViewProps {
  balance: number;
  tiers: WalletTier[];
  paymentMethods: PaymentMethod[];
  onTopUp: (amount: number) => void;
}

export function WalletView({ balance, tiers, paymentMethods, onTopUp }: WalletViewProps) {
  const [selectedTier, setSelectedTier] = useState<WalletTier | null>(null);

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Digital Credits
        </div>
      </div>

      {/* Balance Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-white text-black p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-60">
            <Wallet size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Available Balance</span>
          </div>
          <div className="text-5xl font-bold tracking-tighter">
            {formatCurrency(balance)}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-black/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Top-up Tiers */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <TrendingUp size={18} className="text-white/60" />
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Top-up & Get Bonus</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {tiers.map((tier) => (
            <button
              key={tier.amount}
              onClick={() => setSelectedTier(tier)}
              className={cn(
                "glass p-5 rounded-3xl flex items-center justify-between transition-all group relative overflow-hidden",
                selectedTier?.amount === tier.amount ? "ring-2 ring-white bg-white/10" : "hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <Plus size={20} />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">{formatCurrency(tier.amount)}</div>
                  <div className="text-xs text-white/40">Recharge amount</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-bold">+{tier.bonusPercentage}% Bonus</div>
                <div className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Extra Credit</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Payment Methods</h3>
          <button className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            Manage
          </button>
        </div>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="glass p-5 rounded-3xl flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-3 rounded-2xl">
                  <CreditCard size={20} className="text-white/60" />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider">•••• {method.last4}</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{method.type} • Exp {method.expiry}</div>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          ))}
          <button className="w-full glass border-dashed border-white/10 p-5 rounded-3xl flex items-center justify-center gap-3 text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Plus size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Add New Card</span>
          </button>
        </div>
      </section>

      {/* Action Button */}
      {selectedTier && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-4 right-4 z-40"
        >
          <button
            onClick={() => {
              onTopUp(selectedTier.amount);
              setSelectedTier(null);
            }}
            className="w-full bg-white text-black py-5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl hover:bg-white/90 active:scale-95 transition-all"
          >
            Confirm Recharge {formatCurrency(selectedTier.amount)}
            <ArrowUpRight size={18} />
          </button>
        </motion.div>
      )}

      {/* Recent History */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest px-1">Recent Activity</h3>
        <div className="glass rounded-[2rem] overflow-hidden divide-y divide-white/5">
          {[
            { label: 'Top-up Bonus', amount: `+ ${formatCurrency(10)}`, date: 'Today, 10:45', type: 'bonus' },
            { label: 'Wallet Recharge', amount: `+ ${formatCurrency(100)}`, date: 'Today, 10:45', type: 'recharge' },
            { label: 'Cake Order #882', amount: `- ${formatCurrency(45)}`, date: 'Yesterday, 18:20', type: 'order' },
          ].map((item, i) => (
            <div key={i} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/5 p-2 rounded-xl">
                  <History size={16} className="text-white/40" />
                </div>
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{item.date}</div>
                </div>
              </div>
              <div className={cn(
                "text-sm font-bold",
                item.amount.includes('+') ? "text-emerald-400" : "text-white"
              )}>
                {item.amount}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
