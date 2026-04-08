import { Truck, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  { icon: Truck,        label: "Brezplačna dostava",  sub: "Vsako naročilo nad 200 € se pošlje brezplačno po vsej Sloveniji." },
  { icon: ShieldCheck,  label: "Najvišja kakovost",   sub: "Ponujamo le peptide z neodvisno potrjeno čistostjo, ki presega 99 %." },
  { icon: Headphones,   label: "Spletna podpora",     sub: "Naša ekipa je na voljo za vsa vaša vprašanja. Pišite nam kadarkoli." },
];

export function TrustBadges() {
  return (
    <section style={{ backgroundColor: "#161616" }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto", padding: "0 24px",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
      }}>
        {badges.map(({ icon: Icon, label, sub }, i) => (
          <div key={label} style={{
            display: "flex", alignItems: "flex-start", gap: "20px",
            padding: "40px 32px",
            borderRight: i < badges.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
          }}>
            <div style={{
              flexShrink: 0, width: "64px", height: "64px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon style={{ width: "48px", height: "48px", color: "#c9a84c" }} strokeWidth={1.25} />
            </div>
            <div>
              <h2 style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "14px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "#ffffff", margin: "0 0 8px 0",
              }}>
                {label}
              </h2>
              <p style={{
                fontFamily: "var(--font-opensans)",
                fontSize: "13px", color: "rgba(255,255,255,0.5)",
                lineHeight: 1.65, margin: 0,
              }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
