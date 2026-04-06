import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { ImageGallery } from "@/components/product/ImageGallery";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WhatsAppButton } from "@/components/product/WhatsAppButton";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductCard } from "@/components/shop/ProductCard";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", params.slug)
    .single();
  if (!data) return { title: "Izdelek ni najden" };
  return { title: data.name, description: data.description ?? undefined };
}

export default async function ProductPage({ params }: Props) {
  const supabase = createServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category ?? "")
    .neq("id", product.id)
    .limit(4);

  const tiers = [
    { qty: "1 – 4", price: product.price,        prihranek: "—" },
    { qty: "5 – 8", price: product.price * 0.90, prihranek: "10% popust" },
    { qty: "9+",    price: product.price * 0.85, prihranek: "15% popust" },
  ];

  return (
    <div style={{ backgroundColor: "#fff", color: "#111", minHeight: "60vh" }}>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#f7f7f7", borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 32px" }}>
          <p style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "#999", margin: 0 }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>Domov</Link>
            <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
            <Link href="/shop" style={{ color: "#999", textDecoration: "none" }}>Trgovina</Link>
            <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
            <span style={{ color: "#333" }}>{product.name}</span>
          </p>
        </div>
      </div>

      {/* Main product section */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 32px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }}>

          {/* LEFT: image */}
          <ImageGallery images={product.images} name={product.name} />

          {/* RIGHT: product info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>

            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.22em",
              color: "#c9a84c", margin: "0 0 10px 0",
            }}>
              {product.category ?? "PEPTIDI"}
            </p>

            <h1 style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)", fontWeight: 900,
              color: "#111", lineHeight: 1.2, margin: "0 0 16px 0",
            }}>
              {product.name}
            </h1>

            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "28px", fontWeight: 800,
              color: "#c9a84c", margin: "0 0 24px 0", letterSpacing: "-0.01em",
            }}>
              {formatPrice(product.price)}
            </p>

            {/* Details table */}
            <div style={{ border: "1px solid #e8e8e8", borderRadius: "4px", overflow: "hidden", marginBottom: "20px", fontSize: "13px" }}>
              {[
                { label: "Kategorija", value: product.category ?? "—" },
                { label: "Zaloga", value: product.stock > 0 ? `${product.stock} enot na zalogi` : "Ni na zalogi" },
              ].map(({ label, value }, i) => (
                <div key={label} style={{ display: "grid", gridTemplateColumns: "120px 1fr", borderBottom: i === 0 ? "1px solid #e8e8e8" : "none" }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.07em", color: "#777",
                    padding: "10px 14px", backgroundColor: "#fafafa", borderRight: "1px solid #e8e8e8",
                  }}>
                    {label}
                  </span>
                  <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "#333", padding: "10px 14px" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Free shipping */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              backgroundColor: "#1a7a3a", borderRadius: "4px",
              padding: "12px 16px", marginBottom: "24px",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 5v3h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.09em", color: "#fff",
              }}>
                BREZPLAČNA DOSTAVA za naročila nad 200 €
              </span>
            </div>

            {/* Quantity discounts */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.14em", color: "#555", margin: "0 0 10px 0",
              }}>
                Popusti pri količini
              </p>
              <div style={{ border: "1px solid #e8e8e8", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", backgroundColor: "#fafafa", borderBottom: "1px solid #e8e8e8" }}>
                  {["KOLIČINA", "CENA / KOS", "PRIHRANEK"].map((h) => (
                    <span key={h} style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", padding: "9px 14px",
                    }}>
                      {h}
                    </span>
                  ))}
                </div>
                {tiers.map((tier, i) => (
                  <div key={tier.qty} style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                    borderBottom: i < tiers.length - 1 ? "1px solid #f0f0f0" : "none",
                    backgroundColor: i === 0 ? "#fffdf5" : "#fff",
                  }}>
                    <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "#333", padding: "10px 14px" }}>{tier.qty}</span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700, color: "#c9a84c", padding: "10px 14px" }}>{formatPrice(tier.price)}</span>
                    <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: i === 0 ? "#aaa" : "#4a7c59", fontWeight: i > 0 ? 600 : 400, padding: "10px 14px" }}>{tier.prihranek}</span>
                  </div>
                ))}
              </div>
            </div>

            <AddToCartButton product={product} />
            <div style={{ marginTop: "12px" }}>
              <WhatsAppButton product={product} />
            </div>
          </div>
        </div>

        {/* Tabs: Opis + Certifikat analize */}
        <ProductTabs
          description={product.description}
          coaImages={product.coa_images ?? []}
        />

        {/* Related products */}
        {related && related.length > 0 && (
          <div style={{ marginTop: "72px" }}>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontSize: "18px", fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.1em", color: "#111",
              margin: "0 0 32px 0", paddingBottom: "16px", borderBottom: "1px solid #eee",
            }}>
              Sorodni peptidi
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "28px" }}>
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
