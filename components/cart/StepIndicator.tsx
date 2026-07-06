"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

export type FunnelStep = 1 | 2 | 3;

export function StepIndicator({ current }: { current: FunnelStep }) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tc = mounted ? translations[lang].checkout : translations.sl.checkout;

  const steps: { n: FunnelStep; label: string }[] = [
    { n: 1, label: tc.stepCart },
    { n: 2, label: tc.stepCheckout },
    { n: 3, label: tc.stepConfirmation },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "24px 16px",
        flexWrap: "wrap",
      }}
    >
      {steps.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <div key={step.n} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "12px",
                  fontWeight: 800,
                  flexShrink: 0,
                  backgroundColor: done || active ? "#c9a84c" : "transparent",
                  color: done || active ? "#000" : "rgba(255,255,255,0.4)",
                  border: done || active ? "none" : "1px solid rgba(255,255,255,0.25)",
                }}
              >
                {done ? "✓" : step.n}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: active ? "#c9a84c" : done ? "#fff" : "rgba(255,255,255,0.4)",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                style={{
                  width: "32px",
                  height: "1px",
                  backgroundColor: done ? "#c9a84c" : "rgba(255,255,255,0.2)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
