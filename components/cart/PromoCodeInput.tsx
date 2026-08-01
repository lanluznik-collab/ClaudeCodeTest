"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { usePromoStore } from "@/lib/promo-store";
import { formatPrice } from "@/lib/utils";

export function PromoCodeInput({ subtotal }: { subtotal: number }) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tc = mounted ? translations[lang].checkout : translations.sl.checkout;

  const { promo, setPromo, clearPromo } = usePromoStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input.trim(), subtotal }),
      });
      const data = await res.json();

      if (!data.valid) {
        if (data.reason === "expired") setError(tc.promoCodeExpired);
        else if (data.reason === "inactive") setError(tc.promoCodeInactive);
        else if (data.reason === "min_order") {
          setError(`${tc.promoCodeMinOrderPrefix} ${formatPrice(data.minOrder)}.`);
        } else setError(tc.promoCodeInvalid);
        return;
      }

      setPromo({ code: data.code, type: data.type, value: data.value, minOrder: null });
      setInput("");
    } catch {
      setError(tc.promoCodeInvalid);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "10px 12px",
    backgroundColor: "var(--color-bg)",
    border: "1px solid var(--color-border)",
    borderRadius: "2px",
    color: "var(--color-text)",
    fontFamily: "var(--font-opensans)",
    fontSize: "13px",
    outline: "none",
  };

  if (promo) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "rgba(74,222,128,0.08)",
          border: "1px solid rgba(74,222,128,0.3)",
          borderRadius: "4px",
          padding: "10px 14px",
          marginBottom: "16px",
        }}
      >
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 700, color: "var(--color-success)" }}>
          {tc.promoCodeApplied}: {promo.code}
        </span>
        <button
          onClick={clearPromo}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-opensans)",
            fontSize: "12px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {tc.promoCodeRemove}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} style={{ marginBottom: "16px" }}>
      <label
        style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "12px",
          color: "var(--color-text-faint)",
          display: "block",
          marginBottom: "6px",
        }}
      >
        {tc.promoCodeLabel}
      </label>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tc.promoCodePlaceholder}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 16px",
            backgroundColor: "transparent",
            border: "1px solid var(--color-accent-text)",
            borderRadius: "2px",
            color: "var(--color-accent-text)",
            fontFamily: "var(--font-montserrat)",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {loading ? tc.promoCodeApplying : tc.promoCodeApply}
        </button>
      </div>
      {error && (
        <p style={{ fontFamily: "var(--font-opensans)", fontSize: "12px", color: "var(--color-danger)", margin: "8px 0 0 0" }}>
          {error}
        </p>
      )}
    </form>
  );
}
