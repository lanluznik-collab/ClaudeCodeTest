"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getTieredUnitPrice, getDiscountPctForQty, getLineTotal } from "@/lib/pricing";
import { X } from "lucide-react";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const t = mounted ? translations[lang].cart : translations.sl.cart;

  const discountPct = getDiscountPctForQty(item.quantity);
  const unitPrice = getTieredUnitPrice(item.price, item.quantity);
  const hasTierDiscount = discountPct > 0;

  return (
    <div style={{
      display: "flex",
      gap: "16px",
      padding: "20px 0",
      borderBottom: "1px solid var(--color-border)",
    }}>
      {/* Thumbnail */}
      <Link href={`/shop/${item.slug}`}>
        <div style={{
          width: "80px", height: "80px",
          backgroundColor: "var(--color-surface)",
          borderRadius: "4px",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {item.image && (
            <Image
              src={item.image}
              alt={item.name}
              width={80} height={80}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
      </Link>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link href={`/shop/${item.slug}`} style={{ textDecoration: "none" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "14px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.04em",
            color: "var(--color-text)", margin: "0 0 4px 0",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {item.name}
          </p>
        </Link>
        <p style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "13px", color: "var(--color-text-muted)",
          margin: "0 0 12px 0",
          display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
        }}>
          {hasTierDiscount ? (
            <>
              <span style={{ textDecoration: "line-through", color: "var(--color-text-faint)" }}>
                {formatPrice(item.price)}
              </span>
              <span style={{ color: "var(--color-success)", fontWeight: 700 }}>{formatPrice(unitPrice)}</span>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700,
                color: "var(--color-success)", backgroundColor: "rgba(74,222,128,0.12)",
                padding: "1px 6px", borderRadius: "100px",
              }}>
                −{discountPct}%
              </span>
              <span>{t.perUnit}</span>
            </>
          ) : (
            <>{formatPrice(item.price)} {t.perUnit}</>
          )}
        </p>

        {/* Qty controls */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          border: "1px solid var(--color-border)",
          borderRadius: "4px", overflow: "hidden",
        }}>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            style={{
              width: "32px", height: "32px",
              background: "none", border: "none",
              color: "var(--color-text-muted)", fontSize: "16px",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            −
          </button>
          <span style={{
            padding: "0 12px",
            fontFamily: "var(--font-montserrat)",
            fontSize: "13px", fontWeight: 700,
            color: "var(--color-text)", minWidth: "28px",
            textAlign: "center",
          }}>
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            style={{
              width: "32px", height: "32px",
              background: "none", border: "none",
              color: "var(--color-text-muted)", fontSize: "16px",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Price + remove */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
        <button
          onClick={() => removeItem(item.productId)}
          style={{
            background: "none", border: "none",
            color: "var(--color-text-faint)", cursor: "pointer",
            padding: "2px", display: "flex",
            transition: "color 0.2s",
          }}
          className="hover:text-[var(--color-danger)]"
        >
          <X size={16} />
        </button>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "15px", fontWeight: 700,
          color: "var(--color-accent-text)", margin: 0,
        }}>
          {formatPrice(getLineTotal(item))}
        </p>
      </div>
    </div>
  );
}
