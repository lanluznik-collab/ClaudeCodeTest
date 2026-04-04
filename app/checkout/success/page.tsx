"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-6" />
      <h1 className="text-2xl font-semibold mb-3">Order confirmed!</h1>
      <p className="text-gray-400 mb-8">
        Thank you for your purchase. You will receive an email confirmation
        shortly.
      </p>
      <Link
        href="/shop"
        className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
