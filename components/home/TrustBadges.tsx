import { Truck, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  { icon: Truck,        label: "Free Delivery",  sub: "Any purchase of $200 or more qualifies for free delivery within the USA." },
  { icon: ShieldCheck,  label: "Highest Quality", sub: "We carry only the highest quality products, verified by independent labs." },
  { icon: Headphones,   label: "Online Support",  sub: "Our team is available to answer any questions you may have." },
];

export function TrustBadges() {
  return (
    <section style={{ backgroundColor: "#161616" }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
      }}>
        {badges.map(({ icon: Icon, label, sub }, i) => (
          <div key={label} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "20px",
            padding: "40px 32px",
            borderRight: i < badges.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
          }}>
            {/* Icon — matches the airplane/shield/headphones from corepeptides.com */}
            <div style={{
              flexShrink: 0,
              width: "64px",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Icon style={{ width: "48px", height: "48px", color: "#ca8b2b" }} strokeWidth={1.25} />
            </div>

            {/* Text */}
            <div>
              <h2 style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#ffffff",
                margin: "0 0 8px 0",
              }}>
                {label}
              </h2>
              <p style={{
                fontFamily: "var(--font-opensans)",
                fontSize: "13px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.65,
                margin: 0,
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
