/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hnzksafxfekcbdnzrrvv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuemtzYWZ4ZmVrY2JkbnpycmV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODMxMzAsImV4cCI6MjA4NzM1OTEzMH0.Cl_M-RhBz9RM-eW6RC6rrrq4L1gZ4Wularm2CZ9noMY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
