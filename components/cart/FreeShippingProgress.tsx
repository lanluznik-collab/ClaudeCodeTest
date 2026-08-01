"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { SHIPPING } from "@/lib/config/shipping";

export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tc = mounted ? translations[lang].checkout : translations.sl.checkout;

  const remaining = Math.max(0, SHIPPING.freeThreshold - subtotal);
  const unlocked = remaining === 0;
  const pct = Math.min(100, (subtotal / SHIPPING.freeThreshold) * 100);

  return (
    <div style={{ marginBottom: "20px" }}>
      <p
        style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "13px",
          color: unlocked ? "var(--color-success)" : "var(--color-text-muted)",
          margin: "0 0 8px 0",
        }}
      >
        {unlocked ? (
          tc.freeShippingUnlocked
        ) : (
          <>
            {tc.freeShippingProgressPrefix} <strong style={{ color: "var(--color-accent-text)" }}>{formatPrice(remaining)}</strong>{" "}
            {tc.freeShippingProgressSuffix}
          </>
        )}
      </p>
      <div
        style={{
          height: "6px",
          borderRadius: "3px",
          backgroundColor: "var(--color-border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "3px",
            backgroundColor: unlocked ? "var(--color-success)" : "var(--color-accent)",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
