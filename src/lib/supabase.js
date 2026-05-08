/**
 * 📚 LEARNING NOTE: Supabase Client
 *
 * Supabase is our database — like a big online spreadsheet.
 * This file creates two "connections" to it:
 *
 * 1. supabase (browser) — for normal operations like placing
 *    an order. It follows the Row Level Security (RLS) rules.
 *
 * 2. supabaseAdmin (server) — for admin operations that need
 *    to bypass RLS (like reading ALL orders). This one uses
 *    a secret key and should NEVER be used in the browser!
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Browser-safe Supabase client (uses anon key, respects RLS)
 * Used by: checkout, order tracking
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin Supabase client (uses service-role key, bypasses RLS)
 * Used by: API routes only — NEVER expose this to the browser!
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
