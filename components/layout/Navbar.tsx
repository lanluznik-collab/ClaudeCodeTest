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
    <header className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between relative">

        {/* Logo — left */}
        <Link href="/" className="text-white font-black tracking-[0.2em] uppercase text-lg flex-shrink-0">
          STORE
        </Link>

        {/* Nav links — center (absolute so they stay truly centered) */}
        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: "About Us", href: "/shop" },
            { label: "Contact", href: "/shop" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 hover:text-white transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Icons — right */}
        <div className="flex items-center gap-5">
          <button aria-label="Search" className="text-white/70 hover:text-white transition-colors">
            <Search className="w-[18px] h-[18px]" />
          </button>
          <button aria-label="Account" className="text-white/70 hover:text-white transition-colors">
            <User className="w-[18px] h-[18px]" />
          </button>
          <Link href="/cart" aria-label="Cart" className="relative text-white/70 hover:text-white transition-colors">
            <ShoppingCart className="w-[18px] h-[18px]" />
            {mounted && totalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#C9A84C] text-black text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                {totalItems()}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}
