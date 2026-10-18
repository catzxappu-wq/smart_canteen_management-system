import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load .env if present
try {
  const envContent = readFileSync('.env', 'utf-8');
  envContent.split('\n').forEach((line) => {
    const [k, v] = line.split('=');
    if (k && v && !process.env[k.trim()]) {
      process.env[k.trim()] = v.trim();
    }
  });
} catch (e) {
  // Ignore missing .env
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('----------------------------------------------------');
console.log('🍱 SMART CANTEEN CLOUD DATA UPLOADER');
console.log('----------------------------------------------------');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('mock-canteen-demo')) {
  console.log('⚠️  Notice: Real cloud credentials are not yet configured in .env');
  console.log('');
  console.log('To upload all data to your live Supabase cloud database:');
  console.log('1. Go to your Supabase project (https://supabase.com)');
  console.log('2. Open the SQL Editor on Supabase');
  console.log('3. Copy and run the single script: supabase/full_cloud_setup.sql');
  console.log('4. Or add your real credentials into .env:');
  console.log('     VITE_SUPABASE_URL=https://your-id.supabase.co');
  console.log('     VITE_SUPABASE_ANON_KEY=eyJ...');
  console.log('   Then re-run: node scripts/upload-to-cloud.mjs');
  console.log('----------------------------------------------------');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadData() {
  console.log(`Connecting to cloud database: ${supabaseUrl}...`);

  // 1. Upload Categories
  console.log('1. Uploading categories...');
  const categories = [
    { id: 'c1111111-1111-1111-1111-111111111111', name: 'South Indian', description: 'Traditional idlis, crispy dosas, and steamed delicacies', icon: 'Coffee', display_order: 1, is_active: true },
    { id: 'c2222222-2222-2222-2222-222222222222', name: 'North Indian', description: 'Rich curries, rotis, paneer specials, and gravies', icon: 'Utensils', display_order: 2, is_active: true },
    { id: 'c3333333-3333-3333-3333-333333333333', name: 'Breakfast', description: 'Morning energy boosters and fast combos', icon: 'Sunrise', display_order: 3, is_active: true },
    { id: 'c4444444-4444-4444-4444-444444444444', name: 'Meals & Combos', description: 'Wholesome student lunch platters and rice bowls', icon: 'Soup', display_order: 4, is_active: true },
    { id: 'c5555555-5555-5555-5555-555555555555', name: 'Snacks & Quick Bites', description: 'Crispy evening snacks, sandwiches, and rolls', icon: 'Sandwich', display_order: 5, is_active: true },
    { id: 'c6666666-6666-6666-6666-666666666666', name: 'Beverages', description: 'Hot filter coffee, cutting chai, cool sodas & shakes', icon: 'GlassWater', display_order: 6, is_active: true },
    { id: 'c7777777-7777-7777-7777-777777777777', name: 'Desserts', description: 'Sweet treats, gulab jamun, and ice creams', icon: 'IceCream', display_order: 7, is_active: true },
  ];

  const { error: catError } = await supabase.from('categories').upsert(categories, { onConflict: 'id' });
  if (catError) {
    console.error('Category upload failed:', catError.message);
  } else {
    console.log(`✓ 7 Categories uploaded successfully.`);
  }

  // 2. Upload Admin Profile (Meghashree)
  console.log('2. Uploading Admin Profile (Meghashree)...');
  const adminProfile = {
    id: 'a0000000-0000-0000-0000-000000000001',
    full_name: 'Meghashree',
    email: 'meghashree@campus.edu',
    phone: '+91 98765 99999',
    role: 'admin',
  };
  const { error: profError } = await supabase.from('profiles').upsert(adminProfile, { onConflict: 'id' });
  if (profError) {
    console.warn('Note on profile insert:', profError.message);
  } else {
    console.log(`✓ Administrator Meghashree recorded.`);
  }

  // 3. Upload Food Items
  console.log('3. Uploading Food Items...');
  const foodItems = [
    { id: 'f1111111-1111-1111-1111-111111111111', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'Crispy Masala Dosa', description: 'Golden crisp fermented crepe filled with spiced potato mash, served with coconut chutney and hot sambar.', price: 65, image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 8, calories: 320, is_veg: true, is_popular: true },
    { id: 'f1111111-1111-1111-1111-111111111112', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'Steamed Idli Vada Combo', description: 'Two pillowy soft steamed rice cakes and one crispy medu vada, served with red & white chutneys and sambar.', price: 50, image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 5, calories: 280, is_veg: true, is_popular: true },
    { id: 'f1111111-1111-1111-1111-111111111113', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'Onion Uttapam', description: 'Thick savory pancake topped with caramelized red onions, fresh coriander, green chillies, and ghee.', price: 60, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 10, calories: 340, is_veg: true, is_popular: false },
    { id: 'f2222222-2222-2222-2222-222222222221', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Paneer Butter Masala + Naan', description: 'Succulent cottage cheese cubes simmered in a creamy, buttery tomato-cashew gravy with warm tandoor rotis.', price: 140, image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 15, calories: 540, is_veg: true, is_popular: true },
    { id: 'f2222222-2222-2222-2222-222222222222', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Chole Bhature Platter', description: 'Two fluffy golden fried bhaturas paired with spiced Punjabi chickpea masala, pickled onion, and green mint chutney.', price: 95, image_url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 12, calories: 610, is_veg: true, is_popular: true },
    { id: 'f3333333-3333-3333-3333-333333333331', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'Poori Sagu Set', description: 'Three puffed whole wheat pooris accompanied by spiced mixed vegetable sagu and coconut chutney.', price: 55, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 8, calories: 390, is_veg: true, is_popular: false },
    { id: 'f3333333-3333-3333-3333-333333333332', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'Aloo Paratha with Curd & Butter', description: 'Tawa-toasted whole wheat flatbread stuffed with spiced crushed potatoes, served with fresh curd and amul butter.', price: 70, image_url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 10, calories: 410, is_veg: true, is_popular: true },
    { id: 'f4444444-4444-4444-4444-444444444441', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'Deluxe Campus Veg Thali', description: 'Steamed basmati rice, dal tadka, paneer sabzi, seasonal dry vegetable, 2 rotis, papad, curd, and sweet gulab jamun.', price: 120, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 10, calories: 680, is_veg: true, is_popular: true },
    { id: 'f4444444-4444-4444-4444-444444444442', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'Veg Fried Rice + Manchurian', description: 'Wok-tossed basmati rice with crunchy vegetables and spring onions, paired with vegetable Manchurian balls in hot soy gravy.', price: 110, image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 12, calories: 520, is_veg: true, is_popular: true },
    { id: 'f5555555-5555-5555-5555-555555555551', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Cheese Grilled Sandwich', description: 'Double layered crusty brown bread toasted with cheddar & mozzarella, mint spread, cucumber, and tomatoes.', price: 65, image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 7, calories: 340, is_veg: true, is_popular: false },
    { id: 'f5555555-5555-5555-5555-555555555552', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Crispy Punjabi Samosa (2 pcs)', description: 'Flaky golden pastry cones packed with spicy potato and green peas, served with sweet tamarind and spicy mint chutneys.', price: 35, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 3, calories: 290, is_veg: true, is_popular: true },
    { id: 'f6666666-6666-6666-6666-666666666661', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'South Indian Filter Coffee', description: 'Freshly brewed strong chicory blend coffee frothed with boiling creamy full-fat milk.', price: 25, image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 3, calories: 95, is_veg: true, is_popular: true },
    { id: 'f6666666-6666-6666-6666-666666666662', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Cardamom Masala Chai', description: 'Aromatic crushed ginger and green cardamom tea brewed to perfection.', price: 20, image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 3, calories: 80, is_veg: true, is_popular: true },
    { id: 'f7777777-7777-7777-7777-777777777771', category_id: 'c7777777-7777-7777-7777-777777777777', name: 'Warm Gulab Jamun (2 pcs)', description: 'Melt-in-mouth cottage cheese and khoya dumplings soaked in fragrant cardamom rose sugar syrup.', price: 40, image_url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80', is_available: true, preparation_time: 2, calories: 260, is_veg: true, is_popular: true },
  ];

  const { error: foodError } = await supabase.from('food_items').upsert(foodItems, { onConflict: 'id' });
  if (foodError) {
    console.error('Food items upload failed:', foodError.message);
  } else {
    console.log(`✓ 14 Food items uploaded successfully.`);
  }

  // 4. Upload Canteen Settings
  console.log('4. Uploading Settings...');
  const settings = {
    canteen_name: 'Campus Hub Smart Canteen',
    opening_time: '08:00',
    closing_time: '20:30',
    is_canteen_open: true,
    cash_on_counter_enabled: true,
    tax_rate_percent: 5.0,
    support_phone: '+91 98765 43210',
    support_email: 'canteen@campus.edu',
    announcement_banner: 'Welcome to the Smart Canteen! Pre-order your meals and skip the queue.',
  };
  await supabase.from('canteen_settings').upsert(settings);
  console.log('✓ Canteen settings saved.');

  console.log('----------------------------------------------------');
  console.log('🎉 ALL DATA UPLOADED TO SUPABASE CLOUD SUCCESSFULLY!');
  console.log('----------------------------------------------------');
}

uploadData().catch((err) => {
  console.error('Upload Error:', err);
});
