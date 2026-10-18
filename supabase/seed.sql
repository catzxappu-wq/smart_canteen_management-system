-- ====================================================================
-- SMART CANTEEN MANAGEMENT SYSTEM - SEED DATA
-- ====================================================================

-- 1. INSERT CATEGORIES
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

-- 2. INSERT FOOD ITEMS
INSERT INTO public.food_items (id, category_id, name, description, price, image_url, is_available, preparation_time, calories, is_veg, is_popular)
VALUES
    -- South Indian
    (
        'f1111111-1111-1111-1111-111111111111',
        'c1111111-1111-1111-1111-111111111111',
        'Crispy Masala Dosa',
        'Golden crisp fermented crepe filled with spiced potato mash, served with coconut chutney and hot sambar.',
        65.00,
        'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
        true,
        8,
        320,
        true,
        true
    ),
    (
        'f1111111-1111-1111-1111-111111111112',
        'c1111111-1111-1111-1111-111111111111',
        'Steamed Idli Vada Combo',
        'Two pillowy soft steamed rice cakes and one crispy medu vada, served with red & white chutneys and sambar.',
        50.00,
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
        true,
        5,
        280,
        true,
        true
    ),
    (
        'f1111111-1111-1111-1111-111111111113',
        'c1111111-1111-1111-1111-111111111111',
        'Onion Uttapam',
        'Thick savory pancake topped with caramelized red onions, fresh coriander, green chillies, and ghee.',
        60.00,
        'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
        true,
        10,
        340,
        true,
        false
    ),

    -- North Indian
    (
        'f2222222-2222-2222-2222-222222222221',
        'c2222222-2222-2222-2222-222222222222',
        'Paneer Butter Masala with 2 Butter Naan',
        'Succulent cottage cheese cubes simmered in a creamy, buttery tomato-cashew gravy with warm tandoor rotis.',
        140.00,
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
        true,
        15,
        540,
        true,
        true
    ),
    (
        'f2222222-2222-2222-2222-222222222222',
        'c2222222-2222-2222-2222-222222222222',
        'Chole Bhature Platter',
        'Two fluffy golden fried bhaturas paired with spiced Punjabi chickpea masala, pickled onion, and green mint chutney.',
        95.00,
        'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80',
        true,
        12,
        610,
        true,
        true
    ),

    -- Breakfast
    (
        'f3333333-3333-3333-3333-333333333331',
        'c3333333-3333-3333-3333-333333333333',
        'Poori Sagu Set',
        'Three puffed whole wheat pooris accompanied by spiced mixed vegetable sagu and coconut chutney.',
        55.00,
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        true,
        8,
        390,
        true,
        false
    ),
    (
        'f3333333-3333-3333-3333-333333333332',
        'c3333333-3333-3333-3333-333333333333',
        'Aloo Paratha with Curd & Butter',
        'Tawa-toasted whole wheat flatbread stuffed with spiced crushed potatoes, served with fresh curd and amul butter.',
        70.00,
        'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80',
        true,
        10,
        410,
        true,
        true
    ),

    -- Meals & Combos
    (
        'f4444444-4444-4444-4444-444444444441',
        'c4444444-4444-4444-4444-444444444444',
        'Deluxe Campus Veg Thali',
        'Steamed basmati rice, dal tadka, paneer sabzi, seasonal dry vegetable, 2 rotis, papad, curd, and sweet gulab jamun.',
        120.00,
        'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
        true,
        10,
        680,
        true,
        true
    ),
    (
        'f4444444-4444-4444-4444-444444444442',
        'c4444444-4444-4444-4444-444444444444',
        'Veg Fried Rice with Manchurian',
        'Wok-tossed basmati rice with crunchy vegetables and spring onions, paired with vegetable Manchurian balls in hot soy gravy.',
        110.00,
        'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
        true,
        12,
        520,
        true,
        true
    ),

    -- Snacks
    (
        'f5555555-5555-5555-5555-555555555551',
        'c5555555-5555-5555-5555-555555555555',
        'Cheese Grilled Sandwich',
        'Double layered crusty brown bread toasted with cheddar & mozzarella, mint spread, cucumber, and tomatoes.',
        65.00,
        'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
        true,
        7,
        340,
        true,
        false
    ),
    (
        'f5555555-5555-5555-5555-555555555552',
        'c5555555-5555-5555-5555-555555555555',
        'Crispy Punjabi Samosa (2 pcs)',
        'Flaky golden pastry cones packed with spicy potato and green peas, served with sweet tamarind and spicy mint chutneys.',
        35.00,
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        true,
        3,
        290,
        true,
        true
    ),

    -- Beverages
    (
        'f6666666-6666-6666-6666-666666666661',
        'c6666666-6666-6666-6666-666666666661',
        'South Indian Filter Coffee',
        'Freshly brewed strong chicory blend coffee frothed with boiling creamy full-fat milk.',
        25.00,
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        true,
        3,
        95,
        true,
        true
    ),
    (
        'f6666666-6666-6666-6666-666666666662',
        'c6666666-6666-6666-6666-666666666661',
        'Cardamom Masala Chai',
        'Aromatic crushed ginger and green cardamom tea brewed to perfection.',
        20.00,
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        true,
        3,
        80,
        true,
        true
    ),
    (
        'f6666666-6666-6666-6666-666666666663',
        'c6666666-6666-6666-6666-666666666661',
        'Fresh Mango Lassi',
        'Thick creamy sweet yoghurt shake infused with real Alphonso mango pulp and saffron.',
        50.00,
        'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
        true,
        4,
        210,
        true,
        false
    ),

    -- Desserts
    (
        'f7777777-7777-7777-7777-777777777771',
        'c7777777-7777-7777-7777-777777777777',
        'Warm Gulab Jamun (2 pcs)',
        'Melt-in-mouth cottage cheese and khoya dumplings soaked in fragrant cardamom rose sugar syrup.',
        40.00,
        'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
        true,
        2,
        260,
        true,
        true
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;
