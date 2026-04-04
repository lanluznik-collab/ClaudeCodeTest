import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for server-side operations (API routes, webhooks)
export function createServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Use anon key for server components (respects RLS)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
