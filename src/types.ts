export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Cake {
  id: string;
  name: string;
  description: string;
  descriptionMarkdown?: string;
  priceWhole: number; // In BRL (decimal)
  priceSlice: number; // In BRL (decimal)
  salePriceWhole?: number;
  salePriceSlice?: number;
  stockCount: number;
  image: string; // Primary image
  images: string[]; // Gallery
  category_id: string;
  category?: string; // Name for display
  outOfStockStores: string[];
}

export interface Order {
  id: string;
  user_id: string;
  store_id: string;
  total_cents: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  items: any[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  whatsapp: string;
  points: number;
  loyalty_ratio: number; // Points per R$ 1
  wallet_balance_cents: number;
}

export interface CartItem {
  cakeId: string;
  type: 'whole' | 'slice';
  quantity: number;
}

export interface Store {
  id: string;
  name: string;
  address: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  expiryDate: string;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
}

export interface WalletTier {
  amount: number;
  bonusPercentage: number;
}

export interface AdminConfig {
  webhookUrl: string;
}

export type View = 'catalog' | 'wallet' | 'loyalty' | 'success' | 'settings' | 'admin';
