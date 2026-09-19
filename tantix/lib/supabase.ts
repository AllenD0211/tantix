import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase environment variables supporting both Vite (VITE_*) and Next.js (NEXT_PUBLIC_*) prefixes
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string) ||
  '';

const supabaseKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
  '';

/**
 * Indicates whether valid Supabase connection credentials have been provided.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== 'https://placeholder.supabase.co'
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Warning: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY / VITE_SUPABASE_PUBLISHABLE_KEY is not defined in your .env file.'
  );
}

/**
 * Supabase client instance.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

export default supabase;