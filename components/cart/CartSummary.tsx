"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { WhatsAppOrderButton } from "./WhatsAppOrderButton";

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Checkout error:", text);
        return;
      }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      backgroundColor: "#161616",
      border: "1px solid rgba(201,168,76,0.15)",
      borderRadius: "6px",
      padding: "28px",
      position: "sticky",
      top: "88px",
    }}>
      <h2 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "14px", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.1em",
        color: "#fff", margin: "0 0 20px 0",
      }}>
        Povzetek naročila
      </h2>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
          Vmesni seštevek
        </span>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 700, color: "#fff" }}>
          {formatPrice(subtotal())}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
          Dostava
        </span>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "#4ade80" }}>
          Brezplačno
        </span>
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingTop: "16px",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "24px",
      }}>
        <span style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "14px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.08em",
          color: "#fff",
        }}>
          Skupaj
        </span>
        <span style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "18px", fontWeight: 800,
          color: "#c9a84c",
        }}>
          {formatPrice(subtotal())}
        </span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#c9a84c",
          color: "#fff",
          border: "none",
          borderRadius: "2px",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700, fontSize: "13px",
          textTransform: "uppercase", letterSpacing: "0.1em",
          cursor: loading || items.length === 0 ? "not-allowed" : "pointer",
          opacity: loading || items.length === 0 ? 0.55 : 1,
          marginBottom: "10px",
          transition: "opacity 0.2s",
        }}
      >
        {loading ? "Preusmerjanje…" : "Plačaj s kartico"}
      </button>

      <WhatsAppOrderButton items={items} subtotal={subtotal()} />
    </div>
  );
}
