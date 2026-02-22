export interface Cake {
  id: string;
  name: string;
  description: string;
  descriptionMarkdown?: string;
  priceWhole: number;
  priceSlice: number;
  salePriceWhole?: number;
  salePriceSlice?: number;
  stockCount: number;
  image: string; // Primary image
  images: string[]; // Gallery
  category: string;
  outOfStockStores: string[];
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  whatsapp: string;
}

export interface AdminConfig {
  webhookUrl: string;
}

export type View = 'catalog' | 'wallet' | 'loyalty' | 'success' | 'settings' | 'admin';
