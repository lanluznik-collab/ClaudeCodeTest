"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { WhatsAppOrderButton } from "./WhatsAppOrderButton";

const BANK_NAME = "SloPeps";
const BANK_IBAN = "SI56 0440 3026 6483 426";
const BANK_BIC = "KBMASI2X";

function generateOrderRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "SLP-";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  backgroundColor: "#1e1e1e",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "2px",
  color: "#fff",
  fontFamily: "var(--font-opensans)",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-opensans)",
  fontSize: "12px",
  color: "rgba(255,255,255,0.45)",
  display: "block",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  const [view, setView] = useState<"summary" | "bank_form">("summary");
  const [orderRef, setOrderRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const sub = subtotal();
  const freeShipping = sub >= 200;
  const shippingCost = freeShipping ? 0 : 9.9;
  const total = sub + shippingCost;

  function handleShowBankForm() {
    setOrderRef(generateOrderRef());
    setError("");
    setView("bank_form");
  }

  async function handleConfirmOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total,
          customer_name: name,
          customer_email: email,
          customer_address: address,
          order_ref: orderRef,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Napaka pri oddaji naročila. Poskusite znova.");
        return;
      }

      // Store order info for success page, then clear cart and redirect
      localStorage.setItem(
        "last_order",
        JSON.stringify({ order_ref: orderRef, total: total.toFixed(2) })
      );
      clearCart();
      router.push("/checkout/success");
    } catch {
      setError("Napaka pri povezavi. Preverite internetno povezavo in poskusite znova.");
    } finally {
      setLoading(false);
    }
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: "#161616",
    border: "1px solid rgba(201,168,76,0.15)",
    borderRadius: "6px",
    padding: "24px",
  };

  const infoRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "8px",
  };

  // ── Bank form view ──────────────────────────────────────────────
  if (view === "bank_form") {
    return (
      <div className="md:sticky md:top-[88px]" style={containerStyle}>
        {/* Back */}
        <button
          onClick={() => setView("summary")}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.45)",
            fontFamily: "var(--font-opensans)",
            fontSize: "13px",
            cursor: "pointer",
            padding: "0",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← Nazaj
        </button>

        <h2 style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "14px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "#fff", margin: "0 0 20px 0",
        }}>
          Bančno nakazilo
        </h2>

        {/* Order summary */}
        <div style={{ marginBottom: "20px" }}>
          {items.map((item) => (
            <div key={item.productId} style={{ ...infoRowStyle, marginBottom: "6px" }}>
              <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
                {item.name} <span style={{ color: "rgba(255,255,255,0.35)" }}>×{item.quantity}</span>
              </span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <div style={{ ...infoRowStyle, marginBottom: "6px", marginTop: "10px" }}>
            <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Dostava</span>
            <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: freeShipping ? "#4ade80" : "#fff" }}>
              {freeShipping ? "Brezplačno" : formatPrice(9.9)}
            </span>
          </div>
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "10px",
            ...infoRowStyle,
            marginBottom: "0",
          }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#fff" }}>
              Skupaj
            </span>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "18px", fontWeight: 800, color: "#c9a84c" }}>
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Bank details */}
        <div style={{
          backgroundColor: "rgba(201,168,76,0.06)",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "4px",
          padding: "14px 16px",
          marginBottom: "20px",
        }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#c9a84c", margin: "0 0 12px 0" }}>
            Podatki za nakazilo
          </p>
          {[
            ["Prejemnik", BANK_NAME],
            ["IBAN", BANK_IBAN],
            ["BIC / SWIFT", BANK_BIC],
            ["Referenca", orderRef],
            ["Znesek", formatPrice(total)],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontFamily: "var(--font-opensans)", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{label}</span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 700, color: "#fff", textAlign: "right" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Customer form */}
        <form onSubmit={handleConfirmOrder}>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Ime in priimek *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Janez Novak"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>E-pošta *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="janez@email.com"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Naslov dostave *</label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={"Ulica 1\n1000 Ljubljana\nSlovenija"}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            />
          </div>

          {error && (
            <p style={{
              fontFamily: "var(--font-opensans)",
              fontSize: "13px",
              color: "#f87171",
              margin: "0 0 14px 0",
              lineHeight: 1.5,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: loading ? "#a07830" : "#c9a84c",
              color: "#000",
              border: "none",
              borderRadius: "2px",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Oddajam naročilo…" : "Potrdi naročilo"}
          </button>
        </form>
      </div>
    );
  }

  // ── Default summary view ────────────────────────────────────────
  return (
    <div
      className="md:sticky md:top-[88px]"
      style={containerStyle}
    >
      <h2 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "14px", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.1em",
        color: "#fff", margin: "0 0 20px 0",
      }}>
        Povzetek naročila
      </h2>

      {/* Subtotal */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
          Vmesni seštevek
        </span>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 700, color: "#fff" }}>
          {formatPrice(sub)}
        </span>
      </div>

      {/* Shipping */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
          Dostava
        </span>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: freeShipping ? "#4ade80" : "#fff" }}>
          {freeShipping ? "Brezplačno" : formatPrice(9.9)}
        </span>
      </div>
      {!freeShipping && (
        <p style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "12px", color: "rgba(255,255,255,0.35)",
          margin: "0 0 14px 0", textAlign: "right",
        }}>
          Brezplačna dostava nad 200 €
        </p>
      )}
      {freeShipping && <div style={{ marginBottom: "14px" }} />}

      {/* Total */}
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
          fontSize: "20px", fontWeight: 800,
          color: "#c9a84c",
        }}>
          {formatPrice(total)}
        </span>
      </div>

      {/* Bank transfer button */}
      <button
        onClick={handleShowBankForm}
        disabled={items.length === 0}
        style={{
          width: "100%",
          padding: "16px",
          backgroundColor: "#c9a84c",
          color: "#000",
          border: "none",
          borderRadius: "2px",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "14px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          cursor: items.length === 0 ? "not-allowed" : "pointer",
          opacity: items.length === 0 ? 0.55 : 1,
          marginBottom: "10px",
          transition: "background-color 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
        Plačilo z bančnim nakazilom
      </button>

      {/* WhatsApp button */}
      <WhatsAppOrderButton items={items} subtotal={sub} />
    </div>
  );
}
