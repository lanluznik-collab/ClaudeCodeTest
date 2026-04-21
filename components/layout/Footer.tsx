"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

const paymentMethods = ["Mastercard", "Visa", "Amex", "Bank Transfer"];

export function Footer() {
  const [mounted, setMounted] = useState(false);
  const lang = useLanguageStore((s) => s.lang);
  useEffect(() => setMounted(true), []);

  const t = mounted ? translations[lang].footer : translations.sl.footer;
  const links = mounted ? translations[lang].links : translations.sl.links;

  return (
    <footer style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
      <div
        className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10 md:gap-12"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 40px" }}
      >
        {/* Left: Logo + Disclaimer */}
        <div>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 900, fontSize: "22px",
            letterSpacing: "0.15em", color: "#c9a84c",
            margin: "0 0 20px 0",
          }}>
            SLOPEPS
          </p>
          <p style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "13px", fontStyle: "italic",
            color: "#c9a84c", lineHeight: 1.75, margin: "0 0 14px 0",
          }}>
            {t.disclaimer}
          </p>
          <p style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "12px", color: "rgba(255,255,255,0.35)",
            lineHeight: 1.75, margin: "0 0 14px 0",
          }}>
            {t.legal}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "10px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.22)", margin: 0,
          }}>
            {t.fine}
          </p>
        </div>

        {/* Middle: Quick Links */}
        <div>
          <h3 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "12px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: "#fff", margin: "0 0 20px 0",
          }}>
            {t.quickLinks}
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} style={{
                  fontFamily: "var(--font-opensans)",
                  fontSize: "13px", color: "rgba(255,255,255,0.5)",
                  textDecoration: "none", transition: "color 0.2s",
                }}
                  className="hover:text-[#c9a84c]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Payment methods */}
        <div>
          <h3 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "12px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: "#fff", margin: "0 0 20px 0",
          }}>
            {t.payments}
          </h3>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "10px" }}>
            {paymentMethods.map((card) => (
              <div key={card} style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px", padding: "8px 12px", minWidth: "80px",
              }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.05em", color: "rgba(255,255,255,0.65)",
                  whiteSpace: "nowrap",
                }}>
                  {card}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 24px", textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "12px", color: "rgba(255,255,255,0.28)", margin: 0,
        }}>
          {t.copyright}
        </p>
      </div>
    </footer>
  );
}
