"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "#0a0a0a",
        borderBottom: "1px solid rgba(201,168,76,0.18)",
      }}
    >
      {/* 3-column grid: logo | nav links | icons — no absolute positioning */}
      <div
        className="grid grid-cols-3 items-center px-4 mx-auto"
        style={{ maxWidth: "1200px", height: "64px" }}
      >
        {/* Col 1: Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 900,
            fontSize: "20px",
            letterSpacing: "0.15em",
            color: "#c9a84c",
            textDecoration: "none",
          }}
        >
          SLOPEPS
        </Link>

        {/* Col 2: Nav links — hidden on mobile, flex on desktop */}
        {/* NOTE: no display in inline style — Tailwind hidden/md:flex controls it */}
        <nav className="hidden md:flex justify-center items-center gap-8">
          {navLinks.map(({ label, href }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  color: isActive ? "#c9a84c" : "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  paddingBottom: "4px",
                  borderBottom: isActive ? "2px solid #c9a84c" : "2px solid transparent",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Col 3: Icons — cart always, hamburger mobile only */}
        <div className="flex justify-end items-center gap-4">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            <ShoppingCart size={20} />
            {mounted && totalItems > 0 && (
              <span
                style={{
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
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger — mobile only */}
          {/* NOTE: no display in inline style here — flex + md:hidden controls visibility */}
          <button
            className="flex items-center justify-center md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Zapri meni" : "Odpri meni"}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.8)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown — only renders when menuOpen */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: "#111111",
            borderTop: "1px solid rgba(201,168,76,0.18)",
          }}
        >
          {navLinks.map(({ label, href }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: isActive ? "#c9a84c" : "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  padding: "16px 24px",
                  borderLeft: isActive ? "3px solid #c9a84c" : "3px solid transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
