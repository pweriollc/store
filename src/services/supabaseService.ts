import { supabase } from '../lib/supabase';
import { Cake, Category, Store, Order, UserProfile } from '../types';

export const supabaseService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  },

  async getStores(): Promise<Store[]> {
    const { data, error } = await supabase.from('stores').select('*');
    if (error) throw error;
    return data;
  },

  async getProducts(): Promise<Cake[]> {
    const [productsRes, storesRes] = await Promise.all([
      supabase.from('products').select('*, categories(name), product_images(image_url), inventory(store_id)'),
      supabase.from('stores').select('id')
    ]);
    
    if (productsRes.error) throw productsRes.error;
    if (storesRes.error) throw storesRes.error;

    const allStoreIds = storesRes.data.map(s => s.id);

    return productsRes.data.map((p: any) => {
      const availableStoreIds = p.inventory?.map((i: any) => i.store_id) || [];
      const outOfStockStores = allStoreIds.filter(id => !availableStoreIds.includes(id));
      
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        descriptionMarkdown: p.description_markdown,
        priceWhole: p.price_whole_cents / 100,
        priceSlice: p.price_slice_cents / 100,
        salePriceWhole: p.sale_price_whole_cents ? p.sale_price_whole_cents / 100 : undefined,
        salePriceSlice: p.sale_price_slice_cents ? p.sale_price_slice_cents / 100 : undefined,
        stockCount: p.stock_count || 0,
        image: p.image_url,
        images: p.product_images?.map((img: any) => img.image_url) || [],
        category_id: p.category_id,
        category: p.categories?.name,
        outOfStockStores
      };
    });
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
