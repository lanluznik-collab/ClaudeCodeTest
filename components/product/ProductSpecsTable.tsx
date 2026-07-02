"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { Product } from "@/types";

export function ProductSpecsTable({ product }: { product: Product }) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tl = mounted ? translations[lang] : translations.sl;

  const rows = [
    { label: tl.prodSpecAmount, value: product.amount_mg },
    { label: tl.prodSpecPurity, value: product.purity },
    { label: tl.prodSpecAnalysis, value: product.analysis_method },
    { label: tl.prodSpecStorage, value: product.storage_temp },
    { label: tl.prodSpecForm, value: product.form },
  ].filter((row) => row.value);

  if (rows.length === 0) return null;

  return (
    <div style={{ marginBottom: "48px" }}>
      <h3
        style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "15px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#fff",
          margin: "0 0 16px 0",
        }}
      >
        {tl.prodSpecsTitle}
      </h3>
      <div
        style={{
          border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: "6px",
          overflow: "hidden",
          maxWidth: "560px",
        }}
      >
        {rows.map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              backgroundColor: i % 2 === 0 ? "rgba(201,168,76,0.04)" : "transparent",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#c9a84c",
                padding: "12px 16px",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-opensans)",
                fontSize: "14px",
                color: "rgba(255,255,255,0.85)",
                padding: "12px 16px",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
