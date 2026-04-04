import { Truck, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  {
    icon: Truck,
    label: "Free Delivery",
    sub: "On all orders over $50",
  },
  {
    icon: ShieldCheck,
    label: "Highest Quality",
    sub: "Every batch lab tested & verified",
  },
  {
    icon: Headphones,
    label: "Online Support",
    sub: "24/7 dedicated customer service",
  },
];

export function TrustBadges() {
  return (
    <section className="bg-[#161616] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3">
        {badges.map(({ icon: Icon, label, sub }, i) => (
          <div
            key={label}
            className={`flex items-center gap-5 py-8 px-6 ${
              i < badges.length - 1 ? "sm:border-r border-white/10 border-b sm:border-b-0" : ""
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-white text-sm font-bold uppercase tracking-wider">{label}</p>
              <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
