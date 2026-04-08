import { Truck, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  { icon: Truck,        label: "Brezplačna dostava",  sub: "Vsako naročilo nad 200 € se pošlje brezplačno po vsej Sloveniji." },
  { icon: ShieldCheck,  label: "Najvišja kakovost",   sub: "Ponujamo le peptide z neodvisno potrjeno čistostjo, ki presega 99 %." },
  { icon: Headphones,   label: "Spletna podpora",     sub: "Naša ekipa je na voljo za vsa vaša vprašanja. Pišite nam kadarkoli." },
];

export function TrustBadges() {
  return (
    <section style={{ backgroundColor: "#161616" }}>
      {/* 1 column on mobile, 3 columns on md+ */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 mx-auto px-4 md:px-6"
        style={{ maxWidth: "1200px" }}
      >
        {badges.map(({ icon: Icon, label, sub }, i) => (
          <div
            key={label}
            className={[
              "flex items-start gap-5 py-8 px-4 md:px-8",
              // horizontal divider between rows on mobile
              i < badges.length - 1 ? "border-b border-white/[0.07] md:border-b-0" : "",
              // vertical divider between columns on desktop
              i < badges.length - 1 ? "md:border-r md:border-white/[0.07]" : "",
            ].join(" ")}
          >
            <div style={{ flexShrink: 0 }}>
              <Icon style={{ width: "40px", height: "40px", color: "#c9a84c" }} strokeWidth={1.25} />
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
