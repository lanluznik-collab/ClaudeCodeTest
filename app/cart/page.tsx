"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-gray-400 mb-6">Your cart is empty.</p>
        <Link
          href="/shop"
          className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}
        </div>
        <CartSummary />
      </div>
    </div>
  );
}
