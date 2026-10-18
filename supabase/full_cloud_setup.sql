-- ====================================================================
-- SMART CANTEEN MANAGEMENT SYSTEM - COMPLETE CLOUD DATABASE SETUP
-- (Run this entire script in your Supabase Cloud Dashboard -> SQL Editor)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. FOOD ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    preparation_time INT NOT NULL DEFAULT 10 CHECK (preparation_time >= 0),
    calories INT,
    is_veg BOOLEAN NOT NULL DEFAULT TRUE,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. ORDER NUMBER SEQUENCE & GENERATOR
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    current_year TEXT := to_char(CURRENT_DATE, 'YYYY');
    seq_val BIGINT := nextval('public.order_number_seq');
BEGIN
    RETURN 'SC-' || current_year || '-' || LPAD(seq_val::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE DEFAULT public.generate_order_number(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('online_razorpay', 'cash_at_counter')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled', 'Rejected')),
    notes TEXT,
    pickup_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES public.food_items(id) ON DELETE SET NULL,
    item_name_snapshot TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity >= 1),
    line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0)
);

-- 8. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_provider TEXT NOT NULL DEFAULT 'razorpay',
    provider_order_id TEXT,
    provider_payment_id TEXT,
    provider_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'captured', 'failed', 'refunded')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. ORDER STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. CANTEEN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.canteen_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canteen_name TEXT NOT NULL DEFAULT 'Campus Hub Smart Canteen',
    opening_time TIME NOT NULL DEFAULT '08:00:00',
    closing_time TIME NOT NULL DEFAULT '20:30:00',
    is_canteen_open BOOLEAN NOT NULL DEFAULT TRUE,
    cash_on_counter_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    support_phone TEXT DEFAULT '+91 98765 43210',
    support_email TEXT DEFAULT 'canteen@campus.edu',
    announcement_banner TEXT DEFAULT 'Welcome to the Smart Canteen! Pre-order your meals and skip the queue.',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. INDEXES
CREATE INDEX IF NOT EXISTS idx_food_items_category ON public.food_items(category_id);
CREATE INDEX IF NOT EXISTS idx_food_items_availability ON public.food_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 12. RLS SECURITY POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canteen_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Profiles read access" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Profiles self update" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());

CREATE POLICY "Public read food items" ON public.food_items FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage food items" ON public.food_items FOR ALL USING (public.is_admin());

CREATE POLICY "Users read their orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert their orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL USING (public.is_admin());

CREATE POLICY "Users read order items" ON public.order_items FOR SELECT USING (TRUE);
CREATE POLICY "Insert order items" ON public.order_items FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Public read canteen settings" ON public.canteen_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins update settings" ON public.canteen_settings FOR ALL USING (public.is_admin());

-- 13. SEED INITIAL ADMINISTRATOR (MEGHASHREE)
INSERT INTO public.profiles (id, full_name, email, phone, role)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Meghashree', 'meghashree@campus.edu', '+91 98765 99999', 'admin')
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = 'admin';

-- 14. SEED CANTEEN SETTINGS
INSERT INTO public.canteen_settings (canteen_name, opening_time, closing_time, is_canteen_open, cash_on_counter_enabled, tax_rate_percent)
VALUES ('Campus Hub Smart Canteen', '08:00', '20:30', TRUE, TRUE, 5.00)
ON CONFLICT DO NOTHING;

-- 15. SEED CATEGORIES
INSERT INTO public.categories (id, name, description, icon, display_order, is_active)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'South Indian', 'Traditional idlis, crispy dosas, and steamed delicacies', 'Coffee', 1, true),
    ('c2222222-2222-2222-2222-222222222222', 'North Indian', 'Rich curries, rotis, paneer specials, and gravies', 'Utensils', 2, true),
    ('c3333333-3333-3333-3333-333333333333', 'Breakfast', 'Morning energy boosters and fast combos', 'Sunrise', 3, true),
    ('c4444444-4444-4444-4444-444444444444', 'Meals & Combos', 'Wholesome student lunch platters and rice bowls', 'Soup', 4, true),
    ('c5555555-5555-5555-5555-555555555555', 'Snacks & Quick Bites', 'Crispy evening snacks, sandwiches, and rolls', 'Sandwich', 5, true),
    ('c6666666-6666-6666-6666-666666666666', 'Beverages', 'Hot filter coffee, cutting chai, cool sodas & shakes', 'GlassWater', 6, true),
    ('c7777777-7777-7777-7777-777777777777', 'Desserts', 'Sweet treats, gulab jamun, and ice creams', 'IceCream', 7, true)
ON CONFLICT (id) DO NOTHING;

-- 16. SEED FOOD ITEMS
INSERT INTO public.food_items (id, category_id, name, description, price, image_url, is_available, preparation_time, calories, is_veg, is_popular)
VALUES
    ('f1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Crispy Masala Dosa', 'Golden crisp fermented crepe filled with spiced potato mash, served with coconut chutney and hot sambar.', 65.00, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80', true, 8, 320, true, true),
    ('f1111111-1111-1111-1111-111111111112', 'c1111111-1111-1111-1111-111111111111', 'Steamed Idli Vada Combo', 'Two pillowy soft steamed rice cakes and one crispy medu vada, served with red & white chutneys and sambar.', 50.00, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', true, 5, 280, true, true),
    ('f1111111-1111-1111-1111-111111111113', 'c1111111-1111-1111-1111-111111111111', 'Onion Uttapam', 'Thick savory pancake topped with caramelized red onions, fresh coriander, green chillies, and ghee.', 60.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', true, 10, 340, true, false),
    ('f2222222-2222-2222-2222-222222222221', 'c2222222-2222-2222-2222-222222222222', 'Paneer Butter Masala + Naan', 'Succulent cottage cheese cubes simmered in a creamy, buttery tomato-cashew gravy with warm tandoor rotis.', 140.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', true, 15, 540, true, true),
    ('f2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Chole Bhature Platter', 'Two fluffy golden fried bhaturas paired with spiced Punjabi chickpea masala, pickled onion, and green mint chutney.', 95.00, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80', true, 12, 610, true, true),
    ('f3333333-3333-3333-3333-333333333331', 'c3333333-3333-3333-3333-333333333333', 'Poori Sagu Set', 'Three puffed whole wheat pooris accompanied by spiced mixed vegetable sagu and coconut chutney.', 55.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', true, 8, 390, true, false),
    ('f3333333-3333-3333-3333-333333333332', 'c3333333-3333-3333-3333-333333333333', 'Aloo Paratha with Curd & Butter', 'Tawa-toasted whole wheat flatbread stuffed with spiced crushed potatoes, served with fresh curd and amul butter.', 70.00, 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80', true, 10, 410, true, true),
    ('f4444444-4444-4444-4444-444444444441', 'c4444444-4444-4444-4444-444444444444', 'Deluxe Campus Veg Thali', 'Steamed basmati rice, dal tadka, paneer sabzi, seasonal dry vegetable, 2 rotis, papad, curd, and sweet gulab jamun.', 120.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80', true, 10, 680, true, true),
    ('f4444444-4444-4444-4444-444444444442', 'c4444444-4444-4444-4444-444444444444', 'Veg Fried Rice + Manchurian', 'Wok-tossed basmati rice with crunchy vegetables and spring onions, paired with vegetable Manchurian balls in hot soy gravy.', 110.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80', true, 12, 520, true, true),
    ('f5555555-5555-5555-5555-555555555551', 'c5555555-5555-5555-5555-555555555555', 'Cheese Grilled Sandwich', 'Double layered crusty brown bread toasted with cheddar & mozzarella, mint spread, cucumber, and tomatoes.', 65.00, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', true, 7, 340, true, false),
    ('f5555555-5555-5555-5555-555555555552', 'c5555555-5555-5555-5555-555555555555', 'Crispy Punjabi Samosa (2 pcs)', 'Flaky golden pastry cones packed with spicy potato and green peas, served with sweet tamarind and spicy mint chutneys.', 35.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', true, 3, 290, true, true),
    ('f6666666-6666-6666-6666-666666666661', 'c6666666-6666-6666-6666-666666666661', 'South Indian Filter Coffee', 'Freshly brewed strong chicory blend coffee frothed with boiling creamy full-fat milk.', 25.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', true, 3, 95, true, true),
    ('f6666666-6666-6666-6666-666666666662', 'c6666666-6666-6666-6666-666666666661', 'Cardamom Masala Chai', 'Aromatic crushed ginger and green cardamom tea brewed to perfection.', 20.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', true, 3, 80, true, true),
    ('f7777777-7777-7777-7777-777777777771', 'c7777777-7777-7777-7777-777777777777', 'Warm Gulab Jamun (2 pcs)', 'Melt-in-mouth cottage cheese and khoya dumplings soaked in fragrant cardamom rose sugar syrup.', 40.00, 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80', true, 2, 260, true, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- 17. STORAGE BUCKET FOR FOOD IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'food-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'food-images');
CREATE POLICY "Admin upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'food-images');
