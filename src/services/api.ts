import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Category,
  FoodItem,
  Order,
  OrderStatus,
  PaymentStatus,
  CanteenSettings,
  Profile,
  CheckoutPayload,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_FOOD_ITEMS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
} from './mockData';

// Local storage persistent keys for offline/demo operation
const STORAGE_KEYS = {
  CATEGORIES: 'sc_categories_v1',
  FOOD_ITEMS: 'sc_food_items_v1',
  ORDERS: 'sc_orders_v1',
  SETTINGS: 'sc_settings_v1',
  NEXT_ORDER_SEQ: 'sc_order_seq_v1',
};

// Helper to initialize local persistent state
function getStored<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage quota or write error', e);
  }
}

// Ensure initial data is loaded into local state
if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
  setStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}
if (!localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS)) {
  setStored(STORAGE_KEYS.FOOD_ITEMS, INITIAL_FOOD_ITEMS);
}
if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
  setStored(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
}
if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
  setStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}
if (!localStorage.getItem(STORAGE_KEYS.NEXT_ORDER_SEQ)) {
  setStored(STORAGE_KEYS.NEXT_ORDER_SEQ, 1003);
}

export const api = {
  // -------------------------------------------------------------
  // 1. CANTEEN SETTINGS
  // -------------------------------------------------------------
  async getSettings(): Promise<CanteenSettings> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('canteen_settings')
        .select('*')
        .limit(1)
        .single();
      if (!error && data) return data;
    }
    return getStored<CanteenSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(settings: Partial<CanteenSettings>): Promise<CanteenSettings> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('canteen_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', settings.id)
        .select()
        .single();
      if (!error && data) return data;
    }
    const current = getStored<CanteenSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // -------------------------------------------------------------
  // 2. CATEGORIES
  // -------------------------------------------------------------
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
    return getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
      .sort((a, b) => a.display_order - b.display_order);
  },

  async createCategory(cat: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const newCat: Category = {
      ...cat,
      id: 'cat-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('categories')
        .insert(cat)
        .select()
        .single();
      if (!error && data) return data;
    }
    const cats = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    cats.push(newCat);
    setStored(STORAGE_KEYS.CATEGORIES, cats);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }
    const cats = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const idx = cats.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Category not found');
    cats[idx] = { ...cats[idx], ...updates };
    setStored(STORAGE_KEYS.CATEGORIES, cats);
    return cats[idx];
  },

  async deleteCategory(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.from('categories').delete().eq('id', id);
    }
    const cats = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setStored(STORAGE_KEYS.CATEGORIES, cats.filter((c) => c.id !== id));
  },

  // -------------------------------------------------------------
  // 3. FOOD ITEMS
  // -------------------------------------------------------------
  async getFoodItems(categoryId?: string, search?: string): Promise<FoodItem[]> {
    if (isSupabaseConfigured) {
      let query = supabase.from('food_items').select('*, category:categories(*)');
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }
      if (search && search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`);
      }
      const { data, error } = await query.order('name');
      if (!error && data && data.length > 0) return data;
    }

    let items = getStored<FoodItem[]>(STORAGE_KEYS.FOOD_ITEMS, INITIAL_FOOD_ITEMS);
    const cats = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);

    // populate category relation
    items = items.map((item) => ({
      ...item,
      category: cats.find((c) => c.id === item.category_id),
    }));

    if (categoryId && categoryId !== 'all') {
      items = items.filter((item) => item.category_id === categoryId);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }
    return items;
  },

  async getFoodItemById(id: string): Promise<FoodItem | null> {
    const items = await this.getFoodItems();
    return items.find((i) => i.id === id) || null;
  },

  async createFoodItem(item: Omit<FoodItem, 'id' | 'created_at' | 'updated_at'>): Promise<FoodItem> {
    const newItem: FoodItem = {
      ...item,
      id: 'food-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('food_items').insert(item).select().single();
      if (!error && data) return data;
    }
    const items = getStored<FoodItem[]>(STORAGE_KEYS.FOOD_ITEMS, INITIAL_FOOD_ITEMS);
    items.unshift(newItem);
    setStored(STORAGE_KEYS.FOOD_ITEMS, items);
    return newItem;
  },

  async updateFoodItem(id: string, updates: Partial<FoodItem>): Promise<FoodItem> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('food_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }
    const items = getStored<FoodItem[]>(STORAGE_KEYS.FOOD_ITEMS, INITIAL_FOOD_ITEMS);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Food item not found');
    items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
    setStored(STORAGE_KEYS.FOOD_ITEMS, items);
    return items[idx];
  },

  async deleteFoodItem(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.from('food_items').delete().eq('id', id);
    }
    const items = getStored<FoodItem[]>(STORAGE_KEYS.FOOD_ITEMS, INITIAL_FOOD_ITEMS);
    setStored(STORAGE_KEYS.FOOD_ITEMS, items.filter((i) => i.id !== id));
  },

  async toggleFoodAvailability(id: string, isAvailable: boolean): Promise<FoodItem> {
    return this.updateFoodItem(id, { is_available: isAvailable });
  },

  // -------------------------------------------------------------
  // 4. SECURE ORDER CREATION & CALCULATIONS
  // -------------------------------------------------------------
  async createOrder(payload: CheckoutPayload, user: Profile): Promise<Order> {
    const settings = await this.getSettings();
    if (!settings.is_canteen_open) {
      throw new Error('The canteen is currently closed for new orders.');
    }
    if (payload.payment_method === 'cash_at_counter' && !settings.cash_on_counter_enabled) {
      throw new Error('Cash at counter payment is currently disabled by the administrator.');
    }
    if (!payload.items || payload.items.length === 0) {
      throw new Error('Cart cannot be empty.');
    }

    // Try Supabase RPC if configured
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('create_secure_order', {
        p_user_id: user.id,
        p_payment_method: payload.payment_method,
        p_notes: payload.notes || '',
        p_items: payload.items,
      });

      if (!error && data && data.success) {
        return this.getOrderById(data.order_id) as Promise<Order>;
      }
    }

    // Server-side calculation simulation against trusted store
    const allFoodItems = getStored<FoodItem[]>(STORAGE_KEYS.FOOD_ITEMS, INITIAL_FOOD_ITEMS);
    let subtotal = 0;
    const orderItemsSnapshots = [];

    for (const cartItem of payload.items) {
      const food = allFoodItems.find((f) => f.id === cartItem.food_item_id);
      if (!food) {
        throw new Error(`Item ${cartItem.food_item_id} is no longer available.`);
      }
      if (!food.is_available) {
        throw new Error(`"${food.name}" has just been marked sold out.`);
      }
      if (cartItem.quantity < 1) {
        throw new Error(`Invalid quantity for "${food.name}".`);
      }

      const lineTotal = food.price * cartItem.quantity;
      subtotal += lineTotal;

      orderItemsSnapshots.push({
        id: 'oi-' + Math.random().toString(36).substring(2, 9),
        order_id: '',
        food_item_id: food.id,
        item_name_snapshot: food.name,
        unit_price: food.price,
        quantity: cartItem.quantity,
        line_total: lineTotal,
      });
    }

    const taxAmount = Number(((subtotal * settings.tax_rate_percent) / 100).toFixed(2));
    const totalAmount = Number((subtotal + taxAmount).toFixed(2));

    // Generate unique order number SC-YYYY-XXXXX
    const currentYear = new Date().getFullYear();
    const seq = getStored<number>(STORAGE_KEYS.NEXT_ORDER_SEQ, 1003);
    setStored(STORAGE_KEYS.NEXT_ORDER_SEQ, seq + 1);
    const orderNumber = `SC-${currentYear}-${String(seq).padStart(5, '0')}`;

    const orderId = 'ord-' + Math.random().toString(36).substring(2, 9);
    const pickupToken = 'tk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 8);

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      user_id: user.id,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      payment_method: payload.payment_method,
      payment_status: 'pending',
      order_status: 'Pending',
      notes: payload.notes || '',
      pickup_token: pickupToken,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: user,
      items: orderItemsSnapshots.map((oi) => ({ ...oi, order_id: orderId })),
    };

    const existingOrders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    existingOrders.unshift(newOrder);
    setStored(STORAGE_KEYS.ORDERS, existingOrders);

    return newOrder;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*), profile:profiles(*)')
        .eq('id', orderId)
        .single();
      if (!error && data) return data;
    }
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return orders.find((o) => o.id === orderId) || null;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return orders
      .filter((o) => o.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getAllOrders(filters?: {
    status?: string;
    paymentMethod?: string;
    date?: string;
    search?: string;
  }): Promise<Order[]> {
    if (isSupabaseConfigured) {
      let query = supabase
        .from('orders')
        .select('*, items:order_items(*), profile:profiles(*)')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('order_status', filters.status);
      }
      if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
        query = query.eq('payment_method', filters.paymentMethod);
      }
      if (filters?.search && filters.search.trim()) {
        query = query.ilike('order_number', `%${filters.search.trim()}%`);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    }

    let orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);

    if (filters?.status && filters.status !== 'all') {
      orders = orders.filter((o) => o.order_status === filters.status);
    }
    if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
      orders = orders.filter((o) => o.payment_method === filters.paymentMethod);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.profile?.full_name?.toLowerCase().includes(q) ||
          o.profile?.email?.toLowerCase().includes(q)
      );
    }
    if (filters?.date) {
      orders = orders.filter((o) => o.created_at.startsWith(filters.date!));
    }

    return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    _changedByUserId?: string
  ): Promise<Order> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .update({ order_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select('*, items:order_items(*), profile:profiles(*)')
        .single();
      if (!error && data) return data;
    }

    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    orders[idx] = {
      ...orders[idx],
      order_status: newStatus,
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.ORDERS, orders);
    return orders[idx];
  },

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    _rzpPaymentId?: string
  ): Promise<Order> {
    if (isSupabaseConfigured) {
      const updateData: any = {
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      };
      if (paymentStatus === 'paid') {
        updateData.order_status = 'Confirmed';
      }
      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select('*, items:order_items(*), profile:profiles(*)')
        .single();
      if (!error && data) return data;
    }

    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    orders[idx] = {
      ...orders[idx],
      payment_status: paymentStatus,
      order_status: paymentStatus === 'paid' && orders[idx].order_status === 'Pending' ? 'Confirmed' : orders[idx].order_status,
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.ORDERS, orders);
    return orders[idx];
  },

  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    const order = await this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.user_id !== userId) throw new Error('Unauthorized');
    if (order.order_status !== 'Pending') {
      throw new Error('Only Pending orders can be cancelled. Once Confirmed or Preparing, orders cannot be cancelled.');
    }
    return this.updateOrderStatus(orderId, 'Cancelled', userId);
  },

  // -------------------------------------------------------------
  // 5. DASHBOARD STATS & ANALYTICS
  // -------------------------------------------------------------
  async getDashboardStats() {
    const orders = await this.getAllOrders();
    const todayStr = new Date().toISOString().split('T')[0];

    const totalOrders = orders.length;
    const todayOrders = orders.filter((o) => o.created_at.startsWith(todayStr)).length;
    const pendingOrders = orders.filter((o) => o.order_status === 'Pending').length;
    const preparingOrders = orders.filter((o) => o.order_status === 'Preparing').length;
    const readyOrders = orders.filter((o) => o.order_status === 'Ready for Pickup').length;
    const completedOrders = orders.filter((o) => o.order_status === 'Completed').length;

    // Verified revenue: Only paid online orders or completed cash orders
    const verifiedRevenue = orders
      .filter((o) => o.payment_status === 'paid' || (o.payment_method === 'cash_at_counter' && o.order_status === 'Completed'))
      .reduce((sum, o) => sum + o.total_amount, 0);

    // Items sold count
    let totalItemsSold = 0;
    const itemSaleMap: Record<string, { name: string; count: number; revenue: number }> = {};

    orders.forEach((o) => {
      if (o.order_status !== 'Cancelled' && o.order_status !== 'Rejected') {
        o.items?.forEach((item) => {
          totalItemsSold += item.quantity;
          if (!itemSaleMap[item.item_name_snapshot]) {
            itemSaleMap[item.item_name_snapshot] = {
              name: item.item_name_snapshot,
              count: 0,
              revenue: 0,
            };
          }
          itemSaleMap[item.item_name_snapshot].count += item.quantity;
          itemSaleMap[item.item_name_snapshot].revenue += item.line_total;
        });
      }
    });

    const popularItems = Object.values(itemSaleMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Sales by day for chart (last 7 days)
    const salesByDayMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      salesByDayMap[dateKey] = 0;
    }

    orders.forEach((o) => {
      const dateKey = o.created_at.split('T')[0];
      if (salesByDayMap[dateKey] !== undefined) {
        if (o.payment_status === 'paid' || o.order_status === 'Completed') {
          salesByDayMap[dateKey] += o.total_amount;
        }
      }
    });

    const salesByDay = Object.entries(salesByDayMap).map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      revenue: Math.round(revenue),
    }));

    return {
      totalOrders,
      todayOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      verifiedRevenue: Math.round(verifiedRevenue * 100) / 100,
      totalItemsSold,
      popularItems,
      salesByDay,
    };
  },

  // -------------------------------------------------------------
  // 6. IMAGE STORAGE
  // -------------------------------------------------------------
  async uploadFoodImage(file: File): Promise<string> {
    if (isSupabaseConfigured) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `food/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('food-images').getPublicUrl(filePath);
        return data.publicUrl;
      }
    }

    // Local fallback: convert to base64 Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },
};
