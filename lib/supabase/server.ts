import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for server-side operations (API routes, webhooks)
export function createServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Use anon key for server components (respects RLS).
// Forces cache: "no-store" so Next.js's fetch Data Cache never serves stale
// rows to Server Components — those pages already opt out of the route cache
// via `export const dynamic = "force-dynamic"`, and DB writes (e.g. from the
// admin panel) need to show up on the next request, not after a rebuild.
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
