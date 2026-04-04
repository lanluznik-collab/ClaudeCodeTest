"use client";

import Link from "next/link";
import { ShoppingCart, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">

        {/* Logo — left */}
        <Link href="/" className="text-white font-black tracking-widest uppercase text-sm">
          Store
        </Link>

        {/* Nav links — center */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/shop" className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors font-medium">
            Shop
          </Link>
          <Link href="/shop" className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors font-medium">
            Products
          </Link>
          <Link href="/shop" className="text-xs uppercase tracking-widest text-gray-300 hover:text-white transition-colors font-medium">
            About
          </Link>
        </nav>

        {/* Icons — right */}
        <div className="flex items-center gap-4">
          <button className="text-gray-300 hover:text-white transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors">
            <User className="w-4 h-4" />
          </button>
          <Link href="/cart" className="relative text-gray-300 hover:text-white transition-colors">
            <ShoppingCart className="w-4 h-4" />
            {mounted && totalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {totalItems()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
