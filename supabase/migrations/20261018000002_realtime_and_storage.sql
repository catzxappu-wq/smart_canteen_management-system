-- ====================================================================
-- SMART CANTEEN MANAGEMENT SYSTEM - REALTIME & STORAGE CONFIGURATION
-- ====================================================================

-- 1. REALTIME REPLICATION CONFIGURATION
-- Enable publication of order status changes for live tracking
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'order_status_history'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'canteen_settings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.canteen_settings;
    END IF;
END $$;

-- 2. SUPABASE STORAGE BUCKET FOR FOOD IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'food-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- A. Anyone can view/download food images
CREATE POLICY "Public Read Food Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'food-images');

-- B. Only authenticated admins can upload/modify food images
CREATE POLICY "Admin Upload Food Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'food-images' AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admin Update Food Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'food-images' AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admin Delete Food Images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'food-images' AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);
