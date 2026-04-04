"use client";

import Link from "next/link";
import { ShoppingCart, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";

const navLinks = [
  { label: "Home",     href: "/" },
  { label: "Shop",     href: "/shop" },
  { label: "About Us", href: "/shop" },
  { label: "Contact",  href: "/shop" },
];

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);
  useEffect(() => setMounted(true), []);

  return (
    <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>

        {/* Logo — left */}
        <Link href="/" style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 900,
          fontSize: "20px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#222",
          textDecoration: "none",
        }}>
          STORE
        </Link>

        {/* Nav links — center */}
        <nav style={{ display: "flex", alignItems: "center", gap: "36px", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href} style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "rgba(0,0,0,0.6)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#000")}
              onMouseOut={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.6)")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Icons — right */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button aria-label="Search" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.6)", padding: 0 }}>
            <Search style={{ width: "20px", height: "20px" }} />
          </button>
          <button aria-label="Account" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.6)", padding: 0 }}>
            <User style={{ width: "20px", height: "20px" }} />
          </button>
          <Link href="/cart" aria-label="Cart" style={{ position: "relative", color: "rgba(0,0,0,0.6)", textDecoration: "none" }}>
            <ShoppingCart style={{ width: "20px", height: "20px" }} />
            {mounted && totalItems() > 0 && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "#9d6b2a",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 700,
                borderRadius: "50%",
                width: "17px",
                height: "17px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-montserrat)",
              }}>
                {totalItems()}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}
