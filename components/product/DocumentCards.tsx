"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { Product } from "@/types";

function DocumentCard({
  title,
  action,
  url,
}: {
  title: string;
  action: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        border: "1px solid rgba(201,168,76,0.25)",
        borderRadius: "6px",
        textDecoration: "none",
        transition: "border-color 0.2s, background-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#c9a84c";
        e.currentTarget.style.backgroundColor = "rgba(201,168,76,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: "36px",
          height: "36px",
          borderRadius: "4px",
          backgroundColor: "rgba(201,168,76,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c9a84c",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "13px",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 2px 0",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "12px",
            color: "#c9a84c",
            margin: 0,
          }}
        >
          {action}
        </p>
      </div>
    </a>
  );
}

export function DocumentCards({ product }: { product: Product }) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tl = mounted ? translations[lang] : translations.sl;

  // Reuse existing COA image data if no dedicated coa_url has been set.
  const coaUrl = product.coa_url ?? product.coa_images?.[0] ?? null;

  if (!coaUrl && !product.msds_url) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {coaUrl && (
        <DocumentCard title={tl.prodDocCoaTitle} action={tl.prodDocCoaAction} url={coaUrl} />
      )}
      {product.msds_url && (
        <DocumentCard title={tl.prodDocMsdsTitle} action={tl.prodDocMsdsAction} url={product.msds_url} />
      )}
    </div>
  );
}
