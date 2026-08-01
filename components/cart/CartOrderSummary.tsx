"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { SHIPPING, calculateShipping } from "@/lib/config/shipping";
import { VAT_RATE, getVatPortion } from "@/lib/config/tax";
import { calculateCartSubtotal, computeDiscountAmount } from "@/lib/pricing";
import { usePromoStore } from "@/lib/promo-store";
import { FreeShippingProgress } from "./FreeShippingProgress";
import { PromoCodeInput } from "./PromoCodeInput";

export function CartOrderSummary() {
  const items = useCartStore((s) => s.items);
  const router = useRouter();
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const t = mounted ? translations[lang].cart : translations.sl.cart;
  const tc = mounted ? translations[lang].checkout : translations.sl.checkout;

  const { promo } = usePromoStore();

  const subtotal = calculateCartSubtotal(items);
  const discountAmount = promo ? computeDiscountAmount(promo.type, promo.value, subtotal) : 0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingCost = calculateShipping(subtotalAfterDiscount);
  const freeShipping = shippingCost === 0;
  const total = subtotalAfterDiscount + shippingCost;
  const vatPortion = getVatPortion(total);

  const containerStyle: React.CSSProperties = {
    backgroundColor: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    borderRadius: "6px",
    padding: "24px",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  };

  return (
    <div className="md:sticky md:top-[88px]" style={containerStyle}>
      <h2 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "14px", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.1em",
        color: "var(--color-text)", margin: "0 0 20px 0",
      }}>
        {tc.orderSummary}
      </h2>

      <FreeShippingProgress subtotal={subtotalAfterDiscount} />
      <PromoCodeInput subtotal={subtotal} />

      <div style={rowStyle}>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "var(--color-text-muted)" }}>
          {t.subtotal}
        </span>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 700, color: "var(--color-text)" }}>
          {formatPrice(subtotal)}
        </span>
      </div>

      {promo && discountAmount > 0 && (
        <div style={rowStyle}>
          <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "var(--color-success)" }}>
            {tc.discountLabel} ({promo.code})
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
        marginBottom: "24px",
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

      <button
        onClick={() => router.push("/blagajna")}
        disabled={items.length === 0}
        style={{
          width: "100%",
          padding: "16px",
          backgroundColor: "var(--color-accent)",
          color: "var(--color-on-accent)",
          border: "none",
          borderRadius: "2px",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 800,
          fontSize: "14px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          cursor: items.length === 0 ? "not-allowed" : "pointer",
          opacity: items.length === 0 ? 0.55 : 1,
          transition: "background-color 0.2s",
        }}
      >
        {tc.goToCheckout}
      </button>
    </div>
  );
}
