"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";
import { StepIndicator } from "@/components/cart/StepIndicator";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const t = mounted ? translations[lang].cart : translations.sl.cart;

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "60vh" }}>
      <StepIndicator current={1} />

      {items.length === 0 ? (
        <div style={{
          maxWidth: "600px", margin: "0 auto",
          padding: "48px 24px 96px",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "16px", color: "rgba(255,255,255,0.45)",
            marginBottom: "28px",
          }}>
            {t.empty}
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
            {t.continueShopping}
          </Link>
        </div>
      ) : (
        <div className="mx-auto px-4 md:px-6 pb-12" style={{ maxWidth: "1200px" }}>
          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "28px", fontWeight: 900,
            textTransform: "uppercase", letterSpacing: "0.06em",
            color: "#c9a84c", marginBottom: "32px",
          }}>
            {t.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 md:gap-12 items-start">
            <div>
              {items.map((item) => (
                <CartLineItem key={item.productId} item={item} />
              ))}
              <div style={{ marginTop: "20px" }}>
                <Link href="/shop" style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "12px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.5)", textDecoration: "none",
                }}>
                  ← {t.continueShopping}
                </Link>
              </div>
            </div>

            <CartOrderSummary />
          </div>
        </div>
      )}
    </div>
  );
}
