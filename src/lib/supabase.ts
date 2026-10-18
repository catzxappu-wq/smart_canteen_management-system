import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('mock-canteen-demo') &&
  !supabaseAnonKey.includes('dummy_anon_key')
);

// Centralized Supabase client instance
export const supabase = createClient(
  supabaseUrl || 'https://mock-canteen-demo.supabase.co',
  supabaseAnonKey || 'dummy_anon_key_for_development_and_testing',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
