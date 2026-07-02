"use client";

import { useState, useEffect } from "react";
import { CoaDocument, Product } from "@/types";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { Accordion } from "./Accordion";
import { PRODUCT_INFO_SECTIONS } from "@/lib/product-info-sections";

interface Props {
  product: Product;
  coaImages: string[];
  coaDocs?: CoaDocument[];
}

type TabKey = "opis" | "coa";

// Light, saturated variants so status text stays readable on the dark
// product page background even at low badge-background opacity.
const statusColor: Record<string, string> = {
  Aktualni: "#4ade80",
  Zastarel:  "#f87171",
  Pregled:   "#fbbf24",
};

export function ProductTabs({ product, coaImages, coaDocs }: Props) {
  const [active, setActive] = useState<TabKey>("opis");
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tl = mounted ? translations[lang] : translations.sl;

  const description = lang === "en" ? product.description_en : product.description_sl;

  const tabs: { key: TabKey; label: string }[] = [
    { key: "opis", label: tl.prodTabOpis },
    { key: "coa", label: tl.prodTabCoa },
  ];

  return (
    <div style={{ marginTop: "72px", borderTop: "2px solid rgba(255,255,255,0.1)", paddingTop: "52px" }}>

      {/* Tab bar */}
      <div style={{ borderBottom: "2px solid rgba(255,255,255,0.12)", marginBottom: "36px", display: "flex", gap: "0" }}>
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: active === key ? "#fff" : "rgba(255,255,255,0.5)",
              paddingBottom: "14px", marginBottom: "-2px", marginRight: "32px",
              borderBottom: active === key ? "2px solid #c9a84c" : "2px solid transparent",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Opis */}
      {active === "opis" && (
        <div>
          {description && (
            <>
              <h3 style={{
                fontFamily: "var(--font-montserrat)", fontSize: "15px", fontWeight: 800,
                textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff", margin: "0 0 14px 0",
              }}>
                {tl.prodCompositionTitle}
              </h3>
              <p style={{
                fontFamily: "var(--font-opensans)", fontSize: "15px", lineHeight: 1.85,
                color: "rgba(255,255,255,0.75)", maxWidth: "800px", marginBottom: "16px",
              }}>
                {description}
              </p>
            </>
          )}

          {/* Numbered shared info accordions */}
          <div style={{ marginTop: "32px", maxWidth: "800px" }}>
            {PRODUCT_INFO_SECTIONS.map((section, i) => (
              <Accordion key={section.id} number={i + 1} title={tl[section.titleKey] as string}>
                {tl[section.bodyKey] as string}
              </Accordion>
            ))}
          </div>
        </div>
      )}

      {/* Certifikat analize */}
      {active === "coa" && (
        <div>
          {/* Structured COA documents */}
          {coaDocs && coaDocs.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px" }}>
              {coaDocs.map((doc) => (
                <div key={doc.id} style={{
                  border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "20px",
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "16px", alignItems: "center",
                }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                      {tl.prodCoaSeries}
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0 }}>
                      {doc.batch_number ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                      {tl.prodCoaTestDate}
                    </p>
                    <p style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: 0 }}>
                      {doc.test_date
                        ? new Date(doc.test_date).toLocaleDateString(lang === "en" ? "en-GB" : "sl-SI")
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                      {tl.prodCoaStatus}
                    </p>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                      color: statusColor[doc.status] ?? "#999",
                      backgroundColor: `${statusColor[doc.status] ?? "#999"}14`,
                      padding: "2px 10px", borderRadius: "100px",
                    }}>
                      {doc.status}
                    </span>
                  </div>
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                        letterSpacing: "0.08em", color: "#c9a84c", textTransform: "uppercase",
                        textDecoration: "none", whiteSpace: "nowrap",
                        border: "1px solid #c9a84c", borderRadius: "4px", padding: "6px 12px",
                      }}
                    >
                      {tl.prodCoaDownload}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : coaImages.length > 0 ? (
            /* Fallback to legacy image display */
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {coaImages.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`${tl.prodTabCoa} ${i + 1}`}
                  style={{
                    width: "100%", maxWidth: "900px", height: "auto",
                    border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", display: "block",
                  }}
                />
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: "var(--font-opensans)", fontSize: "15px", color: "#888", fontStyle: "italic" }}>
              {tl.prodCoaNotAvailable}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
