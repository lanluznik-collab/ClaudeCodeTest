"use client";

import { useState } from "react";
import { CoaDocument } from "@/types";

interface Props {
  description: string | null;
  coaImages: string[];
  coaDocs?: CoaDocument[];
}

const tabs = [
  { key: "opis",  label: "Opis" },
  { key: "coa",   label: "Certifikat analize" },
] as const;

type TabKey = typeof tabs[number]["key"];

const statusColor: Record<string, string> = {
  Aktualni: "#166534",
  Zastarel:  "#991b1b",
  Pregled:   "#92400e",
};

export function ProductTabs({ description, coaImages, coaDocs }: Props) {
  const [active, setActive] = useState<TabKey>("opis");

  return (
    <div style={{ marginTop: "72px", borderTop: "2px solid #f0f0f0", paddingTop: "52px" }}>

      {/* Tab bar */}
      <div style={{ borderBottom: "2px solid #e8e8e8", marginBottom: "36px", display: "flex", gap: "0" }}>
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: active === key ? "#111" : "#888",
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
            <p style={{
              fontFamily: "var(--font-opensans)", fontSize: "15px", lineHeight: 1.85,
              color: "#444", maxWidth: "800px", marginBottom: "48px",
            }}>
              {description}
            </p>
          )}

          <h3 style={{
            fontFamily: "var(--font-montserrat)", fontSize: "15px", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.1em", color: "#111", margin: "0 0 14px 0",
          }}>
            Kemijska sestava
          </h3>
          <p style={{
            fontFamily: "var(--font-opensans)", fontSize: "14px", lineHeight: 1.8,
            color: "#666", maxWidth: "800px", marginBottom: "40px",
          }}>
            Naši peptidi so sintetizirani s pomočjo industrijske metode sinteze peptidov na trdni fazi (SPPS). Vsaka serija je podrobno preverjena glede strukturne celovitosti, aminokislinske sestave in molekulske mase z analizo HPLC in masne spektrometrije, kar zagotavlja čistost nad 99 %.
          </p>

          <h3 style={{
            fontFamily: "var(--font-montserrat)", fontSize: "15px", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.1em", color: "#111", margin: "0 0 14px 0",
          }}>
            Raziskave in klinične študije
          </h3>
          <p style={{
            fontFamily: "var(--font-opensans)", fontSize: "14px", lineHeight: 1.8,
            color: "#666", maxWidth: "800px",
          }}>
            Vsi izdelki so namenjeni izključno za in-vitro raziskave in laboratorijsko uporabo. SloPeps ne podpira ali spodbuja uporabe peptidov v terapevtske ali klinične namene. Raziskovalci so spodbujeni k pregledu objavljene literature in spoštovanju vseh veljavnih predpisov v svoji jurisdikciji.
          </p>
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
                  border: "1px solid #e8e8e8", borderRadius: "8px", padding: "20px",
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "16px", alignItems: "center",
                }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                      Serija
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 700, color: "#111", margin: 0 }}>
                      {doc.batch_number ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                      Datum testa
                    </p>
                    <p style={{ fontFamily: "var(--font-opensans)", fontSize: "14px", color: "#333", margin: 0 }}>
                      {doc.test_date
                        ? new Date(doc.test_date).toLocaleDateString("sl-SI")
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                      Status
                    </p>
                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                      color: statusColor[doc.status] ?? "#333",
                      backgroundColor: `${statusColor[doc.status] ?? "#333"}14`,
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
                      Prenesi
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
                  alt={`Certifikat analize ${i + 1}`}
                  style={{
                    width: "100%", maxWidth: "900px", height: "auto",
                    border: "1px solid #e8e8e8", borderRadius: "4px", display: "block",
                  }}
                />
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: "var(--font-opensans)", fontSize: "15px", color: "#888", fontStyle: "italic" }}>
              Certifikat analize ni na voljo za ta izdelek.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
