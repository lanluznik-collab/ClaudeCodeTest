export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { SortSelect } from "@/components/shop/SortSelect";

interface Props {
  searchParams: { category?: string; sort?: string };
}

export default async function ShopPage({ searchParams }: Props) {
  const supabase = createServerClient();
  const { category, sort = "newest" } = searchParams;

  let query = supabase.from("products").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

  // Fetch distinct categories
  const { data: categoryRows } = await supabase
    .from("products")
    .select("category")
    .not("category", "is", null);

  const seen = new Set<string>();
  const categories = (categoryRows ?? [])
    .map((r) => r.category as string)
    .filter((c) => {
      if (!c || seen.has(c)) return false;
      seen.add(c);
      return true;
    });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Shop</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Suspense>
          <CategoryFilter categories={categories} />
        </Suspense>
        <Suspense>
          <SortSelect />
        </Suspense>
      </div>

      <ProductGrid products={products ?? []} />
    </div>
  );
}
