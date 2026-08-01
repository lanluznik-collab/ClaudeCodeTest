"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { SHIPPING } from "@/lib/config/shipping";
import { VAT_RATE, getVatPortion } from "@/lib/config/tax";
import { PaymentMethodId } from "@/lib/config/payment";

interface Props {
  subtotal: number;
  discountAmount: number;
  discountCode: string | null;
  shippingCost: number;
  codSurcharge: number;
  paymentMethod: PaymentMethodId;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string;
}

export function CheckoutOrderSummary({
  subtotal,
  discountAmount,
  discountCode,
  shippingCost,
  codSurcharge,
  paymentMethod,
  onSubmit,
  submitting,
  submitError,
}: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const t = mounted ? translations[lang].cart : translations.sl.cart;
  const tc = mounted ? translations[lang].checkout : translations.sl.checkout;

  const total = Math.max(0, subtotal - discountAmount) + shippingCost + codSurcharge;
  const vatPortion = getVatPortion(total);
  const freeShipping = shippingCost === 0;

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  };

  return (
    <div
      className="md:sticky md:top-[88px]"
      style={{
        backgroundColor: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "6px",
        padding: "24px",
      }}
    >
      <h2 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "14px", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.1em",
        color: "var(--color-text)", margin: "0 0 20px 0",
      }}>
        {tc.orderSummary}
      </h2>

      <div style={rowStyle}>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "var(--color-text-muted)" }}>
          {t.subtotal}
        </span>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 700, color: "var(--color-text)" }}>
          {formatPrice(subtotal)}
        </span>
      </div>

      {discountAmount > 0 && (
        <div style={rowStyle}>
          <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "var(--color-success)" }}>
            {tc.discountLabel} {discountCode ? `(${discountCode})` : ""}
          </span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 700, color: "var(--color-success)" }}>
            −{formatPrice(discountAmount)}
          </span>
        </div>
      )}

      <div style={rowStyle}>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "var(--color-text-muted)" }}>
          {t.shipping}
        </span>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: freeShipping ? "var(--color-success)" : "var(--color-text)" }}>
          {freeShipping ? t.freeShipping : formatPrice(SHIPPING.price)}
        </span>
      </div>

      {codSurcharge > 0 && (
        <div style={rowStyle}>
          <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "var(--color-text-muted)" }}>
            {tc.codSurchargeLabel}
          </span>
          <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "var(--color-text)" }}>
            {formatPrice(codSurcharge)}
          </span>
        </div>
      )}

      <div style={{ ...rowStyle, marginBottom: "16px" }}>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "12px", color: "var(--color-text-faint)" }}>
          {tc.vatLabel} ({Math.round(VAT_RATE * 100)}%, {mounted && lang === "en" ? "included" : "vključen"})
        </span>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "12px", color: "var(--color-text-muted)" }}>
          {formatPrice(vatPortion)}
        </span>
      </div>

      <div style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: "16px",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
      }}>
        <span style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "14px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.08em",
          color: "var(--color-text)",
        }}>
          {t.total}
        </span>
        <span style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "20px", fontWeight: 800,
          color: "var(--color-accent-text)",
        }}>
          {formatPrice(total)}
        </span>
      </div>

      {submitError && (
        <p style={{
          fontFamily: "var(--font-opensans)", fontSize: "13px", color: "var(--color-danger)",
          margin: "0 0 14px 0", lineHeight: 1.5,
        }}>
          {submitError}
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={submitting}
        style={{
          width: "100%",
          padding: "16px",
          backgroundColor: submitting ? "var(--color-accent-hover)" : "var(--color-accent)",
          color: "var(--color-on-accent)",
          border: "none",
          borderRadius: "2px",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "14px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          cursor: submitting ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
          marginBottom: "18px",
        }}
      >
        {submitting ? tc.submitting : tc.confirmOrder}
      </button>

      {/* Trust badges */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
        {[
          { icon: Lock, label: "SSL" },
          { icon: ShieldCheck, label: tc.trustSecurePayment },
          { icon: EyeOff, label: tc.trustPrivacy },
        ].map(({ icon: Icon, label }) => (
          <div key={label} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: "6px", padding: "10px 4px",
            border: "1px solid var(--color-border)", borderRadius: "4px",
          }}>
            <Icon size={16} color="var(--color-accent-text)" />
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.05em",
              color: "var(--color-text-muted)", textAlign: "center",
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
