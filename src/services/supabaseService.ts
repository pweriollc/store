import { supabase } from '../lib/supabase';
import { Cake, Category, Store, Order, UserProfile } from '../types';

export const supabaseService = {
  async getCategories(): Promise<Category[]> {
    console.log('[v0] getCategories: starting fetch...');
    const { data, error, status, statusText } = await supabase.from('categories').select('*');
    if (error) {
      console.error('[v0] getCategories FAILED:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        httpStatus: status,
        httpStatusText: statusText,
      });
      throw error;
    }
    console.log('[v0] getCategories: HTTP', status, statusText, '| rows =', data?.length ?? 0);
    return data;
  },

  async getStores(): Promise<Store[]> {
    console.log('[v0] getStores: starting fetch...');
    const { data, error, status, statusText } = await supabase.from('stores').select('*');
    if (error) {
      console.error('[v0] getStores FAILED:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        httpStatus: status,
        httpStatusText: statusText,
      });
      throw error;
    }
    console.log('[v0] getStores: HTTP', status, statusText, '| rows =', data?.length ?? 0);
    return data;
  },

  async getProducts(): Promise<Cake[]> {
    console.log('[v0] getProducts: starting fetch...');
    const cacheBuster = `_cb=${Date.now()}`;
    console.log('[v0] getProducts: cache buster =', cacheBuster);

    const { data, error, status, statusText } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[v0] getProducts FAILED:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        httpStatus: status,
        httpStatusText: statusText,
      });
      throw error;
    }

    console.log('[v0] getProducts: HTTP', status, statusText);
    console.log('[v0] getProducts: total rows =', data?.length ?? 0);
    if (data && data.length > 0) {
      console.log('[v0] getProducts: first row sample =', JSON.stringify(data[0]).slice(0, 200));
    }

    if (!data) return [];

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      descriptionMarkdown: p.description_markdown || '',
      priceWhole: (p.price_whole_cents || 0) / 100,
      priceSlice: (p.price_slice_cents || 0) / 100,
      salePriceWhole: p.sale_price_whole_cents ? p.sale_price_whole_cents / 100 : undefined,
      salePriceSlice: p.sale_price_slice_cents ? p.sale_price_slice_cents / 100 : undefined,
      stockCount: p.stock_count || 0,
      image: p.image_url || 'https://picsum.photos/400/400',
      images: [],
      category_id: p.category_id,
      category: p.categories?.name || 'Geral',
      outOfStockStores: [] // Sem filtro por loja para teste
    }));
  },

  async createProduct(cake: Partial<Cake>, allStoreIds: string[]): Promise<Cake> {
    // 1. Insert basic product info
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: cake.name,
        description: cake.description,
        description_markdown: cake.descriptionMarkdown,
        price_whole_cents: Math.round((cake.priceWhole || 0) * 100),
        price_slice_cents: Math.round((cake.priceSlice || 0) * 100),
        sale_price_whole_cents: cake.salePriceWhole ? Math.round(cake.salePriceWhole * 100) : null,
        sale_price_slice_cents: cake.salePriceSlice ? Math.round(cake.salePriceSlice * 100) : null,
        stock_count: cake.stockCount || 0,
        image_url: cake.image || '',
        category_id: cake.category_id || '11111111-1111-1111-1111-111111111111' // Default category
      })
      .select()
      .single();

    if (productError) throw productError;

    // 2. Insert images
    if (cake.images && cake.images.length > 0) {
      const { error: insertImagesError } = await supabase
        .from('product_images')
        .insert(cake.images.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          position: index
        })));
      
      if (insertImagesError) throw insertImagesError;
    }

    // 3. Update inventory (Availability per store)
    const availableStoreIds = allStoreIds.filter(id => !cake.outOfStockStores?.includes(id));
    
    if (availableStoreIds.length > 0) {
      const { error: insertInventoryError } = await supabase
        .from('inventory')
        .insert(availableStoreIds.map(storeId => ({
          product_id: product.id,
          store_id: storeId
        })));
      
      if (insertInventoryError) throw insertInventoryError;
    }

    return {
      ...cake,
      id: product.id,
    } as Cake;
  },

  async updateProduct(cake: Cake, allStoreIds: string[]) {
    // 1. Update basic product info
    const { error: productError } = await supabase
      .from('products')
      .update({
        name: cake.name,
        description: cake.description,
        description_markdown: cake.descriptionMarkdown,
        price_whole_cents: Math.round(cake.priceWhole * 100),
        price_slice_cents: Math.round(cake.priceSlice * 100),
        sale_price_whole_cents: cake.salePriceWhole ? Math.round(cake.salePriceWhole * 100) : null,
        sale_price_slice_cents: cake.salePriceSlice ? Math.round(cake.salePriceSlice * 100) : null,
        stock_count: cake.stockCount,
        image_url: cake.image,
        category_id: cake.category_id
      })
      .eq('id', cake.id);

    if (productError) throw productError;

    // 2. Update images (Delete and Insert to maintain order)
    const { error: deleteImagesError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', cake.id);
    
    if (deleteImagesError) throw deleteImagesError;

    if (cake.images && cake.images.length > 0) {
      const { error: insertImagesError } = await supabase
        .from('product_images')
        .insert(cake.images.map((url, index) => ({
          product_id: cake.id,
          image_url: url,
          position: index
        })));
      
      if (insertImagesError) throw insertImagesError;
    }

    // 3. Update inventory (Availability per store)
    // Assuming inventory table stores AVAILABLE products.
    // outOfStockStores are those NOT in the inventory.
    const availableStoreIds = allStoreIds.filter(id => !cake.outOfStockStores.includes(id));
    
    const { error: deleteInventoryError } = await supabase
      .from('inventory')
      .delete()
      .eq('product_id', cake.id);
    
    if (deleteInventoryError) throw deleteInventoryError;

    if (availableStoreIds.length > 0) {
      const { error: insertInventoryError } = await supabase
        .from('inventory')
        .insert(availableStoreIds.map(storeId => ({
          product_id: cake.id,
          store_id: storeId
        })));
      
      if (insertInventoryError) throw insertInventoryError;
    }
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async getProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createOrder(order: Partial<Order>) {
    const { data, error } = await supabase.from('orders').insert(order).select().single();
    if (error) throw error;
    return data;
  },

  async getOrders(): Promise<{ data: Order[] | null }> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, user_profiles(name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data };
  }
};
