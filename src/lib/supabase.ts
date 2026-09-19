import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment credentials for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://viciehedjjpyykjbmzwe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5_y04282Zyz4lmXEvm9ASw_Cw22k6RF';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co')
  );
};

// Create the Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export interface SupabaseProfile {
  id: string; // auth.users.id
  email: string;
  name: string | null;
  given_name?: string | null;
  family_name?: string | null;
  phone?: string | null;
  doc_type?: string | null;
  doc_number?: string | null;
  birth_date?: string | null;
  avatar_url?: string | null;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseCategory {
  id: string;
  name: string;
  icon: string;
  description?: string | null;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  category_id: string;
  price: number;
  description: string;
  badge?: string | null;
  popular?: boolean;
  available?: boolean;
  options?: string[] | null;
  includes_sauces?: boolean;
  created_at?: string;
}

export interface SupabaseOrder {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  order_type: 'delivery' | 'pickup' | 'salon';
  delivery_address?: string | null;
  delivery_reference?: string | null;
  table_number?: string | null;
  payment_method: string;
  notes?: string | null;
  status: 'recibido' | 'preparando' | 'en_camino' | 'entregado';
  total: number;
  items: any;
  user_id?: string | null;
  created_at?: string;
}

export interface SupabaseClaim {
  id?: number;
  claim_code: string;
  full_name: string;
  doc_type: string;
  doc_number: string;
  phone: string;
  email: string;
  address: string;
  claim_type: 'queja' | 'reclamo';
  contracted_good: 'producto' | 'servicio';
  claimed_amount?: number | null;
  product_description?: string | null;
  detail: string;
  consumer_request: string;
  status?: string;
  created_at?: string;
}
