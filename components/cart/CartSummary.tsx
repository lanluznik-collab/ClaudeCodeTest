"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { WhatsAppOrderButton } from "./WhatsAppOrderButton";

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 space-y-4 sticky top-24">
      <h2 className="text-base font-semibold">Order Summary</h2>

      <div className="flex justify-between text-sm text-gray-500">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal())}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Shipping</span>
        <span className="text-green-600">Free</span>
      </div>

      <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatPrice(subtotal())}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="w-full py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Redirecting…" : "Checkout with Card"}
      </button>

      <WhatsAppOrderButton items={items} subtotal={subtotal()} />
    </div>
  );
}
