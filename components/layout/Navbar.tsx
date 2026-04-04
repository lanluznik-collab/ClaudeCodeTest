"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Store
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <Link href="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-1.5 text-sm hover:text-black transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {mounted && totalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {totalItems()}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
