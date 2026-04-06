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
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "28px", fontWeight: 900,
        textTransform: "uppercase", letterSpacing: "0.06em",
        color: "#c9a84c", marginBottom: "40px",
      }}>
        Košarica
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }}>
        <div>
          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}
        </div>
        <CartSummary />
      </div>
    </div>
  );
}
