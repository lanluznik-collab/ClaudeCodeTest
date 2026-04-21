"use client";

import { useEffect, useState } from "react";
import { Truck, ShieldCheck, FlaskConical, Zap, Lock, Package } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

const icons = [Truck, ShieldCheck, FlaskConical, Zap, Lock, Package];

export function TrustBar() {
  const [mounted, setMounted] = useState(false);
  const lang = useLanguageStore((s) => s.lang);
  useEffect(() => setMounted(true), []);

  const items = mounted
    ? translations[lang].home.trust
    : translations.sl.home.trust;

  return (
    <section style={{ backgroundColor: "#161616" }}>
      <div
        style={{ maxWidth: "1200px", margin: "0 auto" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      >
        {items.map(({ label, sub }, i) => {
          const Icon = icons[i];
          return (
            <div
              key={i}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", padding: "28px 16px",
                borderRight: i < items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
              className={[
                // Remove right border on last of each row for cleaner look
                (i + 1) % 2 === 0 ? "border-r-0 md:border-r" : "",
                (i + 1) % 3 === 0 ? "md:border-r-0 lg:border-r" : "",
                i === items.length - 1 ? "!border-r-0" : "",
              ].join(" ")}
            >
              <div style={{
                width: "44px", height: "44px",
                backgroundColor: "rgba(201,168,76,0.08)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "12px",
                flexShrink: 0,
              }}>
                <Icon size={20} color="#c9a84c" strokeWidth={1.5} />
              </div>
              <h3 style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "12px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "#fff", margin: "0 0 6px 0",
              }}>
                {label}
              </h3>
              <p style={{
                fontFamily: "var(--font-opensans)",
                fontSize: "11px", color: "rgba(255,255,255,0.4)",
                lineHeight: 1.55, margin: 0,
              }}>
                {sub}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
