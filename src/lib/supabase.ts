/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// Debug: log credentials (key masked for security)
const maskedKey = supabaseAnonKey
  ? `${supabaseAnonKey.slice(0, 10)}...${supabaseAnonKey.slice(-6)}`
  : 'EMPTY';
console.log('[v0] Supabase URL:', supabaseUrl);
console.log('[v0] Supabase Anon Key (masked):', maskedKey);

// Protocol check: ensure URL uses https://
if (!supabaseUrl.startsWith('https://')) {
  console.warn(
    '[v0] WARNING: VITE_SUPABASE_URL does not start with https://. This may cause mixed-content errors. Current value:',
    supabaseUrl
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
