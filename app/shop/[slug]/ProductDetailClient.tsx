"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageGallery } from "@/components/product/ImageGallery";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WhatsAppButton } from "@/components/product/WhatsAppButton";
import { ProductTabs } from "@/components/product/ProductTabs";
import { StockBadge } from "@/components/product/StockBadge";
import { ProductSpecsTable } from "@/components/product/ProductSpecsTable";
import { DocumentCards } from "@/components/product/DocumentCards";
import { RuoNotice } from "@/components/product/RuoNotice";
import { ProductCard } from "@/components/shop/ProductCard";
import { formatPrice } from "@/lib/utils";
import { SHIPPING } from "@/lib/config/shipping";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { CoaDocument, Product } from "@/types";

interface Props {
  product: Product;
  related: Product[];
  coaDocs: CoaDocument[];
}

export function ProductDetailClient({ product, related, coaDocs }: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tl = mounted ? translations[lang] : translations.sl;

  const inStock = product.stock > 0;

  const tiers = [
    { qty: "1 – 4", price: product.price, savingsPct: null },
    { qty: "5 – 8", price: product.price * 0.9, savingsPct: 10 },
    { qty: "9+", price: product.price * 0.85, savingsPct: 15 },
  ];

  return (
    <div style={{ backgroundColor: "#0a0a0a", color: "#eeeeee", minHeight: "60vh" }}>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#111111", borderBottom: "1px solid #2a2a2a" }}>
        <div className="mx-auto px-4 md:px-8 py-3" style={{ maxWidth: "1200px" }}>
          <p style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "#999", margin: 0 }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>{tl.nav.home}</Link>
            <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
            <Link href="/shop" style={{ color: "#999", textDecoration: "none" }}>{tl.prodBreadcrumbShop}</Link>
            <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
            <span style={{ color: "#ddd" }}>{product.name}</span>
          </p>
        </div>
      </div>

      {/* Main product section */}
      <div className="mx-auto px-4 md:px-8 py-8 md:py-12 pb-16" style={{ maxWidth: "1200px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* LEFT: image + documents */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <ImageGallery images={product.images} name={product.name} />
            <DocumentCards product={product} />
          </div>

          {/* RIGHT: product info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>

            {product.category && (
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.22em",
                color: "#c9a84c", margin: "0 0 10px 0",
              }}>
                {product.category}
              </p>
            )}

            <h1 style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)", fontWeight: 900,
              color: "#fff", lineHeight: 1.2, margin: "0 0 14px 0",
            }}>
              {product.name}
            </h1>

            <StockBadge inStock={inStock} />

            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "28px", fontWeight: 800,
              color: "#c9a84c", margin: "0 0 24px 0", letterSpacing: "-0.01em",
              display: "flex", alignItems: "baseline", gap: "10px",
            }}>
              {formatPrice(product.price)}
              <span style={{
                fontFamily: "var(--font-opensans)", fontSize: "13px", fontWeight: 400,
                color: "rgba(255,255,255,0.4)",
              }}>
                {tl.prodInclVat}
              </span>
            </p>

            {/* Kategorija / Zaloga — readable spec line, no disabled-input styling */}
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", marginBottom: "24px" }}>
              {product.category && (
                <div>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.45)", margin: "0 0 4px 0",
                  }}>
                    {tl.prodCategory}
                  </p>
                  <p style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "#fff", margin: 0 }}>
                    {product.category}
                  </p>
                </div>
              )}
              <div>
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.45)", margin: "0 0 4px 0",
                }}>
                  {tl.prodStock}
                </p>
                <p style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "#fff", margin: 0 }}>
                  {inStock ? `${product.stock} ${tl.prodUnitsSuffix}` : tl.prodOutOfStock}
                </p>
              </div>
            </div>

            <ProductSpecsTable product={product} />

            {/* Free shipping — gold accent */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              backgroundColor: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: "4px",
              padding: "12px 16px", marginBottom: "24px",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 5v3h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.09em", color: "#c9a84c",
              }}>
                {tl.prodFreeShippingPrefix} {formatPrice(SHIPPING.freeThreshold)}
              </span>
            </div>

            {/* Quantity discounts */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)", margin: "0 0 10px 0",
              }}>
                {tl.prodQtyDiscounts}
              </p>
              <div style={{ border: "1px solid #e8e8e8", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", backgroundColor: "#fafafa", borderBottom: "1px solid #e8e8e8" }}>
                  {[tl.prodColQty, tl.prodColPricePerUnit, tl.prodColSavings].map((h) => (
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
                    <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: tier.savingsPct === null ? "#aaa" : "#4a7c59", fontWeight: tier.savingsPct !== null ? 600 : 400, padding: "10px 14px" }}>
                      {tier.savingsPct === null ? "—" : `${tier.savingsPct}% ${tl.prodDiscountWord}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <AddToCartButton product={product} />
            <div style={{ marginTop: "12px" }}>
              <WhatsAppButton product={product} />
            </div>

            <RuoNotice />
          </div>
        </div>

        {/* Tabs: Opis + Certifikat analize */}
        <ProductTabs
          product={product}
          coaImages={product.coa_images ?? []}
          coaDocs={coaDocs}
        />

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginTop: "72px" }}>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontSize: "18px", fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff",
              margin: "0 0 32px 0", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.12)",
            }}>
              {tl.prodRelated}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
