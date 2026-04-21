"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

export function CtaBox() {
  const [mounted, setMounted] = useState(false);
  const lang = useLanguageStore((s) => s.lang);
  useEffect(() => setMounted(true), []);

  const t = mounted ? translations[lang].home.cta : translations.sl.home.cta;

  return (
    <section style={{ backgroundColor: "#fff", padding: "72px 24px 80px" }}>
      <div style={{
        maxWidth: "760px", margin: "0 auto", textAlign: "center",
        backgroundColor: "#0a0a0a",
        borderRadius: "12px",
        padding: "56px 40px",
        border: "1px solid rgba(201,168,76,0.2)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Gold accent line top */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
        }} />

        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.22em",
          color: "#c9a84c", marginBottom: "16px",
        }}>
          SloPeps
        </p>

        <h2 style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          fontWeight: 900, color: "#fff",
          margin: "0 0 16px 0", lineHeight: 1.2,
        }}>
          {t.headline}
        </h2>

        <p style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "15px", lineHeight: 1.75,
          color: "rgba(255,255,255,0.6)",
          margin: "0 0 36px 0",
          maxWidth: "480px", marginLeft: "auto", marginRight: "auto",
        }}>
          {t.sub}
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href={t.href1}
            style={{
              display: "inline-block",
              padding: "14px 32px",
              backgroundColor: "#c9a84c",
              color: "#000",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800, fontSize: "13px",
              textTransform: "uppercase", letterSpacing: "0.1em",
              textDecoration: "none",
              borderRadius: "2px",
            }}
          >
            {t.btn1}
          </Link>

          <Link
            href={t.href2}
            style={{
              display: "inline-block",
              padding: "14px 32px",
              backgroundColor: "transparent",
              color: "#fff",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700, fontSize: "13px",
              textTransform: "uppercase", letterSpacing: "0.1em",
              textDecoration: "none",
              borderRadius: "2px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {t.btn2}
          </Link>
        </div>
      </div>
    </section>
  );
}
