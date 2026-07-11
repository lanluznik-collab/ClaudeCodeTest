"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { COMPANY } from "@/lib/config/company";
import { buildOrderWhatsAppURL } from "@/lib/whatsapp";
import { StepIndicator } from "@/components/cart/StepIndicator";
import { CartItem } from "@/types";

interface OrderConfirmation {
  order_ref: string;
  items: CartItem[];
  subtotal: number;
  shipping_cost: number;
  discount_code: string | null;
  discount_amount: number;
  cod_surcharge: number;
  total: number;
  payment_method: "bank_transfer" | "cod" | "whatsapp";
  language: "sl" | "en";
}

export default function ConfirmationPage() {
  const { order_ref } = useParams<{ order_ref: string }>();
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const t = mounted ? translations[lang] : translations.sl;
  const tc = t.checkout;

  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${order_ref}`)
      .then((res) => {
        if (!res.ok) throw new Error("not_found");
        return res.json();
      })
      .then((data) => setOrder(data))
      .catch(() => setNotFound(true));
  }, [order_ref]);

  async function handleCopyRef() {
    await navigator.clipboard.writeText(order_ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const sectionStyle: React.CSSProperties = {
    backgroundColor: "#161616",
    border: "1px solid rgba(201,168,76,0.15)",
    borderRadius: "6px",
    padding: "24px",
    marginBottom: "20px",
    textAlign: "left",
  };
  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "60vh" }}>
      <StepIndicator current={3} />

      <div className="mx-auto px-4 md:px-6 pb-16" style={{ maxWidth: "560px", textAlign: "center" }}>
        {!mounted || (!order && !notFound) ? null : notFound ? (
          <p style={{ fontFamily: "var(--font-opensans)", fontSize: "15px", color: "rgba(255,255,255,0.6)", padding: "60px 0" }}>
            {tc.orderNotFound}
          </p>
        ) : order ? (
          <>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              backgroundColor: "rgba(201,168,76,0.12)", border: "2px solid #c9a84c",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 28px", fontSize: "28px",
            }}>
              ✓
            </div>

            <h1 style={{
              fontFamily: "var(--font-montserrat)", fontSize: "24px", fontWeight: 900,
              textTransform: "uppercase", letterSpacing: "0.06em",
              color: "#c9a84c", marginBottom: "16px",
            }}>
              {tc.confirmationTitle}
            </h1>

            <div style={sectionStyle}>
              <div style={rowStyle}>
                <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                  {tc.orderNumberLabel}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700, color: "#c9a84c" }}>
                    {order.order_ref}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    style={{
                      background: "none", border: "none", cursor: "pointer", padding: "2px",
                      fontFamily: "var(--font-opensans)", fontSize: "11px",
                      color: "rgba(255,255,255,0.4)", textDecoration: "underline",
                    }}
                  >
                    {copied ? tc.copiedBtn : tc.copyBtn}
                  </button>
                </span>
              </div>

              {order.items.map((item) => (
                <div key={item.productId} style={rowStyle}>
                  <span style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                    {item.name} × {item.quantity}
                  </span>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", color: "#fff" }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div style={{ ...rowStyle, borderBottom: "none", paddingTop: "16px" }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.06em", color: "#fff",
                }}>
                  {t.cart.total}
                </span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "18px", fontWeight: 800, color: "#c9a84c" }}>
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {order.payment_method === "bank_transfer" && (
              <div style={sectionStyle}>
                <p style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "18px" }}>
                  {tc.thankYouBody}
                </p>
                <p style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.1em", color: "#c9a84c", margin: "0 0 12px 0",
                }}>
                  {tc.transferDetails}
                </p>
                {[
                  [tc.recipient, COMPANY.tradingName],
                  [tc.iban, COMPANY.iban],
                  [tc.bic, COMPANY.bic],
                  [tc.reference, order.order_ref],
                  [tc.amount, formatPrice(order.total)],
                ].map(([label, value]) => (
                  <div key={label} style={rowStyle}>
                    <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {order.payment_method === "cod" && (
              <div style={sectionStyle}>
                <p style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                  {tc.codNotice}
                </p>
              </div>
            )}

            {order.payment_method === "whatsapp" && (
              <div style={sectionStyle}>
                <p style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>
                  {tc.whatsappContinueSub}
                </p>
                <a
                  href={buildOrderWhatsAppURL(order)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block", width: "100%", boxSizing: "border-box",
                    padding: "14px", backgroundColor: "#c9a84c", color: "#000",
                    fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "13px",
                    textTransform: "uppercase", letterSpacing: "0.1em",
                    textDecoration: "none", borderRadius: "2px",
                  }}
                >
                  {tc.whatsappContinue}
                </a>
              </div>
            )}

            <p style={{
              fontFamily: "var(--font-opensans)", fontSize: "13px",
              color: "rgba(255,255,255,0.35)", lineHeight: 1.6, marginBottom: "36px",
            }}>
              {tc.confirmationEmailNote}
            </p>

            <Link href="/shop" style={{
              display: "inline-block", padding: "14px 36px",
              backgroundColor: "transparent", border: "1px solid rgba(201,168,76,0.4)",
              color: "#c9a84c", fontFamily: "var(--font-montserrat)",
              fontWeight: 700, fontSize: "13px",
              textTransform: "uppercase", letterSpacing: "0.1em",
              textDecoration: "none", borderRadius: "2px",
            }}>
              {tc.backToShop}
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
