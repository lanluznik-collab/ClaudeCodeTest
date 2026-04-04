import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createServiceClient();

  const [{ count: productCount }, { count: orderCount }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, total, status, customer_name, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const cards = [
    { label: "Products", value: productCount ?? 0, href: "/admin/products" },
    { label: "Orders", value: orderCount ?? 0, href: "/admin/orders" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
          >
            <p className="text-3xl font-semibold">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-black">
            View all →
          </Link>
        </div>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{o.customer_name ?? "Guest"}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(o.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${o.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 capitalize">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
