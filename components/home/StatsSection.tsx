"use client";

import { useEffect, useState } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

export function StatsSection() {
  const [mounted, setMounted] = useState(false);
  const lang = useLanguageStore((s) => s.lang);
  useEffect(() => setMounted(true), []);

  const stats = mounted
    ? translations[lang].home.stats
    : translations.sl.home.stats;

  // Also show partner logo in this section
  return (
    <section style={{ backgroundColor: "#0f2744" }}>
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 24px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-0"
      >
        {stats.map(({ value, label }, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              padding: "32px 16px",
              borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
            className={[
              i % 2 === 1 ? "!border-r-0 md:!border-r" : "",
              i === stats.length - 1 ? "!border-r-0" : "",
            ].join(" ")}
          >
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900, color: "#c9a84c",
              margin: "0 0 8px 0", lineHeight: 1,
            }}>
              {value}
            </p>
            <p style={{
              fontFamily: "var(--font-opensans)",
              fontSize: "13px", color: "rgba(255,255,255,0.6)",
              margin: 0, lineHeight: 1.4,
            }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Partner logo row */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "28px 24px",
        display: "flex", justifyContent: "center", alignItems: "center", gap: "40px",
      }}>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "10px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.3)", margin: 0, whiteSpace: "nowrap",
        }}>
          {mounted && lang === "en" ? "Certified by" : "Certificirano od"}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/partner-logo.png"
          alt="Partner"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
          style={{ height: "36px", width: "auto", opacity: 0.55, filter: "brightness(0) invert(1)" }}
        />
      </div>
    </section>
  );
}
