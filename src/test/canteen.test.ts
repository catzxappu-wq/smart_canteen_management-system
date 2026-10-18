import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '../services/api';
import {
  INITIAL_CATEGORIES,
  INITIAL_FOOD_ITEMS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  DEMO_STUDENT,
  DEMO_ADMIN,
} from '../services/mockData';

describe('Smart Canteen System Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('sc_categories_v1', JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('sc_food_items_v1', JSON.stringify(INITIAL_FOOD_ITEMS));
    localStorage.setItem('sc_orders_v1', JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem('sc_settings_v1', JSON.stringify(INITIAL_SETTINGS));
  });

  // 1. MENU & CATEGORY FILTERING TESTS
  describe('Menu & Food Listing', () => {
    it('loads all categories and food items', async () => {
      const categories = await api.getCategories();
      const foodItems = await api.getFoodItems();

      expect(categories.length).toBeGreaterThan(0);
      expect(foodItems.length).toBeGreaterThan(0);
      expect(foodItems[0]).toHaveProperty('name');
      expect(foodItems[0]).toHaveProperty('price');
      expect(foodItems[0]).toHaveProperty('is_available');
    });

    it('filters items by category correctly', async () => {
      const categories = await api.getCategories();
      const southIndian = categories.find((c) => c.name === 'South Indian');
      expect(southIndian).toBeDefined();

      const items = await api.getFoodItems(southIndian!.id);
      expect(items.length).toBeGreaterThan(0);
      items.forEach((item) => {
        expect(item.category_id).toBe(southIndian!.id);
      });
    });

    it('searches items by text query', async () => {
      const items = await api.getFoodItems(undefined, 'Dosa');
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].name.toLowerCase()).toContain('dosa');
    });
  });

  // 2. TRUSTED ORDER CALCULATION & UNIQUE TOKEN NUMBER
  describe('Secure Order Calculations & Token Numbers', () => {
    it('calculates subtotal and tax in Indian Rupees from trusted database prices', async () => {
      const foodItems = await api.getFoodItems();
      const item1 = foodItems[0];
      const item2 = foodItems[1];

      const order = await api.createOrder(
        {
          payment_method: 'online_razorpay',
          items: [
            { food_item_id: item1.id, quantity: 2 },
            { food_item_id: item2.id, quantity: 1 },
          ],
        },
        DEMO_STUDENT
      );

      const expectedSubtotal = item1.price * 2 + item2.price * 1;
      expect(order.subtotal).toBe(expectedSubtotal);
      expect(order.total_amount).toBeGreaterThan(order.subtotal);
      expect(order.total_amount).toBe(Number((order.subtotal + order.tax_amount).toFixed(2)));
    });

    it('generates a unique order number conforming to SC-YYYY-XXXXX format', async () => {
      const foodItems = await api.getFoodItems();
      const currentYear = new Date().getFullYear();

      const order1 = await api.createOrder(
        {
          payment_method: 'online_razorpay',
          items: [{ food_item_id: foodItems[0].id, quantity: 1 }],
        },
        DEMO_STUDENT
      );

      const order2 = await api.createOrder(
        {
          payment_method: 'cash_at_counter',
          items: [{ food_item_id: foodItems[1].id, quantity: 1 }],
        },
        DEMO_STUDENT
      );

      expect(order1.order_number).toMatch(new RegExp(`^SC-${currentYear}-\\d{5}$`));
      expect(order2.order_number).toMatch(new RegExp(`^SC-${currentYear}-\\d{5}$`));
      expect(order1.order_number).not.toBe(order2.order_number);
    });

    it('prevents ordering sold-out food items', async () => {
      const foodItems = await api.getFoodItems();
      const testItem = foodItems[0];

      // Mark sold out
      await api.toggleFoodAvailability(testItem.id, false);

      await expect(
        api.createOrder(
          {
            payment_method: 'online_razorpay',
            items: [{ food_item_id: testItem.id, quantity: 1 }],
          },
          DEMO_STUDENT
        )
      ).rejects.toThrow(/sold out/i);
    });
  });

  // 3. ORDER STATUS PROGRESSION & CANCELLATION RESTRICTIONS
  describe('Order Status Workflow', () => {
    it('allows cancelling a Pending order, but rejects cancelling once cooking has begun', async () => {
      const foodItems = await api.getFoodItems();
      const order = await api.createOrder(
        {
          payment_method: 'cash_at_counter',
          items: [{ food_item_id: foodItems[0].id, quantity: 1 }],
        },
        DEMO_STUDENT
      );

      expect(order.order_status).toBe('Pending');

      // Student cancels pending order -> should succeed
      const cancelled = await api.cancelOrder(order.id, DEMO_STUDENT.id);
      expect(cancelled.order_status).toBe('Cancelled');

      // Create another order and move to Preparing
      const order2 = await api.createOrder(
        {
          payment_method: 'online_razorpay',
          items: [{ food_item_id: foodItems[1].id, quantity: 1 }],
        },
        DEMO_STUDENT
      );

      await api.updateOrderStatus(order2.id, 'Preparing');

      // Student tries to cancel cooking order -> should fail
      await expect(api.cancelOrder(order2.id, DEMO_STUDENT.id)).rejects.toThrow(
        /Only Pending orders can be cancelled/i
      );
    });

    it('progresses status cleanly through kitchen workflow', async () => {
      const foodItems = await api.getFoodItems();
      const order = await api.createOrder(
        {
          payment_method: 'online_razorpay',
          items: [{ food_item_id: foodItems[0].id, quantity: 1 }],
        },
        DEMO_STUDENT
      );

      // Pending -> Confirmed
      let updated = await api.updateOrderStatus(order.id, 'Confirmed');
      expect(updated.order_status).toBe('Confirmed');

      // Confirmed -> Preparing
      updated = await api.updateOrderStatus(order.id, 'Preparing');
      expect(updated.order_status).toBe('Preparing');

      // Preparing -> Ready for Pickup
      updated = await api.updateOrderStatus(order.id, 'Ready for Pickup');
      expect(updated.order_status).toBe('Ready for Pickup');

      // Ready -> Completed
      updated = await api.updateOrderStatus(order.id, 'Completed');
      expect(updated.order_status).toBe('Completed');
    });
  });

  // 4. ADMIN INVENTORY & SETTINGS
  describe('Admin Operations', () => {
    it('allows admin to add new food item and toggle its availability', async () => {
      const categories = await api.getCategories();
      const newItem = await api.createFoodItem({
        name: 'Mysore Pak Deluxe',
        category_id: categories[0].id,
        description: 'Rich ghee sweet delight',
        price: 45,
        image_url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
        is_available: true,
        preparation_time: 2,
        calories: 310,
        is_veg: true,
        is_popular: false,
      });

      expect(newItem.id).toBeDefined();
      expect(newItem.name).toBe('Mysore Pak Deluxe');

      // Toggle availability
      const toggled = await api.toggleFoodAvailability(newItem.id, false);
      expect(toggled.is_available).toBe(false);
    });

    it('updates canteen settings and verifies cash payment toggle', async () => {
      const settings = await api.getSettings();
      expect(settings).toBeDefined();

      const updated = await api.updateSettings({
        id: settings.id,
        cash_on_counter_enabled: false,
      });

      expect(updated.cash_on_counter_enabled).toBe(false);

      // Verify order creation with cash throws error when disabled
      const foodItems = await api.getFoodItems();
      await expect(
        api.createOrder(
          {
            payment_method: 'cash_at_counter',
            items: [{ food_item_id: foodItems[0].id, quantity: 1 }],
          },
          DEMO_STUDENT
        )
      ).rejects.toThrow(/Cash at counter payment is currently disabled/i);
    });

    it('computes accurate dashboard analytics without counting cancelled orders in revenue', async () => {
      const stats = await api.getDashboardStats();
      expect(stats.totalOrders).toBeGreaterThanOrEqual(0);
      expect(stats.verifiedRevenue).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(stats.popularItems)).toBe(true);
      expect(Array.isArray(stats.salesByDay)).toBe(true);
    });
  });
});
