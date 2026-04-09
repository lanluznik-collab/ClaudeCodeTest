"use client";

import { useRouter } from "next/navigation";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending_payment: "bg-orange-50 text-orange-700",
  pending: "bg-yellow-50 text-yellow-700",
  paid: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-400",
};

const statusOptions = ["pending_payment", "pending", "paid", "shipped", "delivered", "cancelled"];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-36 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 break-words min-w-0">{value ?? "—"}</span>
    </div>
  );
}

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

  if (orders.length === 0) {
    return <p className="text-center text-gray-400 py-10">No orders yet.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="border border-gray-100 rounded-lg p-5">
          {/* Header: date + status */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-400">
              {new Date(o.created_at).toLocaleString("sl-SI")}
            </span>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o.id, e.target.value)}
              className={`text-xs px-3 py-1 rounded-full border-0 font-medium focus:ring-1 focus:ring-black ${
                statusColors[o.status] ?? "bg-gray-50 text-gray-600"
              }`}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s} className="bg-white text-black font-normal">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Details */}
          <Row label="Ime" value={o.customer_name} />
          <Row label="E-pošta" value={o.customer_email} />
          <Row
            label="Naslov dostave"
            value={
              o.customer_address ? (
                <span className="whitespace-pre-line">{o.customer_address}</span>
              ) : null
            }
          />
          <Row
            label="Izdelki"
            value={
              Array.isArray(o.items) && o.items.length > 0 ? (
                <ul className="space-y-0.5">
                  {o.items.map((item: any, i: number) => (
                    <li key={i}>
                      {item.name} × {item.quantity}
                      {item.price ? ` — ${formatPrice(item.price * item.quantity)}` : ""}
                    </li>
                  ))}
                </ul>
              ) : null
            }
          />
          <Row label="Skupaj" value={<span className="font-semibold">{formatPrice(o.total)}</span>} />
          <Row label="Način plačila" value={o.payment_method} />
        </div>
      ))}
    </div>
  );
}
