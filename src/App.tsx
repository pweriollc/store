import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CakeCard } from './components/CakeCard';
import { WalletView } from './components/WalletView';
import { LoyaltyView } from './components/LoyaltyView';
import { CartDrawer } from './components/CartDrawer';
import { SuccessView } from './components/SuccessView';
import { AdminView } from './components/AdminView';
import { ProfileDrawer } from './components/ProfileDrawer';
import { useCart } from './hooks/useCart';
import { useWallet } from './hooks/useWallet';
import { useLoyalty } from './hooks/useLoyalty';
import { 
  STORES as STATIC_STORES, 
  INITIAL_COUPONS, 
  INITIAL_PAYMENT_METHODS, 
  INITIAL_WALLET_TIERS,
} from './constants';
import { View, Store, Cake, Coupon, WalletTier, UserProfile, AdminConfig, Category } from './types';
import { cn, formatCurrency } from './utils';
import { supabase } from './lib/supabase';
import { supabaseService } from './services/supabaseService';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('catalog');
  const [selectedStore, setSelectedStore] = useState<Store>({
    id: 'loja-teste-id',
    name: 'Loja Teste',
    address: 'Endereço de Teste',
    slug: 'loja-teste'
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Admin Managed State
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([{
    id: 'loja-teste-id',
    name: 'Loja Teste',
    address: 'Endereço de Teste',
    slug: 'loja-teste'
  }]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [walletTiers, setWalletTiers] = useState<WalletTier[]>(INITIAL_WALLET_TIERS);
  const [paymentMethods] = useState(INITIAL_PAYMENT_METHODS);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({ webhookUrl: '' });
  const [profile, setProfile] = useState<UserProfile>({
    id: '6903ddff-f8b5-4aaa-8da3-8fcba142b27d', // Admin ID
    name: 'Eduardo Nascimento',
    email: 'eduardo@voalzira.com',
    address: 'Rua das Flores, 123 - Apt 402, Rio de Janeiro',
    whatsapp: '+55 21 99887-7665',
    points: 1250,
    loyalty_ratio: 1,
    wallet_balance_cents: 15000
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [fetchedCakes, fetchedCategories, fetchedStores, fetchedProfile] = await Promise.all([
          supabaseService.getProducts(),
          supabaseService.getCategories(),
          supabaseService.getStores(),
          supabaseService.getProfile('6903ddff-f8b5-4aaa-8da3-8fcba142b27d') // Using the admin ID from request
        ]);
        
        setCakes(fetchedCakes);
        setCategories(fetchedCategories);
        setProfile(fetchedProfile);

        if (fetchedStores.length > 0) {
          setStores(fetchedStores);
          const testStore = fetchedStores.find(s => 
            s.name.includes('Teste') || s.slug?.includes('teste')
          ) || fetchedStores[0];
          
          setSelectedStore(testStore);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Falha ao conectar com o banco de dados. Verifique suas credenciais Supabase.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateCake = async (updated: Cake) => {
    try {
      await supabaseService.updateProduct(updated, stores.map(s => s.id));
      setCakes(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleCreateCake = async (newCake: Partial<Cake>) => {
    try {
      const created = await supabaseService.createProduct(newCake, stores.map(s => s.id));
      setCakes(prev => [...prev, created]);
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Please try again.');
    }
  };

  const {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    subtotal,
    total,
    discount,
    appliedCoupon,
    applyCoupon,
  } = useCart(coupons, cakes);

  const { balance, topUp, pay } = useWallet(profile.wallet_balance_cents / 100);
  const { stamps, points, addPoints } = useLoyalty();

  const handleCheckout = async (method: 'wallet' | 'pix' | 'whatsapp') => {
    const newOrderId = Math.random().toString(36).substr(2, 9);

    if (method === 'whatsapp') {
      const orderDetails = items.map(item => {
        const cake = cakes.find(c => c.id === item.cakeId);
        return `${item.quantity}x ${cake?.name} (${item.type})`;
      }).join('\n');
      
      const message = encodeURIComponent(
        `*Novo Pedido - Vó Alzira*\n\n` +
        `*Itens:*\n${orderDetails}\n\n` +
        `*Total:* ${formatCurrency(total)}\n` +
        `*Loja:* ${selectedStore.name}\n` +
        `*Endereço:* ${profile.address}`
      );
      
      window.open(`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
      clearCart();
      setIsCartOpen(false);
      return;
    }

    try {
      if (method === 'wallet') {
        const { error } = await supabase.rpc('process_wallet_payment', {
          p_user_id: profile.id,
          p_amount_cents: Math.round(total * 100),
          p_order_id: newOrderId,
          p_idempotency_key: `idemp_${newOrderId}`
        });

        if (error) throw error;
        pay(total);
      }

      // Save order to Supabase
      await supabaseService.createOrder({
        id: newOrderId,
        user_id: profile.id,
        store_id: selectedStore.id,
        total_cents: Math.round(total * 100),
        status: 'completed',
        items: items.map(item => ({
          cake_id: item.cakeId,
          type: item.type,
          quantity: item.quantity,
          price_cents: Math.round((cakes.find(c => c.id === item.cakeId)?.[item.type === 'whole' ? 'priceWhole' : 'priceSlice'] || 0) * 100)
        }))
      });

      // Webhook
      if (adminConfig.webhookUrl) {
        fetch(adminConfig.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: newOrderId, items, total, customer: profile, store: selectedStore })
        }).catch(e => console.error('Webhook failed', e));
      }
      
      addPoints(total);
      clearCart();
      setIsCartOpen(false);
      setCurrentView('success');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  const handleToggleStock = (cakeId: string, storeId: string) => {
    setCakes(prev => prev.map(cake => {
      if (cake.id === cakeId) {
        const isOut = cake.outOfStockStores.includes(storeId);
        return {
          ...cake,
          outOfStockStores: isOut 
            ? cake.outOfStockStores.filter(id => id !== storeId)
            : [...cake.outOfStockStores, storeId]
        };
      }
      return cake;
    }));
  };

  const filteredCakes = activeCategory === 'All' 
    ? cakes 
    : cakes.filter(cake => cake.category === activeCategory);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <Header
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="pt-20 px-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6 pb-32"
            >
              <div className="space-y-1 px-1">
                <h1 className="text-4xl font-bold tracking-tight">Vó Alzira</h1>
                <p className="text-white/50 text-sm">Handmade cakes with love since 1980.</p>
              </div>

              {/* Category Menu */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sticky top-16 z-20 bg-black/80 backdrop-blur-xl">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                    activeCategory === 'All' 
                      ? "bg-white text-black shadow-xl scale-105" 
                      : "glass text-white/40 hover:text-white"
                  )}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      activeCategory === cat.name 
                        ? "bg-white text-black shadow-xl scale-105" 
                        : "glass text-white/40 hover:text-white"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {filteredCakes.map((cake) => (
                  <CakeCard
                    key={cake.id}
                    cake={cake}
                    onAdd={(type) => addToCart(cake.id, type)}
                    isOutOfStock={cake.outOfStockStores.includes(selectedStore.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <WalletView
                balance={balance}
                tiers={walletTiers}
                paymentMethods={paymentMethods}
                onTopUp={topUp}
              />
            </motion.div>
          )}

          {currentView === 'loyalty' && (
            <motion.div
              key="loyalty"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <LoyaltyView stamps={stamps} points={points} />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <AdminView 
                cakes={cakes}
                categories={categories}
                stores={stores}
                coupons={coupons}
                walletTiers={walletTiers}
                config={adminConfig}
                profile={profile}
                onUpdateCake={handleUpdateCake}
                onAddCake={handleCreateCake}
                onUpdateCoupon={(updated) => setCoupons(prev => prev.map(c => c.id === updated.id ? updated : c))}
                onDeleteCoupon={(id) => setCoupons(prev => prev.filter(c => c.id !== id))}
                onAddCoupon={(newC) => setCoupons(prev => [...prev, newC])}
                onUpdateWalletTier={(updated) => setWalletTiers(prev => prev.map(t => t.amount === updated.amount ? updated : t))}
                onToggleStock={handleToggleStock}
                onUpdateConfig={setAdminConfig}
                onUpdateProfile={setProfile}
              />
            </motion.div>
          )}

          {currentView === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <SuccessView
                store={selectedStore}
                onBack={() => setCurrentView('catalog')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {currentView !== 'success' && (
        <BottomNav 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          profile={profile}
          onProfileClick={() => setIsProfileOpen(true)}
        />
      )}

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onLogout={() => {
          // Reset to a default user or just alert
          alert('Logged out');
          setProfile({
            id: 'user_guest',
            name: 'Visitante',
            email: 'guest@example.com',
            address: '',
            whatsapp: '',
            points: 0,
            loyalty_ratio: 1,
            wallet_balance_cents: 0
          });
          setCurrentView('catalog');
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items.map(item => ({
          ...item,
          cake: cakes.find(c => c.id === item.cakeId)!
        }))}
        onRemove={removeFromCart}
        subtotal={subtotal}
        total={total}
        discount={discount}
        onApplyCoupon={applyCoupon}
        appliedCoupon={appliedCoupon}
        walletBalance={balance}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
