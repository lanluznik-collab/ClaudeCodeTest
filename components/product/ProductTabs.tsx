"use client";

import { useState } from "react";

interface Props {
  description: string | null;
  coaImages: string[];
}

const tabs = [
  { key: "opis",  label: "Opis" },
  { key: "coa",   label: "Certifikat analize" },
] as const;

type TabKey = typeof tabs[number]["key"];

export function ProductTabs({ description, coaImages }: Props) {
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
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-montserrat)",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: active === key ? "#111" : "#888",
              paddingBottom: "14px",
              marginBottom: "-2px",
              marginRight: "32px",
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
          {coaImages.length === 0 ? (
            <p style={{
              fontFamily: "var(--font-opensans)", fontSize: "15px",
              color: "#888", fontStyle: "italic",
            }}>
              Certifikat analize ni na voljo za ta izdelek.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {coaImages.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`Certifikat analize ${i + 1}`}
                  style={{
                    width: "100%",
                    maxWidth: "900px",
                    height: "auto",
                    border: "1px solid #e8e8e8",
                    borderRadius: "4px",
                    display: "block",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
