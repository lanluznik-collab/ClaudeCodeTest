"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      quantity: qty,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (product.stock === 0) {
    return (
      <button disabled style={{
        width: "100%",
        padding: "15px",
        backgroundColor: "#eee",
        color: "#aaa",
        border: "none",
        borderRadius: "2px",
        fontFamily: "var(--font-montserrat)",
        fontWeight: 700, fontSize: "13px",
        textTransform: "uppercase", letterSpacing: "0.1em",
        cursor: "not-allowed",
      }}>
        Ni na zalogi
      </button>
    );
  }

  return (
    <div>
      {/* Qty selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <span style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: "#555",
        }}>
          Količina
        </span>
        <div style={{
          display: "flex", alignItems: "center",
          border: "1px solid #ddd", borderRadius: "4px",
          overflow: "hidden",
        }}>
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            style={{
              width: "36px", height: "36px",
              background: "none", border: "none",
              color: "#555", fontSize: "18px",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            −
          </button>
          <span style={{
            padding: "0 14px",
            fontFamily: "var(--font-montserrat)",
            fontSize: "14px", fontWeight: 700,
            color: "#111", minWidth: "32px",
            textAlign: "center",
          }}>
            {qty}
          </span>
          <button
            onClick={() => setQty(Math.min(product.stock, qty + 1))}
            style={{
              width: "36px", height: "36px",
              background: "none", border: "none",
              color: "#555", fontSize: "18px",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            +
          </button>
        </div>
        <span style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "12px", color: "#aaa",
        }}>
          {product.stock} v zalogi
        </span>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: added ? "#888" : "#c9a84c",
          color: added ? "#fff" : "#000",
          border: "none",
          borderRadius: "2px",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700, fontSize: "13px",
          textTransform: "uppercase", letterSpacing: "0.1em",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
      >
        {added ? "Dodano v košarico ✓" : "Dodaj v košarico"}
      </button>
    </div>
  );
}
