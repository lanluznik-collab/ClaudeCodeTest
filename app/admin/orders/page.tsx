import { createServiceClient } from "@/lib/supabase/server";
import { OrderTable } from "@/components/admin/OrderTable";

export default async function AdminOrdersPage() {
  const supabase = createServiceClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <OrderTable orders={(orders ?? []) as any} />
      </div>
    </div>
  );
}
