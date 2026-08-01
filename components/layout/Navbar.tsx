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
    { label: "COA Vault", href: "/coa" },
    { label: t.blog,    href: "/blog" },
    { label: t.faq,     href: "/faq" },
    { label: t.about,   href: "/about" },
    { label: t.contact, href: "/contact" },
  ];

  function LangToggle({ size = "sm" }: { size?: "sm" | "lg" }) {
    const fontSize = size === "lg" ? "14px" : "11px";
    return (
      <div style={{
        display: "flex", alignItems: "center",
        border: "1px solid var(--color-border)",
        borderRadius: "4px", overflow: "hidden",
      }}>
        {(["sl", "en"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              background: lang === l ? "var(--color-accent)" : "transparent",
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-montserrat)",
              fontSize,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: lang === l ? "var(--color-on-accent)" : "var(--color-text-muted)",
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
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div
        className="relative flex items-center justify-between px-4 mx-auto"
        style={{ maxWidth: "1200px", height: "64px" }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 900,
            fontSize: "20px",
            letterSpacing: "0.15em",
            color: "var(--color-brand)",
            textDecoration: "none",
          }}
        >
          SLOPEPS
        </Link>

        {/* Nav links — absolutely centered so they never compete with logo/icons for space */}
        <nav className="hidden md:flex items-center gap-5 absolute left-1/2 -translate-x-1/2">
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
                  color: isActive ? "var(--color-accent-text)" : "var(--color-text-muted)",
                  textDecoration: "none",
                  paddingBottom: "4px",
                  borderBottom: isActive ? "2px solid var(--color-accent-text)" : "2px solid transparent",
                  transition: "color 0.2s, border-color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Language toggle — desktop */}
          <div className="hidden md:block">
            {mounted && <LangToggle />}
          </div>

          {/* Cart button */}
          <button
            onClick={openCart}
            aria-label={translations[lang].cart.title}
            className="relative flex items-center"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
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
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-on-accent)",
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
              color: "var(--color-text)",
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
            backgroundColor: "var(--color-bg)",
            borderTop: "1px solid var(--color-border)",
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
                  color: isActive ? "var(--color-accent-text)" : "var(--color-text)",
                  textDecoration: "none",
                  padding: "16px 24px",
                  borderLeft: isActive ? "3px solid var(--color-accent-text)" : "3px solid transparent",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {label}
              </Link>
            );
          })}

          {/* Language toggle in mobile menu */}
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.1em", color: "var(--color-text-faint)",
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
