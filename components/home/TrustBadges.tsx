import { ShieldCheck, Truck, RefreshCw, Star } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Lab Tested", sub: "Every batch verified" },
  { icon: Truck, label: "Free Shipping", sub: "On orders over $50" },
  { icon: RefreshCw, label: "Easy Returns", sub: "30-day hassle free" },
  { icon: Star, label: "5-Star Rated", sub: "Thousands of reviews" },
];

export function TrustBadges() {
  return (
    <section className="border-y border-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {badges.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-2">
            <Icon className="w-6 h-6 text-gray-400" />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
