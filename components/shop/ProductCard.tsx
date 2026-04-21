"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useUiStore } from "@/lib/ui-store";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

interface Props {
  product: Product;
  onQuickView?: (p: Product) => void;
}

export function ProductCard({ product, onQuickView }: Props) {
  const [hovering, setHovering] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);
  const lang = useLanguageStore((s) => s.lang);
  const t = translations[lang].cart;

  const image = product.images[0] ?? "";

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image,
      quantity: 1,
      slug: product.slug,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
    openCart();
  }

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  }

  return (
    <div
      style={{ display: "block", position: "relative" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Link href={`/shop/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
        {/* Image container */}
        <div style={{
          position: "relative",
          aspectRatio: "1 / 1",
          backgroundColor: "#f5f5f5",
          overflow: "hidden",
          marginBottom: "14px",
        }}>
          {image ? (
            <Image
              src={image}
              alt={product.name}
              width={300}
              height={300}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.4s ease",
                transform: hovering ? "scale(1.05)" : "scale(1)",
              }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "#1a1a1a",
            }}>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: "11px",
                fontWeight: 800, letterSpacing: "0.12em", color: "#c9a84c",
              }}>
                SLOPEPS
              </span>
            </div>
          )}

          {/* Out-of-stock badge */}
          {product.stock === 0 && (
            <span style={{
              position: "absolute", top: "10px", left: "10px",
              backgroundColor: "#e53935", color: "#fff",
              fontSize: "10px", fontWeight: 700,
              fontFamily: "var(--font-montserrat)",
              textTransform: "uppercase", letterSpacing: "0.06em",
              padding: "3px 8px", borderRadius: "2px",
            }}>
              {t.outOfStock}
            </span>
          )}

          {/* Hover overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "10px",
            opacity: hovering ? 1 : 0,
            transition: "opacity 0.22s ease",
          }}>
            {onQuickView && (
              <button
                onClick={handleQuickView}
                title="Hitri ogled"
                style={{
                  width: "40px", height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c9a84c")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
              >
                <Eye size={16} color="#111" />
              </button>
            )}
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                title={t.addToCart}
                style={{
                  width: "40px", height: "40px",
                  borderRadius: "50%",
                  backgroundColor: justAdded ? "#4ade80" : "#c9a84c",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                <ShoppingCart size={16} color="#000" />
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        {product.category && (
          <p style={{
            fontFamily: "var(--font-opensans)", fontSize: "11px",
            color: "#999", textTransform: "uppercase",
            letterSpacing: "0.08em", margin: "0 0 4px 0",
          }}>
            {product.category}
          </p>
        )}

        <h2 style={{
          fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700,
          color: "#111", margin: "0 0 6px 0", lineHeight: 1.4,
          textTransform: "uppercase", letterSpacing: "0.04em",
          transition: "color 0.2s",
          ...(hovering ? { color: "#c9a84c" } : {}),
        }}>
          {product.name}
        </h2>

        <span style={{
          display: "block",
          fontFamily: "var(--font-montserrat)", fontSize: "15px",
          fontWeight: 700, color: "#c9a84c",
        }}>
          {formatPrice(product.price)}
        </span>
      </Link>

      {/* Add to cart text button below card */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        style={{
          marginTop: "10px", width: "100%",
          padding: "8px 0",
          backgroundColor: "transparent",
          border: `1px solid ${product.stock === 0 ? "#ddd" : "#c9a84c"}`,
          borderRadius: "3px",
          fontFamily: "var(--font-montserrat)",
          fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: justAdded ? "#4ade80" : product.stock === 0 ? "#bbb" : "#c9a84c",
          cursor: product.stock === 0 ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          if (product.stock > 0) {
            e.currentTarget.style.backgroundColor = "#c9a84c";
            e.currentTarget.style.color = "#000";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = justAdded ? "#4ade80" : product.stock === 0 ? "#bbb" : "#c9a84c";
        }}
      >
        {justAdded ? t.added : product.stock === 0 ? t.outOfStock : t.addToCart}
      </button>
    </div>
  );
}
