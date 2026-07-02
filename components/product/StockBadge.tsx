"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

export function StockBadge({ inStock }: { inStock: boolean }) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tl = mounted ? translations[lang] : translations.sl;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "100px",
        fontFamily: "var(--font-montserrat)",
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: "10px",
        color: inStock ? "#4ade80" : "#f87171",
        backgroundColor: inStock ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: inStock ? "#4ade80" : "#f87171",
        }}
      />
      {inStock ? tl.prodInStock : tl.prodOutOfStock}
    </span>
  );
}
