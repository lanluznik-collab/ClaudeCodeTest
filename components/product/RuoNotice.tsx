"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

export function RuoNotice() {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tl = mounted ? translations[lang] : translations.sl;

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        backgroundColor: "rgba(201,168,76,0.08)",
        border: "1px solid rgba(201,168,76,0.3)",
        borderRadius: "6px",
        padding: "14px 16px",
        marginTop: "20px",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c9a84c"
        strokeWidth="2"
        style={{ flexShrink: 0, marginTop: "1px" }}
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div>
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#c9a84c",
            margin: "0 0 4px 0",
          }}
        >
          {tl.prodRuoTitle}
        </p>
        <p
          style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "13px",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.75)",
            margin: 0,
          }}
        >
          {tl.prodRuoBody}
        </p>
      </div>
    </div>
  );
}
