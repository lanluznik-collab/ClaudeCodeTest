export const dynamic = "force-dynamic";

import { createServiceClient } from "@/lib/supabase/server";
import { OrderTable } from "@/components/admin/OrderTable";

export default async function AdminOrdersPage() {
  const supabase = createServiceClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, items, total, customer_name, customer_email, customer_address, payment_method, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/orders] fetch error:", error);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <OrderTable orders={(orders ?? []) as any} />
      </div>
    </div>
  );
}
