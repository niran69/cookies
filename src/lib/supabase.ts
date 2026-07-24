import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const WHATSAPP_NUMBER = '15551234567'; // placeholder — replace with brand number

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  delivery_date: string;
  delivery_time: string;
  special_instructions: string | null;
  delivery_fee: number;
  total: number;
  status: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  message: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  badge: string | null;
  active: boolean;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
};
