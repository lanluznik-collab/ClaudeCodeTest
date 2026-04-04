import { Truck, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  { icon: Truck,       label: "Free Delivery",   sub: "On all orders over $50" },
  { icon: ShieldCheck, label: "Highest Quality",  sub: "Every batch lab tested & verified" },
  { icon: Headphones,  label: "Online Support",   sub: "24/7 dedicated customer service" },
];

export function TrustBadges() {
  return (
    <section style={{ backgroundColor: "#1a1a1a", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3">
        {badges.map(({ icon: Icon, label, sub }, i) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "32px 24px",
              borderRight: i < badges.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "rgba(201,168,76,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon style={{ width: "20px", height: "20px", color: "#C9A84C" }} />
            </div>
            <div>
              <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {label}
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "3px" }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
