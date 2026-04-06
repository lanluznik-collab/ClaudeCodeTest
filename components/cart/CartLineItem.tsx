"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { X } from "lucide-react";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div style={{
      display: "flex",
      gap: "16px",
      padding: "20px 0",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}>
      {/* Thumbnail */}
      <Link href={`/shop/${item.slug}`}>
        <div style={{
          width: "80px", height: "80px",
          backgroundColor: "#1a1a1a",
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
            color: "#fff", margin: "0 0 4px 0",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {item.name}
          </p>
        </Link>
        <p style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "13px", color: "rgba(255,255,255,0.4)",
          margin: "0 0 12px 0",
        }}>
          {formatPrice(item.price)} / kos
        </p>

        {/* Qty controls */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "4px", overflow: "hidden",
        }}>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            style={{
              width: "32px", height: "32px",
              background: "none", border: "none",
              color: "rgba(255,255,255,0.5)", fontSize: "16px",
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
            color: "#fff", minWidth: "28px",
            textAlign: "center",
          }}>
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            style={{
              width: "32px", height: "32px",
              background: "none", border: "none",
              color: "rgba(255,255,255,0.5)", fontSize: "16px",
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
            color: "rgba(255,255,255,0.25)", cursor: "pointer",
            padding: "2px", display: "flex",
            transition: "color 0.2s",
          }}
          className="hover:text-white"
        >
          <X size={16} />
        </button>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "15px", fontWeight: 700,
          color: "#c9a84c", margin: 0,
        }}>
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
