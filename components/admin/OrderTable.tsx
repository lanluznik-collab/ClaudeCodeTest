"use client";

import { useRouter } from "next/navigation";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  paid: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-400",
};

const statusOptions = ["pending", "paid", "shipped", "delivered", "cancelled"];

export function OrderTable({ orders }: { orders: Order[] }) {
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 pr-4 font-medium text-gray-500">Date</th>
            <th className="text-left py-3 pr-4 font-medium text-gray-500">Customer</th>
            <th className="text-left py-3 pr-4 font-medium text-gray-500">Total</th>
            <th className="text-left py-3 pr-4 font-medium text-gray-500">Method</th>
            <th className="text-left py-3 pr-4 font-medium text-gray-500">Items</th>
            <th className="text-left py-3 font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                {new Date(o.created_at).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4">
                <p className="font-medium">{o.customer_name ?? "—"}</p>
                <p className="text-gray-400 text-xs">{o.customer_email ?? ""}</p>
              </td>
              <td className="py-3 pr-4 font-medium">{formatPrice(o.total)}</td>
              <td className="py-3 pr-4 capitalize text-gray-500">
                {o.payment_method}
              </td>
              <td className="py-3 pr-4 text-gray-500">
                {Array.isArray(o.items) ? o.items.length : 0} item(s)
              </td>
              <td className="py-3">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-full border-0 focus:ring-1 focus:ring-black ${
                    statusColors[o.status] ?? ""
                  }`}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s} className="bg-white text-black">
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <p className="text-center text-gray-400 py-10">No orders yet.</p>
      )}
    </div>
  );
}
