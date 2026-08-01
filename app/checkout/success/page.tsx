"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

const BANK_NAME = "SloPeps";
const BANK_IBAN = "SI56 0440 3026 6483 426";
const BANK_BIC = "KBMASI2X";

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [total, setTotal] = useState<string | null>(null);
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tc = mounted ? translations[lang].checkout : translations.sl.checkout;

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
        backgroundColor: "var(--color-accent-wash)",
        border: "2px solid var(--color-accent-text)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 28px",
        fontSize: "28px",
        color: "var(--color-accent-text)",
      }}>
        ✓
      </div>

      <h1 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "24px", fontWeight: 900,
        textTransform: "uppercase", letterSpacing: "0.06em",
        color: "var(--color-brand)", marginBottom: "16px",
      }}>
        {tc.thankYou}
      </h1>

      <p style={{
        fontFamily: "var(--font-opensans)",
        fontSize: "15px", color: "var(--color-text-muted)",
        lineHeight: 1.7, marginBottom: "36px",
      }}>
        {tc.thankYouBody}
      </p>

      {/* Bank details box */}
      <div style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "6px",
        padding: "24px",
        marginBottom: "36px",
        textAlign: "left",
      }}>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "var(--color-accent-text)", margin: "0 0 16px 0",
        }}>
          {tc.transferDetails}
        </p>

        {[
          [tc.recipient, BANK_NAME],
          [tc.iban, BANK_IBAN],
          [tc.bic, BANK_BIC],
          ...(orderRef ? [[tc.reference, orderRef]] : []),
          ...(total ? [[tc.amount, `${parseFloat(total).toFixed(2)} €`]] : []),
        ].map(([label, value]) => (
          <div key={label} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            padding: "8px 0",
            borderBottom: "1px solid var(--color-border)",
          }}>
            <span style={{
              fontFamily: "var(--font-opensans)",
              fontSize: "13px", color: "var(--color-text-muted)",
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "13px", fontWeight: 700,
              color: label === tc.reference ? "var(--color-accent-text)" : "var(--color-text)",
              textAlign: "right",
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: "var(--font-opensans)",
        fontSize: "13px", color: "var(--color-text-faint)",
        lineHeight: 1.6, marginBottom: "36px",
      }}>
        {tc.confirmationEmailNote}
      </p>

      <Link href="/shop" style={{
        display: "inline-block",
        padding: "14px 36px",
        backgroundColor: "var(--color-accent)",
        color: "var(--color-on-accent)",
        fontFamily: "var(--font-montserrat)",
        fontWeight: 700, fontSize: "13px",
        textTransform: "uppercase", letterSpacing: "0.1em",
        textDecoration: "none",
        borderRadius: "2px",
      }}>
        {tc.backToShop}
      </Link>
    </div>
  );
}
