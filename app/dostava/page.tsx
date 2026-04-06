import Link from "next/link";

const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 2L58 18V50L30 66L2 50V18Z' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M30 68L58 84V104' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M2 84L30 68' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3C/svg%3E")`;

const cards = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Brezplačna dostava",
    body: "Za vsa naročila nad 200 € zagotavljamo brezplačno dostavo po vsej Sloveniji in izbranih evropskih državah.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Rok dostave",
    body: "Naročila, oddana pred 12:00, odpošljemo isti delovni dan. Dostava v Sloveniji traja 1–3 delovne dni, v EU 3–7 delovnih dni.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Varno pakiranje",
    body: "Vsi peptidi so zapakirani z ledenim hladilnikom in zaščitnim materialom, ki zagotavlja ustrezno temperaturo med transportom.",
  },
];

export default function DostavaPage() {
  return (
    <>
      {/* Dark hero */}
      <section style={{
        backgroundColor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
        minHeight: "220px",
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: HEX_PATTERN,
          backgroundSize: "60px 104px",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "1200px", margin: "0 auto",
          padding: "60px 24px 110px",
          width: "100%",
        }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "11px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.25em",
            color: "#c9a84c", marginBottom: "12px",
          }}>
            Informacije
          </p>
          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#c9a84c",
            margin: 0,
          }}>
            Dostava, vračila in povračila
          </h1>
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
          backgroundColor: "#ffffff",
          clipPath: "polygon(0 100%, 100% 0%, 100% 100%)",
        }} />
      </section>

      {/* Content */}
      <section style={{ backgroundColor: "#fff", color: "#111", padding: "64px 0 80px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>

          {/* Info cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            marginBottom: "64px",
          }}>
            {cards.map(({ icon, title, body }) => (
              <div key={title} style={{
                border: "1px solid #e8e8e8",
                borderRadius: "6px",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}>
                {icon}
                <h3 style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "15px", fontWeight: 800,
                  color: "#111", margin: 0,
                }}>
                  {title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-opensans)",
                  fontSize: "14px", lineHeight: 1.7,
                  color: "#555", margin: 0,
                }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* Delivery details */}
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "20px", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.06em",
            color: "#111", marginBottom: "24px",
            paddingBottom: "12px", borderBottom: "2px solid #f0f0f0",
          }}>
            Podrobnosti dostave
          </h2>

          <div style={{ marginBottom: "48px" }}>
            {[
              { label: "Slovenija", value: "1–3 delovni dnevi · Brezplačno nad 200 €, sicer 4,90 €" },
              { label: "EU (izbrane države)", value: "3–7 delovnih dni · Brezplačno nad 200 €, sicer 9,90 €" },
              { label: "Ostale države", value: "Kontaktirajte nas za ceno in rok dostave" },
            ].map(({ label, value }, i) => (
              <div key={label} style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                borderBottom: i < 2 ? "1px solid #f0f0f0" : "none",
              }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "13px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  color: "#777", padding: "14px 0",
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: "var(--font-opensans)",
                  fontSize: "14px", color: "#333",
                  padding: "14px 0",
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Returns */}
          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "20px", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.06em",
            color: "#111", marginBottom: "24px",
            paddingBottom: "12px", borderBottom: "2px solid #f0f0f0",
          }}>
            Vračila in povračila
          </h2>

          <div style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "15px", lineHeight: 1.8,
            color: "#444", marginBottom: "40px",
          }}>
            <p><strong style={{ color: "#111" }}>Preden je naročilo odposlano:</strong> Naročilo lahko brez stroškov odpoveste v roku 30 dni od oddaje naročila. Polno povračilo sredstev bo izvedeno v roku 5–10 delovnih dni.</p>
            <p><strong style={{ color: "#111" }}>Po odposilju naročila:</strong> Ker so naši peptidi biološki materiali, ki zahtevajo posebne pogoje shranjevanja, vračil odposlanih naročil žal ne moremo sprejeti. To velja za zaščito kakovosti in varnosti vseh strank.</p>
            <p><strong style={{ color: "#111" }}>Napačna ali poškodovana pošiljka:</strong> V primeru napake pri pošiljki ali poškodbe med dostavo nas kontaktirajte v roku 48 ur od prejema paketa s fotografijami. Zagotovili bomo zamenjavo ali povračilo brez dodatnih stroškov.</p>
          </div>

          {/* CTA */}
          <div style={{
            backgroundColor: "#fafafa",
            border: "1px solid #e8e8e8",
            borderRadius: "6px",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}>
            <div>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "15px", fontWeight: 700,
                color: "#111", margin: "0 0 6px 0",
              }}>
                Imate vprašanje glede dostave ali vračila?
              </p>
              <p style={{
                fontFamily: "var(--font-opensans)",
                fontSize: "14px", color: "#666", margin: 0,
              }}>
                Naša ekipa vam bo z veseljem pomagala.
              </p>
            </div>
            <Link href="/contact" style={{
              flexShrink: 0,
              padding: "13px 28px",
              backgroundColor: "#c9a84c",
              color: "#fff",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700, fontSize: "12px",
              textTransform: "uppercase", letterSpacing: "0.1em",
              textDecoration: "none",
              borderRadius: "2px",
              whiteSpace: "nowrap",
            }}>
              Kontaktirajte nas
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
