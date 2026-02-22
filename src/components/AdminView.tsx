import React, { useState } from 'react';
import { 
  Package, 
  Tag, 
  Store as StoreIcon, 
  Edit2, 
  Plus, 
  AlertCircle,
  Globe,
  Trash2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Cake, Coupon, WalletTier, AdminConfig } from '../types';
import { cn, formatCurrency } from '../utils';
import { STORES } from '../constants';
import { CakeEditor } from './CakeEditor';
import { PromoEditor } from './PromoEditor';
import { BottomDrawer } from './BottomDrawer';

interface AdminViewProps {
  cakes: Cake[];
  coupons: Coupon[];
  walletTiers: WalletTier[];
  config: AdminConfig;
  onUpdateCake: (cake: Cake) => void;
  onUpdateCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onUpdateWalletTier: (tier: WalletTier) => void;
  onToggleStock: (cakeId: string, storeId: string) => void;
  onUpdateConfig: (config: AdminConfig) => void;
}

type AdminTab = 'inventory' | 'promotions' | 'stores' | 'integrations';

export function AdminView({ 
  cakes, 
  coupons, 
  walletTiers, 
  config,
  onUpdateCake, 
  onUpdateCoupon, 
  onDeleteCoupon,
  onAddCoupon,
  onUpdateWalletTier,
  onToggleStock,
  onUpdateConfig
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [editingTier, setEditingTier] = useState<WalletTier | null>(null);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({ type: 'percentage', discount: 0, code: '' });

  const handleAddCoupon = () => {
    if (newCoupon.code && newCoupon.discount) {
      const coupon: Coupon = {
        id: Math.random().toString(36).substr(2, 9),
        code: newCoupon.code.toUpperCase(),
        discount: newCoupon.discount,
        type: newCoupon.type as 'percentage' | 'fixed',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      onAddCoupon(coupon);
      setNewCoupon({ type: 'percentage', discount: 0, code: '' });
      setIsAddingCoupon(false);
    }
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Manager Mode
        </div>
      </div>

      <div className="flex gap-2 p-1 glass rounded-2xl overflow-x-auto no-scrollbar">
        {[
          { id: 'inventory', icon: Package, label: 'Items' },
          { id: 'promotions', icon: Tag, label: 'Promos' },
          { id: 'stores', icon: StoreIcon, label: 'Stores' },
          { id: 'integrations', icon: Globe, label: 'Webhooks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all whitespace-nowrap",
              activeTab === tab.id ? "bg-white text-black font-bold" : "text-white/40 hover:bg-white/5"
            )}
          >
            <tab.icon size={18} />
            <span className="text-xs uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="font-semibold">Cake Inventory</h3>
              <button className="p-2 bg-white text-black rounded-lg hover:bg-white/90">
                <Plus size={18} />
              </button>
            </div>
            
            <div className="grid gap-3">
              {cakes.map((cake) => (
                <div key={cake.id} className="glass p-4 rounded-2xl flex items-center gap-4">
                  <img src={cake.image} alt={cake.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{cake.name}</h4>
                    <div className="flex gap-3 mt-1">
                      <div className="text-[10px] text-white/40 uppercase font-bold">
                        Slice: <span className="text-white">{formatCurrency(cake.priceSlice)}</span>
                      </div>
                      <div className="text-[10px] text-white/40 uppercase font-bold">
                        Whole: <span className="text-white">{formatCurrency(cake.priceWhole)}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditingCake(cake)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} className="text-white/60" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'promotions' && (
          <motion.div
            key="promotions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <section className="space-y-4">
              <h3 className="font-semibold px-2">Wallet Bonuses</h3>
              <div className="grid gap-3">
                {walletTiers.map((tier) => (
                  <div key={tier.amount} className="glass p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">{formatCurrency(tier.amount)}</div>
                      <div className="text-xs text-white/40">Recharge amount</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold">{tier.bonusPercentage}% Bonus</div>
                        <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Active</div>
                      </div>
                      <button 
                        onClick={() => setEditingTier(tier)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} className="text-white/60" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-semibold">Active Coupons</h3>
                <button 
                  onClick={() => setIsAddingCoupon(true)}
                  className="p-2 bg-white text-black rounded-lg"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="grid gap-3">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="glass p-4 rounded-2xl flex items-center justify-between border-l-4 border-emerald-500">
                    <div>
                      <div className="font-mono font-bold text-lg">{coupon.code}</div>
                      <div className="text-xs text-white/40">Expires: {coupon.expiryDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {coupon.type === 'percentage' ? `${coupon.discount}%` : formatCurrency(coupon.discount)} OFF
                      </div>
                      <button 
                        onClick={() => onDeleteCoupon(coupon.id)}
                        className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'stores' && (
          <motion.div
            key="stores"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white/5 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle size={20} className="text-white/40 shrink-0 mt-0.5" />
              <p className="text-xs text-white/60 leading-relaxed">
                Manage stock availability per location. Marking an item as "Out of Stock" will hide it from the catalog for that specific store.
              </p>
            </div>

            {STORES.map((store) => (
              <div key={store.id} className="space-y-3">
                <h4 className="font-bold text-sm px-2 flex items-center gap-2">
                  <StoreIcon size={14} className="text-white/40" />
                  {store.name}
                </h4>
                <div className="grid gap-2">
                  {cakes.map((cake) => {
                    const isOut = cake.outOfStockStores.includes(store.id);
                    return (
                      <button
                        key={cake.id}
                        onClick={() => onToggleStock(cake.id, store.id)}
                        className={cn(
                          "glass p-3 rounded-xl flex items-center justify-between transition-all",
                          isOut ? "opacity-40 grayscale" : "opacity-100"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <img src={cake.image} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-xs font-medium">{cake.name}</span>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter",
                          isOut ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                        )}>
                          {isOut ? "Out of Stock" : "In Stock"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'integrations' && (
          <motion.div
            key="integrations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="glass p-6 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 text-white/60">
                <Globe size={24} className="text-white/40" />
                <div>
                  <h3 className="font-bold">Webhooks</h3>
                  <p className="text-xs">Send order data to external services</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Webhook URL</label>
                <input
                  type="url"
                  value={config.webhookUrl}
                  onChange={(e) => onUpdateConfig({ ...config, webhookUrl: e.target.value })}
                  placeholder="https://hook.make.com/..."
                  className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20"
                />
              </div>

              {config.webhookUrl && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
                  <Check size={18} className="text-emerald-400" />
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Webhook is active</p>
                </div>
              )}
              
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Every successful order will trigger a POST request to this URL with the order details in JSON format.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CakeEditor 
        isOpen={!!editingCake} 
        onClose={() => setEditingCake(null)} 
        cake={editingCake} 
        onSave={onUpdateCake} 
      />

      <PromoEditor 
        isOpen={!!editingTier} 
        onClose={() => setEditingTier(null)} 
        tier={editingTier} 
        onSave={onUpdateWalletTier} 
      />

      <BottomDrawer
        isOpen={isAddingCoupon}
        onClose={() => setIsAddingCoupon(false)}
        title="New Coupon"
      >
        <div className="space-y-6 pt-4 pb-12">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Coupon Code</label>
            <input
              type="text"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              placeholder="E.G. BOLO20"
              className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Type</label>
              <select
                value={newCoupon.type}
                onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20 appearance-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (R$)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Discount</label>
              <input
                type="number"
                value={newCoupon.discount}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseFloat(e.target.value) })}
                className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20"
              />
            </div>
          </div>
          <button
            onClick={handleAddCoupon}
            className="w-full bg-white text-black py-5 rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95 shadow-xl"
          >
            Create Coupon
          </button>
        </div>
      </BottomDrawer>
    </div>
  );
}
