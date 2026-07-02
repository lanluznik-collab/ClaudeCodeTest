"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

export default function CancelPage() {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tc = mounted ? translations[lang].checkout : translations.sl.checkout;

  return (
    <div style={{
      maxWidth: "500px", margin: "0 auto",
      padding: "96px 24px", textAlign: "center",
    }}>
      <p style={{ fontSize: "40px", marginBottom: "24px" }}>×</p>
      <h1 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "22px", fontWeight: 900,
        textTransform: "uppercase", letterSpacing: "0.06em",
        color: "#fff", marginBottom: "12px",
      }}>
        {tc.orderCancelled}
      </h1>
      <p style={{
        fontFamily: "var(--font-opensans)",
        fontSize: "15px", color: "rgba(255,255,255,0.45)",
        lineHeight: 1.7, marginBottom: "36px",
      }}>
        {tc.cartStillSaved}
      </p>
      <Link href="/cart" style={{
        display: "inline-block",
        padding: "14px 36px",
        backgroundColor: "#c9a84c",
        color: "#fff",
        fontFamily: "var(--font-montserrat)",
        fontWeight: 700, fontSize: "13px",
        textTransform: "uppercase", letterSpacing: "0.1em",
        textDecoration: "none",
        borderRadius: "2px",
      }}>
        {tc.backToCart}
      </Link>
    </div>
  );
}
