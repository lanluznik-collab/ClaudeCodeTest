"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";

const BANK_NAME = "SloPeps";
const BANK_IBAN = "YOUR_IBAN_HERE";
const BANK_BIC = "YOUR_BIC_HERE";

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [total, setTotal] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
    try {
      const stored = localStorage.getItem("last_order");
      if (stored) {
        const { order_ref, total: t } = JSON.parse(stored);
        setOrderRef(order_ref);
        setTotal(t);
        localStorage.removeItem("last_order");
      }
    } catch {
      // ignore parse errors
    }
  }, [clearCart]);

  return (
    <div style={{
      maxWidth: "540px", margin: "0 auto",
      padding: "80px 24px", textAlign: "center",
    }}>
      {/* Checkmark */}
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
        Hvala za vaše naročilo!
      </h1>

      <p style={{
        fontFamily: "var(--font-opensans)",
        fontSize: "15px", color: "rgba(255,255,255,0.6)",
        lineHeight: 1.7, marginBottom: "36px",
      }}>
        Prosimo nakažite znesek na spodnje bančne podatke.
        Vaše naročilo bo odposlano po prejemu plačila.
      </p>

      {/* Bank details box */}
      <div style={{
        backgroundColor: "#161616",
        border: "1px solid rgba(201,168,76,0.25)",
        borderRadius: "6px",
        padding: "24px",
        marginBottom: "36px",
        textAlign: "left",
      }}>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "#c9a84c", margin: "0 0 16px 0",
        }}>
          Podatki za bančno nakazilo
        </p>

        {[
          ["Prejemnik", BANK_NAME],
          ["IBAN", BANK_IBAN],
          ["BIC / SWIFT", BANK_BIC],
          ...(orderRef ? [["Referenca", orderRef]] : []),
          ...(total ? [["Znesek", `${parseFloat(total).toFixed(2)} €`]] : []),
        ].map(([label, value]) => (
          <div key={label} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            padding: "8px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <span style={{
              fontFamily: "var(--font-opensans)",
              fontSize: "13px", color: "rgba(255,255,255,0.4)",
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "13px", fontWeight: 700,
              color: label === "Referenca" ? "#c9a84c" : "#fff",
              textAlign: "right",
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: "var(--font-opensans)",
        fontSize: "13px", color: "rgba(255,255,255,0.35)",
        lineHeight: 1.6, marginBottom: "36px",
      }}>
        Potrditev naročila boste prejeli na vaš e-poštni naslov.
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
