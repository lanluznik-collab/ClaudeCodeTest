"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);
  useEffect(() => { clearCart(); }, [clearCart]);

  return (
    <div style={{
      maxWidth: "500px", margin: "0 auto",
      padding: "96px 24px", textAlign: "center",
    }}>
      <div style={{
        width: "64px", height: "64px",
        borderRadius: "50%",
        backgroundColor: "rgba(201,168,76,0.12)",
        border: "2px solid #c9a84c",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 28px",
        fontSize: "28px",
      }}>
        ✓
      </div>
      <h1 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "24px", fontWeight: 900,
        textTransform: "uppercase", letterSpacing: "0.06em",
        color: "#c9a84c", marginBottom: "16px",
      }}>
        Naročilo potrjeno!
      </h1>
      <p style={{
        fontFamily: "var(--font-opensans)",
        fontSize: "15px", color: "rgba(255,255,255,0.55)",
        lineHeight: 1.7, marginBottom: "36px",
      }}>
        Hvala za vaše naročilo. V kratkem boste prejeli e-poštno potrditev.
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
