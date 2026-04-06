"use client";

import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

const navLinks = [
  { label: "DOMOV",    href: "/" },
  { label: "TRGOVINA", href: "/shop" },
  { label: "O NAS",    href: "/about" },
  { label: "KONTAKT",  href: "/contact" },
];

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const pathname = usePathname();
  useEffect(() => setMounted(true), []);

  return (
    <header style={{
      backgroundColor: "#0a0a0a",
      borderBottom: "1px solid rgba(201,168,76,0.18)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
      }}>

        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 900,
          fontSize: "22px",
          letterSpacing: "0.15em",
          color: "#c9a84c",
          textDecoration: "none",
        }}>
          SLOPEPS
        </Link>

        {/* Nav links — center */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "36px",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
          {navLinks.map(({ label, href }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={label} href={href} style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: isActive ? "#c9a84c" : "rgba(255,255,255,0.7)",
                textDecoration: "none",
                paddingBottom: "4px",
                borderBottom: isActive ? "2px solid #c9a84c" : "2px solid transparent",
                transition: "color 0.2s, border-color 0.2s",
              }}>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right icons — cart + search only */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/cart" style={{
            position: "relative",
            color: "rgba(255,255,255,0.65)",
            display: "flex",
            alignItems: "center",
          }}>
            <ShoppingCart size={20} />
            {mounted && totalItems > 0 && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "#c9a84c",
                color: "#000",
                fontSize: "10px",
                fontWeight: 700,
                fontFamily: "var(--font-montserrat)",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          <button style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.65)",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}>
            <Search size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
