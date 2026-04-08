import Link from "next/link";
import { Product } from "@/types";
import { ProductGrid } from "@/components/shop/ProductGrid";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section style={{ backgroundColor: "#fff", padding: "64px 0 80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px" }}>
          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "11px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.25em",
              color: "#c9a84c", marginBottom: "10px",
            }}>
              Naša ponudba
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.04em", color: "#111", margin: 0,
            }}>
              Peptidi za prodajo
            </h2>
          </div>
          <Link href="/shop" style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "12px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.12em",
            color: "#c9a84c", textDecoration: "none",
            borderBottom: "2px solid #c9a84c", paddingBottom: "2px",
          }}>
            Oglej si vse →
          </Link>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
