"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useUiStore } from "@/lib/ui-store";
import { useLanguageStore, Lang } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useUiStore((s) => s.openCart);
  const lang = useLanguageStore((s) => s.lang);
  const setLang = useLanguageStore((s) => s.setLang);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const t = translations[lang].nav;

  const navLinks = [
    { label: t.home,    href: "/" },
    { label: t.shop,    href: "/shop" },
    { label: t.blog,    href: "/blog" },
    { label: t.about,   href: "/about" },
    { label: t.contact, href: "/contact" },
  ];

  function LangToggle({ size = "sm" }: { size?: "sm" | "lg" }) {
    const fontSize = size === "lg" ? "14px" : "11px";
    return (
      <div style={{
        display: "flex", alignItems: "center",
        border: "1px solid rgba(201,168,76,0.35)",
        borderRadius: "4px", overflow: "hidden",
      }}>
        {(["sl", "en"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              background: lang === l ? "#c9a84c" : "transparent",
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-montserrat)",
              fontSize,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: lang === l ? "#000" : "rgba(255,255,255,0.55)",
              padding: size === "lg" ? "7px 16px" : "4px 9px",
              transition: "background 0.15s, color 0.15s",
              textTransform: "uppercase",
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "#0a0a0a",
        borderBottom: "1px solid rgba(201,168,76,0.18)",
      }}
    >
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

        {/* Col 2: Nav links — desktop only */}
        <nav className="hidden md:flex justify-center items-center gap-7">
          {navLinks.map(({ label, href }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  color: isActive ? "#c9a84c" : "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  paddingBottom: "4px",
                  borderBottom: isActive ? "2px solid #c9a84c" : "2px solid transparent",
                  transition: "color 0.2s, border-color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Col 3: Right icons */}
        <div className="flex justify-end items-center gap-3">
          {/* Language toggle — desktop */}
          <div className="hidden md:block">
            {mounted && <LangToggle />}
          </div>

          {/* Cart button */}
          <button
            onClick={openCart}
            aria-label="Košarica"
            className="relative flex items-center"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.65)",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ShoppingCart size={20} />
            {mounted && totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "#c9a84c",
                  color: "#000",
                  fontSize: "10px",
                  fontWeight: 700,
                  fontFamily: "var(--font-montserrat)",
                  width: "17px",
                  height: "17px",
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
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="flex items-center justify-center md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Zapri meni" : "Odpri meni"}
            aria-expanded={menuOpen}
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

      {/* Mobile dropdown */}
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
                key={href}
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

          {/* Language toggle in mobile menu */}
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
            }}>
              Jezik / Language
            </span>
            {mounted && <LangToggle size="lg" />}
          </div>
        </div>
      )}
    </header>
  );
}
