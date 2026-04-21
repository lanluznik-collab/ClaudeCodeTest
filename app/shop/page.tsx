export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase/server";
import { ShopClient } from "@/components/shop/ShopClient";

export default async function ShopPage() {
  const supabase = createServerClient();

  const [{ data: products }, { data: categoryRows }] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("products").select("category").not("category", "is", null),
  ]);

  const seen = new Set<string>();
  const categories = (categoryRows ?? [])
    .map((r) => r.category as string)
    .filter((c) => { if (!c || seen.has(c)) return false; seen.add(c); return true; });

  return <ShopClient products={products ?? []} categories={categories} />;
}
