import Link from "next/link";
import { Product } from "@/types";
import { ProductGrid } from "@/components/shop/ProductGrid";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section style={{ backgroundColor: "#fff", padding: "64px 0 80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>

        {/* Section header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px" }}>
          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: "#ca8b2b",
              marginBottom: "10px",
            }}>
              Our Range
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#111",
              margin: 0,
            }}>
              Products For Sale
            </h2>
          </div>
          <Link href="/shop" style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#ca8b2b",
            textDecoration: "none",
            borderBottom: "2px solid #ca8b2b",
            paddingBottom: "2px",
          }}>
            View All →
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
