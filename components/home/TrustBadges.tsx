import { Truck, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  { icon: Truck, label: "Free Delivery", sub: "On all orders over $50" },
  { icon: ShieldCheck, label: "Highest Quality", sub: "Every batch lab tested" },
  { icon: Headphones, label: "Online Support", sub: "24/7 customer service" },
];

export function TrustBadges() {
  return (
    <section className="bg-[#1a1a1a] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
        {badges.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-4 px-8 py-6 sm:py-4">
            <Icon className="w-8 h-8 text-gold flex-shrink-0" />
            <div>
              <p className="text-white text-xs font-bold uppercase tracking-widest">{label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
