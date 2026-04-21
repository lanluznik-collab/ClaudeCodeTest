"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useUiStore } from "@/lib/ui-store";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { buildCartOrderURL } from "@/lib/whatsapp";

export function CartSidebar() {
  const cartOpen = useUiStore((s) => s.cartOpen);
  const closeCart = useUiStore((s) => s.closeCart);
  const lang = useLanguageStore((s) => s.lang);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Close on Escape key
  useEffect(() => {
    if (!cartOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [cartOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  if (!mounted) return null;

  const t = translations[lang].cart;
  const sub = subtotal();
  const freeShipping = sub >= 200;
  const shippingCost = freeShipping ? 0 : 9.9;
  const total = sub + shippingCost;
  const whatsappUrl = buildCartOrderURL(items, sub);

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          onClick={closeCart}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 200,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Sidebar panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
          backgroundColor: "#111111",
          borderLeft: "1px solid rgba(201,168,76,0.18)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          willChange: "transform",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBag size={18} color="#c9a84c" />
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "14px", fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: "#fff",
            }}>
              {t.title}
            </span>
            {items.length > 0 && (
              <span style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "11px", fontWeight: 700,
                backgroundColor: "#c9a84c", color: "#000",
                borderRadius: "100px", padding: "1px 8px",
              }}>
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Zapri košarico"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.4)", padding: "4px",
              display: "flex", alignItems: "center",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
          {items.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              height: "100%", gap: "20px", padding: "48px 0",
            }}>
              <ShoppingBag size={40} color="rgba(255,255,255,0.12)" />
              <p style={{
                fontFamily: "var(--font-opensans)",
                fontSize: "15px", color: "rgba(255,255,255,0.4)",
                textAlign: "center", margin: 0,
              }}>
                {t.empty}
              </p>
              <button
                onClick={closeCart}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "12px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  color: "#c9a84c", background: "none", border: "none",
                  cursor: "pointer", padding: 0,
                }}
              >
                {t.continueShopping} →
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: "8px 0 0", margin: 0 }}>
              {items.map((item) => (
                <li key={item.productId} style={{
                  display: "flex",
                  gap: "14px",
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: "70px", height: "70px",
                    backgroundColor: "#1c1c1c",
                    borderRadius: "4px",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={70} height={70}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "13px", fontWeight: 700,
                        color: "#fff", margin: 0,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        flex: 1,
                      }}>
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Odstrani ${item.name}`}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "rgba(255,255,255,0.25)", flexShrink: 0,
                          padding: "2px", display: "flex", alignItems: "center",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#e53935")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <p style={{
                      fontFamily: "var(--font-opensans)",
                      fontSize: "12px", color: "rgba(255,255,255,0.35)",
                      margin: 0,
                    }}>
                      {formatPrice(item.price)} / kos
                    </p>

                    {/* Qty + line price */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{
                        display: "inline-flex", alignItems: "center",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "4px", overflow: "hidden",
                      }}>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          style={{
                            width: "28px", height: "28px",
                            background: "none", border: "none",
                            color: "rgba(255,255,255,0.5)", fontSize: "15px",
                            cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center",
                          }}
                        >
                          −
                        </button>
                        <span style={{
                          padding: "0 10px",
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "13px", fontWeight: 700,
                          color: "#fff", minWidth: "24px", textAlign: "center",
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          style={{
                            width: "28px", height: "28px",
                            background: "none", border: "none",
                            color: "rgba(255,255,255,0.5)", fontSize: "15px",
                            cursor: "pointer", display: "flex",
                            alignItems: "center", justifyContent: "center",
                          }}
                        >
                          +
                        </button>
                      </div>

                      <span style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "14px", fontWeight: 800,
                        color: "#c9a84c",
                      }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only shown when cart has items */}
        {items.length > 0 && (
          <div style={{
            flexShrink: 0,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            {/* Shipping note */}
            {!freeShipping && (
              <p style={{
                fontFamily: "var(--font-opensans)",
                fontSize: "12px", color: "rgba(255,255,255,0.4)",
                textAlign: "center", margin: 0,
              }}>
                {t.freeShippingNote}
              </p>
            )}

            {/* Subtotal row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                {t.subtotal}
              </span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                {formatPrice(sub)}
              </span>
            </div>

            {/* Shipping row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                {t.shipping}
              </span>
              <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: freeShipping ? "#4ade80" : "#fff" }}>
                {freeShipping ? t.freeShipping : formatPrice(9.9)}
              </span>
            </div>

            {/* Total */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "12px", marginTop: "2px",
            }}>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: "13px",
                fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#fff",
              }}>
                {t.total}
              </span>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: "20px",
                fontWeight: 900, color: "#c9a84c",
              }}>
                {formatPrice(total)}
              </span>
            </div>

            {/* View Cart button */}
            <Link
              href="/cart"
              onClick={closeCart}
              style={{
                display: "block", textAlign: "center",
                padding: "14px",
                backgroundColor: "#c9a84c",
                color: "#000",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800, fontSize: "13px",
                textTransform: "uppercase", letterSpacing: "0.1em",
                textDecoration: "none",
                borderRadius: "3px",
                marginTop: "4px",
              }}
            >
              {t.viewCart}
            </Link>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "13px",
                backgroundColor: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700, fontSize: "12px",
                textTransform: "uppercase", letterSpacing: "0.08em",
                textDecoration: "none",
                borderRadius: "3px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#25D366" }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.54 4.064 1.484 5.778L0 24l6.395-1.673A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.368l-.358-.214-3.797.996 1.013-3.7-.233-.378A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
              </svg>
              {t.whatsapp}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
