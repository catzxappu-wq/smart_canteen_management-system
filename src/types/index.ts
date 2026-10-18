export type Role = 'student' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: Role;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface FoodItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  preparation_time: number;
  calories?: number;
  is_veg: boolean;
  is_popular: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export type PaymentMethod = 'online_razorpay' | 'cash_at_counter';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  food_item_id: string;
  item_name_snapshot: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  food_item?: FoodItem;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  notes?: string;
  pickup_token: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
  profile?: Profile;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_provider: string;
  provider_order_id?: string;
  provider_payment_id?: string;
  provider_signature?: string;
  amount: number;
  currency: string;
  payment_status: string;
  verified_at?: string;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  previous_status?: string;
  new_status: OrderStatus;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

export interface CanteenSettings {
  id: string;
  canteen_name: string;
  opening_time: string;
  closing_time: string;
  is_canteen_open: boolean;
  cash_on_counter_enabled: boolean;
  tax_rate_percent: number;
  support_phone: string;
  support_email: string;
  announcement_banner: string;
  updated_at?: string;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface CheckoutPayload {
  payment_method: PaymentMethod;
  notes?: string;
  items: {
    food_item_id: string;
    quantity: number;
  }[];
}
