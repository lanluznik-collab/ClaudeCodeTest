export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ShopFilters } from "@/components/shop/ShopFilters";

const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 2L58 18V50L30 66L2 50V18Z' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M30 68L58 84V104' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M2 84L30 68' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3C/svg%3E")`;

interface Props {
  searchParams: { category?: string; sort?: string; price?: string; in_stock?: string };
}

export default async function ShopPage({ searchParams }: Props) {
  const supabase = createServerClient();
  const { category, sort = "newest", price, in_stock } = searchParams;

  let query = supabase.from("products").select("*");

  if (category) query = query.eq("category", category);

  if (price === "under50")   query = query.lt("price", 50);
  if (price === "50to100")   query = query.gte("price", 50).lte("price", 100);
  if (price === "over100")   query = query.gt("price", 100);

  if (in_stock === "true") query = query.gt("stock", 0);

  if (sort === "price_asc")  query = query.order("price", { ascending: true });
  else if (sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data: products, error: productsError } = await query;
  console.log("[shop] products fetched:", products?.length ?? 0, productsError ?? "");

  const { data: categoryRows } = await supabase
    .from("products")
    .select("category")
    .not("category", "is", null);

  const seen = new Set<string>();
  const categories = (categoryRows ?? [])
    .map((r) => r.category as string)
    .filter((c) => { if (!c || seen.has(c)) return false; seen.add(c); return true; });

  return (
    <>
      {/* Dark hero banner */}
      <section style={{
        backgroundColor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
        minHeight: "260px",
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: HEX_PATTERN,
          backgroundSize: "60px 104px",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse 50% 80% at 15% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "1200px", margin: "0 auto",
          padding: "60px 24px 120px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "11px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.25em",
              color: "#c9a84c", marginBottom: "12px",
            }}>
              Naša ponudba
            </p>
            <h1 style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#c9a84c",
              margin: 0,
            }}>
              Peptidi za prodajo
            </h1>
          </div>
        </div>
        {/* Diagonal cut to white */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
          backgroundColor: "#ffffff",
          clipPath: "polygon(0 100%, 100% 0%, 100% 100%)",
        }} />
      </section>

      {/* White content section */}
      <section style={{ backgroundColor: "#fff", padding: "48px 0 80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <Suspense>
            <ShopFilters categories={categories} />
          </Suspense>
          <ProductGrid products={products ?? []} />
        </div>
      </section>
    </>
  );
}
