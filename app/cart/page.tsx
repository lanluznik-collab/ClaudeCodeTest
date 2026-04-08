"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div style={{
        maxWidth: "600px", margin: "0 auto",
        padding: "96px 24px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "16px", color: "rgba(255,255,255,0.45)",
          marginBottom: "28px",
        }}>
          Vaša košarica je prazna.
        </p>
        <Link href="/shop" style={{
          display: "inline-block",
          padding: "14px 36px",
          backgroundColor: "#c9a84c",
          color: "#fff",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700, fontSize: "13px",
          textTransform: "uppercase", letterSpacing: "0.1em",
          textDecoration: "none",
          borderRadius: "2px",
        }}>
          Nazaj v trgovino
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 md:px-6 py-8 md:py-12" style={{ maxWidth: "1200px" }}>
      <h1 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "28px", fontWeight: 900,
        textTransform: "uppercase", letterSpacing: "0.06em",
        color: "#c9a84c", marginBottom: "32px",
      }}>
        Košarica
      </h1>

      {/* Stack vertically on mobile, sidebar layout on desktop */}
      {/* NOTE: no display/gridTemplateColumns in inline style — Tailwind grid controls layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 md:gap-12 items-start">
        {/* Cart items */}
        <div>
          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}
        </div>

        {/* Order summary — full width below items on mobile, sticky sidebar on desktop */}
        <CartSummary />
      </div>
    </div>
  );
}
