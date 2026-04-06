import Link from "next/link";

const quickLinks = [
  { label: "Peptidi", href: "/shop" },
  { label: "O nas", href: "/about" },
  { label: "Dostava, vračila in povračila", href: "/dostava" },
  { label: "Zasebnost", href: "/zasebnost" },
  { label: "Pogoji poslovanja", href: "/pogoji" },
  { label: "Kontakt", href: "/contact" },
];

const cards = ["Mastercard", "Amex", "Visa"];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "60px 24px 40px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: "48px",
      }}>

        {/* Left: Logo + Disclaimer */}
        <div>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 900,
            fontSize: "22px",
            letterSpacing: "0.15em",
            color: "#c9a84c",
            margin: "0 0 20px 0",
          }}>
            SLOPEPS
          </p>
          <p style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "13px",
            fontStyle: "italic",
            color: "#c9a84c",
            lineHeight: 1.75,
            margin: "0 0 16px 0",
          }}>
            Vsi izdelki so namenjeni izključno za raziskovalne, laboratorijske ali analitske namene in niso namenjeni za človeško porabo.
          </p>
          <p style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "12px",
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.75,
            margin: "0 0 16px 0",
          }}>
            SloPeps je dobavitelj kemikalij, ne lekarna ali licencirani proizvajalec zdravil. Naši izdelki niso bili ocenjeni s strani regulatornih organov in niso namenjeni za diagnozo, zdravljenje ali preprečevanje bolezni.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.22)",
            margin: 0,
          }}>
            Zaužitje s strani ljudi/živali prepovedano. Samo za laboratorijsko/in-vitro eksperimentalno uporabo.
          </p>
        </div>

        {/* Middle: Quick Links */}
        <div>
          <h3 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#fff",
            margin: "0 0 20px 0",
          }}>
            Hitre povezave
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {quickLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} style={{
                  fontFamily: "var(--font-opensans)",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                  className="hover:text-[#c9a84c]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Now Accepting */}
        <div>
          <h3 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#fff",
            margin: "0 0 20px 0",
          }}>
            Sprejemamo plačila
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {cards.map((card) => (
              <div key={card} style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                padding: "9px 0",
                width: "120px",
              }}>
                <span style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "rgba(255,255,255,0.65)",
                }}>
                  {card}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 24px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "12px",
          color: "rgba(255,255,255,0.28)",
          margin: 0,
        }}>
          Copyright {new Date().getFullYear()} SloPeps. Vse pravice pridržane.
        </p>
      </div>
    </footer>
  );
}
