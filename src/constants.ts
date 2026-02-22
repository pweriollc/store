import { Cake, Store, Coupon, PaymentMethod, WalletTier } from './types';

export const STORES: Store[] = [
  { id: '1', name: 'Vó Alzira - Tijuca', address: 'Rua Conde de Bonfim, 123' },
  { id: '2', name: 'Vó Alzira - Barra', address: 'Av. das Américas, 500' },
  { id: '3', name: 'Vó Alzira - Centro', address: 'Rua do Ouvidor, 45' },
  { id: '4', name: 'Vó Alzira - Copacabana', address: 'Av. N. Sra. de Copacabana, 800' },
];

export const CATEGORIES = ['All', 'Classic', 'Premium', 'Special', 'Drinks', 'Ice Cream'];

export const CAKES: Cake[] = [
  {
    id: 'c1',
    name: 'Bolo de Cenoura com Chocolate',
    description: 'Massa fofinha de cenoura com cobertura generosa de brigadeiro artesanal.',
    descriptionMarkdown: '### O Clássico Irresistível\n\nNosso bolo de cenoura é feito com cenouras frescas e uma cobertura de **brigadeiro gourmet** que derrete na boca.\n\n- Massa fofinha\n- Chocolate 50% cacau\n- Sem conservantes',
    priceWhole: 45.00,
    priceSlice: 12.00,
    salePriceSlice: 9.90,
    stockCount: 15,
    image: 'https://picsum.photos/seed/cake1/600/600',
    images: ['https://picsum.photos/seed/cake1/600/600', 'https://picsum.photos/seed/cake1b/600/600'],
    category: 'Classic',
    outOfStockStores: [],
  },
  {
    id: 'c2',
    name: 'Red Velvet Premium',
    description: 'Massa aveludada vermelha com recheio de cream cheese e frutas vermelhas.',
    descriptionMarkdown: '### Elegância em cada fatia\n\nO Red Velvet da Vó Alzira combina a leveza da massa aveludada com o toque cítrico do cream cheese.',
    priceWhole: 85.00,
    priceSlice: 18.00,
    stockCount: 5,
    image: 'https://picsum.photos/seed/cake2/600/600',
    images: ['https://picsum.photos/seed/cake2/600/600'],
    category: 'Premium',
    outOfStockStores: ['2'],
  },
  {
    id: 'c3',
    name: 'Bolo de Fubá com Goiabada',
    description: 'O clássico da vovó, feito com milho selecionado e pedaços de goiabada cascão.',
    priceWhole: 38.00,
    priceSlice: 10.00,
    stockCount: 20,
    image: 'https://picsum.photos/seed/cake3/600/600',
    images: ['https://picsum.photos/seed/cake3/600/600'],
    category: 'Classic',
    outOfStockStores: [],
  },
  {
    id: 'c4',
    name: 'Chocolate Belga 70%',
    description: 'Para os amantes de chocolate intenso, massa úmida e ganache de chocolate belga.',
    priceWhole: 95.00,
    priceSlice: 22.00,
    salePriceWhole: 79.90,
    stockCount: 3,
    image: 'https://picsum.photos/seed/cake4/600/600',
    images: ['https://picsum.photos/seed/cake4/600/600'],
    category: 'Special',
    outOfStockStores: [],
  },
  {
    id: 'c5',
    name: 'Ninho com Nutella',
    description: 'Combinação perfeita de leite ninho cremoso com a legítima Nutella.',
    priceWhole: 75.00,
    priceSlice: 16.00,
    stockCount: 12,
    image: 'https://picsum.photos/seed/cake5/600/600',
    images: ['https://picsum.photos/seed/cake5/600/600'],
    category: 'Premium',
    outOfStockStores: [],
  },
  {
    id: 'c6',
    name: 'Limão Siciliano',
    description: 'Massa leve com toque cítrico de limão siciliano e merengue suíço.',
    priceWhole: 55.00,
    priceSlice: 14.00,
    stockCount: 8,
    image: 'https://picsum.photos/seed/cake6/600/600',
    images: ['https://picsum.photos/seed/cake6/600/600'],
    category: 'Special',
    outOfStockStores: [],
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: '1', code: 'BOLO10', discount: 10, type: 'percentage', expiryDate: '2026-12-31' },
  { id: '2', code: 'VEMPROBOLO', discount: 5, type: 'fixed', expiryDate: '2026-06-30' },
];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', type: 'visa', last4: '4242', expiry: '12/28' },
  { id: '2', type: 'mastercard', last4: '8888', expiry: '05/27' },
];

export const INITIAL_WALLET_TIERS: WalletTier[] = [
  { amount: 50, bonusPercentage: 5 },
  { amount: 100, bonusPercentage: 10 },
  { amount: 200, bonusPercentage: 15 },
];
