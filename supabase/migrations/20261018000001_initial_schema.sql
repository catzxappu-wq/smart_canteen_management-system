-- ====================================================================
-- SMART CANTEEN MANAGEMENT SYSTEM - POSTGRESQL SCHEMA & RLS MIGRATION
-- ====================================================================

-- 1. EXTENSIONS & SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- 7. ORDER ITEMS TABLE (Immutable snapshot of purchase)
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

-- Ensure a single settings row exists
INSERT INTO public.canteen_settings (canteen_name)
SELECT 'Campus Hub Smart Canteen'
WHERE NOT EXISTS (SELECT 1 FROM public.canteen_settings);

-- 11. INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
CREATE INDEX IF NOT EXISTS idx_food_items_category ON public.food_items(category_id);
CREATE INDEX IF NOT EXISTS idx_food_items_availability ON public.food_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON public.order_status_history(order_id);

-- 12. TRIGGERS & FUNCTIONS

-- A. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_food_items_updated_at
    BEFORE UPDATE ON public.food_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- B. Auto-record status transitions in order_status_history
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.order_status IS DISTINCT FROM NEW.order_status) THEN
        INSERT INTO public.order_status_history (
            order_id,
            previous_status,
            new_status,
            changed_by,
            notes
        ) VALUES (
            NEW.id,
            OLD.order_status,
            NEW.order_status,
            auth.uid(),
            'Status changed from ' || COALESCE(OLD.order_status, 'None') || ' to ' || NEW.order_status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_orders_status_history
    AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_order_status_change();

-- C. Record initial order creation in history
CREATE OR REPLACE FUNCTION public.handle_order_initial_status()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.order_status_history (
        order_id,
        previous_status,
        new_status,
        changed_by,
        notes
    ) VALUES (
        NEW.id,
        NULL,
        NEW.order_status,
        NEW.user_id,
        'Order created with initial status ' || NEW.order_status
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_orders_initial_status
    AFTER INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_order_initial_status();

-- D. Handle new user registration from Supabase auth.users to profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User'),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        -- NEVER trust public registration to assign admin role:
        'student'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. SECURE ORDER CREATION FUNCTION (Server-side price calculation & stock check)
CREATE OR REPLACE FUNCTION public.create_secure_order(
    p_user_id UUID,
    p_payment_method TEXT,
    p_notes TEXT,
    p_items JSONB -- Array of { food_item_id: UUID, quantity: INT }
)
RETURNS JSONB AS $$
DECLARE
    v_canteen_open BOOLEAN;
    v_cash_enabled BOOLEAN;
    v_tax_rate NUMERIC;
    v_subtotal NUMERIC := 0;
    v_tax NUMERIC := 0;
    v_total NUMERIC := 0;
    v_order_id UUID;
    v_order_number TEXT;
    v_pickup_token TEXT;
    item_record RECORD;
    v_item JSONB;
    v_food_id UUID;
    v_qty INT;
    v_food_name TEXT;
    v_food_price NUMERIC;
    v_food_available BOOLEAN;
BEGIN
    -- Verify caller matches user_id or is authenticated
    IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
        RAISE EXCEPTION 'Unauthorized: Caller cannot create order for another user';
    END IF;

    -- Check canteen status
    SELECT is_canteen_open, cash_on_counter_enabled, tax_rate_percent
    INTO v_canteen_open, v_cash_enabled, v_tax_rate
    FROM public.canteen_settings
    LIMIT 1;

    IF NOT COALESCE(v_canteen_open, TRUE) THEN
        RAISE EXCEPTION 'Canteen is currently closed for orders.';
    END IF;

    IF p_payment_method = 'cash_at_counter' AND NOT COALESCE(v_cash_enabled, TRUE) THEN
        RAISE EXCEPTION 'Cash on counter payment is currently disabled by administrator.';
    END IF;

    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Cart is empty.';
    END IF;

    -- Calculate trusted subtotal from database prices
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_food_id := (v_item->>'food_item_id')::UUID;
        v_qty := (v_item->>'quantity')::INT;

        IF v_qty < 1 THEN
            RAISE EXCEPTION 'Invalid item quantity: %', v_qty;
        END IF;

        SELECT name, price, is_available
        INTO v_food_name, v_food_price, v_food_available
        FROM public.food_items
        WHERE id = v_food_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Food item not found: %', v_food_id;
        END IF;

        IF NOT v_food_available THEN
            RAISE EXCEPTION 'Item "%" is currently sold out.', v_food_name;
        END IF;

        v_subtotal := v_subtotal + (v_food_price * v_qty);
    END LOOP;

    -- Calculate tax & total
    v_tax := ROUND((v_subtotal * (COALESCE(v_tax_rate, 5.0) / 100.0)), 2);
    v_total := v_subtotal + v_tax;

    -- Create order record
    v_order_number := public.generate_order_number();
    v_pickup_token := encode(gen_random_bytes(16), 'hex');

    INSERT INTO public.orders (
        order_number,
        user_id,
        subtotal,
        tax_amount,
        total_amount,
        payment_method,
        payment_status,
        order_status,
        notes,
        pickup_token
    ) VALUES (
        v_order_number,
        p_user_id,
        v_subtotal,
        v_tax,
        v_total,
        p_payment_method,
        CASE WHEN p_payment_method = 'cash_at_counter' THEN 'pending' ELSE 'pending' END,
        'Pending',
        p_notes,
        v_pickup_token
    ) RETURNING id INTO v_order_id;

    -- Insert snapshot order items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_food_id := (v_item->>'food_item_id')::UUID;
        v_qty := (v_item->>'quantity')::INT;

        SELECT name, price INTO v_food_name, v_food_price
        FROM public.food_items
        WHERE id = v_food_id;

        INSERT INTO public.order_items (
            order_id,
            food_item_id,
            item_name_snapshot,
            unit_price,
            quantity,
            line_total
        ) VALUES (
            v_order_id,
            v_food_id,
            v_food_name,
            v_food_price,
            v_qty,
            (v_food_price * v_qty)
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal', v_subtotal,
        'tax_amount', v_tax,
        'total_amount', v_total,
        'pickup_token', v_pickup_token
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canteen_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- A. PROFILES POLICIES
-- Students can read their own profile; Admins can read all profiles
CREATE POLICY "Profiles read access" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- Students can update their own phone and full_name, but CANNOT change role
CREATE POLICY "Profiles self update" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Admins can update any profile (including roles)
CREATE POLICY "Admins manage profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

-- B. CATEGORIES POLICIES
-- Public & Students can view active categories
CREATE POLICY "Public read categories" ON public.categories
    FOR SELECT USING (is_active = TRUE OR public.is_admin());

-- Only Admins can insert/update/delete categories
CREATE POLICY "Admins manage categories" ON public.categories
    FOR ALL USING (public.is_admin());

-- C. FOOD ITEMS POLICIES
-- Anyone can view available items; Admins can view all items
CREATE POLICY "Public read food items" ON public.food_items
    FOR SELECT USING (is_available = TRUE OR public.is_admin());

-- Only Admins can modify food items
CREATE POLICY "Admins manage food items" ON public.food_items
    FOR ALL USING (public.is_admin());

-- D. ORDERS POLICIES
-- Students can read their own orders; Admins can read all orders
CREATE POLICY "Users read their orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Students can insert their own orders
CREATE POLICY "Users insert their orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Students can cancel their own order ONLY IF order_status is 'Pending'
CREATE POLICY "Users cancel pending orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id AND order_status = 'Pending')
    WITH CHECK (auth.uid() = user_id AND order_status = 'Cancelled');

-- Admins can update any order (status, payment_status, etc.)
CREATE POLICY "Admins manage orders" ON public.orders
    FOR ALL USING (public.is_admin());

-- E. ORDER ITEMS POLICIES
-- Order items can be viewed by order owner or admin
CREATE POLICY "Users read their order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Insert order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- F. PAYMENTS POLICIES
CREATE POLICY "Users read payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = payments.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Admins manage payments" ON public.payments
    FOR ALL USING (public.is_admin());

-- G. ORDER STATUS HISTORY POLICIES
CREATE POLICY "Users read status history" ON public.order_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_status_history.order_id
            AND (orders.user_id = auth.uid() OR public.is_admin())
        )
    );

-- H. CANTEEN SETTINGS POLICIES
CREATE POLICY "Public read canteen settings" ON public.canteen_settings
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins update canteen settings" ON public.canteen_settings
    FOR UPDATE USING (public.is_admin());
